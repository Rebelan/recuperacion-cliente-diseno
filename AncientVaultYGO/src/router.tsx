
import { createBrowserRouter } from "react-router-dom"
import { Landing } from "./pages/Landing"
import { Login } from "./pages/auth/Login"


export const router = createBrowserRouter([
  {
    path: "/",
    element: <Landing />,
  },
  {
    path: "/login",
    element: <Login />,
  },
])
