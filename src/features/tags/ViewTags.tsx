import { Cross1Icon, Cross2Icon } from "@radix-ui/react-icons";
import { SelectIcon } from "@radix-ui/react-select";
import {
  Cross,
  GridIcon,
  Info,
  ListIcon,
  TextSelectIcon,
  Trash2Icon,
  TrashIcon,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type TagGroup = {
  color: string;
  tags: string[];
};

export default function ViewTags() {
  const tags: TagGroup[] = [
    {
      color: "#000000",
      tags: ["TAG1", "TAG2", "TAG3"],
    },
    {
      color: "#262",
      tags: ["TAG4", "TAG5"],
    },
    {
      color: "#0724",
      tags: ["TAG6"],
    },
    {
      color: "#984",
      tags: ["TAG7"],
    },
  ];
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<TagGroup[]>(tags);
  const [view, setView] = useState<string>("list");

  const handleDeleteSelectedTags = () => {
    // Filter out selected tags from all available tags
    const updatedTags = availableTags.map((group) => ({
      ...group,
      tags: group.tags.filter((tag) => !selectedTags.includes(tag)),
    }));
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
    const updatedTags = availableTags.map((group) => ({
      ...group,
      tags: group.tags.filter((tag) => tag !== tagName),
    }));
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
          <div className="flex justify-between items-center mb-4 sticky top-0 bg-white dark:bg-gray-800 z-10 p-4 rounded-t-lg">
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
          <div className="flex justify-center dark:bg-gray-900 pt-5">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-10 w-full  max-h-96 overflow-y-auto">
              {view === "list" ? (
                <div className="flex flex-wrap gap-3">
                  {availableTags.map((group, groupIndex) =>
                    group.tags.map((tagName, tagIndex) => (
                      <div
                        key={`${groupIndex}-${tagIndex}`}
                        className="flex items-center space-x-2 px-3 py-1 rounded-full shadow-sm"
                        style={{
                          backgroundColor: group.color,
                          color: "#fff",
                          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.7)",
                        }}
                      >
                        <input
                          type="checkbox"
                          className="h-3 w-3 text-blue-600 rounded focus:ring-1 focus:ring-offset-1 focus:ring-blue-300"
                          checked={selectedTags.includes(tagName)}
                          onChange={() => handleCheckboxChange(tagName)}
                        />
                        <span className="text-sm font-semibold">{tagName}</span>
                        <button
                          className="text-white hover:text-red-400 focus:outline-none"
                          onClick={() => handleDeleteSelectedTag(tagName)}
                        >
                          <span className="inline-block w-4 h-4 text-lg font-bold leading-none">
                            <Cross2Icon />
                          </span>
                        </button>
                      </div>
                    ))
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {availableTags.map((group, groupIndex) => (
                    <div
                      key={groupIndex}
                      className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg"
                    >
                      {/* Color box */}
                      <div
                        className="flex items-center space-x-3 mb-4"
                        style={{
                          backgroundColor: group.color,
                          padding: "6px 12px",
                          borderRadius: "8px",
                          boxShadow: `0px 2px 8px rgba(0, 0, 0, 0.2)`,
                        }}
                      >
                        <div
                          className="w-6 h-6 rounded-full"
                          style={{ backgroundColor: group.color }}
                        ></div>
                        <span className="text-white font-semibold">
                          {group.color}
                        </span>
                      </div>

                      {/* Tags as badges */}
                      <div className="flex flex-wrap gap-2">
                        {group.tags.map((tagName, tagIndex) => (
                          <div
                            key={`${groupIndex}-${tagIndex}`}
                            className="flex items-center space-x-2 px-4 py-2 rounded-full shadow-sm bg-gray-200 dark:bg-gray-700"
                          >
                            <input
                              type="checkbox"
                              className="h-4 w-4 text-blue-600 rounded focus:ring-1 focus:ring-offset-1 focus:ring-blue-300"
                              checked={selectedTags.includes(tagName)}
                              onChange={() => handleCheckboxChange(tagName)}
                            />
                            <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                              {tagName}
                            </span>
                            <button
                              className="text-gray-600 hover:text-red-400 focus:outline-none"
                              onClick={() =>
                                handleDeleteSelectedTagBox(group.color, tagName)
                              }
                            >
                              <Cross2Icon className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
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
            No Tags Available
          </h3>
        </div>
      )}
    </>
  );
}
