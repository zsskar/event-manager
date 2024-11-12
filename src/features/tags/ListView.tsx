import { TagGroup } from "@/App";
import { Cross2Icon } from "@radix-ui/react-icons";

type ListProps = {
  availableTags: TagGroup[];
  selectedTags: string[];
  handleCheckboxChange: (tagName: string) => void;
  handleDeleteSelectedTag: (tagName: string) => void;
};
export default function ListView({
  availableTags,
  selectedTags,
  handleCheckboxChange,
  handleDeleteSelectedTag,
}: ListProps) {
  return (
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
  );
}
