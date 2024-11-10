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
import { Button } from "@/components/ui/button";

const formName = "category";

const createFormSchema = (fieldName: string) =>
  z.object({
    [fieldName]: z.string().min(2, {
      message: `${fieldName} must be at least 2 characters.`,
    }),
  }) as unknown as z.ZodObject<{ [key: string]: z.ZodString }>;

export default function AddCategory() {
  const formSchema = createFormSchema(formName);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { [formName]: "" },
  });

  return (
    <div className="flex justify-center bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center text-gray-800 dark:text-white mb-6">
          {`Add ${formName.charAt(0).toUpperCase() + formName.slice(1)}`}
        </h2>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(() => {})} className="space-y-6">
            <FormField
              control={form.control}
              name={formName}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-medium text-gray-700 dark:text-gray-300">
                    {formName.charAt(0).toUpperCase() +
                      formName.slice(1) +
                      " Name"}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={`Enter ${formName}`}
                      {...field}
                      className="mt-2 p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition"
                    />
                  </FormControl>
                  <FormDescription className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    This {formName} name you can use while creating the events.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition"
            >
              Submit
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
