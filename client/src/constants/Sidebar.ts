import { IoHomeOutline } from "react-icons/io5";
import { MdAdminPanelSettings, MdOutlineCampaign } from "react-icons/md";
import { MdOutlineAccountTree } from "react-icons/md";
import { CiLogout } from "react-icons/ci";
import Dashboard from "../pages/Dashboard";
import Logout from "../pages/Logout";
import Results from "../pages/Results";
import UsersPage from "../pages/Users";
import RolesEnum from "./Roles";
import Searches from "../pages/Searches";
import UserDetails from "../pages/UserDetails";
import Admin from "../pages/Admin";

export const SidebarData = [
  {
    title: "Dashboard",
    path: "/dashboard",
    shortPath: "/dashboard",
    Icon: IoHomeOutline,
    Element: Dashboard,
    role: [RolesEnum.ADMIN, RolesEnum.USER]
  },
  {
    title: "Search",
    path: "/dashboard/searches",
    shortPath: "/searches",
    Icon: MdOutlineCampaign,
    Element: Searches,
    role: [RolesEnum.ADMIN, RolesEnum.USER]
  },
  {
    title: "All Results",
    path: "/dashboard/results",
    shortPath: "/results",
    Icon: MdOutlineAccountTree,
    Element: Results,
    role: [RolesEnum.ADMIN, RolesEnum.USER]
  },
  {
    title: "Users",
    path: "/dashboard/users",
    shortPath: "/users",
    Icon: MdOutlineCampaign,
    Element: UsersPage,
    role: [RolesEnum.ADMIN]
  },
  {
    title: "Admin Settings",
    path: "/dashboard/admin",
    shortPath: "/admin",
    Icon: MdAdminPanelSettings,
    Element: Admin,
    role: [RolesEnum.ADMIN]
  },
  {
    title: "Logout",
    path: "/logout",
    shortPath: "/logout",
    Icon: CiLogout,
    Element: Logout,
    role: [RolesEnum.ADMIN, RolesEnum.USER]
  }
];


export const FormWithDataRoutes = [
  {
    title: "Dashboard",
    path: "/dashboard/:Id",
    shortPath: "/dashboard",
    Icon: IoHomeOutline,
    Element: Searches,
    role: [RolesEnum.ADMIN, RolesEnum.USER]
  },
  {
    title: "Users",
    path: "/dashboard/users/:id/details/",
    Element: UserDetails
  }
]