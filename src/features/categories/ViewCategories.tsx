import { Category } from "@/App";
import { categoryState } from "@/store/atoms/category";
import { trpc } from "@/utils/trpc";
import { useSession } from "@clerk/clerk-react";
import { TextSelectIcon, Trash2Icon, TrashIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { toast } from "sonner";

export default function ViewCategories() {
  const [categories, setCategories] = useRecoilState(categoryState);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [availableCategories, setAvailableCategories] =
    useState<Category[]>(categories);
  const { session } = useSession();
  const deleteMutation =
    trpc.category.deleteCategoriesByIdAndUserId.useMutation();

  useEffect(() => {
    if (categories && categories.length > 0) {
      setAvailableCategories(categories);
    }
  }, [categories]);

  const deleteCategoriesIdByUserId = (idsToBeDeleted: number[]) => {
    console.log("Ids to be deleted :", selectedCategories);

    deleteMutation.mutate(
      {
        userId: session?.user.id as string,
        categoryIds: idsToBeDeleted,
      },
      {
        onSuccess: () => {
          toast.success(
            `${
              idsToBeDeleted.length == 1 ? "Category" : "Categories"
            } deleted successfully`,
            {
              position: "top-right",
            }
          );
          setSelectedCategories([]);
        },
        onError: (error) => {
          toast.error("Something went wrong !", {
            position: "top-right",
          });
          console.error("Failed to delete categories:", error);
        },
      }
    );
  };

  const handleCheckboxChange = (categoryId: number) => {
    setSelectedCategories((prevSelected) =>
      prevSelected.includes(categoryId)
        ? prevSelected.filter((item) => item !== categoryId)
        : [...prevSelected, categoryId]
    );
  };

  const handleSelectAll = () => {
    const allCategories = availableCategories.flatMap((group) => group.id);
    setSelectedCategories(allCategories);
  };

  const handleClearSelectedCategories = () => {
    setSelectedCategories([]); // Clear all selected tags
  };

  const handleDeleteSelectedCategories = () => {
    const updatedCategories = availableCategories.filter(
      (category) => !selectedCategories.includes(category.id)
    );
    setAvailableCategories(updatedCategories); // Update available tags after deletion
    setCategories(updatedCategories);
    deleteCategoriesIdByUserId(selectedCategories);
  };

  const handleDeleteSelectedCategory = (categoryId: number) => {
    const updatedCategories = availableCategories.filter(
      (category) => category.id !== categoryId
    );

    setAvailableCategories(updatedCategories); // Update available tags after deletion
    setCategories(updatedCategories);
    deleteCategoriesIdByUserId([categoryId]);
  };

  return (
    <>
      {availableCategories && availableCategories.length > 0 ? (
        <div className="flex justify-center dark:bg-gray-900">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-3 w-full  max-h-96 overflow-y-auto">
            <div className="flex flex-wrap gap-3">
              {categories.map((category, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-2 px-3 py-1 rounded-full shadow-sm"
                  style={{
                    backgroundColor: "var(--bg-color)", // Custom CSS variable
                    color: "var(--text-color)", // Custom CSS variable
                    border: "1px solid",
                  }}
                >
                  <input
                    type="checkbox"
                    className="h-3 w-3 rounded focus:ring-1 focus:ring-offset-1 text-blue-600 focus:ring-blue-300 dark:text-blue-400"
                    checked={selectedCategories.includes(category.id)}
                    onChange={() => handleCheckboxChange(category.id)}
                  />
                  <span className="text-sm font-semibold">
                    {category.category}
                  </span>
                  <button
                    className="hover:text-red-400 focus:outline-none text-current"
                    onClick={() => handleDeleteSelectedCategory(category.id)}
                  >
                    <span className="inline-block w-4 h-4 text-lg font-bold leading-none">
                      &times;
                    </span>
                  </button>
                </div>
              ))}
            </div>
            {selectedCategories.length > 0 && (
              <div className="sticky bottom-0 mt-4 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-200 text-sm font-semibold text-center p-3 rounded-md shadow-sm">
                <div className="flex justify-between items-center">
                  <span>Selected Categories: {selectedCategories.length}</span>
                  <div className="flex space-x-2 ml-auto">
                    <button
                      className="text-red-500 hover:text-red-700 flex items-center"
                      onClick={handleSelectAll}
                    >
                      <TextSelectIcon className="h-5 w-5 mr-2" />
                      Select All
                    </button>
                    <span className="text-gray-500">|</span>
                    <button
                      className="text-red-500 hover:text-red-700 flex items-center"
                      onClick={handleClearSelectedCategories}
                    >
                      <TrashIcon className="h-5 w-5 mr-2" />
                      Clear Selection
                    </button>
                    <span className="text-gray-500">|</span>

                    <button
                      className="text-red-500 hover:text-red-700 flex items-center"
                      onClick={handleDeleteSelectedCategories}
                    >
                      <Trash2Icon className="h-5 w-5 mr-2" />
                      Delete Selected
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-10 w-full">
          <h3 className="text-lg text-center font-semibold text-gray-700 dark:text-gray-200">
            No Category Available
          </h3>
        </div>
      )}
    </>
  );
}
