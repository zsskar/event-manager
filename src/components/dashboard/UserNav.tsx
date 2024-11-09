import { LayoutGrid, LogOut } from "lucide-react";
import { useClerk } from "@clerk/clerk-react";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";
import { useSession } from "@clerk/clerk-react";
import CircularLoader from "../ui/circular-loader";
import { useToast } from "@/hooks/use-toast";

export function UserNav() {
  const { isLoaded, session } = useSession();
  const { toast } = useToast();
  const { signOut } = useClerk();

  return (
    <DropdownMenu>
      <TooltipProvider disableHoverableContent>
        <Tooltip delayDuration={100}>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              {isLoaded ? (
                <Button
                  variant="outline"
                  className="relative h-8 w-8 rounded-full"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={session?.publicUserData.imageUrl}
                      alt="Avatar"
                    />
                    <AvatarFallback className="bg-transparent">
                      <CircularLoader />
                    </AvatarFallback>
                  </Avatar>
                </Button>
              ) : (
                <CircularLoader />
              )}
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent side="bottom">Profile</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {session?.publicUserData.firstName +
                " " +
                session?.publicUserData.lastName}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {session?.publicUserData.identifier}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem className="hover:cursor-pointer" asChild>
            <Link to="/dashboard" className="flex items-center">
              <LayoutGrid className="w-4 h-4 mr-3 text-muted-foreground" />
              Dashboard
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="hover:cursor-pointer"
          onClick={() => {
            toast({
              variant: "destructive",
              title: "Sign Out",
              description: "You have been signed out successfully.",
            });

            signOut({ redirectUrl: "/" });
          }}
        >
          <LogOut className="w-4 h-4 mr-3 text-muted-foreground" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
