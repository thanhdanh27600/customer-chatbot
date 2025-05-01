import {pb} from "../pocketbase";
import {collections} from "../pocketbase/utils";
import {Chat, ChatStatus} from "../types/chat.type";

export const fetchChat = async (id: string, {expand}: {expand: string}) => {
	return pb.collection<Chat>(collections.chat).getOne(id, {expand});
};

export const getMessages = async (chatId: string) => {
	return pb.collection("messages").getList(1, 20, {
		filter: `Chat = "${chatId}"`,
		sort: "-created",
	});
};

export const searchGuestChat = async ({
	guestId,
	orgId,
}: {
	guestId: string;
	orgId: string;
}) => {
	return pb
		.collection("chats")
		.getFirstListItem(`Org="${orgId}" && Guest="${guestId}"`);
};

export const openChatChannel = async ({
	guestId,
	orgId,
}: {
	guestId: string;
	orgId: string;
}) => {
	try {
		const existing = await pb
			.collection("chats")
			.getFirstListItem(
				`Org="${orgId}" && Guest="${guestId}" && status="${ChatStatus.open}"`
			);
		if (existing) {
			return existing;
		}
	} catch (error) {}
	return pb.collection("chats").create({
		status: ChatStatus.open,
		Guest: guestId,
		Org: orgId,
		lastActive: new Date(),
	});
};
