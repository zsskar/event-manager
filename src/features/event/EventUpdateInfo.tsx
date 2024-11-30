export default function EventUpdateInfo() {
  return (
    <div className="flex items-start gap-3 p-4 border border-gray-300 rounded-md bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
      <div>
        <h2 className="text-sm font-medium text-gray-700 dark:text-gray-200">
          Once an event is created, it cannot be updated. If you want to change
          any event, delete the existing one and create a new one.
        </h2>
      </div>
    </div>
  );
}
