import {createGuest, getGuest} from "./api";

export const GUEST_STORAGE_KEY = "guest_id";
let initializeLoading = false;

interface GuestState {
	guestId: string | null;
	isLoading: boolean;
}

interface IpInfo {
	ipAddress: string;
	continentCode: string;
	continentName: string;
	countryCode: string;
	countryName: string;
	stateProvCode: string;
	stateProv: string;
	city: string;
	[key: string]: any;
}

type StateChangeCallback = (state: GuestState) => void;

export interface GuestHook {
	getState: () => GuestState;
	subscribe: (callback: StateChangeCallback) => () => void;
	refreshGuest: (guestId?: string) => void;
	initialize: () => Promise<void>;
}

export async function fetchIpInfo(): Promise<IpInfo | null> {
	try {
		const response = await fetch("https://api.db-ip.com/v2/free/self");
		if (!response.ok) {
			throw new Error(`Failed to fetch IP info: ${response.statusText}`);
		}
		const data = await response.json();
		return data;
	} catch (error) {
		console.error("Error fetching IP info:", error);
		return null;
	}
}

export function createGuestHook(): GuestHook {
	let guestId: string | null = null;
	let isLoading = true;
	let onChangeCallbacks: StateChangeCallback[] = [];

	function notifyChange(): void {
		onChangeCallbacks.forEach((callback) => callback({guestId, isLoading}));
	}

	async function initializeGuest(): Promise<void> {
		if (initializeLoading) return;
		initializeLoading = true;

		try {
			const storedId = localStorage.getItem(GUEST_STORAGE_KEY);

			if (storedId) {
				try {
					const existingGuest = await getGuest(storedId);
					console.log("existingGuest", existingGuest.id);
					guestId = storedId;
					isLoading = false;
					initializeLoading = false;
					notifyChange();
				} catch {
					initializeLoading = false;
					localStorage.removeItem(GUEST_STORAGE_KEY);
					initializeGuest();
				}
				return;
			}

			const ipInfo = await fetchIpInfo();
			const createdGuest = await createGuest(ipInfo);
			console.log("createdGuest", createdGuest.id);
			const newId = createdGuest.id;
			localStorage.setItem(GUEST_STORAGE_KEY, newId);
			guestId = newId;
		} catch (error) {
			console.error("Guest initialization error:", error);
			guestId = null;
		} finally {
			isLoading = false;
			initializeLoading = false;
			notifyChange();
		}
	}

	function subscribe(callback: StateChangeCallback): () => void {
		onChangeCallbacks.push(callback);
		return () => {
			onChangeCallbacks = onChangeCallbacks.filter((cb) => cb !== callback);
		};
	}

	function refreshGuest(guestId?: string) {
		localStorage.removeItem(GUEST_STORAGE_KEY);
		if (guestId) {
			localStorage.setItem(GUEST_STORAGE_KEY, guestId);
		}
		return location.reload();
	}

	return {
		getState: () => ({guestId, isLoading}),
		subscribe,
		initialize: initializeGuest,
		refreshGuest,
	};
}
