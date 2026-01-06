import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Otp from "./pages/Otp";
import ResetPassword from "./pages/ResetPassword";

import Leads from "./pages/LeadsList";
import Admissions from "./pages/Admission";
import CreateLead from "./pages/CreateLead";
import LeadDetails from "./pages/LeadDetails";
import ImportLeads from "./pages/ImportLeads";
import UsersRoles from "./pages/UsersRoles";
import DocumentPage from "./pages/DocumentPage";
import StudentPage from "./pages/StudentPage";

// import ProtectedRoute from "../routes/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot" element={<ForgotPassword />} />
        <Route path="/otp" element={<Otp />} />
        <Route path="/reset" element={<ResetPassword />} />

        {/* PROTECTED ROUTES */}
        <Route
          path="/leads"
          element={
            // <ProtectedRoute>
            <Leads />
            // </ProtectedRoute>
          }
        />
        <Route
          path="/admissions"
          element={
            // <ProtectedRoute>
            <Admissions />
            // </ProtectedRoute>
          }
        />
        <Route
          path="/document-page"
          element={
            // <ProtectedRoute>
            <DocumentPage />
            // </ProtectedRoute>
          }
        />
        <Route
          path="/student-page"
          element={
            // <ProtectedRoute>
            <StudentPage />
            // </ProtectedRoute>
          }
        />

        <Route
          path="/leads/create"
          element={
            // <ProtectedRoute>
            <CreateLead />
            // </ProtectedRoute>
          }
        />

        <Route
          path="/leads/:id"
          element={
            // <ProtectedRoute>
            <LeadDetails />
            // </ProtectedRoute>
          }
        />

        <Route
          path="/leads/import"
          element={
            // <ProtectedRoute>
            <ImportLeads />
            // </ProtectedRoute>
          }
        />

        <Route
          path="/users-roles"
          element={
            // <ProtectedRoute>
            <UsersRoles />
            // </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
