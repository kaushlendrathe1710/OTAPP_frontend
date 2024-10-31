import React, { useEffect, useState } from "react";
import { useClickOutside } from "../../../../../hooks/useClickOutside";
import { useWindowWidth } from "../../../../../hooks/useWindowWidth";
import {
  TableBodyCell,
  TableBodyWrapper,
  TableColumn,
  TableHead,
  TableHeadCell,
  TableRow,
  TableWrapper,
} from "../../../../table";
import glassStyles from "../../../../../styles/glass.module.scss";
import utilStyles from "../../../../../styles/utils.module.scss";
import api, { getAccessToken } from "../../../../../services/api";

export const TutorWeeklyProjectsModal = ({
  setIsWeeklyProjectsModalOpen,
  clickedWeekProjectsData,
}) => {
  const modalRef = useClickOutside(handleCloseModal);

  const [weeklyPrjects, setWeeklyPrjects] = useState([]);

  let data = [
    {
      assignmentId: "Pow_20231201_001",
      payment: 800,
      status: "Accepted",
      _id: 1,
    },
    {
      assignmentId: "Bio_20230624_051",
      payment: 1200,
      status: "Accepted",
      _id: 2,
    },
  ];

  // console.log("clicked: ", clickedWeekProjectsData);

  useEffect(() => {
    async function fetchTutorWeeklyProjects() {
      const res = await api.get(
        `/payment/get-tutor-weekly-projects?weekId=${clickedWeekProjectsData?.weekId}&tutorId=${clickedWeekProjectsData?.tutorId}`,
        {
          headers: {
            Authorization: getAccessToken(),
          },
        }
      );
      // console.log("res: ", res.data);
      setWeeklyPrjects(
        res.data?.data?.map(({ projectId }) => ({ ...projectId }))
      );
    }
    fetchTutorWeeklyProjects();
  }, []);

  useEffect(() => {
    document.getElementById("mainSidebar").style.zIndex = "0";
    document.getElementById("mainSidebarButton").style.zIndex = "0";
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
      document.getElementById("mainSidebar").style.zIndex = "100";
      document.getElementById("mainSidebarButton").style.zIndex = "101";
    };
  }, []);

  function handleCloseModal() {
    setIsWeeklyProjectsModalOpen(false);
  }
  return (
    <div
      className={`${glassStyles.modalWrapper} ${glassStyles.modalCenterWrapper}`}
    >
      <div
        style={{
          maxWidth: "900px",
          minHeight: "fit-content",
          backgroundColor: "rgba(255, 255, 255, 0.25)",
          paddingBottom: "0",
        }}
        className={glassStyles.modalBoxWrapper}
        ref={modalRef}
      >
        <h2
          style={{ margin: "1rem 0 0 .5rem" }}
          className={utilStyles.headingMd}
        >
          Week {clickedWeekProjectsData?.week}
        </h2>
        <TableWrapper marginTop={".75rem"}>
          <TableHead>
            <TableColumn>
              <TableHeadCell>Assignment Id</TableHeadCell>
            </TableColumn>
            <TableColumn>
              <TableHeadCell>Payment</TableHeadCell>
            </TableColumn>
            <TableColumn>
              <TableHeadCell>Status</TableHeadCell>
            </TableColumn>
          </TableHead>
          <TableBodyWrapper>
            {weeklyPrjects?.length > 0 ? (
              weeklyPrjects?.map(
                ({ assignmentId, _id, tutorPayment, status }) => {
                  return (
                    <TableRow key={_id}>
                      <TableColumn>
                        <TableBodyCell>{assignmentId}</TableBodyCell>
                      </TableColumn>
                      <TableColumn>
                        <TableBodyCell>{tutorPayment}</TableBodyCell>
                      </TableColumn>
                      <TableColumn>
                        <TableBodyCell>{status}</TableBodyCell>
                      </TableColumn>
                    </TableRow>
                  );
                }
              )
            ) : (
              <span className={glassStyles.insideTableLoaderWrapper}>
                <h2>0 Projects</h2>
              </span>
            )}
          </TableBodyWrapper>
        </TableWrapper>
      </div>
    </div>
  );
};
