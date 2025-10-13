"use client";

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect, useTransition } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUserRole, type Role } from '@/contexts/user-role-context';
import { VajraIcon } from '@/components/icons';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { recognizeRoleCommand } from '@/ai/flows/recognize-role-command';

export default function LoginPage() {
  const router = useRouter();
  const { setRole } = useUserRole();
  const [selectedRole, setSelectedRole] = useState<Role>('field_engineer');
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, startTransition] = useTransition();
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const { toast } = useToast();

  const loginHeroImage = PlaceHolderImages.find(p => p.id === 'login-hero');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setRole(selectedRole);
    router.push('/dashboard');
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setIsRecording(true);
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          const base64Audio = reader.result as string;
          startTransition(async () => {
            try {
              const { role } = await recognizeRoleCommand({ audioDataUri: base64Audio });
              if (role !== 'unknown') {
                setSelectedRole(role);
                toast({
                  title: "Role Detected!",
                  description: `Logging you in as ${role.replace('_', ' ')}.`,
                });
                setTimeout(() => {
                    setRole(role);
                    router.push('/dashboard');
                }, 1000);
              } else {
                toast({
                  title: "Voice Command Not Recognized",
                  description: "Please try saying 'log me in as a manager' or 'log me in as an engineer'.",
                  variant: "destructive",
                });
              }
            } catch (error) {
              console.error(error);
              toast({
                title: "Error Processing Voice Command",
                description: "Could not process your voice command. Please try again.",
                variant: "destructive",
              });
            }
          });
        };
      };

      mediaRecorderRef.current.start();
      toast({
        title: "Listening...",
        description: "Speak your role (e.g., 'Log in as a manager').",
      });

      // Stop recording after 4 seconds
      setTimeout(() => {
        stopRecording();
      }, 4000);

    } catch (error) {
      console.error("Error accessing microphone:", error);
      toast({
        title: "Microphone Access Denied",
        description: "Please allow microphone access in your browser settings to use voice commands.",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleVoiceCommand = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[380px] gap-6">
          <div className="grid gap-2 text-center">
            <VajraIcon className="h-10 w-10 text-primary mx-auto" />
            <h1 className="text-3xl font-bold font-headline">VajraAI Diagnostics</h1>
            <p className="text-balance text-muted-foreground">
              Login to access the future of transformer fault analysis
            </p>
          </div>
          <form onSubmit={handleLogin} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                defaultValue="engineer@vajra.ai"
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input id="password" type="password" defaultValue="password" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="role">Role</Label>
              <Select value={selectedRole} onValueChange={(value: Role) => setSelectedRole(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="field_engineer">Field Engineer</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full">
              Login
            </Button>
            <div className="relative my-2">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                    Or
                    </span>
                </div>
            </div>
            <Button type="button" variant="outline" className="w-full" onClick={handleVoiceCommand} disabled={isProcessing}>
              {isProcessing ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : isRecording ? (
                <MicOff className="mr-2 h-4 w-4 text-destructive" />
              ) : (
                <Mic className="mr-2 h-4 w-4" />
              )}
              {isProcessing ? "Processing..." : isRecording ? "Recording... (Speak Now)" : "Login with Voice"}
            </Button>
          </form>
        </div>
      </div>
      <div className="hidden bg-muted lg:block relative">
        {loginHeroImage && (
            <Image
            src={loginHeroImage.imageUrl}
            alt={loginHeroImage.description}
            fill
            className="object-cover"
            data-ai-hint={loginHeroImage.imageHint}
            />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-10 left-10 text-white">
            <h2 className="text-4xl font-bold font-headline">Intelligent Diagnostics. Actionable Insights.</h2>
            <p className="text-lg mt-2 max-w-2xl">VajraAI leverages state-of-the-art AI to predict and diagnose transformer faults before they become critical.</p>
        </div>
      </div>
    </div>
  );
}
