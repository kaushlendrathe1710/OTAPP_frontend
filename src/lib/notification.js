/**
 *
 * @param {Array} to - array of user ids to send the notification to
 * @param {string} title - title of the notification
 * @param {string} description - description of the notification
 * @param {Object} data - data to be sent with the notification
 */
function createChatMessageNotificationData(
  to,
  title = "New Message",
  description = "You have a new message",
  data
) {
  return {
    to,
    title,
    description,
    data,
  };
}

export { createChatMessageNotificationData };
