import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateRequest";
import { UserControllers } from "./user.controller";
import { Role } from "./user.interface";
import { createUserZodSchema } from "./user.validation";


const router = Router();

router.post(
     "/register",
     validateRequest(createUserZodSchema),
     UserControllers.createUser
);

router.get(
     "/all-users", 
     checkAuth(Role.ADMIN), 
     UserControllers.getAllUsers
);

router.get(
     "/all-agents", 
     checkAuth(Role.ADMIN), 
     UserControllers.getAllAgents
);

router.get(
     "/my-profile",
     checkAuth(...Object.values(Role)), // ✔ any logged-in user can access
     UserControllers.getMyProfile
);

router.patch(
     "/:id", 
     checkAuth(Role.ADMIN), 
     UserControllers.updateUser
)


export const UserRoutes = router;