import { Router, Request, Response } from "express";
import { fetchStocks } from "../services/fetchStocks";
import { extractSymbols } from "../utils/extractSymbols";
import { updateScannerSymbols } from "../services/sendData";
import path from "path";

const router = Router();

// Middleware to protect admin routes
function requireAuth(req: Request, res: Response, next: Function) {
    if (req.path === "/login.html" || req.path === "/login") {
        return next(); // Allow login page access
    }

    if (req.session.isAuthenticated) {
        return next(); // Proceed if authenticated
    }

    res.redirect("/login.html");
}

// Secure admin panel
router.get("/", requireAuth, (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, "../../public", "index.html"));
});

// Route to manually trigger stock data fetching
router.get("/run-scanner", requireAuth, async (req: Request, res: Response) => {
    console.log("Manual execution triggered...");
    await executeScanner();
    res.json({ message: "Stock scanner executed successfully." });
});

// Scanner execution function
export async function executeScanner() {
    const stockData = await fetchStocks();
    if (stockData) {
        const simplifiedData = extractSymbols(stockData);
        await updateScannerSymbols(simplifiedData);
        console.log("Updated symbols for scanners.");
    } else {
        console.log("Update scanner symbols execution failed.");
    }
}

export default router;
