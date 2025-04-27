import LoginPage from "~/pages/client/login";
import RegisterPage from "~/pages/client/register";

const authRoutes = [
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },
];

export default authRoutes;
