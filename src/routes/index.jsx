import { createBrowserRouter, Navigate } from "react-router-dom";
import Main from "../layouts/Main/Main";
import Auth from "../layouts/Auth/Auth";
import SignIn from "../pages/Auth/SignIn";
import { routesGenerators } from "../utils/routesGenerators";
import { dashboardItems } from "../constants/router.constants";
import ForgotPassword from "../pages/Auth/ForgotPassword";
import VerifyEmail from "../pages/Auth/VerifyEmail";
import ResetPassword from "../pages/Auth/ResetPassword";
import AdminRoutes from "./AdminRoutes";
import DeleteInstructions from "../pages/DeleteInstructions";
import AboutUsGlobal from "../pages/AboutUsGlobal";
import PrivacyGlobal from "../pages/PrivacyGlobal";
import TermsConditionGlobal from "../pages/TermsConditionGlobal";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <AdminRoutes>
        <Main />
      </AdminRoutes>
    ),
    children: routesGenerators(dashboardItems),
  },
  {
    path: "/auth",
    element: <Auth />,
    children: [
      {
        path: "/auth",
        element: <Navigate to={"/auth/sign-in"} />,
      },
      {
        path: "/auth/sign-in",
        element: <SignIn />,
      },
      {
        path: "/auth/forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "/auth/verify-email/:id",
        element: <VerifyEmail />,
      },
      {
        path: "/auth/reset-password",
        element: <ResetPassword />,
      },
    ],
  },
  {
    path: "/privacy-policy",
    element: <PrivacyGlobal />,
  },
  {
    path: "/terms-condition",
    element: <TermsConditionGlobal />,
  },
  {
    path: "/delete-instruction",
    element: <DeleteInstructions />,
  },
  {
    path: "/about-us",
    element: <AboutUsGlobal />,
  },
  {
    path: "*",
    //   element: <NotFound />,
  },
]);

export default router;
