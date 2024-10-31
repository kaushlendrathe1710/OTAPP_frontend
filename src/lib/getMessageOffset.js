import { getMessageHeight } from "./getMessageHeight";

/**
 *
 * @param {array} messages array of messages
 * @param {number} index index of message
 * @returns {number} offset of message
 */
export function getMessageOffset(messages, index) {
  if (messages.length <= 0) {
    return 0;
  }
  let offset = 0;
  let myMessages = [...messages];
  for (let i = 0; i < myMessages.length; i++) {
    let messageHeight = getMessageHeight(myMessages[i], 50) + 40;
    offset += messageHeight;
    if (i === index) {
      break;
    }
  }
  return offset;
}
