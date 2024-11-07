import React from "react";
import { ContentLayout } from "../layout/ContentLayout";

const Dashboard: React.FC = () => {
  return (
    <ContentLayout title="Dashboard">
      <h2 className="text-2xl font-bold">Welcome to the Dashboard</h2>
      <p>This is your dashboard content area.</p>
    </ContentLayout>
  );
};

export default Dashboard;
