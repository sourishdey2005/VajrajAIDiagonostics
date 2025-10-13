import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

type AnalysisResult = {
  faultClassification: string;
  confidenceScore: number;
  transformerId: string;
  criticality: string;
  rawFraDataSummary: string;
};

type AIFetcherData = {
  aiExplanation?: string;
  actionableInsights?: string;
  suggestedRules?: string;
  factors?: { factor: string; influence: number }[];
};

export const generateAnalysisReport = async (result: AnalysisResult, aiData: AIFetcherData): Promise<void> => {
  const reportElement = document.createElement('div');
  reportElement.style.position = 'absolute';
  reportElement.style.left = '-9999px';
  reportElement.style.width = '800px';
  reportElement.style.padding = '40px';
  reportElement.style.fontFamily = 'Inter, sans-serif';
  reportElement.style.color = '#1f2937';
  reportElement.style.backgroundColor = 'white';

  const rulesHtml = () => {
    if (aiData.suggestedRules) {
        try {
            const rules = JSON.parse(aiData.suggestedRules);
            return rules.map((rule: any) => `
                <div style="padding: 10px; background-color: #f9fafb; border-radius: 8px; border: 1px solid #e5e7eb; margin-top: 10px;">
                    <p style="margin: 0;"><strong style="color: #4f46e5;">Condition:</strong> ${rule.condition}</p>
                    <p style="margin: 10px 0 0 0;"><strong style="color: #4f46e5;">Suggestion:</strong> ${rule.maintenanceSuggestion}</p>
                </div>
            `).join('');
        } catch (e) {
            return `<p style="white-space: pre-wrap; color: #4b5563; line-height: 1.6;">${aiData.suggestedRules}</p>`;
        }
    }
    return '<p>No rules generated.</p>';
  };
  
  const factorsHtml = () => {
    if (aiData.factors && aiData.factors.length > 0) {
        return aiData.factors.map(f => `
            <div style="display: flex; align-items: center; margin-bottom: 8px; font-size: 14px;">
                <span style="width: 180px; font-weight: 500;">${f.factor}</span>
                <div style="flex: 1; background-color: #e5e7eb; border-radius: 4px; overflow: hidden;">
                    <div style="width: ${f.influence}%; background-color: #4f46e5; color: white; padding: 4px 8px; text-align: right; font-weight: bold;">${f.influence}%</div>
                </div>
            </div>
        `).join('');
    }
    return '<p>No factors identified.</p>';
  };


  reportElement.innerHTML = `
    <div style="border-bottom: 2px solid #e5e7eb; padding-bottom: 20px;">
        <h1 style="font-size: 36px; font-weight: 900; margin: 0; letter-spacing: -1.5px;">VajraAI Analysis Report</h1>
        <p style="font-size: 16px; color: #6b7280; margin: 5px 0 0 0;">Transformer Fault Diagnosis</p>
    </div>
    
    <div style="margin-top: 30px; padding: 20px; border-radius: 12px; border: 1px solid #e5e7eb; background-color: #f9fafb;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
            <div>
                <h2 style="font-size: 24px; font-weight: 700; margin: 0;">Transformer: ${result.transformerId}</h2>
                <p style="font-size: 14px; color: #6b7280; margin: 5px 0 0 0;">Report generated on: ${new Date().toLocaleDateString()}</p>
            </div>
            <div style="padding: 8px 16px; border-radius: 9999px; font-weight: 600; font-size: 14px; background-color: ${result.criticality === 'High' ? '#fef2f2' : result.criticality === 'Medium' ? '#fffbeb' : '#eff6ff'}; color: ${result.criticality === 'High' ? '#dc2626' : result.criticality === 'Medium' ? '#f59e0b' : '#3b82f6'};">
                ${result.criticality} Criticality
            </div>
        </div>
    </div>

    <div style="margin-top: 30px;">
      <h3 style="font-size: 20px; font-weight: 700; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px;">Summary</h3>
      <div style="margin-top: 20px; display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
        <div style="background-color: #fef2f2; border: 1px solid #fecaca; padding: 20px; border-radius: 12px;">
            <h4 style="font-size: 16px; font-weight: 600; margin: 0; color: #dc2626;">Detected Fault</h4>
            <p style="font-size: 24px; font-weight: 800; margin: 10px 0 0 0; color: #dc2626;">${result.faultClassification}</p>
        </div>
        <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; padding: 20px; border-radius: 12px;">
             <h4 style="font-size: 16px; font-weight: 600; margin: 0;">Confidence Score</h4>
             <p style="font-size: 24px; font-weight: 800; margin: 10px 0 0 0;">${(result.confidenceScore * 100).toFixed(1)}%</p>
        </div>
      </div>
      <div style="margin-top: 20px;">
          <h4 style="font-size: 16px; font-weight: 600; margin: 0;">Raw Data Summary</h4>
          <p style="background-color: #f3f4f6; border-radius: 8px; padding: 12px; font-family: 'Roboto Mono', monospace; font-size: 12px; margin-top: 10px; border: 1px solid #e5e7eb; color: #4b5563;">${result.rawFraDataSummary}</p>
      </div>
    </div>
    
    <div style="margin-top: 30px;">
      <h3 style="font-size: 20px; font-weight: 700; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px;">AI Insights</h3>
      <div style="margin-top: 20px;">
        <h4 style="font-size: 16px; font-weight: 600; margin-bottom: 10px;">AI-Generated Explanation</h4>
        <p style="white-space: pre-wrap; color: #4b5563; line-height: 1.6;">${aiData.aiExplanation || 'No explanation generated.'}</p>
      </div>
      <div style="margin-top: 20px;">
        <h4 style="font-size: 16px; font-weight: 600; margin-bottom: 10px;">Recommended Actions</h4>
        <p style="white-space: pre-wrap; color: #4b5563; line-height: 1.6;">${aiData.actionableInsights || 'No actions recommended.'}</p>
      </div>
    </div>

     <div style="margin-top: 30px;">
        <h3 style="font-size: 20px; font-weight: 700; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px;">Root Cause Analysis</h3>
        <div style="margin-top: 20px;">${factorsHtml()}</div>
     </div>

    ${result.criticality === 'High' ? `
     <div style="margin-top: 30px; page-break-before: always;">
        <h3 style="font-size: 20px; font-weight: 700; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px;">Expert System Rules</h3>
        <div style="margin-top: 20px;">${rulesHtml()}</div>
     </div>
    ` : ''}

  `;
  document.body.appendChild(reportElement);

  const canvas = await html2canvas(reportElement, { scale: 2 });
  const imgData = canvas.toDataURL('image/png');

  const pdf = new jsPDF({
    orientation: 'p',
    unit: 'px',
    format: [canvas.width, canvas.height]
  });

  pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
  pdf.save(`VajraAI-Report-${result.transformerId}-${new Date().toISOString().split('T')[0]}.pdf`);

  document.body.removeChild(reportElement);
};
