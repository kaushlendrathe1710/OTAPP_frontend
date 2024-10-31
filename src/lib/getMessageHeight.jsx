import {
  imageFileExtensions,
  videoFileExtensions,
} from "../../constants/helpers";
import { REPLY_MESSAGE_HEIGHT } from "../components/message/ReplyMessage";

// all units in px
const MESSAGE_MAX_WIDTH = 440; // it can be changed when user resizing thier window
const TOTAL_CHARACTERS_CAN_ENTER_IN_ONE_ROW = 50; // when font-size will be: 0.9rem; word-spacing: 2px; and message max-width: 440;

const ONE_TEXT_ROW_HEIGHT = 21.7;

const MESSAGE_TIME_VIEW_HEIGHT = 16;

const MESSAGE_REACTIONS_VIEW_HEIGHT = 20;

const REPLY_MESSAGE_VIEW_HEIGHT = REPLY_MESSAGE_HEIGHT;

const MESSAGE_MEIDA_VIEW_HEIGHT = 280; // media can be video or image
const MESSAGE_DEFAULT_FILE_VIEW_HEIGHT = 72; // default file type (message file type neither be a media (video, image) file)
const MESSAGE_VOICE_VIEW_HEIGHT = 64; // voice message height

const PADDING_VERTICAL = 10.4; // 0.65rem => default to 16px
const MARGIN_BOTTOM = 16; // 0.5rem;

const MESSAGE_ONE_ROW_HEIGHT =
  ONE_TEXT_ROW_HEIGHT +
  MESSAGE_TIME_VIEW_HEIGHT +
  PADDING_VERTICAL +
  MARGIN_BOTTOM; // this is a message full height when it has only one row of characters

const MESSAGE_ONE_ROW_HEIGHT_WITH_REACTIONS =
  MESSAGE_ONE_ROW_HEIGHT + MESSAGE_REACTIONS_VIEW_HEIGHT;

// All those variables which name start with "__" is handling conditon on its own

export function getMessageHeight(
  message,
  TOTAL_CHARACTERS_CAN_ENTER_IN_ONE_ROW = 50
) {
  let __messageReactionViewHeight =
    message?.reactions?.length > 0 ? MESSAGE_REACTIONS_VIEW_HEIGHT : 0;
  let __replyMessageViewHeight = message?.replyOn
    ? REPLY_MESSAGE_VIEW_HEIGHT
    : 0;
  if (message.messageType === "Voice") {
    return (
      MESSAGE_VOICE_VIEW_HEIGHT +
      MESSAGE_TIME_VIEW_HEIGHT +
      PADDING_VERTICAL +
      MARGIN_BOTTOM +
      __messageReactionViewHeight +
      __replyMessageViewHeight
    );
  }

  let __totalCharacters =
    message.textContent?.length ||
    message.fileContent?.textContent?.length ||
    0;
  // initially it should be zero, after verifying message type condition then it may be changed or may be not
  let __messageMediaViewHeight =
    message?.messageType === "File" &&
    (videoFileExtensions.includes(
      message.fileContent?.fileExtension?.toLowerCase()
    ) ||
      imageFileExtensions.includes(
        message.fileContent?.fileExtension?.toLowerCase()
      ))
      ? MESSAGE_MEIDA_VIEW_HEIGHT
      : message?.messageType === "File"
      ? MESSAGE_DEFAULT_FILE_VIEW_HEIGHT
      : 0;

  if (__totalCharacters <= TOTAL_CHARACTERS_CAN_ENTER_IN_ONE_ROW) {
    return (
      MESSAGE_ONE_ROW_HEIGHT +
      __messageReactionViewHeight +
      __messageMediaViewHeight +
      __replyMessageViewHeight
    );
  } else {
    let totalRowsWillBe = Math.ceil(
      __totalCharacters / TOTAL_CHARACTERS_CAN_ENTER_IN_ONE_ROW
    );
    return (
      ONE_TEXT_ROW_HEIGHT * totalRowsWillBe +
      (MESSAGE_TIME_VIEW_HEIGHT +
        PADDING_VERTICAL +
        MARGIN_BOTTOM +
        (__messageReactionViewHeight +
          __messageMediaViewHeight +
          __replyMessageViewHeight))
    );
  }
}
