type messageProps = {
  title: string;
  description: string;
};
export default function NoDataMessage({ title, description }: messageProps) {
  return (
    <div className="border border-gray-500 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-10 w-full">
      <div className="bg-gradient-to-r from-blue-100 to-blue-50 dark:from-gray-800 dark:to-gray-700 p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-blue-900 dark:text-blue-300 text-center mb-4">
          {title}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-center">
          {description}
        </p>
      </div>
    </div>
  );
}
