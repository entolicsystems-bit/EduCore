<<<<<<< HEAD
import { useState } from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import './App.css'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import Otp from './pages/Otp'
import ResetPassword from './pages/ResetPassword'
import Leads from './pages/LeadsList'
import CreateLead from './pages/CreateLead'
import LeadDetails from './pages/LeadDetails'
import ImportLeads from './pages/ImportLeads'
import UsersRoles from './pages/UsersRoles'
=======
import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Otp from "./pages/Otp";
import ResetPassword from "./pages/ResetPassword";
import Leads from "./pages/LeadsList";
import CreateLead from "./pages/CreateLead";
import LeadDetails from "./pages/LeadDetails";
import ImportLeads from "./pages/ImportLeads";
import UsersRoles from "./pages/UsersRoles";
>>>>>>> 5aac09e3570f67aa3f52c483ad0569c079da4515

// import VerifyOtp from "./pages/VerifyOtp"

function App() {
<<<<<<< HEAD
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot" element={<ForgotPassword />} />
                <Route path="/otp" element={<Otp />} />
                <Route path="/reset" element={<ResetPassword />} />
                <Route path="/leads" element={<Leads /> }/>
                <Route path='/leads/create' element={<CreateLead/>}/>
                 <Route path='/leads/:id' element={<LeadDetails/>}/>
                 <Route path='/leads/import' element={<ImportLeads/>} />
                 <Route path='/users-roles' element={<UsersRoles/>} />
            </Routes>
        </BrowserRouter>
    )
=======
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot" element={<ForgotPassword />} />
        <Route path="/otp" element={<Otp />} />
        <Route path="/reset" element={<ResetPassword />} />
        <Route path="/leads" element={<Leads />} />
        <Route path="/leads/create" element={<CreateLead />} />
        <Route path="/leads/:id" element={<LeadDetails />} />
        <Route path="/leads/import" element={<ImportLeads />} />
        <Route path="/users-roles" element={<UsersRoles />} />
      </Routes>
    </BrowserRouter>
  );
>>>>>>> 5aac09e3570f67aa3f52c483ad0569c079da4515
}

export default App;
