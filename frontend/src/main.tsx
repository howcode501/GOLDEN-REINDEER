import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import LandingPage from "./landing/LandingPage";
import FreeReportPage from "./app/FreeReportPage";
import LoginPage from "./app/LoginPage";
import AppLayout from "./app/AppLayout";
import Dashboard from "./app/Dashboard";
import AutomationStorePage from "./app/AutomationStorePage";
import LeadsPage from "./app/LeadsPage";
import InboxPage from "./app/InboxPage";
import ReviewsPage from "./app/ReviewsPage";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/report" element={<FreeReportPage />} />
          <Route path="/login" element={<LoginPage />} />
          
          <Route path="/app" element={<AppLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="leads" element={<LeadsPage />} />
            <Route path="inbox" element={<InboxPage />} />
            <Route path="campaigns" element={<Dashboard />} />
            <Route path="google" element={<ReviewsPage />} />
            <Route path="reviews" element={<ReviewsPage />} />
            <Route path="automations" element={<AutomationStorePage />} />
            <Route path="website" element={<FreeReportPage />} />
            <Route path="settings" element={<AutomationStorePage />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);
