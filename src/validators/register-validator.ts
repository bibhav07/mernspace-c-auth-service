import { checkSchema } from "express-validator";

 export default checkSchema({
    email: {
        errorMessage: "Email is required",
        notEmpty: true,
        trim: true,
        isEmail: true,
        normalizeEmail: true
    },
    password: {
        errorMessage: "Email is password",
        notEmpty: true,
        trim: true,
        isLength: {
            options:{
                max:8
            }
        },
    },
    firstName: {
        errorMessage: "Email is firstName",
        notEmpty: true,
        trim: true,
    },
    lastName: {
        errorMessage: "Email is lastName",
        notEmpty: true,
        trim: true,
    },
});

// export default [body("email").notEmpty().withMessage("Email is required")];
