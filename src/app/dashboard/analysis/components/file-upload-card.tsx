"use client"

import { useState } from "react"
import { UploadCloud, FileCheck2, Loader2 } from "lucide-react"
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
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

interface FileUploadCardProps {
  onAnalyze: (file: File, transformerId: string, criticality: string) => void
}

export function FileUploadCard({ onAnalyze }: FileUploadCardProps) {
  const [file, setFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [selectedTransformerId, setSelectedTransformerId] = useState<string>(transformers[0].id)
  const { toast } = useToast()
  
  const selectedTransformer = transformers.find(t => t.id === selectedTransformerId);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  };

  const handleSubmit = () => {
    if (file && selectedTransformer) {
      onAnalyze(file, selectedTransformer.id, selectedTransformer.criticality)
    } else {
        toast({
            title: "Incomplete information",
            description: "Please select a file and a transformer.",
            variant: "destructive",
        })
    }
  }

  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>New Analysis Job</CardTitle>
        <CardDescription>
          Select a transformer and upload its FRA data file (e.g., .csv, .xml, .dat).
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div 
          className={cn(
            "flex flex-col items-center justify-center w-full p-10 border-2 border-dashed rounded-lg cursor-pointer transition-colors",
            isDragging ? "bg-muted border-primary" : "hover:bg-muted/50"
          )}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => document.getElementById('file-upload')?.click()}
        >
          {file ? (
            <div className="flex flex-col items-center text-center">
              <FileCheck2 className="w-12 h-12 text-green-500" />
              <p className="mt-4 text-lg font-semibold">{file.name}</p>
              <p className="text-sm text-muted-foreground">
                ({(file.size / 1024).toFixed(2)} KB)
              </p>
              <Button variant="link" size="sm" className="mt-2 text-destructive" onClick={(e) => { e.stopPropagation(); setFile(null); }}>
                Remove file
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center text-center">
              <UploadCloud className="w-12 h-12 text-muted-foreground" />
              <p className="mt-4 text-sm text-muted-foreground">
                <span className="font-semibold text-primary">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-muted-foreground mt-1">Supported formats: CSV, XML, BIN, DAT</p>
            </div>
          )}
          <Input id="file-upload" type="file" className="hidden" onChange={handleFileChange} accept=".csv,.xml,.bin,.dat" />
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
            <Input id="criticality" value={selectedTransformer?.criticality || ''} readOnly className="font-medium bg-muted/50"/>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSubmit} disabled={!file || !selectedTransformer}>
          <Loader2 className="mr-2 h-4 w-4 animate-spin hidden" />
          Upload & Analyze
        </Button>
      </CardFooter>
    </Card>
  )
}
