import * as path from "path";
import {loadServiceDescriptions, prepareServicesContext} from "./root";

// Load service descriptions
const services = loadServiceDescriptions(path.join(__dirname, "services.json"));
if (services.length === 0) {
	console.error("No services loaded. Please check your services.json file.");
	process.exit(1);
}

// Prepare context for the AI
export const servicesContext = prepareServicesContext(services);
