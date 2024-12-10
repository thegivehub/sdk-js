# The Give Hub JavaScript SDK Documentation

## Overview
The GiveHub JavaScript SDK provides a simple and intuitive way to interact with The Give Hub API. It includes support for campaign management, donations, impact tracking, and real-time notifications.

## Installation

```bash
npm install givehub-sdk
```

Or using yarn:
```bash
yarn add givehub-sdk
```

## Quick Start

```javascript
import { GiveHub } from 'givehub-sdk';

// Initialize the SDK
const givehub = new GiveHub({
    baseUrl: 'https://api.thegivehub.com',
    version: 'v1',
    apiKey: 'your-api-key'
});

// Use the SDK
async function init() {
    try {
        const campaigns = await givehub.campaigns.list();
        console.log('Active campaigns:', campaigns);
    } catch (error) {
        console.error('Error:', error);
    }
}
```

## Authentication

### Login
```javascript
const result = await givehub.auth.login(email, password);
// SDK automatically handles token management
```

### Register
```javascript
const userData = {
    email: 'user@example.com',
    password: 'secure123',
    firstName: 'John',
    lastName: 'Doe'
};
await givehub.auth.register(userData);
```

### Verify Email
```javascript
await givehub.auth.verifyEmail(email, verificationCode);
```

## Campaign Management

### Create Campaign
```javascript
const campaign = await givehub.campaigns.create({
    title: 'Clean Water Project',
    description: 'Providing clean water access',
    targetAmount: 50000,
    category: 'water',
    milestones: [{
        description: 'Phase 1',
        amount: 10000
    }]
});
```

### Get Campaign Details
```javascript
const campaign = await givehub.campaigns.get(campaignId);
```

### List Campaigns
```javascript
const campaigns = await givehub.campaigns.list({
    category: 'water',
    status: 'active',
    page: 1,
    limit: 10
});
```

### Update Campaign
```javascript
await givehub.campaigns.update(campaignId, {
    title: 'Updated Title',
    description: 'Updated description'
});
```

### Upload Media
```javascript
await givehub.campaigns.uploadMedia(campaignId, file);
```

## Donations

### Create Donation
```javascript
const donation = await givehub.donations.create({
    campaignId: 'campaign-id',
    amount: {
        value: 100,
        currency: 'USD'
    },
    type: 'one-time'
});
```

### Create Recurring Donation
```javascript
const recurring = await givehub.donations.createRecurring({
    campaignId: 'campaign-id',
    amount: {
        value: 50,
        currency: 'USD'
    },
    frequency: 'monthly'
});
```

### Get Donations
```javascript
const donations = await givehub.donations.getDonations({
    campaignId: 'campaign-id',
    status: 'completed'
});
```

### Cancel Recurring Donation
```javascript
await givehub.donations.cancelRecurring(subscriptionId);
```

## Impact Metrics

### Create Metrics
```javascript
const metrics = await givehub.impact.createMetrics(campaignId, {
    metrics: [{
        name: 'People Helped',
        value: 500,
        unit: 'individuals'
    }]
});
```

### Update Metrics
```javascript
await givehub.impact.updateMetrics(metricId, {
    value: 600,
    verificationMethod: 'survey'
});
```

### Get Metrics
```javascript
const impact = await givehub.impact.getMetrics(campaignId, {
    from: '2024-01-01',
    to: '2024-12-31'
});
```

## Campaign Updates

### Create Update
```javascript
const update = await givehub.updates.create({
    campaignId: 'campaign-id',
    title: 'Progress Update',
    content: 'Project milestone achieved',
    type: 'milestone'
});
```

### Get Updates
```javascript
const updates = await givehub.updates.getUpdates({
    campaignId: 'campaign-id',
    type: 'milestone'
});
```

### Upload Update Media
```javascript
await givehub.updates.uploadMedia(updateId, file);
```

## Real-time Notifications

### Connect to Notifications
```javascript
const notifications = givehub.notifications;

// Connect
notifications.connect();

// Listen for events
notifications.on('donation_received', (notification) => {
    console.log('New donation:', notification);
});

notifications.on('milestone_completed', (notification) => {
    console.log('Milestone completed:', notification);
});

// Disconnect when done
notifications.disconnect();
```

## Error Handling

The SDK throws `GiveHubException` for API errors:

```javascript
try {
    await givehub.campaigns.create(campaignData);
} catch (error) {
    if (error.status === 401) {
        // Handle authentication error
    } else if (error.status === 400) {
        // Handle validation error
    } else {
        // Handle other errors
    }
}
```

## Types

### Campaign
```typescript
interface Campaign {
    id: string;
    title: string;
    description: string;
    targetAmount: number;
    currentAmount: number;
    category: string;
    status: 'draft' | 'active' | 'completed' | 'suspended';
    milestones: Milestone[];
    created: string;
    updated: string;
}
```

### Donation
```typescript
interface Donation {
    id: string;
    campaignId: string;
    amount: {
        value: number;
        currency: string;
    };
    type: 'one-time' | 'recurring';
    status: 'pending' | 'completed' | 'failed';
    transaction: {
        id: string;
        status: string;
    };
    created: string;
}
```

### Impact Metric
```typescript
interface ImpactMetric {
    name: string;
    value: number;
    unit: string;
    verificationMethod?: string;
    verifiedAt?: string;
    verifiedBy?: string;
}
```

## Configuration Options

```javascript
{
    baseUrl: string;            // API base URL
    version: string;            // API version
    apiKey: string;            // Your API key
    timeout: number;           // Request timeout (ms)
    retryAttempts: number;     // Number of retry attempts
    debug: boolean;            // Enable debug logging
}
```

## Best Practices

1. **Token Management**: The SDK automatically handles token refresh. Store tokens securely in your application.

2. **Error Handling**: Always wrap SDK calls in try-catch blocks for proper error handling.

3. **Resource Cleanup**: Disconnect from notifications when they're no longer needed.

4. **Rate Limiting**: The SDK implements automatic rate limiting. Configure retry attempts based on your needs.

5. **File Uploads**: Use appropriate file types and sizes for media uploads.

## Examples

### Complete Campaign Flow
```javascript
async function manageCampaign() {
    try {
        // Create campaign
        const campaign = await givehub.campaigns.create({
            title: 'Water Project',
            targetAmount: 50000
        });

        // Upload media
        await givehub.campaigns.uploadMedia(
            campaign.id,
            document.querySelector('input[type="file"]').files[0]
        );

        // Track impact
        await givehub.impact.createMetrics(campaign.id, {
            metrics: [{
                name: 'Wells Built',
                value: 1,
                unit: 'wells'
            }]
        });

        // Post update
        await givehub.updates.create({
            campaignId: campaign.id,
            title: 'First Well Complete',
            content: 'We've completed the first well!'
        });
    } catch (error) {
        console.error('Campaign management failed:', error);
    }
}
```

### Handling Donations
```javascript
async function processDonation(campaignId, amount) {
    try {
        // Create donation
        const donation = await givehub.donations.create({
            campaignId,
            amount: {
                value: amount,
                currency: 'USD'
            }
        });

        // Track transaction
        const transaction = await givehub.donations.getTransaction(
            donation.transaction.id
        );

        // Show confirmation
        if (transaction.status === 'completed') {
            showSuccess('Donation successful!');
        }
    } catch (error) {
        console.error('Donation failed:', error);
    }
}
```

## Debugging

Enable debug mode to see detailed logs:

```javascript
const givehub = new GiveHub({
    debug: true,
    // other config...
});
```

## Support

- Documentation: [https://docs.thegivehub.com](https://docs.thegivehub.com)
- GitHub Issues: [https://github.com/thegivehub/sdk-js/issues](https://github.com/thegivehub/sdk-js/issues)
- Email: support@thegivehub.com
