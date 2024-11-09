import React from "react";
import { Link } from "react-router-dom";
import { SignUpButton, useSession } from "@clerk/clerk-react";
import { UserNav } from "./dashboard/UserNav";
import { Button } from "./ui/button";
import AuthButton from "./AuthButtons";
import {
  Bell,
  Calendar,
  ChartLine,
  EllipsisIcon,
  FolderSync,
  Pen,
  Search,
} from "lucide-react";

const LandingPage: React.FC = () => {
  const { isLoaded, session } = useSession();

  return (
    <div className="flex flex-col min-h-[100dvh]">
      <header className="px-6 lg:px-8 h-16 bg-gray-900 text-white flex items-center shadow-md">
        <Link
          to="/"
          className="flex items-center text-2xl font-bold tracking-wide hover:text-blue-400 transition-colors"
          aria-label="Event Management"
        >
          <div className="flex items-center space-x-2">
            <Calendar className="text-xl" />
            <span className="text-2xl font-extrabold">Event Manager</span>
          </div>
        </Link>

        <nav className="ml-auto flex items-center gap-6 sm:gap-8">
          {isLoaded && !session ? (
            <div className="flex items-center space-x-4">
              <AuthButton
                type="signUp"
                mode="modal"
                redirectUrl="/dashboard"
                className="bg-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-600 transition-all"
              />
              <AuthButton
                type="signIn"
                mode="modal"
                redirectUrl="/dashboard"
                className="bg-green-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-600 transition-all"
              />
            </div>
          ) : (
            <UserNav />
          )}
        </nav>
      </header>

      {/* Main */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Effortless Event Management
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Streamline your event planning and ticketing with our
                  all-in-one platform. Elevate your events and delight your
                  attendees.
                </p>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  {isLoaded && !session ? (
                    <SignUpButton mode="modal">
                      <Button className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90">
                        Get Started
                      </Button>
                    </SignUpButton>
                  ) : (
                    <Link
                      to="/dashboard"
                      className="inline-flex h-10 items-center justify-center rounded-md bg-green-500 px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
                    >
                      Go to Dashboard
                    </Link>
                  )}
                </div>
              </div>
              <img
                src="eventManger"
                alt="Event Management Hero"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last lg:aspect-square"
                width="550"
                height="550"
              />
            </div>
          </div>
        </section>
        {/* Features Section */}

        <section className="w-full py-16 md:py-28 lg:py-36 bg-muted">
          <div className="container px-6 md:px-8 text-center space-y-8">
            <h2 className="text-4xl font-extrabold tracking-tight text-primary sm:text-5xl lg:text-6xl">
              Streamline Your Event Management
            </h2>
            <p className="max-w-3xl mx-auto text-muted-foreground md:text-lg lg:text-xl xl:text-lg">
              Our event management system provides a comprehensive suite of
              tools to simplify your event planning and execution.
            </p>
            <div className="grid gap-8 pt-10 lg:grid-cols-3 lg:gap-10">
              {[
                {
                  title: "Event Creation",
                  description:
                    "Easily create and manage events with our intuitive interface.",
                  icon: <Calendar className="text-4xl text-primary mb-4" />,
                },
                {
                  title: "Search and Filter Options",
                  description:
                    "Easily find and organize events with advanced search and filter options.",
                  icon: <Search className="text-4xl text-primary mb-4" />,
                },
                {
                  title: "Analytics",
                  description:
                    "Gain valuable insights into your event performance with our comprehensive analytics.",
                  icon: <ChartLine className="text-4xl text-primary mb-4" />,
                },
                {
                  title: "Customizable Invitations",
                  description:
                    "Design and send customized invitations to your attendees.",
                  icon: <Pen className="text-4xl text-primary mb-4" />,
                },
                {
                  title: "Calendar Sync",
                  description:
                    "Sync events with Google Calendar, Outlook, and more.",
                  icon: <FolderSync className="text-4xl text-primary mb-4" />,
                },
                {
                  title: "Automated Reminders",
                  description:
                    "Send automated reminders to ensure attendees never miss an update.",
                  icon: <Bell className="text-4xl text-primary mb-4" />,
                },
              ].map((feature) => (
                <div
                  key={feature.title}
                  className="p-8 bg-white border border-gray-200 rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300 transform hover:scale-105"
                >
                  <div className="flex justify-center mb-4">{feature.icon}</div>
                  <h3 className="text-2xl font-semibold text-primary mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
            <p className="text-primary text-lg mt-8 font-semibold italic flex items-center justify-center gap-2">
              <EllipsisIcon className="text-xl" />
              and many more
            </p>
          </div>
        </section>
      </main>
      <footer className="w-full py-6 bg-primary text-white">
        <div className="container px-6 text-center">
          <p className="text-sm">
            &copy; {new Date().getFullYear()}{" "}
            <span className="font-semibold">Event Manager</span>. All rights
            reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
