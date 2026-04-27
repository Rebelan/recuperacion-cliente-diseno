
import { Outlet } from "react-router-dom"
import { Navbar } from "../components/layout/Navbar"

export const AppLayout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  )
}
