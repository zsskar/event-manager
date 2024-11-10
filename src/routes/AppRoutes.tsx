import Dashboard from "@/components/dashboard/Dashboard";
import DashboardLayout from "@/components/layout/DashboardLayout";
import LandingPage from "@/components/LandingPage";
import MyCalendar from "@/features/MyCalender";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Profile from "@/components/dashboard/Profile";
import Categories from "../features/categories";
import Tags from "@/features/tags";

const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Root route for landing page */}
        <Route path="/" element={<LandingPage />} />

        {/* Nested routes for the dashboard */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          {/* Dashboard home page */}
          <Route index element={<Dashboard />} />

          {/* Nested route for "/dashboard/mycalendar" */}
          <Route path="mycalender" element={<MyCalendar />} />
          <Route path="profile" element={<Profile />} />
          <Route path="categories" element={<Categories />} />
          <Route path="tags" element={<Tags />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRoutes;
