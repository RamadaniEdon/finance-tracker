import z from "zod";
import { accountSchema } from "./factory";

export type Account = z.infer<typeof accountSchema>;