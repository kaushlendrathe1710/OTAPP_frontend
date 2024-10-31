import React, { useState } from "react";
import styles from "../../styles/whiteboard.module.scss";
import { ToolItem } from "./tool_item/ToolItem";
import {
  AddText,
  Square,
  Triangle,
  Round,
  Star,
  PentagonOne,
  MoveOne,
  Pencil,
  Erase,
  Notes,
  SmilingFace,
  PageTemplate,
  ConnectionArrow,
  HighLight,
  Undo,
  Redo,
  MessageOne,
  User,
} from "@icon-park/react";
import { Board } from "./board/Board";
import { useClickOutside } from "../../hooks/useClickOutside";
import { useRef } from "react";
import { useWhiteboard } from "../../context/WhiteboardContext";

export const Whiteboard = () => {
  const whiteboard = useWhiteboard();
  const [canErase, setCanErase] = useState(false);
  const [showJoinedUsers, setShowJoinedUsers] = useState(false);
  let headerTools = [
    {
      name: "Text Tool",
      Icon: AddText,
      iconColor: "#333",
      onClick: () => console.log("Text Tool Clicked"),
      tooltipText: "Text",
    },
    {
      name: "Square Tool",
      Icon: Square,
      iconColor: "#333",
      onClick: () => console.log("Square Tool Clicked"),
      tooltipText: "Square",
    },
    {
      name: "Triangle Tool",
      Icon: Triangle,
      iconColor: "#333",
      onClick: () => console.log("Triangle Tool Clicked"),
      tooltipText: "Triangle",
    },
    {
      name: "Circle Tool",
      Icon: Round,
      iconColor: "#333",
      onClick: () => console.log("Circle Tool Clicked"),
      tooltipText: "Circle",
    },
    {
      name: "Star Tool",
      Icon: Star,
      iconColor: "#333",
      onClick: () => console.log("Star Tool Clicked"),
      tooltipText: "Star",
    },
    {
      name: "Pentagon Tool",
      Icon: PentagonOne,
      iconColor: "#333",
      onClick: () => console.log("Pentagon Tool Clicked"),
      tooltipText: "Pentagon",
    },
  ];

  let asideTools = [
    {
      name: "Select Tool",
      Icon: MoveOne,
      iconColor: "#333",
      onClick: () => console.log("Select Tool Clicked"),
      tooltipText: "Select",
    },
    {
      name: "Pencil Tool",
      Icon: Pencil,
      iconColor: "#333",
      onClick: () => console.log("Pencil Tool Clicked"),
      tooltipText: "Pencil",
    },
    {
      name: "HighLight Tool",
      Icon: HighLight,
      iconColor: "#333",
      onClick: () => console.log("HighLight Tool Clicked"),
      tooltipText: "HighLight",
    },
    {
      name: "Eraser Tool",
      Icon: Erase,
      iconColor: "#333",
      onClick: () => console.log("Eraser Tool Clicked"),
      tooltipText: "Eraser",
    },
    {
      name: "Notes Tool",
      Icon: Notes,
      iconColor: "#333",
      onClick: () => console.log("Notes Tool Clicked"),
      tooltipText: "Notes",
    },
    {
      name: "Emoji Tool",
      Icon: SmilingFace,
      iconColor: "#333",
      onClick: () => console.log("Emoji Tool Clicked"),
      tooltipText: "Emoji",
    },
    {
      name: "Connection Arrow Tool",
      Icon: ConnectionArrow,
      iconColor: "#333",
      onClick: () => console.log("Connection Arrow Tool Clicked"),
      tooltipText: "Connection Arrow",
    },
    {
      name: "Template Tool",
      Icon: PageTemplate,
      iconColor: "#333",
      onClick: () => console.log("Template Tool Clicked"),
      tooltipText: "Template",
    },
    // ...headerTools,
  ];

  const showUserButtonRef = useRef();
  const showUserModalRef = useClickOutside(
    handleCloseShowUserModal,
    showUserButtonRef
  );

  function eraseAllDrawings(callback) {
    if (canErase) {
      callback();
      setTimeout(() => {
        setCanErase(false);
      }, 100);
    }
  }

  function handleCloseShowUserModal() {
    setShowJoinedUsers(false);
  }
  return (
    <div className={styles.container}>
      <header className={styles.headerToolbarsWrapper}>
        <div className={styles.headerToolbar}>
          {headerTools?.map((tool) => (
            <ToolItem
              key={tool.name}
              name={tool.name}
              Icon={tool.Icon}
              onClick={tool.onClick}
              tooltipText={tool.tooltipText}
              size={44}
              iconColor={tool.iconColor}
              strokeWidth={3}
            />
          ))}
        </div>
        <div className={styles.headerToolbar}>
          <ToolItem
            name="Undo"
            Icon={Undo}
            tooltipText="Undo"
            size={44}
            iconColor={"#333"}
            strokeWidth={3}
            disabled={true}
          />
          <ToolItem
            name="Redo"
            Icon={Redo}
            tooltipText="Redo"
            size={44}
            iconColor={"#333"}
            strokeWidth={3}
          />
        </div>
        <div className={styles.joinedUsersWrapper}>
          <button
            ref={showUserButtonRef}
            type="button"
            onClick={() => setShowJoinedUsers(!showJoinedUsers)}
          >
            <User
              theme="outline"
              color="var(--primary-color)"
              size={24}
              strokeWidth={3}
            />
          </button>
          <span className={styles.usersLength}>
            {whiteboard?.joinedUsers?.length || 0}
          </span>
          {showJoinedUsers ? (
            <div ref={showUserModalRef} className={styles.joinedUsers}>
              <h5>Joined Users</h5>
              {whiteboard?.joinedUsers?.length > 0 ? (
                whiteboard?.joinedUsers?.map((data, i) => {
                  return <div key={i}>{data?.userData}</div>;
                })
              ) : (
                <div>No joined users</div>
              )}
            </div>
          ) : null}
        </div>
      </header>
      <div className={styles.asideToolbarWrapper}>
        {asideTools?.map((tool) => (
          <ToolItem
            key={tool.name}
            name={tool.name}
            Icon={tool.Icon}
            onClick={tool.name === "Eraser Tool" ? setCanErase : tool.onClick}
            tooltipText={tool.tooltipText}
            size={44}
            iconColor={tool.iconColor}
            strokeWidth={3}
          />
        ))}
      </div>
      <Board eraseAllDrawings={eraseAllDrawings} canErase={canErase} />
      <button type="button" className={styles.chatButton} title="Chat">
        <MessageOne theme="outline" size="24" fill="#333" strokeWidth={4} />
      </button>
    </div>
  );
};
