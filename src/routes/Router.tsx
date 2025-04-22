import { useRoutes } from "react-router-dom";
import clientRoutes from "./client/index";
import adminRoutes from "./admin/index";
import authRoutes from "./authRoutes/authRoutes";
import notFoundRoute from "./notFoundRoute/notFoundRoute";

export default function Router() {
  const routes = useRoutes([
    clientRoutes,
    adminRoutes,
    ...authRoutes,
    notFoundRoute,
  ]);
  return routes;
}
