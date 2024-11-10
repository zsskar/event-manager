import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";

interface formProps {
  formName: string;
  onSubmit: () => void;
}

const createFormSchema = (fieldName: string) =>
  z.object({
    [fieldName]: z.string().min(2, {
      message: `${fieldName} must be at least 2 characters.`,
    }),
  });

export default function CategoryOrTag({ formName, onSubmit }: formProps) {
  const formSchema = createFormSchema(formName);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { [formName]: "" },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <h2 className="text-xl font-bold">{`Add ${
          formName.charAt(0).toUpperCase() + formName.slice(1)
        }`}</h2>

        <FormField
          control={form.control}
          name={formName}
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {formName.charAt(0).toUpperCase() + formName.slice(1)}
              </FormLabel>
              <FormControl>
                <Input placeholder={`Enter ${formName}`} {...field} />
              </FormControl>
              <FormDescription>This is your {formName}.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
