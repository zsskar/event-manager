import { TagGroup } from "@/App";
import { Cross2Icon } from "@radix-ui/react-icons";

type GroupProps = {
  availableTags: TagGroup[];
  selectedTags: string[];
  handleCheckboxChange: (tagName: string) => void;
  handleDeleteSelectedTagBox: (color: string, tagName: string) => void;
};

export default function GroupView({
  availableTags,
  selectedTags,
  handleCheckboxChange,
  handleDeleteSelectedTagBox,
}: GroupProps) {
  return (
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
            <span className="text-white font-semibold">{group.color}</span>
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
  );
}
