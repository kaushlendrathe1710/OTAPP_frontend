import React, { memo, useMemo } from "react";
import PropTypes from "prop-types";

import chatUserImg from "../../assets/img/chat-user.png";
import chatStyles from "../../styles/chat.module.scss";
import sliceText from "../../lib/sliceText";
import moment from "moment";
import { MESSAGE_TYPE } from "../../../constants/helpers";

function getNewProps(props, arrayOfKeyProps = []) {
  let newProps = {};
  for (let key in props) {
    if (arrayOfKeyProps.includes(key)) {
      continue;
    } else {
      newProps[key] = props[key];
    }
  }
  return newProps;
}

const UserChatListCard = (props) => {
  const { latestMessage, listUser, onClick, activeUser } = props;
  const newProps = useMemo(() => {
    return getNewProps(props, ["latestMessage", "listUser", "activeUser"]);
  }, [props]);

  return (
    <div
      style={{
        background: activeUser?._id === listUser?._id ? "#0000000d" : "",
      }}
      role={"navigation"}
      onClick={onClick}
      className={chatStyles.userChatListCard}
      {...newProps}
    >
      <div className={chatStyles.avatar}>
        <img src={chatUserImg} alt="user image" />
      </div>
      <div className={chatStyles.metaDataContainer}>
        <p style={{ letterSpacing: !listUser?.name && "0" }}>
          {listUser?.name ||
            listUser?.phoneNumber + ` - ${listUser?.userType}` ||
            "No name"}
        </p>
        {latestMessage !== null && (
          <div className={chatStyles.latestMessage}>
            <p>
              {sliceText(
                latestMessage?.textContent ||
                  (latestMessage?.fileContent?.textContent !== "" &&
                    `📁 ${latestMessage?.fileContent?.textContent}`) ||
                  (latestMessage?.messageType === MESSAGE_TYPE.file &&
                    "📁 File message") ||
                  (latestMessage?.messageType === MESSAGE_TYPE.voice &&
                    "🎤 Voice message") ||
                  "",
                25
              )}
            </p>
            <p>{moment(latestMessage?.createdAt).format("LT")}</p>
          </div>
        )}
      </div>
    </div>
  );
};

UserChatListCard.defaultProps = {
  onClick: () => {},
};
UserChatListCard.propTypes = {
  onClick: PropTypes.func,
  latestMessage: PropTypes.object,
  user: PropTypes.object,
};

export default memo(UserChatListCard);
