import { app } from "./app.js";
import { config } from "./config/config.js";
import connectDb from "./db/index.js";

const port = config.port || 8080;

// connect the db and run the run the application
connectDb()
    .then(() => {
        app.listen(port, () => {
            console.log(`app is listing at port: ${port}`);
        })
    })
    .catch((err) => {
        console.log("DB connection Failed");
    });