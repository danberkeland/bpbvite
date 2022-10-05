import * as yup from "yup"

export const validationSchema = yup.object().shape({
    prodNick: yup
        .string()
        .matches(/^[a-zA-z]+$/, "must contain only letters")
        .min(3, "Product ID must have at least 3 characters")
        .required("Required")
})

