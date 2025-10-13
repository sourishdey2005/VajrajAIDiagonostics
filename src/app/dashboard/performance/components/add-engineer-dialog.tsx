"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const engineerSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long."),
  faultsDetected: z.coerce.number().min(0, "Cannot be negative."),
  reportsSubmitted: z.coerce.number().min(0, "Cannot be negative."),
  onTimeCompletion: z.coerce.number().min(0).max(100, "Must be between 0 and 100."),
  avgResolutionHours: z.coerce.number().min(0, "Cannot be negative."),
})

type EngineerFormValues = z.infer<typeof engineerSchema>

interface AddEngineerDialogProps {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
  onAddEngineer: (data: EngineerFormValues) => void
}

export function AddEngineerDialog({ isOpen, onOpenChange, onAddEngineer }: AddEngineerDialogProps) {
  const form = useForm<EngineerFormValues>({
    resolver: zodResolver(engineerSchema),
    defaultValues: {
      name: "",
      faultsDetected: 0,
      reportsSubmitted: 0,
      onTimeCompletion: 90,
      avgResolutionHours: 40,
    },
  })

  function onSubmit(data: EngineerFormValues) {
    onAddEngineer(data)
    form.reset()
    onOpenChange(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Add New Engineer</DialogTitle>
          <DialogDescription>
            Enter the details for the new field engineer.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Alisha Khan" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="faultsDetected"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Faults Detected</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="reportsSubmitted"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reports Submitted</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="onTimeCompletion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>On-Time Completion (%)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="avgResolutionHours"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Avg. Resolution (Hrs)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="md:col-span-2">
              <DialogClose asChild>
                <Button type="button" variant="ghost">Cancel</Button>
              </DialogClose>
              <Button type="submit">Add Engineer</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
