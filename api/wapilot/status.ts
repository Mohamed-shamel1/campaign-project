import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * Vercel Serverless Function: GET /api/wapilot/status
 *
 * This serverless endpoint securely checks the connection with WAPilot API v2
 * using the server-side environment variable WAPILOT_API_KEY.
 * Tokens are never exposed to the client browser.
 */

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const apiKey = process.env.WAPILOT_API_KEY;
  const instanceId = process.env.WAPILOT_INSTANCE_ID || req.query.instanceId;

  if (!apiKey || !instanceId) {
    return res.status(200).json({
      isConnected: false,
      status: 'unconfigured',
      message: 'لم يتم تعيين مفتاح WAPILOT_API_KEY أو WAPILOT_INSTANCE_ID في متغيرات بيئة Vercel.',
    });
  }

  try {
    const baseUrl = process.env.WAPILOT_API_URL || 'https://api.wapilot.net/v2';
    const response = await fetch(`${baseUrl}/instance/${instanceId}/status`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return res.status(200).json({
        isConnected: false,
        status: 'error',
        message: `تعذر الاتصال ببوابة WAPilot (رمز الخطأ: ${response.status})`,
      });
    }

    const data = await response.json();
    return res.status(200).json({
      isConnected: Boolean(data.connected),
      status: data.connected ? 'connected' : 'disconnected',
      message: data.connected ? 'متصل بنجاح مع بوابة WAPilot v2' : 'المثيل غير متصل بواتساب',
    });
  } catch (error: any) {
    return res.status(200).json({
      isConnected: false,
      status: 'network_error',
      message: error?.message || 'خطأ أثناء فحص حالة الاتصال بالخادم.',
    });
  }
}
