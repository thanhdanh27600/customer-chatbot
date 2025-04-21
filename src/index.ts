import express from "express";
import customerRoutes from "./routes/customer";
import {config} from "./utils/config";

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use("/api/customer", customerRoutes);
app.use("/api/family", customerRoutes);

// Health check route
app.get("/health", (req, res) => {
	res.status(200).json({status: "ok"});
});

// Start the server
app.listen(config.port, () => {
	console.log(`Server is running on port ${config.port}`);
});
