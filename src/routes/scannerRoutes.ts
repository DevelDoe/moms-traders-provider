import { Router, Request, Response } from "express";
import axios from "axios";
import dotenv from "dotenv";
import { fetchStocks } from "../services/fetchStocks";
import { extractSymbols } from "../utils/extractSymbols";
import { updateScannerSymbols } from "../services/sendData";
import path from "path";

dotenv.config();

const router = Router();
const C_SERVER_URL = process.env.C_SERVER_URL || "http://localhost:8000"; // ✅ Now uses .env

// Middleware to protect admin routes
function requireAuth(req: Request, res: Response, next: Function) {
    if (req.path === "/login.html" || req.path === "/login") {
        return next();
    }
    if (req.session?.isAuthenticated) {
        return next();
    }
    res.redirect("/login.html");
}

// 📌 Secure admin panel (serve index.html)
router.get("/", requireAuth, (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, "../../public", "index.html"));
});



// 📌 Fetch scanner statuses from C server
router.get("/scanners", requireAuth, async (req: Request, res: Response) => {
    try {
        const response = await axios.get(`${C_SERVER_URL}/scanners`);
        res.json(response.data);
    } catch (error: unknown) {
        const errMsg = error instanceof Error ? error.message : "Unknown error";
        console.error("Error fetching scanners:", errMsg);
        res.status(500).json({ message: "Failed to fetch scanner data" });
    }
});

// 📌 Fetch symbol pool from C server
router.get("/pool", requireAuth, async (req: Request, res: Response) => {
    try {
        const response = await axios.get(`${C_SERVER_URL}/pool`);
        res.json(response.data);
    } catch (error: unknown) {
        const errMsg = error instanceof Error ? error.message : "Unknown error";
        console.error("Error fetching pool:", errMsg);
        res.status(500).json({ message: "Failed to fetch pool data" });
    }
});

// 📌 Route to manually trigger stock data fetching with filters
router.post("/refresh-pool", requireAuth, async (req: Request, res: Response) => {
    console.log("Manual execution triggered with filters:", req.body);

    // Ensure filters exist, otherwise fallback to defaults
    const filters = req.body || {
        priceMoreThan: "1",
        priceLowerThan: "7",
        volumeMoreThan: "100000",
        marketCapLowerThan: "30000000",
        exchange: "NASDAQ",
        isActivelyTrading: "true",
        isEtf: "false",
        isFund: "false",
    };

    await executeScanner(filters); // ✅ Now executes with filters

    console.log("Waiting for server to update data...");
    await new Promise(resolve => setTimeout(resolve, 2000));

    res.json({ message: "Symbols updated!" });
});


// 📌 Scanner execution function (now accepts filters)
export async function executeScanner(filters: Record<string, any>): Promise<void> {
    const stockData = await fetchStocks(filters); // ✅ Pass filters
    if (stockData) {
        const simplifiedData = extractSymbols(stockData);

        console.log("Posting symbols to C server...");
        await updateScannerSymbols(simplifiedData); // ✅ Await here
        console.log("Symbols posted, waiting for C server update...");
    } else {
        console.log("Update scanner symbols execution failed.");
    }
}



export default router;
