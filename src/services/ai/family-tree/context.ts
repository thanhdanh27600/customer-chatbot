import * as fs from "fs";
import {OpenAI} from "openai";
import * as path from "path";
import {FamilyData, FamilyMember} from "../../../types/family";
import {config, familyBotConfig} from "../../../utils/config";

export class FamilyContextManager {
	private familyData: FamilyData;
	private openai: OpenAI;

	constructor(familyDataPath: string) {
		this.openai = new OpenAI({
			apiKey: config.openaiApiKey,
			baseURL: config.openaiBaseUrl,
		});

		// Load family data from JSON file
		const rawData = fs.readFileSync(path.resolve(familyDataPath), "utf8");
		this.familyData = JSON.parse(rawData) as FamilyData;
	}

	// Find relationships between family members
	findRelationship(person1Id: string, person2Id: string): string[] {
		const relationships: string[] = [];

		const person1 = this.familyData.family.members.find(
			(m) => m.id === person1Id
		);
		if (!person1) return [`Person with ID ${person1Id} not found`];

		// Direct relationship check
		for (const rel of person1.relationships) {
			if (rel.of?.includes(person2Id)) {
				relationships.push(
					`${person1.name} is ${rel.type} of ${this.getMemberNameById(
						person2Id
					)}`
				);
			}
		}

		return relationships.length > 0
			? relationships
			: ["No direct relationship found"];
	}

	// Get member name by ID
	private getMemberNameById(id: string): string {
		const member = this.familyData.family.members.find((m) => m.id === id);
		return member ? member.name : "Unknown";
	}

	// Get all family members
	getAllMembers(): FamilyMember[] {
		return this.familyData.family.members;
	}

	// Check if member is deceased
	isDeceased(memberId: string): boolean {
		const member = this.familyData.family.members.find(
			(m) => m.id === memberId
		);
		return member ? member.deathDate !== null : false;
	}

	// Get deceased family members
	getDeceasedMembers(): FamilyMember[] {
		return this.familyData.family.members.filter(
			(member) => member.deathDate !== null
		);
	}

	// Generate family tree description
	generateFamilyTreeDescription(): string {
		let description = `Family: ${this.familyData.family.name}\n\n`;

		for (const member of this.familyData.family.members) {
			// Show life span with death date if applicable
			const birthDate = new Date(member.birthDate).toDateString();
			const lifeSpan = member.deathDate
				? `(mất ${new Date(member.deathDate).toDateString()})`
				: `(${birthDate})`;

			description += `- ${member.name} ${lifeSpan}: ${member.bio}\n`;
			description += "  :\n";

			for (const rel of member.relationships) {
				if (rel.of) {
					description += `    . ${rel.type} của ${rel.of
						.map((id) => this.getMemberNameById(id))
						.join(", ")}\n`;
				}
			}
			description += "\n";
		}

		return description;
	}

	// Create OpenAI API messages with family context
	async createChatWithFamilyContext(userQuery: string): Promise<string> {
		const familyContext = this.generateFamilyTreeDescription();
		const botConfig = familyBotConfig(familyContext);
		try {
			const response = await this.openai.chat.completions.create({
				model: config.openaiModel,
				messages: [
					{
						role: "system",
						content: botConfig.systemPrompt,
					},
					{role: "user", content: userQuery},
				],
				temperature: botConfig.temperature,
				max_tokens: botConfig.maxTokens,
			});

			return response.choices[0]?.message?.content || "No response generated";
		} catch (error) {
			console.error("Error calling OpenAI API:", error);
			return "Error generating response";
		}
	}
}
