import React, { memo, useState } from "react";
import PropTypes from "prop-types";
import { VscSearch, VscClose } from "react-icons/vsc";
import chatStyles from "../../styles/chat.module.scss";

const ChatSearch = ({
  onTextChange = () => {},
  placeholder = "Search a chat",
}) => {
  const [searchText, setSearchText] = useState("");
  return (
    <div className={chatStyles.searchChat}>
      <input
        type="text"
        placeholder={placeholder}
        value={searchText}
        onChange={(e) => {
          setSearchText(e.target.value);
          onTextChange(e.target.value);
        }}
      />
      <div
        className={chatStyles.searchRightIcon}
        style={{ pointerEvents: searchText ? "auto" : "none" }}
      >
        {searchText === "" ? (
          <VscSearch opacity={0.45} fontSize={14} data-type="search" />
        ) : (
          <VscClose
            opacity={0.65}
            fontSize={20}
            data-type="close"
            onClick={() => {
              setSearchText("");
              onTextChange("");
            }}
          />
        )}
      </div>
    </div>
  );
};

ChatSearch.propTypes = {
  onTextChange: PropTypes.func,
};

export default memo(ChatSearch);
