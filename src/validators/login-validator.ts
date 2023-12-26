import { checkSchema } from "express-validator";

export default checkSchema({
    email: {
        errorMessage: "email is required",
        notEmpty: true,
        trim: true,
        isEmail: {
            errorMessage: "should be a valid email",
        },
        normalizeEmail: true,
    },
    password: {
        errorMessage: "password is required",
        notEmpty: true,
        trim: true,
    },
});
