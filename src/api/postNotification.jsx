import axios from "axios";

export default async function PostNotification({ deviceToken, title, message }) {
  const response = await axios.post(
    process.env.NEXT_PUBLIC_API_FIREBASE,
    {
      registration_ids: deviceToken,
      collapse_key: "pesan_facechat_123456",
      notification: {
        title: title,
        body: message,
        content_available: true,
        priority: "high",
      },
    },
    {
      headers: {
        Authorization: `key=${process.env.NEXT_PUBLIC_FIREBASE_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response;
}
