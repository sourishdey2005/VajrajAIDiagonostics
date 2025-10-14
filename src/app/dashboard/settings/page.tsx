
"use client"

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
import { Switch } from "@/components/ui/switch"
import { useUserRole, FieldEngineerAccount } from "@/contexts/user-role-context"
import { ShieldCheck, MessageSquareWarning, BellRing, UserPlus } from "lucide-react"
import { useForm, SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useToast } from "@/hooks/use-toast"

const newEngineerSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters."),
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters long."),
})

type NewEngineerFormValues = z.infer<typeof newEngineerSchema>;


export default function SettingsPage() {
  const { role, userName, addFieldEngineer, fieldEngineers } = useUserRole();
  const { toast } = useToast();

   const form = useForm<NewEngineerFormValues>({
    resolver: zodResolver(newEngineerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: ""
    }
  });

  const onSubmit: SubmitHandler<NewEngineerFormValues> = (data) => {
    if (fieldEngineers.some(e => e.email === data.email)) {
        toast({
            title: "Email already exists",
            description: "An engineer with this email address has already been registered.",
            variant: "destructive"
        });
        return;
    }
    addFieldEngineer(data);
    toast({
        title: "Engineer Account Created",
        description: `${data.name} can now log in with the provided credentials.`
    });
    form.reset();
  };


  const renderManagerAndEngineerSettings = () => (
    <>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><ShieldCheck /> System Alert Preferences</CardTitle>
            <CardDescription>
              Configure alerts for critical asset and team events.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <Label className="text-base">Critical Fault Alerts</Label>
                 <p className="text-sm text-muted-foreground">
                  Notify when a transformer needs attention.
                </p>
              </div>
              <Switch defaultChecked />
            </div>
             <div className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <Label className="text-base">Missed Maintenance</Label>
                 <p className="text-sm text-muted-foreground">
                  Alert for overdue service dates.
                </p>
              </div>
              <Switch defaultChecked />
            </div>
             <div className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <Label className="text-base">Team Communications</Label>
                 <p className="text-sm text-muted-foreground">
                  Get alerts for escalations or key notes.
                </p>
              </div>
              <Switch />
            </div>
          </CardContent>
           <CardFooter>
            <Button>Save Preferences</Button>
          </CardFooter>
        </Card>
        
        {role === 'manager' && (
          <Card className="xl:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><UserPlus /> Create Field Engineer Account</CardTitle>
              <CardDescription>
                Provision a new login for a field engineer. They will be able to log in with the credentials you set.
              </CardDescription>
            </CardHeader>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="new-engineer-name">Full Name</Label>
                  <Input id="new-engineer-name" placeholder="e.g., Alisha Khan" {...form.register("name")} />
                  {form.formState.errors.name && <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-engineer-email">Email Address</Label>
                  <Input id="new-engineer-email" type="email" placeholder="alisha.k@vajra.ai" {...form.register("email")} />
                  {form.formState.errors.email && <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-engineer-password">Password</Label>
                  <Input id="new-engineer-password" type="password" placeholder="Set a secure password" {...form.register("password")} />
                  {form.formState.errors.password && <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>}
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={form.formState.isSubmitting}>Create Account</Button>
              </CardFooter>
            </form>
          </Card>
        )}
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><BellRing /> Notification Channels</CardTitle>
            <CardDescription>
              Configure how you receive alerts.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <Label className="text-base">App Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive alerts within the app.
                </p>
              </div>
              <Switch defaultChecked disabled/>
            </div>
             <div className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <Label className="text-base">Email Notifications</Label>
                 <p className="text-sm text-muted-foreground">
                  Receive alerts to your inbox.
                </p>
              </div>
              <Switch defaultChecked />
            </div>
             <div className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <Label className="text-base">SMS Notifications</Label>
                 <p className="text-sm text-muted-foreground">
                  Get alerts via text message.
                </p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>
    </>
  );

  const renderUserSettings = () => (
     <>
        <Card>
          <CardHeader>
            <CardTitle>Alert Preferences</CardTitle>
            <CardDescription>
              Subscribe to notifications for your area.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="space-y-2">
              <Label htmlFor="pincode">My Pincode</Label>
              <Input id="pincode" defaultValue="400050" placeholder="Enter your 6-digit pincode"/>
            </div>
             <div className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <Label className="text-base">Critical Fault Alerts</Label>
                 <p className="text-sm text-muted-foreground">
                  Get notified about urgent issues.
                </p>
              </div>
              <Switch defaultChecked />
            </div>
             <div className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <Label className="text-base">Upcoming Maintenance</Label>
                 <p className="text-sm text-muted-foreground">
                  Alerts for planned outages.
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
           <CardFooter>
            <Button>Save Preferences</Button>
          </CardFooter>
        </Card>
         <Card>
          <CardHeader>
            <CardTitle>Notification Channels</CardTitle>
            <CardDescription>
              Configure how you receive alerts.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <Label className="text-base">App Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive alerts within the app.
                </p>
              </div>
              <Switch defaultChecked disabled/>
            </div>
             <div className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <Label className="text-base">Email Notifications</Label>
                 <p className="text-sm text-muted-foreground">
                  Receive alerts to your inbox.
                </p>
              </div>
              <Switch defaultChecked />
            </div>
             <div className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <Label className="text-base">SMS Notifications</Label>
                 <p className="text-sm text-muted-foreground">
                  Get alerts via text message.
                </p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>
      </>
  );

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>
      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>
              Update your personal information.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" defaultValue={userName} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue={`${role.split('_')[0]}@vajra.ai`} />
            </div>
             <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" type="tel" defaultValue="+91 98765 43210" />
            </div>
          </CardContent>
          <CardFooter>
            <Button>Save Changes</Button>
          </CardFooter>
        </Card>

        {role === 'user' ? renderUserSettings() : renderManagerAndEngineerSettings()}
      </div>
    </div>
  )
}

    