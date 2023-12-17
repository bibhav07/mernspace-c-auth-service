import { checkSchema } from "express-validator";

export default checkSchema({
    email: {
        errorMessage: "EMail is required",
        notEmpty: true,
    },
});

// export default [body("email").notEmpty().withMessage("Email is required")];