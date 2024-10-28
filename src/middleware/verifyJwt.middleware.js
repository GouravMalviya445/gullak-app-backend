import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';
import { config } from '../config/config.js';

const verifyJwt = (req, res, next) => {
    const token = req.headers?.authorization?.split(" ").at(-1);

    if (!token)
        return next(createHttpError(401, "Missing token / unauthorized user"));

    try {
        const decoded = jwt.verify(token, config.accessTokenSecret);
        if (decoded) {
            req.userId = decoded.sub;
            next();
        }
    } catch (err) {
        if (err.name === 'TokenExpiredError')
            return next(createHttpError(401, "token expired / you may refresh or login again"));
        else
            return next(createHttpError(401, "Invalid token"));
    }

}

export { verifyJwt };