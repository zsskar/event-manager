import Header from "./Header";

interface ContentLayoutProps {
  title: string;
  children: React.ReactNode;
}

export function ContentLayout({ title, children }: ContentLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header Section */}
      <Header title={title} />

      {/* Main Content Section */}
      <div className="container mx-auto pt-8 pb-8 px-4 sm:px-8">
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
