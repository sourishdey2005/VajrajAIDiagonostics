"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { AnalysisResultCard } from "./components/analysis-result-card"
import { FileUploadCard } from "./components/file-upload-card"

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
  const { toast } = useToast()

  const handleAnalyze = (file: File, transformerId: string, criticality: string) => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a file to upload.",
        variant: "destructive",
      })
      return
    }

    const supportedFormats = ["csv", "xml", "bin", "dat"]
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
    // Simulate API call and analysis
    setTimeout(() => {
      // Simulate different results for variety
      const randomResult = Math.random();
      if (randomResult > 0.66) {
        setAnalysisResult({
            faultClassification: "Winding Deformation",
            confidenceScore: 0.87,
            transformerId: transformerId,
            criticality: criticality,
            rawFraDataSummary:
            "Significant deviation detected in the high-frequency range (1-2 MHz) compared to baseline data, suggesting physical changes in winding geometry.",
        });
      } else if (randomResult > 0.33) {
         setAnalysisResult({
            faultClassification: "Axial Displacement",
            confidenceScore: 0.92,
            transformerId: transformerId,
            criticality: criticality,
            rawFraDataSummary:
            "A notable impedance mismatch is observed in the mid-frequency (20kHz-200kHz) band, indicative of axial winding movement.",
        });
      } else {
        setAnalysisResult({
            faultClassification: "Core Fault",
            confidenceScore: 0.78,
            transformerId: transformerId,
            criticality: criticality,
            rawFraDataSummary:
            "Low-frequency oscillations and an anomalous response below 2kHz point towards a potential issue with the transformer core's magnetic circuit.",
        });
      }
      setAnalysisState("results")
    }, 2000)
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
        <FileUploadCard onAnalyze={handleAnalyze} />
      )}

      {(analysisState === "loading" || (analysisState === "results" && analysisResult)) && (
        <AnalysisResultCard result={analysisResult} isLoading={analysisState === 'loading'} />
      )}
    </div>
  )
}
