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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"

const transformerSchema = z.object({
  name: z.string().min(3, "Substation name must be at least 3 characters long."),
  location: z.string().min(2, "Location is required."),
  criticality: z.enum(["High", "Medium", "Low"]),
  load: z.coerce.number().min(0, "Load cannot be negative.").max(100, "Load must be 100% or less."),
  manufacturer: z.string().min(2, "Manufacturer is required."),
  last_inspection: z.date({ required_error: "Last service date is required." }),
  nextServiceDate: z.date({ required_error: "Next service date is required." }),
  servicedBy: z.string().min(2, "Service engineer's name is required."),
})

type TransformerFormValues = z.infer<typeof transformerSchema>

interface AddTransformerDialogProps {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
  onAddTransformer: (data: TransformerFormValues) => void
}

export function AddTransformerDialog({ isOpen, onOpenChange, onAddTransformer }: AddTransformerDialogProps) {
  const form = useForm<TransformerFormValues>({
    resolver: zodResolver(transformerSchema),
    defaultValues: {
      name: "",
      location: "",
      criticality: "Medium",
      load: 75,
      manufacturer: "",
      servicedBy: "",
    },
  })

  function onSubmit(data: TransformerFormValues) {
    onAddTransformer(data)
    form.reset()
    onOpenChange(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add New Transformer</DialogTitle>
          <DialogDescription>
            Enter the details of the new transformer to add it to the monitoring fleet.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Substation Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Bandra Substation" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Mumbai, MH" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="criticality"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Criticality</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select asset criticality" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                   <FormDescription>The operational importance of this asset.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="load"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Average Load (%)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 75" {...field} />
                  </FormControl>
                   <FormDescription>The typical operational load percentage.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="manufacturer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Manufacturer</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Siemens India" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="servicedBy"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Serviced By</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Ravi Kumar" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
                control={form.control}
                name="last_inspection"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Last Service Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("2000-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            <FormField
              control={form.control}
              name="nextServiceDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Next Scheduled Service</FormLabel>
                   <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                           disabled={(date) =>
                            date < new Date()
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="md:col-span-2">
              <DialogClose asChild>
                <Button type="button" variant="ghost">Cancel</Button>
              </DialogClose>
              <Button type="submit">Add Transformer</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
