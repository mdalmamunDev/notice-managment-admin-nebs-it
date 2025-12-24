import { CiUser } from "react-icons/ci";
import { RiDashboardHorizontalFill, RiUser2Fill, RiListSettingsLine, RiSettings5Fill } from "react-icons/ri";
import DashboardHome from "../pages/Main/DashboardHome/DashboardHome";
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
import { FaDollarSign, FaMessage, FaServicestack, FaTags, FaUserShield } from "react-icons/fa6";
import { BiMessageSquareDetail } from "react-icons/bi";
import Earnings from "../pages/Main/Earnings/Earnings";
import GeneralSettings from "../pages/Settings/GeneralSettings";
import Admins from "../pages/Main/Users/Admins";
import ProviderDetails from "../pages/Main/Users/ProviderDetails";
import Reports from "../pages/Main/Reports/Reports";
import Contacts from "../pages/Main/Contacts/Contacts";
import Agents from "../pages/Main/Users/Agents";
import Business from "../pages/Main/Users/Business";
import Subscriptions from "../pages/Main/Subscriptions/Subscriptions";

export const dashboardItems = [
  {
    name: "Dashboard",
    path: "/",
    icon: RiDashboardHorizontalFill,
    element: <DashboardHome />,
  },
  {
    path: "notifications",
    element: <Notifications />,
  },
  {
    name: "Users",
    rootPath: "users",
    icon: RiUser2Fill,
    children: [
      {
        name: "Agents",
        path: "/agents",
        icon: CiUser,
        element: <Agents />,
      },
      {
        name: "Business",
        path: "/business",
        icon: CiUser,
        element: <Business />,
      },
      {
        path: "/provider-details",
        element: <ProviderDetails />,
      },
      {
        name: "Admins",
        path: "/admin",
        icon: FaUserTie,
        element: <Admins />,
        role: ['admin'],
      },
    ],
  },
  {
    name: "Payments",
    path: "earnings",
    icon: FaDollarSign,
    element: <Earnings />,
    role: ['admin'],
  },
  {
    name: "Subscriptions",
    path: "subscriptions",
    icon: MdOutlineSubscriptions,
    element: <Subscriptions />,
  },
  // {
  //   name: "Contacts",
  //   path: "contact",
  //   icon: FaMessage,
  //   element: <Contacts />,
  // },

  {
    name: "Settings",
    rootPath: "settings",
    icon: RiSettings5Fill,
    children: [
      {
        name: "Profile",
        path: "settings/profile",
        icon: CiUser,
        element: <MyProfile />,
      },
      {
        path: "settings/profile/edit",
        element: <EditMyProfile />,
      },
      {
        name: "General Settings",
        icon: RiListSettingsLine,
        path: "settings/generals",
        element: <GeneralSettings />,
      },
      {
        name: "Terms & Conditions",
        icon: FaServicestack,
        path: "settings/terms-conditions",
        element: <TermsConditions />,
      },
      {
        path: "settings/terms-conditions/edit",
        element: <EditTermsConditions />,
      },
      {
        name: "Privacy Policy",
        icon: MdOutlineSecurityUpdateWarning,
        path: "settings/privacy-policy",
        element: <PrivacyPolicy />,
      },
      {
        path: "settings/privacy-policy/edit",
        element: <EditPrivacyPolicy />,
      },
      {
        name: "About Us",
        icon: BiMessageSquareDetail,
        path: "settings/about-us",
        element: <AboutUs />,
      },
      {
        path: "settings/about-us/edit",
        element: <EditAboutUs />,
      },
    ],
  },
];
