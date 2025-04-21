import * as fs from "fs";
import * as path from "path";
import {ServiceDescription} from "../../types/common";
import {customerBotConfig} from "../../utils/config";

// Read service descriptions from file
export function loadServiceDescriptions(
	filePath: string
): ServiceDescription[] {
	try {
		const data = fs.readFileSync(filePath, "utf8");
		return JSON.parse(data);
	} catch (error) {
		console.error("Error loading service descriptions:", error);
		return [];
	}
}

// Prepare services information for the AI context
export function prepareServicesContext(services: ServiceDescription[]): string {
	let context = customerBotConfig.summaryPrompt + "\n\n";

	services.forEach((service) => {
		context += `SERVICE: ${service.name}\n`;
		context += `DESCRIPTION: ${service.description}\n`;

		context += "FEATURES:\n";
		service.features.forEach((feature: string) => {
			context += `- ${feature}\n`;
		});

		if (service.commonIssues && service.commonIssues.length > 0) {
			context += "COMMON ISSUES AND SOLUTIONS:\n";
			service.commonIssues.forEach((issue: string) => {
				context += `- ${issue}\n`;
			});
		}

		if (service.pricing) {
			context += `PRICING: ${service.pricing}\n`;
		}

		context += "\n";
	});

	return context;
}

// Load service descriptions
const services = loadServiceDescriptions(
	path.resolve("src/data/services.json")
);
if (services.length === 0) {
	console.error("No services loaded. Please check your services.json file.");
	process.exit(1);
}

// Prepare context for the AI
export const servicesContext = prepareServicesContext(services);
