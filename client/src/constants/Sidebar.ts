import { IoHomeOutline } from "react-icons/io5";
import { MdOutlineCampaign } from "react-icons/md";
import { MdOutlineAccountTree } from "react-icons/md";
import { CiLogout } from "react-icons/ci";
import Dashboard from "../pages/Dashboard";
import Logout from "../pages/Logout";
import Results from "../pages/Results";
import Users from "../pages/Users";

export const SidebarData = [
  {
    title: "Dashboard",
    path: "/dashboard",
    shortPath: "/dashboard",
    Icon: IoHomeOutline,
    Element: Dashboard,
  },
  {
    title: "Search History",
    path: "/dashboard/searches",
    shortPath: "/searches",
    Icon: MdOutlineCampaign,
    Element: Users,
  },
  {
    title: "All Results",
    path: "/dashboard/results",
    shortPath: "/results",
    Icon: MdOutlineAccountTree,
    Element: Results,
  },
  // {
  //   title: "Sessions",
  //   path: "/dashboard/sessions",
  //   shortPath: "/sessions",
  //   Icon: GoProjectTemplate,
  //   Element: Sessions,
  // },
  // {
  //   title: "MyAccount",
  //   path: "/dashboard/myaccount",
  //   shortPath: "/myaccount",
  //   Icon: IoIosNotifications,
  //   Element: MyAccount,
  // },
  {
    title: "Logout",
    path: "/logout",
    shortPath: "/logout",
    Icon: CiLogout,
    Element: Logout,
  }
];


export const FormWithDataRoutes = [
  {
    title: "Dashboard",
    path: "/dashboard/:Id",
    shortPath: "/dashboard",
    Icon: IoHomeOutline,
    Element: Dashboard,
  },
]