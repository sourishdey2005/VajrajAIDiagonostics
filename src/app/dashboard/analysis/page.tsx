"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { AnalysisResultCard } from "./components/analysis-result-card"
import { FileUploadCard } from "./components/file-upload-card"
import { classifyFraData } from "@/ai/flows/classify-fra-data"

type AnalysisState = "idle" | "loading" | "results"
type AnalysisResult = {
  faultClassification: string
  confidenceScore: number
  transformerId: string
  criticality: string
  rawFraDataSummary: string
}

export default function AnalysisPage() {
  const [analysisState, setAnalysisState] = useState<AnalysisState>("idle")
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast()

  const handleAnalyze = async (file: File, transformerId: string, criticality: string) => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a file to upload.",
        variant: "destructive",
      })
      return
    }

    const supportedFormats = ["csv", "xml", "bin", "dat", "txt"]
    const fileExtension = file.name.split('.').pop()?.toLowerCase()
    
    if (!fileExtension || !supportedFormats.includes(fileExtension)) {
      toast({
        title: "Unsupported file format",
        description: `Only ${supportedFormats.join(', ')} files are supported.`,
        variant: "destructive",
      })
      return
    }

    setAnalysisState("loading")

    const fileReader = new FileReader()
    fileReader.readAsText(file, "UTF-8")
    fileReader.onload = (e) => {
        const fileData = e.target?.result as string;
        startTransition(async () => {
          try {
            const result = await classifyFraData({ fileData, transformerId, criticality });
            setAnalysisResult({
              ...result,
              transformerId,
              criticality,
            });
            setAnalysisState("results");
          } catch (error) {
            console.error("AI Analysis failed:", error);
            toast({
              title: "Analysis Failed",
              description: "The AI analysis could not be completed. Please try again.",
              variant: "destructive",
            });
            setAnalysisState("idle");
          }
        });
    };
    fileReader.onerror = (error) => {
        console.error("Failed to read file:", error);
        toast({
            title: "File Read Error",
            description: "Could not read the selected file.",
            variant: "destructive",
        });
        setAnalysisState("idle");
    };
  }

  const handleNewAnalysis = () => {
    setAnalysisState("idle")
    setAnalysisResult(null)
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tighter sm:text-4xl md:text-5xl font-headline">
            FRA Data Analysis
          </h1>
          <p className="text-muted-foreground">
            Upload Frequency Response Analysis data to perform an AI-powered fault diagnosis.
          </p>
        </div>
        {analysisState !== "idle" && (
          <Button onClick={handleNewAnalysis}>Start New Analysis</Button>
        )}
      </div>

      {analysisState === "idle" && (
        <FileUploadCard onAnalyze={handleAnalyze} isAnalyzing={isPending} />
      )}

      {(analysisState === "loading" || (analysisState === "results" && analysisResult)) && (
        <AnalysisResultCard result={analysisResult} isLoading={analysisState === 'loading' || isPending} />
      )}
    </div>
  )
}
