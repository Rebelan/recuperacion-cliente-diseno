
import { createBrowserRouter } from "react-router-dom"
import { Landing } from "./pages/Landing"
import Login from "./pages/auth/Login"
import Register from "./pages/auth/Register"
import Profile from "./pages/Profile"
import { AuthLayout } from "./layouts/AuthLayout"
import { AppLayout } from "./layouts/AppLayout"
import Collection from "./pages/Collection"
import { AdminRoute } from "./pages/auth/AdminRoute"
import AdminDashboard from "./pages/admin/AdminDashboard"
import AdminUsers from "./pages/admin/AdminUsers"



export const router = createBrowserRouter([
  {
    path: "/",
    element: <Landing />,
  },
{
  element: <AuthLayout />,
  children: [
    {path: "/login", element: <Login />},
    {path: "/register", element: <Register />},
  ],
},
{
  element: <AppLayout />,
  children: [
    {path: "/profile", element: <Profile />},
    {path: "/collection", element: <Collection />},
    {
      path: "/admin",
      element: (
        <AdminRoute>
          <AdminDashboard/>
        </AdminRoute>
      ),
    },
    {
      path: "/admin/users",
      element: (
        <AdminRoute>
          <AdminUsers/>
        </AdminRoute>
      ),
    },
  ],
},
])
