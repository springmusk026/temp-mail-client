import cheerio from 'cheerio';

/**
 * @typedef {import('./index').TempMailConfig} TempMailConfig
 * @typedef {import('./index').Message} Message
 * @typedef {import('./index').MailboxResponse} MailboxResponse
 * @typedef {import('./index').MessagesResponse} MessagesResponse
 */

const DEFAULT_CONFIG = {
    BASE_URL: 'https://web2.temp-mail.org',
    POLLING_INTERVAL: 5000,
    MAX_RETRIES: 3,
    RETRY_DELAY: 1000,
    HEADERS: {
        "accept": "*/*",
        "accept-language": "en-US,en;q=0.6",
        "content-type": "application/json",
        "priority": "u=1, i",
        "sec-ch-ua": "\"Not(A:Brand\";v=\"99\", \"Brave\";v=\"133\", \"Chromium\";v=\"133\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"Windows\"",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site",
        "sec-gpc": "1",
        "Referer": "https://temp-mail.org/",
        "Referrer-Policy": "strict-origin-when-cross-origin",
    }
};

export class APIError extends Error {
    /**
     * @param {string} message 
     * @param {number} statusCode 
     */
    constructor(message, statusCode) {
        super(message);
        this.name = 'APIError';
        this.statusCode = statusCode;
    }
}

export default class TempMail {
    #config;
    #token = null;
    #mailbox = null;

    /**
     * @param {TempMailConfig} [config] 
     */
    constructor(config = {}) {
        this.#config = { ...DEFAULT_CONFIG, ...config };
    }

    /**
     * Get current mailbox address
     * @returns {string|null}
     */
    get email() {
        return this.#mailbox;
    }

    /**
     * Retry a function with exponential backoff
     * @template T
     * @param {() => Promise<T>} fn 
     * @param {number} [retries] 
     * @returns {Promise<T>}
     */
    async #retry(fn, retries = this.#config.MAX_RETRIES) {
        for (let i = 0; i < retries; i++) {
            try {
                return await fn();
            } catch (error) {
                if (i === retries - 1) throw error;
                await new Promise(resolve => 
                    setTimeout(resolve, this.#config.RETRY_DELAY * Math.pow(2, i))
                );
            }
        }
    }

    /**
     * Make an API request
     * @template T
     * @param {string} endpoint 
     * @param {RequestInit} [options] 
     * @returns {Promise<T>}
     */
    async #makeRequest(endpoint, options = {}) {
        const headers = { ...this.#config.HEADERS };
        if (this.#token) {
            headers.authorization = `Bearer ${this.#token}`;
        }

        const response = await fetch(`${this.#config.BASE_URL}${endpoint}`, {
            ...options,
            headers: { ...headers, ...options.headers },
        });

        const data = await response.json();

        if (!response.ok) {
            throw new APIError(data.errorMessage || 'API request failed', response.status);
        }

        return data;
    }

    /**
     * Initialize mailbox and get token
     * @returns {Promise<void>}
     */
    async initialize() {
        try {
            /** @type {MailboxResponse} */
            const data = await this.#retry(() => 
                this.#makeRequest('/mailbox', { method: 'POST' })
            );

            this.#token = data.token;
            this.#mailbox = data.mailbox;

            if (!this.#token || !this.#mailbox) {
                throw new Error('Failed to initialize mailbox');
            }
        } catch (error) {
            console.error('Initialization failed:', error.message);
            throw error;
        }
    }

    /**
     * Get messages from mailbox
     * @returns {Promise<MessagesResponse>}
     */
    async getMessages() {
        if (!this.#token) {
            throw new Error('Not initialized. Call initialize() first.');
        }

        return this.#retry(() => 
            this.#makeRequest('/messages')
        );
    }

    /**
     * Read a specific message
     * @param {string} messageId 
     * @returns {Promise<Message>}
     */
    async readMail(messageId) {
        if (!this.#token) {
            throw new Error('Not initialized. Call initialize() first.');
        }
        if (!messageId) {
            throw new Error('Message ID is required');
        }

        return this.#retry(() => 
            this.#makeRequest(`/messages/${messageId}`)
        );
    }

    /**
     * Extract confirmation link from HTML body
     * @param {string} htmlBody 
     * @returns {string|null}
     */
    extractConfirmationLink(htmlBody) {
        try {
            const $ = cheerio.load(htmlBody);
            return $('span a').attr('href') || null;
        } catch (error) {
            console.error('Failed to parse HTML:', error.message);
            return null;
        }
    }

    /**
     * Start monitoring mailbox for new messages
     * @param {(message: Message) => Promise<void>} callback 
     * @returns {Promise<void>}
     */
    async monitorMailbox(callback) {
        if (!this.#token) {
            throw new Error('Not initialized. Call initialize() first.');
        }

        while (true) {
            try {
                const messages = await this.getMessages();
                
                for (const message of messages.messages) {
                    console.log(`From: ${message.from}`);
                    console.log(`Subject: ${message.subject}`);
                    console.log(`Preview: ${message.bodyPreview}`);

                    const fullMessage = await this.readMail(message._id);
                    if (callback && typeof callback === 'function') {
                        await callback(fullMessage);
                    }

                    const confirmationLink = this.extractConfirmationLink(fullMessage.bodyHtml);
                    if (confirmationLink) {
                        console.log('Confirmation Link:', confirmationLink);
                    }
                }

                await new Promise(resolve => 
                    setTimeout(resolve, this.#config.POLLING_INTERVAL)
                );
            } catch (error) {
                console.error('Error while monitoring mailbox:', error.message);
                await new Promise(resolve => 
                    setTimeout(resolve, this.#config.RETRY_DELAY)
                );
            }
        }
    }
}
