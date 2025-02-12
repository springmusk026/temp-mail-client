# TempMail API Client

A robust Node.js client for interacting with the temp-mail.org service. This client provides an object-oriented interface for creating temporary email addresses and monitoring incoming messages.

## Features

- 🚀 Easy-to-use API for temporary email management
- ⚡ Real-time message monitoring
- 🔄 Automatic retry mechanism with exponential backoff
- 🛡️ Comprehensive error handling
- 📝 Support for HTML message parsing
- 🎯 Configurable settings
- 📦 Can be used as a module or standalone script

## Installation

```bash
npm install temp-mail-client
```

## Quick Start

```javascript
const TempMail = require('./index.js');

async function example() {
    const tempMail = new TempMail();
    
    try {
        // Initialize and create a temporary mailbox
        await tempMail.initialize();
        console.log('Temporary email:', tempMail.mailbox);
        
        // Start monitoring for new messages
        await tempMail.monitorMailbox(async (message) => {
            console.log('New message received:', message.subject);
        });
    } catch (error) {
        console.error('Error:', error.message);
    }
}

example();
```

## API Documentation

### Class: TempMail

#### Constructor

```javascript
const tempMail = new TempMail(config);
```

Parameters:
- `config` (optional): Configuration object to override default settings

#### Configuration Options

```javascript
{
    BASE_URL: 'https://web2.temp-mail.org',
    POLLING_INTERVAL: 5000, // 5 seconds
    MAX_RETRIES: 3,
    RETRY_DELAY: 1000, // 1 second
    HEADERS: { ... } // Custom headers
}
```

#### Methods

##### initialize()
Creates a new temporary mailbox and obtains authentication token.

```javascript
await tempMail.initialize();
```

##### getMessages()
Retrieves all messages from the mailbox.

```javascript
const messages = await tempMail.getMessages();
```

##### readMail(messageId)
Retrieves a specific message by ID.

```javascript
const message = await tempMail.readMail('message-id');
```

##### monitorMailbox(callback)
Starts monitoring the mailbox for new messages.

```javascript
await tempMail.monitorMailbox(async (message) => {
    console.log('New message:', message);
});
```

Parameters:
- `callback`: Function to be called for each new message

##### extractConfirmationLink(htmlBody)
Extracts confirmation links from HTML email content.

```javascript
const link = tempMail.extractConfirmationLink(message.bodyHtml);
```

## Advanced Usage

### Custom Configuration

```javascript
const customConfig = {
    POLLING_INTERVAL: 10000, // Check every 10 seconds
    MAX_RETRIES: 5, // More retries
    RETRY_DELAY: 2000 // Longer delay between retries
};

const tempMail = new TempMail(customConfig);
```

### Message Processing Example

```javascript
const tempMail = new TempMail();
await tempMail.initialize();

await tempMail.monitorMailbox(async (message) => {
    // Process message content
    console.log('From:', message.from);
    console.log('Subject:', message.subject);
    
    // Extract confirmation link if present
    const link = tempMail.extractConfirmationLink(message.bodyHtml);
    if (link) {
        console.log('Found confirmation link:', link);
        // Process the link...
    }
});
```

### Error Handling

```javascript
try {
    const tempMail = new TempMail();
    await tempMail.initialize();
} catch (error) {
    if (error.name === 'APIError') {
        console.error('API Error:', error.message, 'Status:', error.statusCode);
    } else {
        console.error('General Error:', error.message);
    }
}
```

## Error Types

### APIError
Thrown when the API returns an error response.
- Properties:
  - `message`: Error description
  - `statusCode`: HTTP status code
  - `name`: Always 'APIError'

## Development

### Project Structure

```
.
├── index.js     # Main implementation
└── README.md    # Documentation
```

### Running Tests

```bash
npm test
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [temp-mail.org](https://temp-mail.org/) for providing the temporary email service
- [Cheerio](https://github.com/cheeriojs/cheerio) for HTML parsing capabilities

## Support

For support, please open an issue in the GitHub repository.
