"use client"

import { useUserRole } from "@/contexts/user-role-context"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import React from "react"

const electricitySuppliers = [
    "Adani Electricity Mumbai Ltd",
    "Tata Power",
    "Brihanmumbai Electric Supply and Transport (BEST)",
    "Torrent Power",
    "India Power Corporation Limited",
    "Other"
];

export function UserDashboard() {
  const { userName } = useUserRole();
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      toast({
          title: "Details Saved",
          description: "Your information has been updated successfully.",
      })
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-black tracking-tighter sm:text-4xl md:text-5xl font-headline">
          Welcome, {userName}
        </h1>
        <p className="text-muted-foreground">
          Please provide your details to get started with our services.
        </p>
      </div>
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Complete Your Profile</CardTitle>
          <CardDescription>
            This information helps us tailor our services to your specific needs.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="grid md:grid-cols-2 gap-6">
            <div className="grid gap-2">
              <Label htmlFor="consumer-id">Consumer ID</Label>
              <Input id="consumer-id" placeholder="Enter your Consumer ID" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="supplier">Electricity Supplier</Label>
              <Select>
                <SelectTrigger id="supplier">
                  <SelectValue placeholder="Select your supplier" />
                </SelectTrigger>
                <SelectContent>
                  {electricitySuppliers.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="area">Area / Locality</Label>
              <Input id="area" placeholder="e.g., Bandra West" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="district">District</Label>
              <Input id="district" placeholder="e.g., Mumbai" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="pincode">Pincode</Label>
              <Input id="pincode" placeholder="e.g., 400050" required />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit">Save Details</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
