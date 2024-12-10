// Initialize the SDK
const givehub = new GiveHub({
  baseUrl: 'https://api.thegivehub.com',
  version: 'v1',
  apiKey: 'your-api-key'
});

// Authentication Examples
async function authExamples() {
  try {
    // Login
    const loginResult = await givehub.auth.login('user@example.com', 'password123');
    console.log('Logged in as:', loginResult.user.username);

    // Register new user
    const userData = {
      email: 'newuser@example.com',
      password: 'securepass123',
      firstName: 'John',
      lastName: 'Doe'
    };
    await givehub.auth.register(userData);
  } catch (error) {
    console.error('Auth error:', error);
  }
}

// Campaign Examples
async function campaignExamples() {
  try {
    // Create campaign
    const campaign = await givehub.campaigns.create({
      title: 'Clean Water Project',
      description: 'Providing clean water access to remote communities',
      targetAmount: 50000,
      category: 'water',
      milestones: [
        {
          description: 'Phase 1: Survey',
          amount: 10000
        }
      ]
    });

    // Upload campaign media
    const mediaFile = new File(['...'], 'campaign-photo.jpg', { type: 'image/jpeg' });
    await givehub.campaigns.uploadMedia(campaign.id, mediaFile);

    // Get campaign list
    const campaigns = await givehub.campaigns.list({
      category: 'water',
      status: 'active',
      page: 1,
      limit: 10
    });
  } catch (error) {
    console.error('Campaign error:', error);
  }
}

// Donation Examples
async function donationExamples() {
  try {
    // Create one-time donation
    const donation = await givehub.donations.create({
      campaignId: 'campaign-id',
      amount: {
        value: 100,
        currency: 'USD'
      },
      type: 'one-time'
    });

    // Create recurring donation
    const recurring = await givehub.donations.createRecurring({
      campaignId: 'campaign-id',
      amount: {
        value: 50,
        currency: 'USD'
      },
      frequency: 'monthly'
    });
  } catch (error) {
    console.error('Donation error:', error);
  }
}

// Impact Tracking Examples
async function impactExamples() {
  try {
    // Create impact metrics
    const metrics = await givehub.impact.createMetrics('campaign-id', {
      metrics: [
        {
          name: 'People Helped',
          value: 500,
          unit: 'individuals'
        },
        {
          name: 'Water Access',
          value: 1000,
          unit: 'liters/day'
        }
      ]
    });

    // Get impact metrics
    const impact = await givehub.impact.getMetrics('campaign-id', {
      from: '2024-01-01',
      to: '2024-12-31'
    });
  } catch (error) {
    console.error('Impact error:', error);
  }
}

// Update Examples
async function updateExamples() {
  try {
    // Create campaign update
    const update = await givehub.updates.create({
      campaignId: 'campaign-id',
      title: 'Construction Progress',
      content: 'We have completed the first phase of well construction.',
      type: 'milestone'
    });

    // Upload update media
    const mediaFile = new File(['...'], 'progress-photo.jpg', { type: 'image/jpeg' });
    await givehub.updates.uploadMedia(update.id, mediaFile);
  } catch (error) {
    console.error('Update error:', error);
  }
}

// Notification Examples
function notificationExamples() {
  // Connect to real-time notifications
  givehub.notifications.connect();

  // Listen for donation notifications
  givehub.notifications.on('donation_received', (notification) => {
    console.log('New donation:', notification.amount);
    updateDonationCounter(notification);
  });

  // Listen for milestone completions
  givehub.notifications.on('milestone_completed', (notification) => {
    console.log('Milestone completed:', notification.milestone);
    updateCampaignProgress(notification);
  });

  // Listen for impact updates
  givehub.notifications.on('impact_verified', (notification) => {
    console.log('Impact verified:', notification.metrics);
    updateImpactDisplay(notification);
  });

  // Clean up on page unload
  window.addEventListener('unload', () => {
    givehub.notifications.disconnect();
  });
}
