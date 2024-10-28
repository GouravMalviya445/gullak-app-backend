import { config } from "../config/config.js"

const globalErrorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    if (err) {
        res.status(statusCode).json({
            message: err.message,
            success: statusCode < 400,
            errorStack: config.env === "production" ? "" : err.stack
        })
    }
}

export { globalErrorHandler };