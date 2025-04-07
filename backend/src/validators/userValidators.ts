import * as yup from "yup";

export const registerValidation = yup.object().shape({
  firstName: yup
    .string()
    .min(2, "Invalid Name")
    .max(20, "Invalid Name")
    .required("Enter your First Name"),

  lastName: yup
    .string()
    .min(2, "Invalid Name")
    .max(20, "Invalid Name")
    .required("Enter your Last Name"),

  phone: yup
    .string()
    .required("Enter your Phone number")
    .matches(/^(\+91)?\d{10}$/, "Enter a valid Indian phone number"),

  email: yup
    .string()
    .email("Please enter a valid Email address")
    .required("Enter a Email address"),

  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters long")
    .max(10, "Password must be at most 10 characters long")
    .matches(/[A-Za-z]/, "Password must include at least one letter")
    .matches(/\d/, "Password must include at least one number")
    .matches(
      /[@$!%*?&]/,
      "Password must include at least one special character (@$!%*?&)"
    ),
});

export const loginValidation = yup.object().shape({
  identifier: yup
    .string()
    .required("Identifier is required")
    .test(
      "is-email-or-phone",
      "Enter a valid email or 10-digit phone number",
      function (value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^\d{10}$/;

        return emailRegex.test(value || "") || phoneRegex.test(value || "");
      }
    ),

  password: yup.string().required("Password is required"),
});
