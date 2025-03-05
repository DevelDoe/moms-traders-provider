import axios from "axios";
import dotenv from "dotenv";

dotenv.config(); // Ensure .env is loaded

const C_SERVER_URL = process.env.C_SERVER_URL || "http://localhost:8000"; // Use the environment variable

export async function updateScannerSymbols(payload: any): Promise<void> {
    try {
        const response = await axios.post(`${C_SERVER_URL}/update-scanner-symbols`, payload, {
            headers: { "Content-Type": "application/json" }
        });
        console.log("Successfully posted symbols:", response.status);
    } catch (error) {
        console.error("Failed to send data:", error);
    }
}
