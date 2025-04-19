import express from "express";
import {config} from "./config";
import chatRoutes from "./routes/chat";

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use("/api/chat", chatRoutes);

// Health check route
app.get("/health", (req, res) => {
	res.status(200).json({status: "ok"});
});

// Start the server
app.listen(config.port, () => {
	console.log(`Server is running on port ${config.port}`);
});
