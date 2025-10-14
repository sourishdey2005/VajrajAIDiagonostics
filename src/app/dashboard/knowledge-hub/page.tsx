
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
    question: "What does 'FRA' stand for in transformer diagnostics?",
    options: ["Fault Repair Analysis", "Frequency Response Analysis", "Fast Reactance Assessment", "Field Relay Audit"],
    answer: "Frequency Response Analysis",
  },
  {
    question: "If you see sparks from a power pole, what is the safest action?",
    options: ["Get closer to investigate", "Try to fix it yourself", "Ignore it", "Keep a safe distance and report it immediately"],
    answer: "Keep a safe distance and report it immediately",
  },
    {
    question: "Which of the following is an effective way to save energy at home?",
    options: ["Leaving lights on in empty rooms", "Using appliances on standby mode", "Unplugging chargers when not in use", "Setting the AC to the lowest temperature"],
    answer: "Unplugging chargers when not in use",
  },
  {
    question: "What does AI like VajraAI use to predict transformer faults?",
    options: ["Weather forecasts only", "The age of the transformer", "Subtle changes in data like temperature and frequency", "The color of the transformer"],
    answer: "Subtle changes in data like temperature and frequency",
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
        <CardTitle>⚡ Quick Knowledge Quiz</CardTitle>
        <CardDescription>Test your power and safety knowledge.</CardDescription>
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
                <AccordionItem value="item-4">
                <AccordionTrigger>What is Frequency Response Analysis (FRA)?</AccordionTrigger>
                <AccordionContent>
                  FRA is a powerful diagnostic method used to evaluate the mechanical integrity of a transformer's internal components. By sending a range of frequencies through the transformer and measuring the response, engineers can detect issues like winding deformation or core problems, which are invisible to the naked eye. It's like an 'x-ray' for the transformer.
                </AccordionContent>
              </AccordionItem>
               <AccordionItem value="item-5">
                <AccordionTrigger>Simple Tips to Save Energy</AccordionTrigger>
                <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>Unplug chargers and appliances when not in use. They can draw power even when turned off (this is called "phantom load").</li>
                        <li>Switch to LED bulbs. They use up to 80% less energy and last much longer than traditional bulbs.</li>
                        <li>Use natural light whenever possible instead of turning on lights.</li>
                        <li>Set your air conditioner to a moderate temperature (e.g., 24-26°C) instead of the coldest setting. Every degree makes a difference.</li>
                    </ul>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>Electrical Safety Tips</AccordionTrigger>
                <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>Never touch a downed power line. Always assume it is live and dangerous.</li>
                        <li>Stay at least 30 feet (about 10 meters) away from any downed power lines.</li>
                        <li>Do not fly kites, drones, or balloons near overhead power lines.</li>
                        <li>If you see sparks from a transformer or power pole, immediately move to a safe location and report it to your electricity provider.</li>
                         <li>Do not overload electrical outlets with too many plugs, and avoid using damaged cords.</li>
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
