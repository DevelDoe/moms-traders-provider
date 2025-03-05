import dotenv from "dotenv";

dotenv.config();

export const FMP_KEY = process.env.FMP_KEY || "";
export const FMP_URL = process.env.FMP_URL || "";