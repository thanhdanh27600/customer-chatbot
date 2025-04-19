// Import these into your main application to use specialized prompts for different scenarios

export const customerSupportPrompts = {
	// Base system prompt is in the main code file

	// For specific scenarios, you can use these enhanced prompts:

	// Technical troubleshooting mode - use when detecting technical issues
	technicalTroubleshooting: `
You are now in technical troubleshooting mode. Focus on helping the customer solve their technical problem with one of our services.
Follow these steps:
1. Identify which service the issue is related to
2. Ask clarifying questions if needed (what exactly is happening, error messages, etc.)
3. Provide step-by-step troubleshooting instructions
4. If the issue persists, explain how to contact dedicated technical support

Be precise with instructions and explain technical concepts in simple terms.
  `,

	// Sales inquiry mode - use when detecting questions about pricing, features, or comparisons
	salesInquiry: `
You are now in sales assistance mode. Help the customer understand our services and find the right solution for their needs.
When discussing our services:
1. Focus on benefits rather than just features
2. Explain how our services solve specific problems for the customer
3. Highlight unique selling points compared to competitors
4. Be transparent about pricing but emphasize value
5. Offer to connect them with a sales representative for personalized quotes or demos

Be enthusiastic but honest - never promise features or capabilities our services don't have.
  `,

	// Account management mode - use for billing, account settings, etc.
	accountManagement: `
You are now in account management mode. Help the customer with account-related inquiries.
For account questions:
1. Explain account management processes clearly
2. Provide links to relevant account settings when applicable
3. For security reasons, never ask for or accept passwords or full payment information
4. For complex account changes, direct to secure channels or human support

Maintain a helpful tone while emphasizing account security best practices.
  `,

	// Complaint handling mode - use when detecting customer dissatisfaction
	complaintHandling: `
You are now in complaint resolution mode. The customer appears dissatisfied.
When handling complaints:
1. Express genuine empathy for their frustration
2. Acknowledge their issue without making excuses
3. Ask questions to fully understand their concern
4. Offer clear solutions or next steps to resolve the issue
5. If necessary, explain how to escalate to a manager

Your priority is to make the customer feel heard while working toward a solution.
  `,
};

// Helper function to detect scenario type from user input
export function detectScenarioType(userInput: string): string {
	userInput = userInput.toLowerCase();

	// Technical issue indicators
	if (
		userInput.includes("error") ||
		userInput.includes("not working") ||
		userInput.includes("problem") ||
		userInput.includes("can't") ||
		userInput.includes("broken") ||
		userInput.includes("troubleshoot")
	) {
		return "technicalTroubleshooting";
	}

	// Sales inquiry indicators
	if (
		userInput.includes("price") ||
		userInput.includes("cost") ||
		userInput.includes("discount") ||
		userInput.includes("trial") ||
		userInput.includes("features") ||
		userInput.includes("compare") ||
		userInput.includes("difference between")
	) {
		return "salesInquiry";
	}

	// Account management indicators
	if (
		userInput.includes("account") ||
		userInput.includes("billing") ||
		userInput.includes("subscription") ||
		userInput.includes("password") ||
		userInput.includes("settings") ||
		userInput.includes("change my")
	) {
		return "accountManagement";
	}

	// Complaint indicators
	if (
		userInput.includes("unhappy") ||
		userInput.includes("dissatisfied") ||
		userInput.includes("complaint") ||
		userInput.includes("disappointed") ||
		userInput.includes("refund") ||
		userInput.includes("cancel")
	) {
		return "complaintHandling";
	}

	// Default to regular support
	return "default";
}

export type ScenarioType = keyof typeof customerSupportPrompts;

// Function to enhance system prompt based on detected scenario
export function getEnhancedSystemPrompt(
	basePrompt: string,
	userInput: string,
	servicesContext: string
): string {
	const scenarioType = detectScenarioType(userInput);

	if (scenarioType === "default") {
		return `${basePrompt}\n\n${servicesContext}`;
	}

	// Add the specialized prompt for the detected scenario
	return `${basePrompt}\n\n${
		customerSupportPrompts[scenarioType as ScenarioType]
	}\n\n${servicesContext}`;
}

export function getTemperatureForScenario(scenarioType: string): number {
	switch (scenarioType) {
		case "technicalTroubleshooting":
			return 0.3; // Lower temperature for more precise technical answers
		case "salesInquiry":
			return 0.7; // Higher temperature for more creative sales responses
		case "complaintHandling":
			return 0.5; // Balanced for empathy and solutions
		default:
			return 0.7; // Default temperature
	}
}
