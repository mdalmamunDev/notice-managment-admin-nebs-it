import { CiUser } from "react-icons/ci";
import { RiUser2Fill, RiListSettingsLine, RiSettings5Fill, RiDashboardHorizontalLine } from "react-icons/ri";
import MyProfile from "../pages/Profile/MyProfile";
import EditMyProfile from "../pages/Profile/EditMyProfile";
import TermsConditions from "../pages/Settings/TermsConditions";
import EditTermsConditions from "../pages/Settings/EditTermsConditions";
import PrivacyPolicy from "../pages/Settings/PrivacyPolicy";
import EditPrivacyPolicy from "../pages/Settings/EditPrivacyPolicy";
import EditAboutUs from "../pages/Settings/EditAboutUs";
import AboutUs from "../pages/Settings/AboutUs";
import Notifications from "../pages/Main/Notifications/Notifications";
import { FaUserTie } from "react-icons/fa";
import {
  MdOutlineSecurityUpdateWarning,
  MdOutlineSubscriptions,
} from "react-icons/md";
import { FaDollarSign, FaRegUser, FaServicestack } from "react-icons/fa6";
import { BiMessageSquareDetail } from "react-icons/bi";
import Earnings from "../pages/Main/Earnings/Earnings";
import GeneralSettings from "../pages/Settings/GeneralSettings";
import Admins from "../pages/Main/Users/Admins";
import ProviderDetails from "../pages/Main/Users/ProviderDetails";
import Agents from "../pages/Main/Users/Agents";
import Business from "../pages/Main/Users/Business";
import Subscriptions from "../pages/Main/Subscriptions/Subscriptions";
import { BsBox } from "react-icons/bs";
import { LuFileText, LuClipboardList, LuAppWindow } from "react-icons/lu";
import { HiOutlineDocumentText } from "react-icons/hi";
import { IoExitOutline } from "react-icons/io5";
import { FiUsers } from "react-icons/fi";

export const dashboardItems = [
  {
    name: "Dashboard",
    path: "/",
    icon: RiDashboardHorizontalLine,
    element: <></>,
  },
    {
    name: "Employee",
    rootPath: "employee",
    icon: FaRegUser,
    children: [
      {
        name: "Employee Database",
        path: "/employee-database",
        icon: "aaaa",
      },
      {
        name: "Add New Employee",
        path: "/employee-add",
        icon: "aaaa",
      },
      {
        name: "Performance Report",
        path: "/employee-report",
        icon: "aaaa",
      },
      {
        name: "Performance History",
        path: "/employee-history",
        icon: "aaaa",
      },
    ],
  },
  {
    name: "Payroll",
    path: "/payroll",
    icon: BsBox,
    element: <></>,
  },
  {
    name: "Pay Slip",
    path: "/pay-slip",
    icon: LuFileText,
    element: <></>,
  },
  {
    name: "Attendance",
    path: "/attendance",
    icon: FiUsers,
    element: <></>,
  },
  {
    name: "Request Center",
    path: "/request-center",
    icon: LuAppWindow,
    element: <></>,
  },
  {
    name: "Career Database",
    rootPath: "career-database",
    icon: FiUsers,
    children: [
      {
        name: "Job Postings",
        path: "/career-database/job-postings",
        icon: "aaaa",
      },
      {
        name: "Applications",
        path: "/career-database/applications",
        icon: "aaaa",
      },
    ],
  },
  {
    name: "Document Manager",
    path: "/document-manager",
    icon: HiOutlineDocumentText,
    element: <></>,
  },
  {
    name: "Notice Board",
    path: "/notice-board",
    icon: LuClipboardList,
    element: <></>,
  },
  {
    name: "Activity Log",
    path: "/activity-log",
    icon: RiListSettingsLine,
    element: <></>,
  },
  {
    name: "Exit Interview",
    path: "/exit-interview",
    icon: IoExitOutline,
    element: <></>,
  },
  {
    name: "Profile",
    path: "/profile",
    icon: CiUser,
    element: <></>,
  },
];