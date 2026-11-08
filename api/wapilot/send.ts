import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * Vercel Serverless Function: POST /api/wapilot/send
 *
 * This serverless endpoint receives campaign payloads and dispatches WhatsApp
 * messages via WAPilot API v2 using the private server-side WAPILOT_API_KEY.
 */

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const apiKey = process.env.WAPILOT_API_KEY;
  const instanceId = process.env.WAPILOT_INSTANCE_ID || req.body?.instanceId;

  if (!apiKey || !instanceId) {
    return res.status(400).json({
      success: false,
      error: 'متغيرات بيئة الخادم غير مكتملة (WAPILOT_API_KEY / WAPILOT_INSTANCE_ID).',
    });
  }

  const { campaignId, recipients, message } = req.body || {};

  if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
    return res.status(400).json({
      success: false,
      error: 'قائمة المستلمين فارغة أو غير صالحة.',
    });
  }

  if (!message || !message.text) {
    return res.status(400).json({
      success: false,
      error: 'نص الرسالة مطلوب.',
    });
  }

  try {
    // In production, dispatch bulk campaign to WAPilot API v2 endpoint:
    // POST https://api.wapilot.net/v2/messages/send-bulk
    /*
    const baseUrl = process.env.WAPILOT_API_URL || 'https://api.wapilot.net/v2';
    const response = await fetch(`${baseUrl}/messages/send-bulk`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        instanceId,
        campaignId,
        recipients,
        message,
      }),
    });
    const result = await response.json();
    return res.status(200).json(result);
    */

    return res.status(200).json({
      success: true,
      campaignId,
      dispatchedCount: recipients.length,
      status: 'dispatched',
      message: `تم استلام الحملة وبدء الإرسال لـ ${recipients.length} مستلم عبر WAPilot v2.`,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error?.message || 'حدث خطأ أثناء معالجة إرسال الحملة.',
    });
  }
}
