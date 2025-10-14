
"use client"

import { useState } from "react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { CheckCircle, XCircle } from "lucide-react"

const quizQuestions = [
  {
    question: "What is the primary function of a transformer?",
    options: ["To store energy", "To change AC voltage levels", "To generate electricity", "To correct power factor"],
    answer: "To change AC voltage levels",
  },
  {
    question: "Which of these is a common sign of a transformer fault?",
    options: ["A humming sound", "Unusually high temperature", "A steady green light", "Low load"],
    answer: "Unusually high temperature",
  },
   {
    question: "If you see sparks coming from a power pole or transformer, what should you do?",
    options: ["Get closer to investigate", "Try to fix it yourself", "Ignore it", "Keep a safe distance and report it immediately"],
    answer: "Keep a safe distance and report it immediately",
  },
];

function SafetyQuiz() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const { toast } = useToast()

  const question = quizQuestions[currentQuestionIndex]
  const isCorrect = selectedOption === question.answer

  const handleNext = () => {
    if (selectedOption === null) {
        toast({ title: "Please select an answer.", variant: "destructive" });
        return;
    }
    
    setShowResult(true);

    if (isCorrect) {
      setScore(s => s + 1)
    }

    setTimeout(() => {
        setShowResult(false)
        setSelectedOption(null)
        if (currentQuestionIndex < quizQuestions.length - 1) {
            setCurrentQuestionIndex(i => i + 1)
        } else {
             toast({ title: `Quiz Complete! Your score: ${isCorrect ? score + 1: score}/${quizQuestions.length}` });
             setCurrentQuestionIndex(0);
             setScore(0);
        }
    }, 1500)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>⚡ Quick Safety Quiz</CardTitle>
        <CardDescription>Test your electrical safety knowledge.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="font-semibold mb-4">{currentQuestionIndex + 1}. {question.question}</p>
        <RadioGroup
          value={selectedOption || ""}
          onValueChange={setSelectedOption}
          disabled={showResult}
        >
          {question.options.map(option => (
            <div key={option} className="flex items-center space-x-2">
              <RadioGroupItem value={option} id={option} />
              <Label htmlFor={option} className="font-normal cursor-pointer">{option}</Label>
            </div>
          ))}
        </RadioGroup>
        {showResult && (
            <div className={`mt-4 flex items-center gap-2 font-semibold ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                {isCorrect ? <CheckCircle /> : <XCircle />}
                <span>{isCorrect ? 'Correct!' : `Incorrect. The answer is: ${question.answer}`}</span>
            </div>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={handleNext} disabled={showResult}>
          {showResult ? (isCorrect ? 'Correct!' : 'Incorrect') : 'Check Answer'}
        </Button>
      </CardFooter>
    </Card>
  )
}


export default function KnowledgeHubPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-black tracking-tighter sm:text-4xl md:text-5xl font-headline">
          Power Knowledge Hub
        </h1>
        <p className="text-muted-foreground max-w-[700px]">
          Learn about the technology that powers your world and how to stay safe.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 items-start">
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Education Center</h2>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>What is a Transformer?</AccordionTrigger>
                <AccordionContent>
                  A transformer is a passive electrical device that transfers electrical energy from one electrical circuit to another, or multiple circuits. A varying current in any one coil of the transformer produces a varying magnetic flux in the transformer's core, which induces a varying electromotive force across any other coils wound around the same core.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>How does AI help prevent outages?</AccordionTrigger>
                <AccordionContent>
                  VajraAI uses advanced algorithms to analyze real-time data from transformers, like temperature, load, and frequency response. By detecting subtle anomalies that indicate a developing fault, the AI can predict potential failures before they happen. This allows maintenance crews to proactively repair issues, preventing unexpected blackouts and ensuring a reliable power supply.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>Electrical Safety Tips</AccordionTrigger>
                <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>Never touch a downed power line. Always assume it is live and dangerous.</li>
                        <li>Stay at least 30 feet away from any downed power lines.</li>
                        <li>Do not fly kites or drones near overhead power lines.</li>
                        <li>If you see sparks from a transformer or power pole, immediately move to a safe location and report it to your electricity provider.</li>
                         <li>Do not overload electrical outlets with too many plugs.</li>
                    </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
        </div>
        <SafetyQuiz />
      </div>
    </div>
  )
}
