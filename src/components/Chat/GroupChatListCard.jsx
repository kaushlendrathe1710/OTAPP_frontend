import React, { memo, useMemo } from "react";
import PropTypes from "prop-types";
import moment from "moment";

import groupUsersImg from "../../assets/img/group-users.png";
import chatStyles from "../../styles/chat.module.scss";
import sliceText from "../../lib/sliceText";
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

const GroupChatListCard = (props) => {
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
        <img src={groupUsersImg} alt="user image" />
      </div>
      <div className={chatStyles.metaDataContainer}>
        <p style={{ letterSpacing: !listUser?.name && "0" }}>
          {listUser?.groupName || "No name"}
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

GroupChatListCard.defaultProps = {
  onClick: () => {},
};
GroupChatListCard.propTypes = {
  onClick: PropTypes.func,
  latestMessage: PropTypes.object,
  user: PropTypes.object,
};

export default memo(GroupChatListCard);
