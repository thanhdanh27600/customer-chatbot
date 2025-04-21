export interface Relationship {
	type: string;
	of?: string[];
}

export interface FamilyMember {
	id: string;
	name: string;
	birthDate: string;
	deathDate: string | null;
	relationships: Relationship[];
	bio: string;
}

export interface FamilyData {
	family: {
		name: string;
		members: FamilyMember[];
	};
}
