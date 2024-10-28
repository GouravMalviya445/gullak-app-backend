import mongoose from 'mongoose';
import { config } from '../config/config.js';
import { dbName } from '../constants.js';

const connectDb = async () => {
    try {
        mongoose.connection.on("connected", () => console.log("DB Connected SuccessFully!! host: ", mongoose.connection.host));

        mongoose.connection.on("error", (err) => console.error("Error While Connecting DB: ", err));

        // connect to database if theres is no error occur
        await mongoose.connect(`${config.mongodbUri}/${dbName}`);

    } catch (err) {
        console.error("DB Connection Failed: ", err);
        process.exit(1);
    }

}

export default connectDb;