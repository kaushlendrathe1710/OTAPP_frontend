import axios from "axios";

export default async function sendNotificationsWithExpo({
  to,
  title,
  body,
  data,
  sound = "default",
  priority = "high",
}) {
  if (!to || !title || !body || to?.length === 0) {
    return new Error("Missing required parameters to send notifications");
  }
  try {
    return axios.post("https://exp.host/--/api/v2/push/send", {
      to,
      title,
      body,
      data,
      sound,
      priority,
      channelId: "default",
    });
  } catch (error) {
    console.log("Error in sending notifications with expo", error);
  }
}
