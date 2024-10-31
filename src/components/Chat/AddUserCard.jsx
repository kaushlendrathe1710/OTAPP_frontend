import React, { memo } from "react";

import sliceText from "../../lib/sliceText";
import chatUserImg from "../../assets/img/chat-user.png";
import chatStyles from "../../styles/chat.module.scss";
import { BsFillCheckCircleFill } from "react-icons/bs";

const AddUserCard = ({ listUser, isSelected, showCheckbox = false, showRemoveBtn = false, onClick = () => {}, onRemoveBtnClick = () => {}, disabledRemoveBtn = false }) => {
    return (
        <div role="button" onClick={onClick} className={chatStyles.addUserCard}>
            <div className={chatStyles.avatar}>
                <img src={chatUserImg} alt="user image" />
            </div>
            <div
                style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <div className={chatStyles.metaDataContainer}>
                    <p style={{ letterSpacing: !listUser?.name && "0" }}>{sliceText(listUser?.name, 14) || listUser?.phoneNumber + ` - ${listUser?.userType}` || "No name"}</p>
                    <div className={chatStyles.latestMessage}>
                        <p>{listUser?.userType}</p>
                    </div>
                </div>
                <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                    {showCheckbox && isSelected && <BsFillCheckCircleFill fill="var(--success-400)" size={20} />}
                    {showRemoveBtn && (
                        <button className="btnDanger btn--small" onClick={onRemoveBtnClick} disabled={disabledRemoveBtn}>
                            Remove
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default memo(AddUserCard);
