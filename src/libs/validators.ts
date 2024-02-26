import { z } from "zod";

const AdminLogin = z.object({
  uname: z.string().min(1, { message: "Username is required" }),
  password: z
    .string()
    .min(1, "Password is required")
    .min(4, "Atleast 4 characters"),
});

type AdminType = z.infer<typeof AdminLogin>;

export { type AdminType, AdminLogin };
