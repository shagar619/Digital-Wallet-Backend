import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { WalletControllers } from "./wallet.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { WalletValidations } from "./wallet.validation";



const router = Router();


// --- COMMON ROUTES ---
router.get(
     "/my-balance",
     checkAuth(Role.USER, Role.AGENT, Role.ADMIN), // All roles have wallets
     WalletControllers.getMyBalance
);


// --- ADMIN ROUTES ---
router.get(
     "/all-wallets",
     checkAuth(Role.ADMIN), // 🔒 Admin Only
     WalletControllers.getAllWallets
);

router.patch(
     "/:id",
     checkAuth(Role.ADMIN), // 🔒 Admin Only
     validateRequest(WalletValidations.updateWalletStatusSchema),
     WalletControllers.updateWalletStatus
);

export const WalletRoutes = router;