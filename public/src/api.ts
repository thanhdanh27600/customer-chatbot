import {BASE_URL} from "./config";
import {Chat} from "./types";

export const getOrg = async (id: string) => {
	const rs = await fetch(`${BASE_URL}/api/org/${id}`);
	const data = await rs.json();
	if (data.error) return null;
	return data;
};

export const getMessages = async (chatId: string, orgId: string) => {
	const rs = await fetch(`${BASE_URL}/api/chat/messages`, {
		method: "POST",
		body: JSON.stringify({
			chatId,
		}),
		headers: {
			"Content-Type": "application/json",
			"Org-Id": orgId,
		},
	});
	const data = await rs.json();
	if (data.error) return null;
	return data;
};

export const getGuest = async (guestId: string) => {
	const rs = await fetch(`${BASE_URL}/api/guest/search`, {
		method: "POST",
		body: JSON.stringify({
			guestId,
		}),
		headers: {
			"Content-Type": "application/json",
		},
	});
	const data = await rs.json();
	if (data.error) return null;
	return data;
};

export const createGuest = async (ipInfo: any) => {
	const rs = await fetch(`${BASE_URL}/api/guest/create`, {
		method: "POST",
		body: JSON.stringify({
			ipInfo,
		}),
		headers: {
			"Content-Type": "application/json",
		},
	});
	const data = await rs.json();
	if (data.error) return null;
	return data;
};

export const searchChat = async ({
	guestId,
	orgId,
}: {
	guestId: string;
	orgId: string;
}) => {
	const rs = await fetch(`${BASE_URL}/api/chat/search`, {
		method: "POST",
		body: JSON.stringify({
			guestId,
		}),
		headers: {
			"Content-Type": "application/json",
			"Org-Id": orgId,
		},
	});
	const data = await rs.json();
	if (data.error) return null;
	return data as Chat;
};

export const openChat = async ({
	guestId,
	orgId,
}: {
	guestId: string;
	orgId: string;
}) => {
	return (await fetch(`${BASE_URL}/api/chat/open-channel`, {
		method: "POST",
		body: JSON.stringify({
			guestId,
		}),
		headers: {
			"Content-Type": "application/json",
			"Org-Id": orgId,
		},
	}).then((res) => res.json())) as Chat;
};
