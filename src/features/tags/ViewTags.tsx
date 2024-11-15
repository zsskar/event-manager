import { TagGroup } from "@/App";
import {
  GridIcon,
  Info,
  ListIcon,
  TextSelectIcon,
  Trash2Icon,
  TrashIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import ListView from "./ListView";
import GroupView from "./GroupView";
import { useRecoilValue } from "recoil";
import { tagsState } from "@/store/atoms/tags";
import { trpc } from "@/utils/trpc";
import { useSession } from "@clerk/clerk-react";

export default function ViewTags() {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [view, setView] = useState<string>("list");
  const [tagsData] = useRecoilValue(tagsState);
  const [availableTags, setAvailableTags] = useState<TagGroup[]>(tagsData);
  const { session, isLoaded } = useSession();

  const {
    data: tags,
    isLoading,
    error,
  } = trpc.tags.getTagsByUserId.useQuery(
    { userId: session?.user.id || "" },
    { enabled: isLoaded }
  );

  useEffect(() => {
    if (!isLoading && tags) {
      setAvailableTags(tags);
    }
  }, [isLoading, tags]);

  const handleDeleteSelectedTags = () => {
    let updatedTags = availableTags.map((group) => ({
      ...group,
      tags: group.tags.filter((tag) => !selectedTags.includes(tag)),
    }));
    updatedTags = updatedTags.filter((tags) => tags.tags.length > 0);
    setAvailableTags(updatedTags); // Update available tags after deletion
    setSelectedTags([]); // Clear the selected tags after deletion
    console.log("Updated available tags after deletion:", updatedTags);
    toast(`${selectedTags.length} Tags has been deleted.`, {
      icon: <Info className="w-5 h-5 text-white" />, // Ensure the icon is white
      position: "top-right",
      className: "custom-toast", // Ensures all text inside the toast is white
    });
  };

  const handleDeleteSelectedTag = (tagName: string) => {
    let updatedTags = availableTags.map((group) => ({
      ...group,
      tags: group.tags.filter((tag) => tag !== tagName),
    }));
    updatedTags = updatedTags.filter((tags) => tags.tags.length > 0);
    setAvailableTags(updatedTags); // Update available tags after deletion
    setSelectedTags([]); // Clear the selected tags after deletion
    console.log("Updated available tags after deletion:", updatedTags);
  };

  const handleCheckboxChange = (tag: string) => {
    setSelectedTags((prevSelected) =>
      prevSelected.includes(tag)
        ? prevSelected.filter((item) => item !== tag)
        : [...prevSelected, tag]
    );
  };

  // Remove tag function
  const handleRemoveCategory = (tag: string) => {
    setSelectedTags((prevSelected) =>
      prevSelected.filter((item) => item !== tag)
    );
  };
  const handleClearSelectedTags = () => {
    setSelectedTags([]); // Clear all selected tags
  };

  const handleSelectAll = () => {
    const allTags = tags.flatMap((group) => group.tags);
    setSelectedTags(allTags);
  };

  const tagsView = (view: string) => {
    setView(view);
  };

  // Function to handle tag deletion
  const handleDeleteSelectedTagBox = (color: string, tag: string) => {
    setAvailableTags(
      (prevTags) =>
        prevTags
          .map((group) => {
            if (group.color === color) {
              return {
                ...group,
                tags: group.tags.filter((item) => item !== tag),
              };
            }
            return group;
          })
          .filter((group) => group.tags.length > 0) // Filter out color boxes with no tags
    );
  };

  const handleAllDeleteSelectedTagBox = () => {
    setAvailableTags([]);
    setSelectedTags([]);
  };

  return (
    <>
      {availableTags && availableTags.length > 0 ? (
        <>
          <div className="flex justify-between items-center sticky top-0 bg-white dark:bg-gray-800 z-10 p-4 rounded-t-lg">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
              Tags
            </h3>
            <div className="flex space-x-2">
              <button
                onClick={() => tagsView("list")}
                className="p-2 bg-gray-300 dark:bg-gray-700 rounded-full hover:bg-gray-400 dark:hover:bg-gray-600"
              >
                <ListIcon className="h-5 w-5 text-gray-700 dark:text-gray-200" />
              </button>
              <button
                onClick={() => tagsView("group")}
                className="p-2 bg-gray-300 dark:bg-gray-700 rounded-full hover:bg-gray-400 dark:hover:bg-gray-600"
              >
                <GridIcon className="h-5 w-5 text-gray-700 dark:text-gray-200" />
              </button>
            </div>
          </div>
          <div className="flex justify-center dark:bg-gray-900">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-3 w-full  max-h-96 overflow-y-auto">
              {view === "list" ? (
                <ListView
                  availableTags={availableTags}
                  selectedTags={selectedTags}
                  handleCheckboxChange={handleCheckboxChange}
                  handleDeleteSelectedTag={handleDeleteSelectedTag}
                />
              ) : (
                <GroupView
                  availableTags={availableTags}
                  selectedTags={selectedTags}
                  handleCheckboxChange={handleCheckboxChange}
                  handleDeleteSelectedTagBox={handleDeleteSelectedTagBox}
                />
              )}
              {/* Selected Categories Count section */}
              {selectedTags.length > 0 && (
                <div className="sticky bottom-0 mt-4 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-200 text-sm font-semibold text-center p-3 rounded-md shadow-sm">
                  <div className="flex justify-between items-center">
                    <span>Selected Tags: {selectedTags.length}</span>
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
                        onClick={handleClearSelectedTags}
                      >
                        <TrashIcon className="h-5 w-5 mr-2" />
                        Clear Selection
                      </button>
                      <span className="text-gray-500">|</span>

                      <button
                        className="text-red-500 hover:text-red-700 flex items-center"
                        onClick={
                          view == "list"
                            ? handleDeleteSelectedTags
                            : handleAllDeleteSelectedTagBox
                        }
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
        </>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-10 w-full">
          <h3 className="text-lg text-center font-semibold text-gray-700 dark:text-gray-200">
            {availableTags?.length == 0 && !isLoading
              ? "No Tags Available"
              : "Loading..."}
          </h3>
        </div>
      )}
    </>
  );
}
