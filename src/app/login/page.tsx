
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
import { VajraIcon, GoogleIcon, AppleIcon } from '@/components/icons';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Mic, MicOff, Loader2, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { recognizeRoleCommand } from '@/ai/flows/recognize-role-command';

const rolePasswords: Record<Role, string> = {
    manager: 'vajra-manager',
    field_engineer: 'vajra-engineer',
    user: 'vajra-user'
}

export default function LoginPage() {
  const router = useRouter();
  const { setRole, setUserName, fieldEngineers } = useUserRole();
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [selectedRole, setSelectedRole] = useState<Role>('manager');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('engineer@vajra.ai');
  const [name, setName] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, startTransition] = useTransition();
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const { toast } = useToast();

  const loginHeroImage = PlaceHolderImages.find(p => p.id === 'login-hero');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    let defaultName = 'User';
    let isAuthenticated = false;

    if (selectedRole === 'manager') {
        if (email === 'engineer@vajra.ai' && password === rolePasswords.manager) {
            defaultName = 'Rohan Sharma';
            isAuthenticated = true;
        }
    } else if (selectedRole === 'user') {
        if (password === rolePasswords.user) {
            isAuthenticated = true;
        }
    } else if (selectedRole === 'field_engineer') {
        const dynamicEngineer = fieldEngineers.find(eng => eng.email === email && eng.password === password);
        if (dynamicEngineer) {
            defaultName = dynamicEngineer.name;
            isAuthenticated = true;
        } 
        else if (email === 'engineer@vajra.ai' && password === rolePasswords.field_engineer) {
            defaultName = 'Priya Sharma';
            isAuthenticated = true;
        }
    }

    if (isAuthenticated) {
        setRole(selectedRole);
        setUserName(name || defaultName);
        router.push('/dashboard');
    } else {
        toast({
            title: "Invalid Credentials",
            description: "The email or password you entered is incorrect.",
            variant: "destructive",
        });
    }
  };

  const handleSocialLogin = (role: Role) => {
    setRole(role);
    setUserName('Social User');
    router.push('/dashboard');
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({
        title: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }
    setRole(selectedRole);
    setUserName(name || 'New User');
    toast({
        title: "Account Created!",
        description: "Redirecting you to the dashboard..."
    });
    router.push('/dashboard');
  };

  const handleForgotPassword = (e: React.FormEvent) => {
     e.preventDefault();
     toast({
        title: "Password Reset Instructions Sent",
        description: `If an account exists for ${email}, you will receive an email with reset instructions.`
    });
    setAuthMode('login');
  }

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
                  title: `Logging you in as ${role.replace('_', ' ')}.`,
                  description: "Please enter the password for this role.",
                });
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
  
  const renderForm = () => {
    if (authMode === 'signup') {
        return (
            <>
                 <div className="grid gap-2 text-center">
                    <VajraIcon className="h-10 w-10 text-primary mx-auto" />
                    <h1 className="text-3xl font-bold font-headline">Create an Account</h1>
                    <p className="text-balance text-muted-foreground">
                        Enter your details to get started.
                    </p>
                </div>
                 <form onSubmit={handleSignUp} className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" placeholder="e.g., Alisha Khan" required value={name} onChange={e => setName(e.target.value)} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="m@example.com" required value={email} onChange={e => setEmail(e.target.value)} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="role-signup">Role</Label>
                        <Select value={selectedRole} onValueChange={(value: Role) => setSelectedRole(value)}>
                            <SelectTrigger id="role-signup">
                            <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                            <SelectContent>
                            <SelectItem value="manager">Manager</SelectItem>
                            <SelectItem value="field_engineer">Field Engineer</SelectItem>
                            <SelectItem value="user">User</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" type="password" required value={password} onChange={e => setPassword(e.target.value)} />
                    </div>
                     <div className="grid gap-2">
                        <Label htmlFor="confirm-password">Confirm Password</Label>
                        <Input id="confirm-password" type="password" required value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
                    </div>
                    <Button type="submit" className="w-full">
                        Sign Up
                    </Button>
                    <div className="mt-4 text-center text-sm">
                        Already have an account?{' '}
                        <Button variant="link" className="p-0" onClick={() => setAuthMode('login')}>Login</Button>
                    </div>
                </form>
            </>
        )
    }

    if (authMode === 'forgot') {
        return (
             <>
                 <div className="grid gap-2 text-center">
                    <VajraIcon className="h-10 w-10 text-primary mx-auto" />
                    <h1 className="text-3xl font-bold font-headline">Forgot Password</h1>
                    <p className="text-balance text-muted-foreground">
                        Enter your email to receive reset instructions.
                    </p>
                </div>
                 <form onSubmit={handleForgotPassword} className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="m@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <Button type="submit" className="w-full">
                        Send Instructions
                    </Button>
                    <div className="mt-4 text-center text-sm">
                        Remember your password?{' '}
                        <Button variant="link" className="p-0" onClick={() => setAuthMode('login')}>Login</Button>
                    </div>
                </form>
            </>
        )
    }

    return (
        <>
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
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="role">Role</Label>
                    <Select value={selectedRole} onValueChange={(value: Role) => setSelectedRole(value)}>
                        <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                        <SelectContent>
                        <SelectItem value="manager">Manager</SelectItem>
                        <SelectItem value="field_engineer">Field Engineer</SelectItem>
                        <SelectItem value="user">User</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="grid gap-2">
                    <div className="flex items-center">
                        <Label htmlFor="password">Password</Label>
                        <Button variant="link" className="ml-auto p-0 text-sm" onClick={() => setAuthMode('forgot')}>Forgot password?</Button>
                    </div>
                    <Input 
                        id="password" 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required 
                    />
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
                        Or continue with
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Button variant="outline" type="button" onClick={() => handleSocialLogin('user')}>
                        <GoogleIcon className="mr-2 h-4 w-4" />
                        Google
                    </Button>
                    <Button variant="outline" type="button" onClick={() => handleSocialLogin('user')}>
                        <AppleIcon className="mr-2 h-4 w-4" />
                        Apple
                    </Button>
                </div>
                
                <Button type="button" variant="outline" className="w-full" onClick={handleVoiceCommand} disabled={isProcessing}>
                {isProcessing ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : isRecording ? (
                    <MicOff className="mr-2 h-4 w-4 text-destructive" />
                ) : (
                    <Mic className="mr-2 h-4 w-4" />
                )}
                {isProcessing ? "Processing..." : isRecording ? "Recording..." : "Select Role with Voice"}
                </Button>
                 <div className="mt-4 text-center text-sm">
                    Don&apos;t have an account?{' '}
                    <Button variant="link" className="p-0" onClick={() => setAuthMode('signup')}>Sign up</Button>
                </div>
            </form>
        </>
    )
  }


  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[380px] gap-6">
          {renderForm()}
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
        <Card className="absolute bottom-10 left-10 text-sm text-card-foreground bg-card/80 backdrop-blur-sm w-[360px]">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Info className="w-5 h-5 text-primary" />
                    Demo Credentials
                </CardTitle>
                <CardDescription>Use these credentials to explore different roles.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <h3 className="font-semibold">Manager Role</h3>
                    <p className="font-mono text-xs">Email: <span className="text-primary">engineer@vajra.ai</span></p>
                    <p className="font-mono text-xs">Password: <span className="text-primary">vajra-manager</span></p>
                </div>
                 <div>
                    <h3 className="font-semibold">Field Engineer Role</h3>
                    <p className="font-mono text-xs">Email: <span className="text-primary">engineer@vajra.ai</span></p>
                    <p className="font-mono text-xs">Password: <span className="text-primary">vajra-engineer</span></p>
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}

    