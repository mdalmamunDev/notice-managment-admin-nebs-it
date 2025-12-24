import { CiUser } from "react-icons/ci";
import { RiListSettingsLine, RiDashboardHorizontalLine } from "react-icons/ri";
import { FaRegUser } from "react-icons/fa6";
import { BsBox } from "react-icons/bs";
import { LuFileText, LuClipboardList, LuAppWindow } from "react-icons/lu";
import { HiOutlineDocumentText } from "react-icons/hi";
import { IoExitOutline } from "react-icons/io5";
import { FiUsers } from "react-icons/fi";
import Notices from "../pages/Main/Notices/Notices";

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
        icon: () => {},
      },
      {
        name: "Add New Employee",
        path: "/employee-add",
        icon: () => {},
      },
      {
        name: "Performance Report",
        path: "/employee-report",
        icon: () => {},
      },
      {
        name: "Performance History",
        path: "/employee-history",
        icon: () => {},
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
        icon: () => {},
      },
      {
        name: "Applications",
        path: "/career-database/applications",
        icon: () => {},
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
    element: <Notices />,
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