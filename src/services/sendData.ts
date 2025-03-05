import axios from "axios";

export async function updateScannerSymbols(payload: any): Promise<void> {
    try {
        const response = await axios.post("http://172.232.155.62:8000/update-scanner-symbols", payload, {
            headers: { "Content-Type": "application/json" }
        });
        console.log("Successfully posted symbols:", response.status);
    } catch (error) {
        console.error("Failed to send data:", error);
    }
}