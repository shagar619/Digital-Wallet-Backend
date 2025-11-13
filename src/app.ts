import cors from "cors";
import express, { Request, Response } from "express";
import cookieParser from "cookie-parser";
import expressSession from "express-session";
import { envVars } from "./app/config/env";
import notFound from "./app/middlewares/notFound";
import { router } from "./app/routes";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";





const app = express();

app.use(expressSession({
     secret: envVars.EXPRESS_SESSION_SECRET,
     resave: false,
     saveUninitialized: false
}));

// app.use(passport.initialize());
// app.use(passport.session());

app.use(cookieParser());
app.use(express.json());
app.set("trust proxy", 1);
app.use(express.urlencoded({ extended: true }));
app.use(cors({
     origin: envVars.FRONTEND_URL,
     credentials: true
}));

app.use("/api/w1", router);

app.get('/', (req: Request, res: Response) => {
     res.send({ 
          success: true, 
          message: `Sever is Live ⚡!` 
     });
});


app.use(globalErrorHandler);

app.use(notFound);


export default app;