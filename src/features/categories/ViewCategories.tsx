import { categories } from "@/App";

export default function ViewCategories() {
  return (
    <div className="flex justify-center bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-5 w-full">
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
                checked={false}
                onChange={() => {}}
              />
              <span className="text-sm font-semibold">{category.category}</span>
              <button
                className="hover:text-red-400 focus:outline-none text-current"
                onClick={() => {}}
              >
                <span className="inline-block w-4 h-4 text-lg font-bold leading-none">
                  &times;
                </span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
