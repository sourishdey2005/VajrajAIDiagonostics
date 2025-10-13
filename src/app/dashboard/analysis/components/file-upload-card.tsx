"use client"

import { useState } from "react"
import { UploadCloud } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { transformers } from "@/lib/data"

interface FileUploadCardProps {
  onAnalyze: (file: File, transformerId: string, criticality: string) => void
}

export function FileUploadCard({ onAnalyze }: FileUploadCardProps) {
  const [file, setFile] = useState<File | null>(null)
  const [selectedTransformerId, setSelectedTransformerId] = useState<string>(transformers[0].id)
  
  const selectedTransformer = transformers.find(t => t.id === selectedTransformerId);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0])
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  };

  const handleSubmit = () => {
    if (file && selectedTransformer) {
      onAnalyze(file, selectedTransformer.id, selectedTransformer.criticality)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Data File</CardTitle>
        <CardDescription>
          Select a transformer and upload its FRA data file (CSV, XML, BIN).
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div 
          className="flex flex-col items-center justify-center w-full p-8 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted"
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => document.getElementById('file-upload')?.click()}
        >
          <UploadCloud className="w-10 h-10 text-muted-foreground" />
          <p className="mt-2 text-sm text-muted-foreground">
            <span className="font-semibold text-primary">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-muted-foreground">Supported formats: CSV, XML, BIN</p>
          {file && <p className="mt-2 text-sm font-medium">{file.name}</p>}
          <Input id="file-upload" type="file" className="hidden" onChange={handleFileChange} accept=".csv,.xml,.bin" />
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="transformer">Transformer</Label>
            <Select value={selectedTransformerId} onValueChange={setSelectedTransformerId}>
              <SelectTrigger id="transformer">
                <SelectValue placeholder="Select Transformer" />
              </SelectTrigger>
              <SelectContent>
                {transformers.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.id} - {t.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="criticality">Criticality Level</Label>
            <Input id="criticality" value={selectedTransformer?.criticality || ''} disabled />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSubmit} disabled={!file}>
          Upload & Analyze
        </Button>
      </CardFooter>
    </Card>
  )
}
