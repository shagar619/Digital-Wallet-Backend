// import { Router } from "express";
// import { checkAuth } from "../../middlewares/checkAuth";
// import { Role } from "../user/user.interface";
// import { transactionControllers } from "./transaction.controller";



// const router = Router();
// router.get(
//      "/all-transactions",
//      checkAuth(Role.ADMIN),
//      transactionControllers.getAllTransaction
// );


// router.get(
//      "/your-transactions",
//      checkAuth(Role.USER),
//      transactionControllers.getAllTransactionByUserID
// );



// export const TransRoutes = router;
















// Updated
import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { validateRequest } from "../../middlewares/validateRequest";
import { TransactionValidations } from "./transaction.validation";
import { TransactionControllers } from "./transaction.controller";



const router = Router();

// --- USER ROUTES ---
router.post(
     "/send-money",
     checkAuth(Role.USER),
     validateRequest(TransactionValidations.sendMoneySchema),
     TransactionControllers.sendMoney
);

router.get(
     "/my-history",
     checkAuth(Role.USER, Role.AGENT), // Both can view own history
     TransactionControllers.getMyTransactions
);

// --- AGENT ROUTES ---
router.post(
     "/cash-in",
     checkAuth(Role.AGENT),
     validateRequest(TransactionValidations.cashInSchema),
     TransactionControllers.cashIn
);

// --- ADMIN ROUTES ---
router.get(
     "/analytics",
     checkAuth(Role.ADMIN),
     TransactionControllers.getAdminAnalytics
);

export const TransactionRoutes = router;