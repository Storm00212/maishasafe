const axios = require("axios");
const crypto = require("crypto");

/**
 * Send WhatsApp Template Message via Infobip
 * @param {string} to - Recipient phone number in E.164 format (+2547xxxxxxx)
 * @param {Array<string>} placeholders - Placeholder values for template
 */
const sendWhatsAppInfobip = async (to, placeholders = []) => {
  try {
    console.log("INFOBIP_API_KEY:", process.env.INFOBIP_API_KEY);
    console.log("INFOBIP_WHATSAPP_FROM:", process.env.INFOBIP_WHATSAPP_FROM);

    const response = await axios.post(
        "https://8k8y3e.api.infobip.com/whatsapp/1/message/template",
        {
          messages: [
            {
              from: process.env.INFOBIP_WHATSAPP_FROM, // your Infobip sender number
              to,
              messageId: crypto.randomUUID(), // generates unique ID for tracking
              content: {
                templateName: "test_whatsapp_template_en", // must match approved Infobip template
                templateData: {
                  body: {placeholders}, // placeholders for message
                },
                language: "en",
              },
            },
          ],
        },
        {
          headers: {
            "Authorization": `App ${process.env.INFOBIP_API_KEY}`, // API key from Infobip portal
            "Content-Type": "application/json",
            "Accept": "application/json",
          },
        },
    );

    console.log("✅ Infobip WhatsApp sent:", response.data);
    return {success: true, data: response.data};
  } catch (err) {
    console.error(
        "❌ Infobip error:",
        err.response?.data || err.message || "Unknown error",
    );
    return {
      success: false,
      error: err.response?.data || err.message || "Unknown error",
    };
  }
};

module.exports = {sendWhatsAppInfobip};
