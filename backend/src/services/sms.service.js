/**
 * SMS Provider Service supporting Fast2SMS and MSG91,
 * with a development-only mock test mode.
 */

const sendFast2SMS = async (phone, otp) => {
  const apiKey = process.env.FAST2SMS_API_KEY;
  if (!apiKey) {
    throw new Error("FAST2SMS_API_KEY is not configured.");
  }

  const response = await fetch("https://www.fast2sms.com/dev/bulkV2", {
    method: "POST",
    headers: {
      authorization: apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      route: "otp",
      variables_values: String(otp),
      numbers: phone,
    }),
  });

  const data = await response.json();
  if (!response.ok || data.return === false) {
    const errorMsg = Array.isArray(data.message) ? data.message.join(", ") : data.message || "Fast2SMS delivery failed";
    console.error(`[SMS Service] Fast2SMS error: ${errorMsg}`);
    throw new Error(`SMS Provider Error: ${errorMsg}`);
  }

  return { success: true, provider: "fast2sms", request_id: data.request_id };
};

const sendMSG91 = async (phone, otp) => {
  const authKey = process.env.MSG91_AUTH_KEY;
  const templateId = process.env.MSG91_TEMPLATE_ID;

  if (!authKey || !templateId) {
    throw new Error("MSG91_AUTH_KEY or MSG91_TEMPLATE_ID is missing.");
  }

  const url = `https://control.msg91.com/api/v5/otp?template_id=${templateId}&mobile=91${phone}&authkey=${authKey}&otp=${otp}`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();
  if (!response.ok || data.type === "error") {
    const errorMsg = data.message || "MSG91 delivery failed";
    console.error(`[SMS Service] MSG91 error: ${errorMsg}`);
    throw new Error(`SMS Provider Error: ${errorMsg}`);
  }

  return { success: true, provider: "msg91", message_id: data.message };
};

/**
 * Main sendOtp function
 * @param {string} phone 10-digit mobile number
 * @param {string|number} otp 6-digit OTP code
 */
const sendOtp = async (phone, otp) => {
  const isProduction = process.env.NODE_ENV === "production";
  const preferredProvider = (process.env.SMS_PROVIDER || "").toLowerCase();

  // 1. If explicit Fast2SMS configured
  if (preferredProvider === "fast2sms" || process.env.FAST2SMS_API_KEY) {
    return await sendFast2SMS(phone, otp);
  }

  // 2. If explicit MSG91 configured
  if (preferredProvider === "msg91" || (process.env.MSG91_AUTH_KEY && process.env.MSG91_TEMPLATE_ID)) {
    return await sendMSG91(phone, otp);
  }

  // 3. In Production without valid SMS credentials, do not pretend it succeeded
  if (isProduction) {
    throw new Error(
      "SMS provider credentials are missing in production. Please set FAST2SMS_API_KEY or MSG91_AUTH_KEY & MSG91_TEMPLATE_ID."
    );
  }

  // 4. Development-only mock test mode
  console.log("==================================================");
  console.log(" [SMS SERVICE - DEV TEST MODE]");
  console.log(` Target Phone : +91 ${phone}`);
  console.log(` Generated OTP: ${otp}`);
  console.log(` Validity     : 5 Minutes`);
  console.log("==================================================");

  return {
    success: true,
    provider: "dev-mock",
    message: "OTP generated and logged in server development console.",
  };
};

module.exports = {
  sendOtp,
  sendFast2SMS,
  sendMSG91,
};
