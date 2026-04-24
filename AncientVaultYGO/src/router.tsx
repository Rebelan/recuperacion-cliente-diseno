
import { createBrowserRouter } from "react-router-dom"
import { Landing } from "./pages/Landing"
import { Login } from "./pages/auth/Login"
import { Register } from "./pages/auth/Register"


export const router = createBrowserRouter([
  {
    path: "/",
    element: <Landing />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />
  },
])
