import Sidebar from "./Sidebar";
import { cn } from "@/lib/utils";
import { useStore } from "@/hooks/use-store";
import { useSidebar } from "@/hooks/use-sidebar";
import { Outlet, useNavigate } from "react-router-dom";
import { useSession } from "@clerk/clerk-react";
import { useEffect } from "react";
import FullScreenLoader from "../FullScreenLoader";

const DashboardLayout: React.FC = () => {
  const navigate = useNavigate();
  const { isLoaded, session } = useSession();

  useEffect(() => {
    if (isLoaded && !session) {
      navigate("/");
    }
  }, [isLoaded, session, navigate]);

  const sidebar = useStore(useSidebar, (x) => x);
  if (!sidebar) return null;
  const { getOpenState, settings } = sidebar;

  return (
    <>
      {isLoaded && session ? (
        <>
          <Sidebar />
          <main
            className={cn(
              "min-h-[calc(100vh_-_56px)] bg-zinc-50 dark:bg-zinc-900 transition-[margin-left] ease-in-out duration-300",
              !settings.disabled &&
                (!getOpenState() ? "lg:ml-[90px]" : "lg:ml-72")
            )}
          >
            <Outlet />
          </main>
        </>
      ) : (
        <FullScreenLoader />
      )}
    </>
  );
};

export default DashboardLayout;
