import express from "express";
import session from "express-session";
import cron from "node-cron";
import path from "path";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";
import scannerRoutes, { executeScanner } from "./routes/scannerRoutes"; // Import executeScanner separately

dotenv.config();

declare module "express-session" {
    interface SessionData {
        isAuthenticated?: boolean;
    }
}

const app = express();
const PORT = process.env.PORT || 3000;

// Session setup
const FileStore = require("session-file-store")(session);
app.use(session({
    store: new FileStore({ path: "./sessions" }),
    secret: process.env.SESSION_SECRET || "default_secret",
    resave: false,
    saveUninitialized: false, // Prevents session until login
    cookie: { secure: false, httpOnly: true, maxAge: 3600000 }
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware to protect all admin routes
function requireAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
    console.log(`Auth check on ${req.path}:`, req.session.isAuthenticated);

    if (req.path === "/login.html" || req.path === "/login") {
        return next(); // Allow access to login page
    }

    if (req.session && req.session.isAuthenticated) {
        return next(); // Allow access if authenticated
    }

    res.redirect("/login.html"); // Redirect if not authenticated
}

// 🔹 Apply `requireAuth` before serving static files
app.use(requireAuth);
app.use(express.static(path.join(__dirname, "../public")));

// Use modularized routes
app.use(authRoutes);
app.use(scannerRoutes);

const defaultFilters = {
    marketCapLowerThan: "30000000",
    priceMoreThan: "1",
    priceLowerThan: "7",
    volumeMoreThan: "100000",
    exchange: "NASDAQ",
    isActivelyTrading: "true",
    isEtf: "false",
    isFund: "false"
};

// Schedule the task to run every day at midnight (server time)
cron.schedule("0 0 * * *", async () => {
    console.log("Running stock scanner at midnight with default filters...");
    await executeScanner(defaultFilters); // ✅ Now correctly passing filters
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
