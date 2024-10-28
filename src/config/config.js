import dotenv from "dotenv";

dotenv.config({
    path: "./.env"
});

const _config = {
    port: process.env.PORT,
    mongodbUri: process.env.MONGODB_URI,
    env: process.env.ENV,

    accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
    accessTokenExpiry: process.env.ACCESS_TOKEN_EXPIRY
}

export const config = Object.freeze(_config);