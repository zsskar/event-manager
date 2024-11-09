import { UserProfile } from "@clerk/clerk-react";
import { ContentLayout } from "../layout/ContentLayout";
import { useTheme } from "next-themes";

export default function Profile() {
  const { theme } = useTheme();

  const appearance = {
    variables: {
      colorPrimary: theme === "dark" ? "#0d1117" : "#f0f0f5",
      colorBackground: theme === "dark" ? "#161b22" : "#ffffff",
      colorText: theme === "dark" ? "#c9d1d9" : "#24292f",
      colorTextSecondary: theme === "dark" ? "#8b949e" : "#6a737d",
      colorDanger: "#da3633",
    },
    elements: {
      rootBox: {
        backgroundColor: theme === "dark" ? "#0d1117" : "#ffffff",
        color: theme === "dark" ? "#c9d1d9" : "#24292f",
      },
      buttonPrimary: {
        backgroundColor: theme === "dark" ? "#238636" : "#28a745",
        color: "#ffffff",
        "&:hover": {
          backgroundColor: theme === "dark" ? "#2ea043" : "#218838",
        },
      },
      buttonSecondary: {
        backgroundColor: theme === "dark" ? "#30363d" : "#e1e4e8",
        color: theme === "dark" ? "#c9d1d9" : "#24292f",
        "&:hover": {
          backgroundColor: theme === "dark" ? "#484f58" : "#d0d7de",
        },
      },
      // Specific customizations for "Profile" and "Security" buttons
      profileButton: {
        backgroundColor: theme === "dark" ? "#238636" : "#28a745",
        color: "#ffffff",
        "&:hover": {
          backgroundColor: theme === "dark" ? "#2ea043" : "#218838",
        },
      },
      securityButton: {
        backgroundColor: theme === "dark" ? "#da3633" : "#e74c3c",
        color: "#ffffff",
        "&:hover": {
          backgroundColor: theme === "dark" ? "#c0392b" : "#e63946",
        },
      },
      formFieldInput: {
        backgroundColor: theme === "dark" ? "#0d1117" : "#ffffff",
        border: theme === "dark" ? "1px solid #30363d" : "1px solid #d0d7de",
        color: theme === "dark" ? "#c9d1d9" : "#24292f",
      },
      formFieldLabel: {
        color: theme === "dark" ? "#8b949e" : "#6a737d",
      },
      footer: {
        color: theme === "dark" ? "#8b949e" : "#6a737d",
        borderTop: theme === "dark" ? "1px solid #30363d" : "1px solid #d0d7de",
      },
    },
  };

  return (
    <ContentLayout title="Profile">
      <div className="min-h-screen flex items-center justify-center">
        <UserProfile appearance={appearance} />
      </div>
    </ContentLayout>
  );
}
