import cors from "cors";
import express from "express";
import chatRoutes from "./routes/chat";
import customerRoutes from "./routes/customer";
import familyRoutes from "./routes/family";
import guestRoutes from "./routes/guest";
import orgRoutes from "./routes/org";
import {config} from "./utils/config";

const app = express();

// Middleware
app.use(express.json());

// cors
app.use(
	cors({
		origin: ["http://127.0.0.1:5500", "https://widget.dolph.my"],
	})
);

// Route Chat
app.use("/api/chat", chatRoutes);
app.use("/api/org", orgRoutes);
app.use("/api/guest", guestRoutes);
// Routes AI
app.use("/api/customer", customerRoutes);
app.use("/api/family", familyRoutes);

// Health check route
app.get("/health", (req, res) => {
	res.status(200).json({status: "ok"});
});

// Start the server
app.listen(config.port, () => {
	console.log(`Server is running on port ${config.port}`);
});
