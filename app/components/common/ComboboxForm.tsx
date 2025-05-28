import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "~/components/ui/button"
import { Check, ChevronsUpDown } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem ,CommandList } from "~/components/ui/command"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form"
import { cn } from "~/lib/utils"
import { Toast } from "~/components/ui/toast"

const languages: { label: string; value: string }[] = [
  { label: "中文", value: "zh" },
  { label: "English", value: "en" },
  { label: "日本語", value: "jp" },
  { label: "Français", value: "fr" },
  { label: "Deutsch", value: "de" },
]
console.log('[ComboboxForm] mock languages', languages)

const FormSchema = z.object({
  language: z.array(z.string({
    required_error: "Please select at least one language.",
  })).min(1, "Please select at least one language."),
})

export function ComboboxForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: { language: [] },
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log('[ComboboxForm] onSubmit 入参', data)
    Toast({
      title: "You submitted the following values:"
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="language"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Language</FormLabel>
              <Popover open={field.value.length > 0 ? undefined : undefined}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-[300px] justify-between",
                        !field.value.length && "text-muted-foreground"
                      )}
                    >
                      {field.value.length
                        ? languages.filter(l => field.value.includes(l.value)).map(l => l.label).join(', ')
                        : "Select language"}
                      <ChevronsUpDown className="opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0">
                  <Command>
                    <CommandInput
                      placeholder="Search language..."
                      className="h-9"
                    />
                    <CommandList>
                      <CommandEmpty>No language found.</CommandEmpty>
                      <CommandGroup>
                        {languages.map((language) => {
                          const checked = field.value.includes(language.value)
                          return (
                            <CommandItem
                              value={language.label}
                              key={language.value}
                              onSelect={() => {
                                let newValue = [...field.value]
                                if (checked) {
                                  newValue = newValue.filter(v => v !== language.value)
                                } else {
                                  newValue.push(language.value)
                                }
                                console.log('[ComboboxForm] CommandItem onSelect', { selected: language.value, checked, newValue })
                                field.onChange(newValue)
                                // 不关闭弹层
                              }}
                            >
                              <div className="flex items-center w-full">
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    checked ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                {language.label}
                              </div>
                            </CommandItem>
                          )
                        })}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormDescription>
                This is the language that will be used in the dashboard.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}