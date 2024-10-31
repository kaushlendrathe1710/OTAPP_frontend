import React, { useState, useEffect, useRef } from "react";
import { LinkGenerationModal } from "./LinkGenerationModal";
import glassStyles from "../../../../../styles/glass.module.scss";
import studentStyles from "../../../../../styles/student.module.scss";
import styles from "../../../../../styles/payments.module.scss";
import { MdContentCopy } from "react-icons/md";
import { toast } from "react-hot-toast";
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
import utilStyles from "../../../../../styles/utils.module.scss";
import { useQuery } from "react-query";
import api, { getAccessToken } from "../../../../../services/api";
import { Loader1 } from "../../../../Loaders/Loader1";
import { Link } from "react-router-dom";

async function fetchPaymentLinks(lastPaymentId = "", limit = 10) {
  const res = await api.get(
    `/payment/get-payment-links-for-listing?lastPaymentId=${lastPaymentId}&limit=${limit}`,
    {
      headers: {
        Authorization: getAccessToken(),
      },
    }
  );
  return res.data;
}
async function fetchPaymentLinksOnScroll(lastPaymentId, limit = 10) {
  const res = await api.get(
    `/payment/get-payment-links-for-listing?lastPaymentId=${lastPaymentId}&limit=${limit}`,
    {
      headers: {
        Authorization: getAccessToken(),
      },
    }
  );
  return res.data;
}

export default function LinkGeneration() {
  const limit = useRef(12);
  // modal state
  const [isLinkGenerationModalOpen, setIsLinkGenerationModalOpen] =
    useState(false);
  const [generateLinkFor, setGenerateLinkFor] = useState("");

  const [paymentLinks, setPaymentLinks] = useState([]);
  const [lastPaymentId, setLastPaymentId] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState({
    isMountLoading: false,
    isMorePaymentsFetching: false,
  });
  const [hasMore, setHasMore] = useState(true);

  const windowInnerWidth = useWindowWidth();

  useEffect(() => {
    (async function () {
      try {
        setLoading((prev) => ({ ...prev, isMountLoading: true }));
        const data = await fetchPaymentLinks("", limit.current);
        const links = data.data;
        setPaymentLinks(links);
        setLastPaymentId(links[links.length - 1].id);
      } catch (err) {
        setIsError(true);
        console.log("Error fetching payment links: ", err);
      } finally {
        setLoading((prev) => ({ ...prev, isMountLoading: false }));
      }
    })();
  }, []);

  function handleGenLinkStudent() {
    setGenerateLinkFor("Student");
    setIsLinkGenerationModalOpen(true);
  }
  function handleGenLinkTutor() {
    setGenerateLinkFor("Tutor");
    setIsLinkGenerationModalOpen(true);
  }
  async function handleListOnScroll(e) {
    if (!hasMore || !lastPaymentId) {
      return;
    }
    if (e.target.scrollTop + e.target.clientHeight >= e.target.scrollHeight) {
      try {
        console.log("lastPaymentId: ", lastPaymentId);
        setLoading((prev) => ({ ...prev, isMorePaymentsFetching: true }));
        const data = await fetchPaymentLinksOnScroll(
          lastPaymentId,
          limit.current
        );
        const links = data.data;
        if (links.length === 0) {
          setHasMore(false);
          return;
        }
        setPaymentLinks((prev) => [...prev, ...links]);
        setLastPaymentId(links[links.length - 1].id);
      } catch (err) {
        // setIsError(true);
        console.log("Error fetching more payment links: ", err);
      } finally {
        setLoading((prev) => ({ ...prev, isMorePaymentsFetching: false }));
      }
    }
  }

  const handleCopyPaymentLink = (paymentLink) => {
    navigator.clipboard.writeText(paymentLink).then(() => {
      toast.success("Payment link copied", {
        duration: 4000,
        position: "top-right",
      });
    });
  };
  const handleUpdatePaymentLinkStatus = (id, status) => {
    api
      .patch(
        `/payment/update-payment-link-active-status?paymentLinkId=${id}`,
        { status },
        {
          headers: {
            Authorization: getAccessToken(),
          },
        }
      )
      .then((res) => {
        toast.success("Payment link updated successfully");
        setPaymentLinks((prev) =>
          prev.map((obj) => (obj.id === id ? { ...obj, active: status } : obj))
        );
      })
      .catch((e) => {
        toast.error("Something went wrong\nPlease try again", {
          duration: 4000,
        });
      });
  };

  if (loading.isMountLoading)
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
      {isLinkGenerationModalOpen ? (
        <LinkGenerationModal
          generateLinkFor={generateLinkFor}
          setIsLinkGenerationModalOpen={setIsLinkGenerationModalOpen}
          setAllPaymentsLinksData={setPaymentLinks}
        />
      ) : null}
      <div className="outletContainer">
        <h2 className={utilStyles.headingLg}>Generate Links</h2>
        <div className={styles.header}>
          <button onClick={handleGenLinkStudent}>
            Generate Link for Student
          </button>
          <button onClick={handleGenLinkTutor}>Generate Link for Tutor</button>
        </div>
        <br />
        <TableWrapper>
          <TableHead>
            <TableColumn width={"60%"}>
              <TableHeadCell>Name</TableHeadCell>
            </TableColumn>
            {windowInnerWidth > 900 ? (
              <TableColumn width={"80%"}>
                <TableHeadCell>Email</TableHeadCell>
              </TableColumn>
            ) : null}
            <TableColumn width="100%">
              <TableHeadCell>Payment Link</TableHeadCell>
            </TableColumn>
            <TableColumn width={"40%"}>
              <TableHeadCell>Amount</TableHeadCell>
            </TableColumn>
            <TableColumn width={"40%"}>
              <TableHeadCell>Created for</TableHeadCell>
            </TableColumn>
            <TableColumn width={"50%"}>
              <TableHeadCell>Status</TableHeadCell>
            </TableColumn>
          </TableHead>
          <TableBodyWrapper onScroll={handleListOnScroll}>
            {paymentLinks?.length !== 0 ? (
              loading.isMountLoading ? (
                <span className={glassStyles.insideTableLoaderWrapper}>
                  <Loader1 />
                </span>
              ) : (
                paymentLinks?.map((paymentObj, i) => {
                  const { url: paymentLink, metadata, active, id } = paymentObj;
                  const { name, email, amount, currency, createdFor } =
                    metadata;
                  const paidStatus = Object.keys(metadata).includes("paid")
                    ? metadata.paid === "true"
                      ? "✅ Paid"
                      : "Un-Paid"
                    : "Not Available";
                  return (
                    <TableRow key={i}>
                      <TableColumn width={"60%"}>
                        <TableBodyCell>{name}</TableBodyCell>
                      </TableColumn>
                      {windowInnerWidth > 900 ? (
                        <TableColumn width={"80%"}>
                          <TableBodyCell>{email}</TableBodyCell>
                        </TableColumn>
                      ) : null}
                      <TableColumn width="100%">
                        <TableBodyCell customStyles={{ flexWrap: "nowrap" }}>
                          <span>
                            {windowInnerWidth > 540
                              ? paymentLink.length > 25
                                ? `${paymentLink.slice(0, 25)}...`
                                : `${paymentLink}`
                              : `${paymentLink.slice(0, 15)}...`}
                          </span>
                          <button
                            className="btnIcon btnIconNeutral btnIcon--small"
                            title="Copy payment link"
                            onClick={() => handleCopyPaymentLink(paymentLink)}
                          >
                            <MdContentCopy />
                          </button>
                        </TableBodyCell>
                      </TableColumn>
                      <TableColumn width={"40%"}>
                        <TableBodyCell>
                          {amount / 100 + " (" + currency?.toUpperCase() + ")"}
                        </TableBodyCell>
                      </TableColumn>
                      <TableColumn width={"40%"}>
                        <TableBodyCell>{createdFor}</TableBodyCell>
                      </TableColumn>
                      <TableColumn width={"50%"}>
                        <TableBodyCell>
                          {paidStatus}
                          {/* <button
                            className={`${
                              active ? "btnWarning" : "btnSuccess"
                            } btn--small`}
                            onClick={() =>
                              handleUpdatePaymentLinkStatus(id, !active)
                            }
                          >
                            {active ? "Deactivate" : "Activate"}
                          </button> */}
                        </TableBodyCell>
                      </TableColumn>
                    </TableRow>
                  );
                })
              )
            ) : (
              <span className={glassStyles.insideTableLoaderWrapper}>
                <h3>No payments links</h3>
              </span>
            )}
          </TableBodyWrapper>
        </TableWrapper>
      </div>
    </>
  );
}
