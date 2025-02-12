import TempMail from './index.js';

async function example() {
    // Create a new instance with custom configuration (optional)
    const tempMail = new TempMail({
        POLLING_INTERVAL: 10000, // Check every 10 seconds
        MAX_RETRIES: 5 // More retries for reliability
    });
    
    try {
        // Initialize and get temporary email address
        await tempMail.initialize();
        console.log('Your temporary email:', tempMail.email);
        
        // Start monitoring for new messages
        await tempMail.monitorMailbox(async (message) => {
            console.log('\nNew message received:');
            console.log('From:', message.from);
            console.log('Subject:', message.subject);
            
            // Check for confirmation links
            const confirmationLink = tempMail.extractConfirmationLink(message.bodyHtml);
            if (confirmationLink) {
                console.log('Found confirmation link:', confirmationLink);
                // Handle the confirmation link here...
            }
            
            // Custom message processing logic
            if (message.subject.includes('Welcome')) {
                console.log('Processing welcome message...');
                // Add your custom logic here
            }
        });
    } catch (error) {
        if (error.name === 'APIError') {
            console.error('API Error:', error.message, 'Status:', error.statusCode);
        } else {
            console.error('Error:', error.message);
        }
        process.exit(1);
    }
}

// Run the example
example();
