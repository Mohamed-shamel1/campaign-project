import { Campaign, WAPilotConfig } from '../types';

/**
 * Service layer for WAPilot API v2 integration.
 * Designed to interface with future Vercel Serverless Functions (/api/wapilot/*)
 * to maintain credential security and avoid exposing API tokens in the browser.
 */

const STORAGE_KEY_CONFIG = 'wapilot_config_v1';

const DEFAULT_CONFIG: WAPilotConfig = {
  apiUrl: 'https://api.wapilot.net/v2',
  instanceId: '',
  isConfigured: false,
  isConnected: false,
  status: 'not_configured',
  statusMessage: 'لم يتم تفعيل ربط WAPilot بعد. يتطلب إعداد خادم Vercel Serverless وتعيين مفتاح API آمن.',
};

export class WAPilotService {
  /**
   * Retrieves the current configuration status.
   * Does NOT return raw tokens or pretend to be connected.
   */
  public static getConfig(): WAPilotConfig {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_CONFIG);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // ignore
    }
    return DEFAULT_CONFIG;
  }

  /**
   * Updates configuration parameters (e.g. instance ID, endpoint URL).
   * Note: Auth token will be stored only in server environment variables once backend is deployed.
   */
  public static saveConfig(partial: Partial<WAPilotConfig>): WAPilotConfig {
    const current = this.getConfig();
    const isConfigured = Boolean(partial.instanceId?.trim());
    const updated: WAPilotConfig = {
      ...current,
      ...partial,
      isConfigured,
      isConnected: false, // Honesty requirement: remains false until real backend ping succeeds
      status: isConfigured ? 'pending_backend' : 'not_configured',
      statusMessage: isConfigured
        ? 'تم حفظ الإعدادات محلياً. بانتظار نشر نقطة النهاية الآمنة (Vercel Serverless Function) لفحص الاتصال الفعلي.'
        : 'الربط غير مكتمل. يرجى إدخال معرف المثيل (Instance ID).',
      lastChecked: new Date().toISOString(),
    };

    localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(updated));
    return updated;
  }

  /**
   * Prepares the payload for future dispatch via serverless function.
   * Validates structure without making unauthorized external calls.
   */
  public static prepareDispatchPayload(campaign: Campaign) {
    const validRecipients = campaign.recipients.filter(r => r.isValid && !r.isDuplicate);

    return {
      campaignId: campaign.id,
      campaignName: campaign.name,
      recipientsCount: validRecipients.length,
      recipients: validRecipients.map(r => ({
        to: r.normalizedPhone,
        name: r.name,
        customParams: r.extraFields,
      })),
      message: {
        text: campaign.messageText,
        hasMedia: Boolean(campaign.media),
        mediaType: campaign.media?.type,
        mediaName: campaign.media?.name,
      },
      dispatchedAt: null, // Pending backend
    };
  }

  /**
   * Checks the health/status through the planned serverless API route.
   */
  public static async checkConnection(): Promise<{ isConnected: boolean; message: string }> {
    // We intentionally return the honest unconfigured status as requested
    return {
      isConnected: false,
      message: 'الخدمة غير متصلة: بانتظار توفير الخادم السحابي الآمن ونقاط نهاية Vercel Functions.',
    };
  }
}

