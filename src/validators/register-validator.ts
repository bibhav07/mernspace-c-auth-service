import { checkSchema } from "express-validator";

export default checkSchema({
    email: {
        errorMessage: "email is required",
        notEmpty: true,
        trim: true,
        isEmail: true,
        normalizeEmail: true,
    },
    password: {
        errorMessage: "password is required",
        notEmpty: true,
        trim: true,
        isLength: {
            options: {
                max: 8,
            },
        },
    },
    firstName: {
        errorMessage: "firstname is required",
        notEmpty: true,
        trim: true,
    },
    lastName: {
        errorMessage: "lastName is required",
        notEmpty: true,
        trim: true,
    },
});
