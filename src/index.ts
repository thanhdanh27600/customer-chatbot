import express from "express";
import chatRoutes from "./routes/chat";
import customerRoutes from "./routes/customer";
import familyRoutes from "./routes/family";
import {config} from "./utils/config";

const app = express();

// Middleware
app.use(express.json());

// Route Chat
app.use("/api/chat", chatRoutes);
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
