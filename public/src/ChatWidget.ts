// src/ChatWidget.ts
import {getMessages, getOrg, openChat, searchChat} from "./api";
import {BASE_URL} from "./config";
import {createGuestHook, GuestHook} from "./guest";
import RichTextRenderer from "./RichText";
import {
	Chat,
	ChatStatus,
	ChatWidgetConfig,
	ChatWidgetState,
	Message,
	UserRole,
} from "./types";
import {formatDate, svgIcons} from "./utils";

export class ChatWidget {
	private config: Required<ChatWidgetConfig>;
	private state: ChatWidgetState;
	private container: HTMLDivElement = document.createElement("div");
	private messagesContainer: HTMLDivElement = document.createElement("div");
	private button: HTMLButtonElement = document.createElement("button");
	private buttonIcon: HTMLDivElement = document.createElement("div");
	private dialog: HTMLDivElement = document.createElement("div");
	private sendButton: HTMLButtonElement = document.createElement("button");
	private inputField: HTMLInputElement = document.createElement("input");
	private chat: Chat | null = null;
	private guest: GuestHook;
	private richtext = new RichTextRenderer();

	constructor(options: ChatWidgetConfig = {}) {
		// Default configuration with type assertion
		this.config = {
			orgId: options.orgId || "",
			companyName: options.companyName || "Support Chat",
			initialMessage: options.initialMessage || "How can we help you today?",
			primaryColor: options.primaryColor || "#3b82f6",
			secondaryColor: options.secondaryColor || "#dff2fe",
			borderRadius: options.borderRadius || "12px",
			isFullHeight: options.isFullHeight || false,
		};

		// Initialize state
		this.state = {
			loading: true,
			isOpen: false,
			messages: [],
			lastMessageLoading: "",
		};

		this.guest = createGuestHook();
		this.guest.initialize().then(() => {
			this.getRemoteConfig();
		});
		window.addEventListener("resize", this.setDialogWidth);
	}

	private async getRemoteConfig() {
		try {
			if (!this.config.orgId) throw new Error("No orgId provided");
			const data = await getOrg(this.config.orgId);
			this.config = {
				...this.config,
				...data.chat_config,
				companyName: data.chat_name,
				initialMessage: data.initial_message,
			};

			const guestId = this.guest.getState().guestId;
			if (!guestId) throw new Error("No guestId found");
			const chat = await searchChat({guestId, orgId: this.config.orgId});

			if (!chat?.id) throw new Error("No chat found");
			if (chat.status === ChatStatus.closed) {
				this.guest.refreshGuest();
				return;
			}
			const messages = await getMessages(chat.id, this.config.orgId);
			if (!messages) throw new Error("No messages found");
			this.state.messages = messages.items.reverse() as Message[];
			this.chat = chat as Chat;
		} catch (error) {
			console.log(error);
		}

		this.state.loading = false;
		// Create and initialize widget
		this.createWidget();
		this.attachEventListeners();
	}

	private createWidget(): void {
		if (this.state.loading) return;
		// Create main container
		this.container = document.createElement("div");
		this.container.id = "chat-widget";
		this.container.style.position = "fixed";
		this.container.style.zIndex = "1000";
		document.body.appendChild(this.container);

		// Render button
		this.renderButton();
		// Render dialog (hidden by default)
		this.renderDialog();
	}

	private renderButton(): void {
		this.button = document.createElement("button");
		this.button.setAttribute("aria-label", "Open Chat");
		this.button.style.cssText = `
      position: fixed;
      bottom: 16px;
      right: 16px;
      width: 62px;
      height: 62px;
      border-radius: 50%;
      background-color: ${this.config.primaryColor};
      color: white;
      border: none;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.3s;
    `;

		this.buttonIcon = document.createElement("div");
		this.buttonIcon.style.cssText = `
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
    `;
		this.buttonIcon.innerHTML = svgIcons.messageCircle;
		this.button.appendChild(this.buttonIcon);

		this.container.appendChild(this.button);
	}

	private setDialogWidth = () => {
		if (window.innerWidth <= 600) {
			this.dialog.style.width = "100vw";
			this.dialog.style.right = "0px";
			this.dialog.style.left = "0px";
			this.dialog.style.bottom = "12px";
			this.dialog.style.maxWidth = "unset";
		} else {
			this.dialog.style.width = "400px";
			this.dialog.style.right = "16px";
			this.dialog.style.bottom = "12px";
			this.dialog.style.left = "auto";
			this.dialog.style.maxWidth = "90vw";
		}
	};

	private renderDialog(): void {
		this.dialog = document.createElement("div");
		this.dialog.style.cssText = `
            display: none;
            position: fixed;
            background: white;
            border-radius: ${this.config.borderRadius}px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            flex-direction: column;
        `;
		this.setDialogWidth();

		// Dialog Header
		const header = document.createElement("div");
		header.style.cssText = `
            padding: 16px;
            background-color: ${this.config.primaryColor};
            color: white;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-top-left-radius: ${this.config.borderRadius}px;
            border-top-right-radius: ${this.config.borderRadius}px;
        `;

		const titleEl = document.createElement("h2");
		titleEl.textContent = this.config.companyName;
		titleEl.style.margin = "0";
		titleEl.style.fontSize = "20px";
		titleEl.style.fontWeight = "600";
		titleEl.style.color = "white";
		titleEl.style.paddingTop = "4px";
		titleEl.style.paddingBottom = "4px";

		const closeBtn = document.createElement("button");
		closeBtn.innerHTML = svgIcons.x;
		closeBtn.style.background = "transparent";
		closeBtn.style.border = "none";
		closeBtn.style.color = "white";
		closeBtn.style.cursor = "pointer";
		closeBtn.style.width = "32px";
		closeBtn.style.height = "32px";

		header.appendChild(titleEl);
		header.appendChild(closeBtn);

		// Messages Container
		this.messagesContainer = document.createElement("div");
		this.messagesContainer.style.cssText = `
            flex-grow: 1;
            overflow-y: auto;
            padding: 16px;
            height: ${
							this.config.isFullHeight
								? "calc(90vh - 192px)"
								: "calc(60vh - 192px)"
						};
            display: flex;
            flex-direction: column;
            scrollbar-width: none;
            -ms-overflow-style: none;
        `;

		// Input Area
		const inputContainer = document.createElement("div");
		inputContainer.style.cssText = `
            display: flex;
            padding: 16px;
            border-top: 1px solid ${this.config.primaryColor};
        `;

		this.inputField = document.createElement("input");
		this.inputField.type = "text";
		this.inputField.placeholder = "Type your message...";
		this.inputField.style.cssText = `
            flex-grow: 1;
            padding-top: 8px;
			padding-bottom: 8px;
            padding-left: 16px;
            padding-right: 16px;
			outline-width: 0px;
            border: 1px solid #ccc;
            border-radius: 20px;
            margin-right: 8px;
        `;

		this.sendButton = document.createElement("button");
		this.sendButton.innerHTML = svgIcons.sendHorizontal;
		this.sendButton.style.cssText = `
            background-color: ${this.config.primaryColor};
            color: white;
            border: none;
            border-radius: 50%;
            padding: 12px;
            cursor: pointer;
            width: 42px;
            height: 42px;
            display: flex;
            align-items: center;
            justify-content: center;
        `;

		inputContainer.appendChild(this.inputField);
		inputContainer.appendChild(this.sendButton);

		this.dialog.appendChild(header);
		this.dialog.appendChild(this.messagesContainer);
		this.dialog.appendChild(inputContainer);

		this.container.appendChild(this.dialog);
	}

	private attachEventListeners(): void {
		// Toggle chat widget
		this.button.addEventListener("click", () => {
			this.state.isOpen = !this.state.isOpen;
			this.updateWidgetState();
		});

		// Close button in dialog
		this.dialog.querySelector("button")?.addEventListener("click", () => {
			this.state.isOpen = false;
			this.updateWidgetState();
		});

		// Send message
		this.sendButton.addEventListener("click", () => this.sendMessage());
		this.inputField.addEventListener("keypress", (e) => {
			if (e.key === "Enter") this.sendMessage();
		});
	}

	private updateWidgetState(): void {
		this.buttonIcon.innerHTML = this.state.isOpen
			? svgIcons.x
			: svgIcons.messageCircle;

		this.dialog.style.display = this.state.isOpen ? "flex" : "none";
		this.renderMessages();
	}

	private async sendMessage() {
		if (!!this.state.lastMessageLoading) return;
		const messageText = this.inputField.value.trim();
		if (!messageText) return;
		const id = Date.now().toString();
		this.state.lastMessageLoading = id;
		this.state.messages.push({
			id,
			role: UserRole.CLIENT,
			body: messageText,
		});

		this.inputField.value = "";
		this.renderMessages();
		const guestId = this.guest.getState().guestId;

		if (!guestId) throw new Error("Your guest data is invalid.");
		let chatChannel = this.chat;
		if (!chatChannel) {
			chatChannel = await openChat({guestId, orgId: this.config.orgId});
			this.chat = chatChannel;
		}

		await this.sendMessageToBackend({
			message: messageText,
			chatId: chatChannel.id,
			guestId,
		});
	}

	private renderMessages(): void {
		// Clear existing messages
		this.messagesContainer.innerHTML = "";

		// Show initial message if no messages
		if (this.state.messages.length === 0) {
			const initialMsg = document.createElement("div");
			initialMsg.textContent = this.config.initialMessage;
			initialMsg.style.cssText = `
                text-align: center;
                color: ${this.config.primaryColor};
                font-style: italic;
                padding: 16px;
            `;
			this.messagesContainer.appendChild(initialMsg);
		}

		// Render messages
		this.state.messages.forEach((msg) => {
			const msgEl = document.createElement("div");
			// msgEl.textContent = msg.body;
			msgEl.style.cssText = `
			    max-width: 80%;
			    margin: 8px 0;
			    padding: 12px;
			    border-radius: 8px;
			    background-color: ${
						msg.role === "client" ? this.config.secondaryColor : "#f1f1f1"
					};
			    align-self: ${msg.role === "client" ? "flex-end" : "flex-start"};
				opacity: ${this.state.lastMessageLoading === msg.id ? "0.5" : "1"};
				white-space: break-spaces;
			`;

			const p = document.createElement("p");
			p.textContent = formatDate(msg.created) || "just now";

			p.style.fontSize = "10px";
			p.style.color = "#9ca3af";
			p.style.transform = "translateY(-4px)";
			p.style.height = "12px";
			p.style.margin = "0px";
			p.style.marginBottom = "2px";

			msgEl.appendChild(p);

			msgEl.innerHTML += this.richtext.render(msg.body);
			this.messagesContainer.appendChild(msgEl);
		});

		// Scroll to bottom
		this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
	}
	private async sendMessageToBackend({
		message,
		guestId,
		chatId,
	}: {
		message: string;
		guestId: string;
		chatId: string;
	}) {
		console.log("Sending message:", message);

		const rs = await fetch(`${BASE_URL}/api/chat/send-message`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"Org-Id": this.config.orgId,
			},
			body: JSON.stringify({
				message,
				guestId,
				chatId,
				role: UserRole.CLIENT,
			}),
		}).then((response) => response.json());

		// Placeholder for backend communication
		this.state.messages.push({
			id: Date.now().toString(),
			role: UserRole.AI_BOT,
			body: rs.response,
		});
		this.state.lastMessageLoading = "";
		this.renderMessages();
	}
}
