// givehub-sdk.js

/**
 * GiveHub SDK for JavaScript
 * @version 1.0.0
 */

class GiveHubSDK {
  constructor(config = {}) {
    this.baseUrl = config.baseUrl || 'https://api.thegivehub.com';
    this.version = config.version || 'v1';
    this.apiKey = config.apiKey;
    this.accessToken = null;
    this.refreshToken = null;
    
    // Initialize sub-modules
    this.auth = new AuthModule(this);
    this.campaigns = new CampaignModule(this);
    this.donations = new DonationModule(this);
    this.impact = new ImpactModule(this);
    this.updates = new UpdateModule(this);
    this.notifications = new NotificationModule(this);
  }

  /**
   * Make an authenticated API request
   * @private
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}/${this.version}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      'X-API-Key': this.apiKey,
      ...options.headers
    };

    if (this.accessToken) {
      headers.Authorization = `Bearer ${this.accessToken}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers
      });

      if (!response.ok) {
        if (response.status === 401 && this.refreshToken) {
          // Token expired, try to refresh
          await this.auth.refreshAccessToken();
          // Retry request with new token
          return this.request(endpoint, options);
        }
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }
}

/**
 * Authentication Module
 */
class AuthModule {
  constructor(sdk) {
    this.sdk = sdk;
  }

  async login(email, password) {
    const response = await this.sdk.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });

    if (response.success) {
      this.sdk.accessToken = response.tokens.accessToken;
      this.sdk.refreshToken = response.tokens.refreshToken;
    }

    return response;
  }

  async register(userData) {
    return this.sdk.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  }

  async verifyEmail(email, code) {
    return this.sdk.request('/auth/verify', {
      method: 'POST',
      body: JSON.stringify({ email, code })
    });
  }

  async refreshAccessToken() {
    const response = await this.sdk.request('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken: this.sdk.refreshToken })
    });

    if (response.success) {
      this.sdk.accessToken = response.accessToken;
    }

    return response;
  }

  logout() {
    this.sdk.accessToken = null;
    this.sdk.refreshToken = null;
  }
}

/**
 * Campaign Module
 */
class CampaignModule {
  constructor(sdk) {
    this.sdk = sdk;
  }

  async create(campaignData) {
    return this.sdk.request('/campaigns', {
      method: 'POST',
      body: JSON.stringify(campaignData)
    });
  }

  async get(campaignId) {
    return this.sdk.request(`/campaigns/${campaignId}`);
  }

  async list(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.sdk.request(`/campaigns?${queryString}`);
  }

  async update(campaignId, updateData) {
    return this.sdk.request(`/campaigns/${campaignId}`, {
      method: 'PUT',
      body: JSON.stringify(updateData)
    });
  }

  async uploadMedia(campaignId, file) {
    const formData = new FormData();
    formData.append('media', file);

    return this.sdk.request(`/campaigns/${campaignId}/media`, {
      method: 'POST',
      body: formData,
      headers: {
        // Let browser set correct content type for form data
        'Content-Type': undefined
      }
    });
  }

  async getMilestones(campaignId) {
    return this.sdk.request(`/campaigns/${campaignId}/milestones`);
  }

  async updateMilestone(campaignId, milestoneId, data) {
    return this.sdk.request(`/campaigns/${campaignId}/milestones/${milestoneId}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }
}

/**
 * Donation Module
 */
class DonationModule {
  constructor(sdk) {
    this.sdk = sdk;
  }

  async create(donationData) {
    return this.sdk.request('/donations', {
      method: 'POST',
      body: JSON.stringify(donationData)
    });
  }

  async getDonations(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.sdk.request(`/donations?${queryString}`);
  }

  async getTransaction(txId) {
    return this.sdk.request(`/donations/transactions/${txId}`);
  }

  async createRecurring(donationData) {
    return this.sdk.request('/donations/recurring', {
      method: 'POST',
      body: JSON.stringify(donationData)
    });
  }

  async cancelRecurring(subscriptionId) {
    return this.sdk.request(`/donations/recurring/${subscriptionId}`, {
      method: 'DELETE'
    });
  }
}

/**
 * Impact Module
 */
class ImpactModule {
  constructor(sdk) {
    this.sdk = sdk;
  }

  async createMetrics(campaignId, metricsData) {
    return this.sdk.request(`/impact/metrics`, {
      method: 'POST',
      body: JSON.stringify({
        campaignId,
        ...metricsData
      })
    });
  }

  async updateMetrics(metricId, updateData) {
    return this.sdk.request(`/impact/metrics/${metricId}`, {
      method: 'PUT',
      body: JSON.stringify(updateData)
    });
  }

  async getMetrics(campaignId, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.sdk.request(`/impact/metrics/${campaignId}?${queryString}`);
  }

  async verifyMetric(metricId, verificationData) {
    return this.sdk.request(`/impact/metrics/${metricId}/verify`, {
      method: 'POST',
      body: JSON.stringify(verificationData)
    });
  }
}

/**
 * Update Module
 */
class UpdateModule {
  constructor(sdk) {
    this.sdk = sdk;
  }

  async create(updateData) {
    return this.sdk.request('/updates', {
      method: 'POST',
      body: JSON.stringify(updateData)
    });
  }

  async getUpdates(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.sdk.request(`/updates?${queryString}`);
  }

  async uploadMedia(updateId, file) {
    const formData = new FormData();
    formData.append('media', file);

    return this.sdk.request(`/updates/${updateId}/media`, {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': undefined
      }
    });
  }
}

/**
 * Notification Module
 */
class NotificationModule {
  constructor(sdk) {
    this.sdk = sdk;
    this.socket = null;
    this.listeners = new Map();
  }

  async getNotifications(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.sdk.request(`/notifications?${queryString}`);
  }

  connect() {
    if (!this.sdk.accessToken) {
      throw new Error('Authentication required for notifications');
    }

    const wsUrl = this.sdk.baseUrl.replace(/^http/, 'ws');
    this.socket = new WebSocket(`${wsUrl}/notifications`);

    this.socket.onopen = () => {
      this.socket.send(JSON.stringify({
        type: 'auth',
        token: this.sdk.accessToken
      }));
    };

    this.socket.onmessage = (event) => {
      const notification = JSON.parse(event.data);
      if (this.listeners.has(notification.type)) {
        this.listeners.get(notification.type).forEach(callback => {
          callback(notification);
        });
      }
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }

  on(eventType, callback) {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set());
    }
    this.listeners.get(eventType).add(callback);
  }

  off(eventType, callback) {
    if (this.listeners.has(eventType)) {
      this.listeners.get(eventType).delete(callback);
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }
}

// Export the SDK
if (typeof window !== 'undefined') {
  window.GiveHub = GiveHubSDK;
} else {
  module.exports = GiveHubSDK;
}
