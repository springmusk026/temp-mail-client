declare class APIError extends Error {
    statusCode: number;
    constructor(message: string, statusCode: number);
}

interface TempMailConfig {
    BASE_URL?: string;
    POLLING_INTERVAL?: number;
    MAX_RETRIES?: number;
    RETRY_DELAY?: number;
    HEADERS?: Record<string, string>;
}

interface Message {
    _id: string;
    from: string;
    subject: string;
    bodyPreview: string;
    bodyHtml: string;
    [key: string]: any;
}

interface MailboxResponse {
    token: string;
    mailbox: string;
}

interface MessagesResponse {
    mailbox: string;
    messages: Message[];
}

declare class TempMail {
    constructor(config?: TempMailConfig);
    
    /**
     * Initialize mailbox and get token
     */
    initialize(): Promise<void>;
    
    /**
     * Get messages from mailbox
     */
    getMessages(): Promise<MessagesResponse>;
    
    /**
     * Read a specific message
     */
    readMail(messageId: string): Promise<Message>;
    
    /**
     * Extract confirmation link from HTML body
     */
    extractConfirmationLink(htmlBody: string): string | null;
    
    /**
     * Start monitoring mailbox for new messages
     */
    monitorMailbox(callback: (message: Message) => Promise<void>): Promise<void>;
    
    /**
     * Get current mailbox address
     */
    get email(): string | null;
}

export { TempMail as default, APIError, TempMailConfig, Message, MailboxResponse, MessagesResponse };
