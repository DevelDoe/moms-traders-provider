import { Router, Request, Response } from "express";
import bcrypt from "bcrypt";
import fs from "fs";
import path from "path"

const router = Router();

router.post("/login", async (req: Request, res: Response): Promise<void> => {
    const { password } = req.body;
    const storedHash = process.env.ADMIN_PASSWORD_HASH || "";

    if (!password) {
        res.status(400).json({ message: "Password required" });
        return;
    }

    try {
        const match = await bcrypt.compare(password, storedHash);
        if (match) {
            req.session.isAuthenticated = true;
            res.json({ message: "Login successful" });
        } else {
            res.status(401).json({ message: "Invalid password" });
        }
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.get("/logout", (req: Request, res: Response) => {


    const sessionID = req.session.id;
    req.session.destroy((err) => {
        if (err) {
            console.error("Session destruction error:", err);
            return res.status(500).json({ message: "Logout failed" });
        }

        // Manually delete session file
        const sessionPath = path.join(__dirname, "../../sessions", sessionID + ".json");
        fs.unlink(sessionPath, (err) => {
            if (err && err.code !== "ENOENT") {
                console.error("Error deleting session file:", err);
            }
        });

        // Explicitly expire the session cookie
        res.clearCookie("connect.sid", { path: "/", domain: "localhost", httpOnly: true, secure: false });

        console.log("Session destroyed, file deleted, cookie cleared.");
        
        res.redirect("/login.html");
    });
});




export default router;
