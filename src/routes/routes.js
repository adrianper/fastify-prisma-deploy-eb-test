import { authRoutes } from "./auth/auth.routes.js";
import { userRoutes } from "./users/users.routes.js";

export const routes = Array.prototype.concat(authRoutes, userRoutes)