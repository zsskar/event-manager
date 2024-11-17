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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSession } from "@clerk/clerk-react";
import { trpc } from "@/utils/trpc";
import { toast } from "sonner";
import { useRecoilState } from "recoil";
import { categoryState } from "@/store/atoms/category";

const createFormSchema = (fieldName: string) =>
  z.object({
    category: z.string().min(5, {
      message: `${fieldName} name should be minimum 5 characters.`,
    }),
  });

type FormData = {
  category: string;
};

const formName = "category";
const formSchema = createFormSchema(formName);

export default function AddCategory() {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { category: "" },
  });
  const { session } = useSession();
  const [, setCategory] = useRecoilState(categoryState);
  const createMutation = trpc.category.insert.useMutation();

  const onSubmit = (data: FormData) => {
    const categoryData = {
      category: data.category,
      createdBy: session?.user.id as string,
    };
    saveData(categoryData);
  };

  const saveData = (categoryData: { category: string; createdBy: string }) => {
    createMutation.mutate(categoryData, {
      onSuccess: (data) => {
        toast.success("Category saved successfully.", {
          position: "top-right",
        });
        setCategory((prev) => {
          return [...prev, data];
        });

        form.reset();
      },
      onError: (error) => {
        toast.error("Something went wrong.", {
          position: "top-right",
        });
        console.error("Error inserting data:", error);
      },
    });
  };

  return (
    <div className="border border-gray-300 dark:border-gray-600 flex justify-center bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 w-full">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Tags Input */}
            <FormField
              control={form.control}
              name={formName}
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-1">
                    <FormLabel className="text-lg font-medium text-gray-700 dark:text-gray-300">
                      Category Name
                    </FormLabel>
                  </div>

                  <FormControl>
                    <Input
                      {...field} // spread field properties for form integration
                      type="text"
                      placeholder="Enter category name"
                      className="w-full px-3 py-2 mt-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                    />
                  </FormControl>
                  <FormDescription className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    This {formName} name you can use while creating the events.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <div className="flex">
              <Button
                type="submit"
                className="ml-auto py-3 text-white rounded-lg font-semibold hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition"
              >
                Submit
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
