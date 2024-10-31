import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
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
import { UploadReceiptModal } from "./UploadReceiptModal";
import utilStyles from "../../../../../styles/utils.module.scss";
import glassStyles from "../../../../../styles/glass.module.scss";
import studentStyles from "../../../../../styles/student.module.scss";
import { TutorWeeklyProjectsModal } from "./TutorWeeklyProjectsModal";
import api, { getAccessToken } from "../../../../../services/api";
import { useQuery } from "react-query";
import { Loader1 } from "../../../../Loaders/Loader1";

const TutorWeeklyPayment = () => {
  const { tutorId } = useParams();
  const windowWidth = useWindowWidth();
  async function fetchWeeklyPayment() {
    const res = await api.get(
      `/payment/get-all-tutor-payment-by-individual-tutor-id?tutorId=${tutorId}`,
      {
        headers: {
          Authorization: getAccessToken(),
        },
      }
    );
    return res.data;
  }

  const { data, isLoading, isError, refetch } = useQuery(
    "weekly-payments",
    () => fetchWeeklyPayment()
  );

  const [weeks, setWeeks] = useState([]);

  useEffect(() => {
    console.log("data: ", data);
    if (data) {
      if (Array.isArray(data)) {
        setWeeks(data[data.length - 1].weeks);
      } else {
        setWeeks(data.weeks);
      }
    }
  }, [data]);

  // console.log("weeks: ", weeks);

  const [isUploadReceiptModalOpen, setIsUploadReceiptModalOpen] =
    useState(false);
  const [isWeeklyProjectsModalOpen, setIsWeeklyProjectsModalOpen] =
    useState(false);
  const [clickedWeekProjectsData, setClickedWeekProjectsData] = useState("");

  const handleTutorWeeklyProjectModal = (weeklyProjects) => {
    setClickedWeekProjectsData(weeklyProjects);
    setIsWeeklyProjectsModalOpen(true);
  };

  if (isLoading)
    return (
      <div className={studentStyles.loaderWrapper}>
        <Loader1 />
      </div>
    );
  if (isError)
    return (
      <div className={studentStyles.loaderWrapper}>
        <div>
          <h2>{isError?.message || "Some error occured."}</h2>
          <br />
          <Link to={-1} className="btnDark btn--medium">
            Go back
          </Link>
        </div>
      </div>
    );

  return (
    <>
      {isUploadReceiptModalOpen ? (
        <UploadReceiptModal
          setIsUploadReceiptModalOpen={setIsUploadReceiptModalOpen}
        />
      ) : null}
      {isWeeklyProjectsModalOpen ? (
        <TutorWeeklyProjectsModal
          setIsWeeklyProjectsModalOpen={setIsWeeklyProjectsModalOpen}
          clickedWeekProjectsData={clickedWeekProjectsData}
        />
      ) : null}
      <div className="outletContainer">
        <h2 className={utilStyles.headingLg}>Tutor Weekly Payment</h2>
        <TableWrapper>
          <TableHead>
            <TableColumn>
              <TableHeadCell>Week</TableHeadCell>
            </TableColumn>
            <TableColumn>
              <TableHeadCell>Amt. paid</TableHeadCell>
            </TableColumn>
            {windowWidth > 600 ? (
              <TableColumn>
                <TableHeadCell>Status</TableHeadCell>
              </TableColumn>
            ) : null}
            <TableColumn width={"150%"}>
              <TableHeadCell>Actions</TableHeadCell>
            </TableColumn>
          </TableHead>
          <TableBodyWrapper>
            {weeks.length > 0 ? (
              weeks?.map(
                ({ week = 1, amountPaid, status, _id, projects }, i) => {
                  return (
                    <TableRow key={i}>
                      <TableColumn>
                        <TableBodyCell>{week || i + 1}</TableBodyCell>
                      </TableColumn>
                      <TableColumn>
                        <TableBodyCell>{amountPaid}</TableBodyCell>
                      </TableColumn>
                      {windowWidth > 600 ? (
                        <TableColumn>
                          <TableBodyCell>{status}</TableBodyCell>
                        </TableColumn>
                      ) : null}
                      <TableColumn width={"150%"}>
                        <TableBodyCell>
                          {status === "Un-paid" ? (
                            <button className="btnInfo btn--small">
                              Make payment
                            </button>
                          ) : null}
                          <button
                            className="btnSuccess btn--small"
                            onClick={() => setIsUploadReceiptModalOpen(true)}
                          >
                            Upload Reciept
                          </button>
                          <button
                            className="btnDark btn--small"
                            onClick={() =>
                              handleTutorWeeklyProjectModal({
                                week,
                                weekId: _id,
                                tutorId,
                                projects,
                              })
                            }
                          >
                            View Projects
                          </button>
                        </TableBodyCell>
                      </TableColumn>
                    </TableRow>
                  );
                }
              )
            ) : (
              <span className={glassStyles.insideTableLoaderWrapper}>
                <h2>No data available</h2>
              </span>
            )}
          </TableBodyWrapper>
        </TableWrapper>
      </div>
    </>
  );
};

export default TutorWeeklyPayment;
