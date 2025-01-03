// schemas/userSchema.js
const { z } = require("zod");

exports.loginSchema = z.object({
  body: z.object({
    login_name: z.string().min(1, "Login name is required"),
    password: z
      .string()
      .min(8, "Password is required and must be at least 8 characters long"),
  }),
});
exports.registerSchema = z.object({
  body: z.object({
    first_name: z.string().optional(),
    last_name: z.string().optional(),
    location: z.string().optional(),
    description: z.string().optional(),
    occupation: z.string().optional(),
    login_name: z
      .string()
      .min(1, "Login name is required")
      .regex(
        /^[a-zA-Z0-9]+$/,
        "Login name can only contain alphanumeric characters"
      ),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one digit")
      .regex(
        /[!@#$%^&*(),.?":{}|<>]/,
        "Password must contain at least one special character"
      ),
  }),
});
// Define Zod schema for user registration
// exports.loginSchema = z.object({
//   body: z.object({
//     // username: z.string(),
//     identifier: z.string().min(1, "Enter username or email"),
//     password: z.string().min(1, "Enter password"),
//   }),
//   // query: z.object({
//   //   role: z.string().optional(),
//   // }),
//   // params: z.object({
//   //   userId: z.string().uuid("Invalid user ID"),
//   // }),
// });
// exports.createUserSchema = z.object({
//   body: z.object({
//     email: z.string().email("Invalid email address"),
//     firstName: z.string().min(1, "Enter First Name"),
//     lastName: z.string().min(1, "Enter last name"),
//     username: z.string().min(1, "Enter username"),
//     password: z
//       .string()
//       .min(8, { message: "Нууц үг дор хаяж 8 тэмдэгтийн урттай байна" })
//       .max(100, { message: "Нууц үг 100 тэмдэгтээс их байж болохгүй" })
//       .regex(/[a-z]/, {
//         message: "Password must contain at least one lowercase letter",
//       }) // Lowercase letter
//       .regex(/[A-Z]/, {
//         message: "Password must contain at least one uppercase letter",
//       }) // Uppercase letter
//       .regex(/\d/, { message: "Password must contain at least one number" }) // Number
//       .regex(/[@$!%*;?&#]/, {
//         message: "Password must contain at least one special character",
//       }), // Special character
//   }),
// });
// exports.changePasswordSchema = z.object({
//   body: z.object({
//     oldPassword: z
//       .string()
//       .min(8, { message: "Нууц үг дор хаяж 8 тэмдэгтийн урттай байна" }),
//     password: z
//       .string()
//       .min(8, { message: "Нууц үг дор хаяж 8 тэмдэгтийн урттай байна" })
//       .max(100, { message: "Нууц үг 100 тэмдэгтээс их байж болохгүй" })
//       .regex(/[a-z]/, {
//         message: "Password must contain at least one lowercase letter",
//       }) // Lowercase letter
//       .regex(/[A-Z]/, {
//         message: "Password must contain at least one uppercase letter",
//       }) // Uppercase letter
//       .regex(/\d/, { message: "Password must contain at least one number" }) // Number
//       .regex(/[@$!%*;?&#]/, {
//         message: "Password must contain at least one special character",
//       }), // Special character
//   }),
// });
// exports.editUserDetailsSchema = z.object({
//   body: z.object({
//     firstName: z.string(),
//     lastName: z.string(),
//     username: z.string(),
//     password: z
//       .string()
//       .min(8, { message: "Нууц үг дор хаяж 8 тэмдэгтийн урттай байна" }),
//   }),
// });
