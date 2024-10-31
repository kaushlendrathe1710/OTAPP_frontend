import { AddWeb } from "@icon-park/react";
import { useState } from "react";
import styles from "../../../../styles/session.module.scss";
import utilStyles from "../../../../styles/utils.module.scss";
import { CreateSessionModal } from "../../../session/CreateSessionModal";
import { SessionCard } from "../../../session/SessionCard";

const SessionShedule = () => {
  const [isCreateSessionModalOpen, setIsCreateSessionModalOpen] =
    useState(false);

  function handleCreateSessionModal() {
    setIsCreateSessionModalOpen(true);
  }
  return (
    <div className="outletContainer">
      {isCreateSessionModalOpen ? (
        <CreateSessionModal
          setIsCreateSessionModalOpen={setIsCreateSessionModalOpen}
        />
      ) : null}
      <h2 className={utilStyles.headingLg}>✍ Session Shedule</h2>
      <div className={styles.sessionsWrapper}>
        <div
          onClick={handleCreateSessionModal}
          role="button"
          className={`${styles.sessionCard} ${styles.createSessionCard}`}
        >
          <AddWeb theme="outline" size="44" fill="#111" strokeWidth={2} />{" "}
          Create new whiteboard
        </div>
        <SessionCard />
        <SessionCard />
        <SessionCard />
      </div>
    </div>
  );
};

export default SessionShedule;
