import OpenAI from "openai";
import {FunctionDefinition} from "openai/resources/shared";
import {FunctionHandler, FunctionResult} from "../../../types/common";

export const functions: FunctionDefinition[] = [
	{
		name: "get_weather",
		description: "Get the current weather in a given location",
		parameters: {
			type: "object",
			properties: {
				location: {
					type: "string",
					description: "The city and state, e.g., San Francisco, CA",
				},
				unit: {
					type: "string",
					enum: ["celsius", "fahrenheit"],
					description: "The temperature unit",
				},
			},
			required: ["location"],
		},
	},
	{
		name: "search_database",
		description: "Search for information in the database",
		parameters: {
			type: "object",
			properties: {
				query: {
					type: "string",
					description: "The search query",
				},
				filters: {
					type: "array",
					items: {
						type: "string",
					},
					description: "List of filters to apply to the search",
				},
			},
			required: ["query"],
		},
	},
];

const functionHandlers: Record<string, FunctionHandler> = {
	get_weather: async (args: {
		location: string;
		unit?: string;
	}): Promise<FunctionResult> => {
		// Implementation for weather function
		const {location, unit = "celsius"} = args;
		try {
			// Mock implementation - replace with actual API call
			console.log(`Getting weather for ${location} in ${unit}`);
			return {
				location,
				temperature: 22,
				unit,
				condition: "Sunny",
			};
		} catch (error) {
			console.error("Error fetching weather:", error);
			return {error: "Failed to fetch weather data"};
		}
	},
	search_database: async (args: {
		query: string;
		filters?: string[];
	}): Promise<FunctionResult> => {
		// Implementation for search_database function
		const {query, filters = []} = args;
		try {
			// Mock implementation - replace with actual database search
			console.log(
				`Searching database for "${query}" with filters: ${filters.join(", ")}`
			);
			return {
				query,
				results: [
					{id: 1, title: "Result 1"},
					{id: 2, title: "Result 2"},
				],
			};
		} catch (error) {
			console.error("Error searching database:", error);
			return {error: "Failed to search database"};
		}
	},
};

export async function executeFunction(
	tool_calls: OpenAI.Chat.Completions.ChatCompletionMessageToolCall[]
): Promise<FunctionResult[]> {
	let result: FunctionResult[] = [];
	tool_calls.forEach(async (tool_call) => {
		const {function: f} = tool_call;
		const {name, arguments: argsString} = f;

		console.log(`Function call requested: ${name}`);

		if (functionHandlers[name]) {
			try {
				const args = JSON.parse(argsString);
				const rs = await functionHandlers[name](args);
				result.push(rs);
			} catch (error) {
				console.error(`Error executing function ${name}:`, error);
				result.push({error: `Failed to execute function ${name}`});
			}
		} else {
			console.log(`Skipping unknown function: ${name}`);
			result.push({error: `Function ${name} is not implemented`});
		}
	});
	return result;
}
