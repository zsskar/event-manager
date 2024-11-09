import { Loader2 } from "lucide-react";

export function FullScreenLoader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background z-50">
      <div className="flex items-center space-x-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-lg font-semibold text-muted-foreground">
          Loading, please wait...
        </p>
      </div>
    </div>
  );
}

export default FullScreenLoader;
