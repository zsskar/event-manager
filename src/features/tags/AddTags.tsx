import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { TwitterPicker } from "react-color";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { InputTags } from "./InputTags";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { useSession } from "@clerk/clerk-react";
import { trpc } from "@/utils/trpc";
import { useRecoilState } from "recoil";
import { tagsState } from "@/store/atoms/tags";
import { toast } from "sonner";

const createFormSchema = (fieldName: string) =>
  z.object({
    tags: z.array(z.string()).min(1, {
      message: `At least one ${fieldName} must be added.`,
    }),
    color: z.string().min(7, {
      message: "Please select a color.",
    }),
  });

type FormData = {
  tags: string[];
  color: string;
  createdBy?: string;
};

const formName = "tags";
const formSchema = createFormSchema(formName);

export default function AddTags() {
  const [inputTags, setInputTags] = useState<string[]>([]);
  const { session } = useSession();
  const mutation = trpc.tags.insert.useMutation();
  const [, setTags] = useRecoilState(tagsState);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { tags: [], color: "" },
  });

  const onSubmit = (data: FormData) => {
    const formattedTags = data.tags.map((tag) => tag.toUpperCase()).toString();
    const tagsData = {
      tags: formattedTags,
      color: data.color,
      createdBy: session?.user.id as string,
    };

    mutation.mutate(tagsData, {
      onSuccess: (data) => {
        toast("tags saved successfully.");
        setTags((prev) => {
          return [...prev, data];
        });
        setInputTags([]);
        form.reset();
      },
      onError: (error) => {
        toast("something went wrong.");
        console.error("Error inserting data:", error);
        // Handle any error actions here, like showing an error message
      },
    });
  };

  const handleColorChange = (color) => {
    form.setValue("color", color.hex);
  };

  useEffect(() => {
    form.setValue("tags", inputTags);
  }, [form, inputTags]);

  return (
    <div className="flex justify-center dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-5 w-full">
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
                      Tag Name
                    </FormLabel>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200" />
                        </TooltipTrigger>
                        <TooltipContent side="right" align="center">
                          <p>
                            You can add multiple tags by pressing <b>Enter</b>{" "}
                            or <b>Space</b> after each input text.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  <FormControl>
                    <InputTags
                      value={inputTags} // Pass the tags state directly
                      onChange={setInputTags} // Update state based on new tags array
                      placeholder="Enter a tag and press Enter"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Color Picker */}
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-medium text-gray-700 dark:text-gray-300">
                    Select Color
                  </FormLabel>
                  <FormControl>
                    <div className="mt-2">
                      <TwitterPicker
                        color={field.value} // Set the initial color from form state
                        onChangeComplete={handleColorChange} // Handle color change
                      />
                    </div>
                  </FormControl>
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
