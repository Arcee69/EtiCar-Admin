import { Route, Routes } from "react-router-dom";

import { ProtectRoutes, AuthProtectRoutes } from "./ProtectedRoute";

import Login from "../pages/Auth/Login";
import ForgotPassword from "../pages/Auth/ForgotPassword";
import DashboardLayout from "../layouts/DashboardLayout/Index";
import Analytics from "../pages/Analytics";
import Inventory from "../pages/Inventory";
import Notifications from "../pages/Notifications";
import Orders from "../pages/Orders";
import Overview from "../pages/Overview";
import Providers from "../pages/Providers";
import Roles from "../pages/Roles";
import ServiceRequests from "../pages/ServiceRequests";
import Users from "../pages/Users";
import Vehicles from "../pages/Vehicles";
import Vendors from "../pages/Vendors";
import Wallet from "../pages/Wallet";
import Transactions from "../pages/Transactions";
import AuthLayout from "../layouts/AuthLayout";
import ChangePassword from "../pages/Auth/ChangePassword";

const Routers = () => {
  return (
    <div>
      <Routes>

        {/* Protected dashboard routes — require authentication */}
        <Route element={<ProtectRoutes />}>
          <Route element={<DashboardLayout />}>
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/dashboard" element={<Overview />} />
            <Route path="/providers" element={<Providers />} />
            <Route path="/roles" element={<Roles />} />
            <Route path="/service-requests" element={<ServiceRequests />} />
            <Route path="/users" element={<Users />} />
            <Route path="/vehicles" element={<Vehicles />} />
            <Route path="/vendors" element={<Vendors />} />
            <Route path="/wallet" element={<Wallet />} />
            <Route path="/transactions" element={<Transactions />} />
          </Route>
        </Route>

        {/* Public auth routes — redirect to dashboard if already authenticated */}
        <Route element={<AuthProtectRoutes />}>
          <Route element={<AuthLayout />}>
            <Route path="/" element={<Login />} />
            <Route path="/change-password" element={<ChangePassword />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
          </Route>
        </Route>

      </Routes>
    </div>
  );
};

export default Routers;
