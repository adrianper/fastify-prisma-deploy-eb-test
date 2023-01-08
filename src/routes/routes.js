import { testRoutes } from "./test_routes.routes.js"
import { authRoutes } from "./auth/auth.routes.js"
import { userRoutes } from "./users/users.routes.js"

export const routes = Array.prototype.concat(testRoutes, authRoutes, userRoutes)