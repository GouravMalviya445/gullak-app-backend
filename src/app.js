import express from "express";
import { globalErrorHandler } from "./middleware/globalError.middleware.js";
import cors from "cors";

const app = express();

// global middleware 
app.use(express.json());
app.use(cors());


// import all the routes here
import { userRouter } from "./routes/user.routes.js"
import { accountRouter } from "./routes/account.routes.js";

// routes
app.use("/api/v1/user", userRouter);
app.use("/api/v1/account", accountRouter);



// global error handling middleware
app.use(globalErrorHandler);

export { app };