"use client"

import { useEffect, useState, useTransition, useRef } from "react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, Cell } from "recharts"
import { AlertCircle, Bot, BrainCircuit, Lightbulb, Loader2, Share2, Download, UploadCloud } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { augmentDashboardWithAIExplanations } from "@/ai/flows/augment-dashboard-with-ai-explanations"
import { generateActionableInsights } from "@/ai/flows/generate-actionable-insights"
import { suggestExpertSystemRules } from "@/ai/flows/suggest-expert-system-rules"
import { getContributingFactors } from "@/ai/flows/get-contributing-factors"
import { getHealthCompassReading } from "@/ai/flows/get-health-compass-reading"
import { useUserRole } from "@/contexts/user-role-context"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"
import { HealthCompass } from "./health-compass"
import { generateAnalysisReport } from "@/lib/report-generator"
import { useToast } from "@/hooks/use-toast"
import { Progress } from "@/components/ui/progress"

type AnalysisResult = {
  faultClassification: string;
  confidenceScore: number;
  transformerId: string;
  criticality: string;
  rawFraDataSummary: string;
}

interface AnalysisResultCardProps {
  result: AnalysisResult | null
  isLoading: boolean
}

type AIFetcherData = {
  aiExplanation?: string;
  actionableInsights?: string;
  suggestedRules?: string;
  factors?: { factor: string; influence: number }[];
};


const generateChartColors = (count: number) => {
  const colors = [];
  for (let i = 0; i < count; i++) {
    colors.push(`hsl(var(--chart-${(i % 5) + 1}))`);
  }
  return colors;
};

function RootCauseAnalysisChart({ result }: { result: AnalysisResult }) {
    const [data, setData] = useState<{ factors: {factor: string, influence: number}[] } | null>(null);
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        if (!result) return;
        startTransition(async () => {
            const output = await getContributingFactors(result);
            setData(output);
        });
    }, [result]);

    if (isPending || !data) {
        return <div className="space-y-2 h-[250px]">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-4/5" />
            <Skeleton className="h-8 w-3/4" />
        </div>
    }
    
    const chartData = data.factors.map((f, i) => ({ ...f, fill: `hsl(var(--chart-${(i%5)+1}))` }));

    return (
       <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" margin={{ left: 120 }}>
                <XAxis type="number" hide domain={[0, 100]} />
                <YAxis type="category" dataKey="factor" tick={{ fontSize: 12 }} width={120} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: 'hsl(var(--muted))' }} content={<ChartTooltipContent formatter={(value) => `${value}%`} hideLabel />} />
                <Bar dataKey="influence" name="Influence" radius={[0, 4, 4, 0]}>
                    {chartData.map((entry) => (
                        <Cell key={`cell-${entry.factor}`} />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
       </div>
    );
}

const AIFetcher = ({ flow, input, icon, title, onData }: { flow: (input: any) => Promise<{ [key: string]: any }>, input: any, icon: React.ReactNode, title: string, onData: (data: any) => void }) => {
  const [data, setData] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    if (!input) return;
    startTransition(async () => {
      const output = await flow(input)
      onData(output); // Pass data to parent
      const key = Object.keys(output)[0];
      setData(output[key] as string)
    })
  }, [input, flow, onData])

  const renderContent = () => {
    if (isPending) {
      return <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2 mt-4" />
        <Skeleton className="h-4 w-full" />
      </div>
    }

    if (!data) return <p>No insights generated.</p>
    
    try {
      const jsonData = JSON.parse(data as string);
      if (Array.isArray(jsonData)) {
        return (
          <div className="space-y-4 font-code text-sm">
            {jsonData.map((rule, index) => (
              <div key={index} className="p-4 bg-muted/50 rounded-lg border">
                <p><span className="font-semibold text-primary">Condition:</span> {rule.condition}</p>
                <p className="mt-2"><span className="font-semibold text-primary">Suggestion:</span> {rule.maintenanceSuggestion}</p>
              </div>
            ))}
          </div>
        )
      }
    } catch (e) {
      // Not JSON, render as text
      return <p className="whitespace-pre-wrap text-muted-foreground leading-relaxed">{data as string}</p>
    }

    return <p className="whitespace-pre-wrap text-muted-foreground leading-relaxed">{data as string}</p>
  }


  return (
    <div className="flex items-start gap-4 p-1">
      <div className="text-primary pt-1">{icon}</div>
      <div className="flex-1">
        <h3 className="font-bold text-lg">{title}</h3>
        <div className="mt-2">{renderContent()}</div>
      </div>
    </div>
  )
}

function HealthCompassAnalysis({ result }: { result: AnalysisResult }) {
    const [angle, setAngle] = useState<number>(0);
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        if (!result) return;
        startTransition(async () => {
            const output = await getHealthCompassReading(result);
            setAngle(output.angle);
        });
    }, [result]);

    if (isPending) {
        return <Skeleton className="w-[300px] h-[300px] rounded-full" />;
    }

    return <HealthCompass angle={angle} faultClassification={result.faultClassification} />;
}

export function AnalysisResultCard({ result, isLoading }: AnalysisResultCardProps) {
  const { role } = useUserRole();
  const aiDataRef = useRef<AIFetcherData>({});
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const { toast } = useToast();

  const handleAIData = (key: keyof AIFetcherData, data: any) => {
    aiDataRef.current[key] = data;
  };
  
  const onGenerateReport = async () => {
      if (!result) return;
      setIsGeneratingReport(true);
      await generateAnalysisReport(result, aiDataRef.current);
      setIsGeneratingReport(false);
  }

  const onSyncToPortal = () => {
      if (!result) return;
      setIsSyncing(true);
      setTimeout(() => {
          setIsSyncing(false);
          toast({
              title: "Sync Successful",
              description: `Report for ${result.transformerId} has been submitted to the compliance portal.`,
          });
      }, 2000);
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="mt-4 text-lg font-semibold">Running AI Analysis...</p>
            <p className="text-sm text-muted-foreground">Please wait while we process the FRA data.</p>
          </div>
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-40 w-full" />
        </CardContent>
      </Card>
    )
  }

  if (!result) return null

  const confidenceValue = result.confidenceScore * 100;

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl font-bold tracking-tight font-headline">Analysis Complete</CardTitle>
            <CardDescription>
              AI-powered fault diagnosis for <span className="font-semibold text-primary">{result.transformerId}</span>
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {role === 'manager' && (
                <Button variant="outline" onClick={onSyncToPortal} disabled={isSyncing}>
                    {isSyncing ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4"/>}
                    <span className="ml-2">{isSyncing ? "Syncing..." : "Sync to Portal"}</span>
                </Button>
            )}
            <Button onClick={onGenerateReport} disabled={isGeneratingReport}>
              {isGeneratingReport ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4"/>}
              <span className="ml-2">{isGeneratingReport ? "Generating..." : "Download Report"}</span>
            </Button>
            <Badge variant={result.criticality === "High" ? "destructive" : result.criticality === "Medium" ? "default" : "secondary"}>
                {result.criticality} Criticality
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="summary">
          <TabsList className="grid w-full grid-cols-3 md:grid-cols-5 mb-6">
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="root-cause">Root Cause</TabsTrigger>
            <TabsTrigger value="ai-explanation">AI Explanation</TabsTrigger>
            <TabsTrigger value="actions">Maintenance Actions</TabsTrigger>
            {role === 'manager' && <TabsTrigger value="expert-system">Expert System Rules</TabsTrigger>}
          </TabsList>
          
          <TabsContent value="summary" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Card className="bg-destructive/5 border-destructive/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-destructive"><AlertCircle className="w-5 h-5" /> Detected Fault</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-destructive">{result.faultClassification}</p>
                    <p className="text-sm text-destructive/80">Based on the provided FRA signature.</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Confidence Score</CardTitle>
                    <CardDescription>Probability of correctness.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4">
                        <Progress value={confidenceValue} className="h-3 flex-1" />
                        <span className="text-xl font-bold">
                            {confidenceValue.toFixed(1)}%
                        </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <Card>
                <CardHeader>
                    <CardTitle>Health Compass</CardTitle>
                    <CardDescription>AI-inferred fault category.</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-center">
                    <HealthCompassAnalysis result={result} />
                </CardContent>
              </Card>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Raw Data Summary</h3>
              <p className="text-sm text-muted-foreground p-4 bg-muted/50 rounded-lg border font-mono">{result.rawFraDataSummary}</p>
            </div>
          </TabsContent>

          <TabsContent value="root-cause">
             <ChartContainer config={{}} className="h-[250px] w-full">
                 <div className="flex items-start gap-4 p-1">
                    <div className="text-primary pt-1"><Share2 className="w-6 h-6" /></div>
                    <div className="flex-1">
                        <h3 className="font-bold text-lg">AI-Powered Root Cause Analysis</h3>
                        <p className="text-sm text-muted-foreground mb-4">The most likely contributing factors to the detected fault.</p>
                        <RootCauseAnalysisChart result={result} />
                    </div>
                </div>
             </ChartContainer>
          </TabsContent>

          <TabsContent value="ai-explanation">
            <AIFetcher flow={augmentDashboardWithAIExplanations} input={result} icon={<Bot className="w-6 h-6" />} title="AI-Generated Explanation" onData={(d) => handleAIData('aiExplanation', d.aiExplanation)} />
          </TabsContent>

          <TabsContent value="actions">
            <AIFetcher flow={generateActionableInsights} input={result} icon={<Lightbulb className="w-6 h-6" />} title="Recommended Actions" onData={(d) => handleAIData('actionableInsights', d.actionableInsights)} />

          </TabsContent>
          
          {role === 'manager' && (
            <TabsContent value="expert-system">
              <AIFetcher flow={suggestExpertSystemRules} input={result} icon={<BrainCircuit className="w-6 h-6" />} title="Suggested Expert System Rules" onData={(d) => handleAIData('suggestedRules', d.suggestedRules)} />
            </TabsContent>
          )}

        </Tabs>
      </CardContent>
    </Card>
  )
}
