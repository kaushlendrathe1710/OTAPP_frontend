import React from "react";
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

function PaidPayment() {
  const windowWidth = useWindowWidth();
  let data = [
    {
      assignmentId: "Pow_20231201_001",
      paidAmt: 800,
      unPaidAmt: 500,
      _id: 1,
    },
    {
      assignmentId: "Bio_20230624_051",
      paidAmt: 1200,
      unPaidAmt: 400,
      _id: 2,
    },
  ];
  return (
    <div className="outletContainer">
      <h2 className={utilStyles.headingLg}>Paid Payments</h2>
      <TableWrapper>
        <TableHead>
          <TableColumn>
            <TableHeadCell>Assignment Id</TableHeadCell>
          </TableColumn>
          <TableColumn>
            <TableHeadCell>Remarks</TableHeadCell>
          </TableColumn>
        </TableHead>
        <TableBodyWrapper>
          {data?.map(({ assignmentId, _id }) => {
            return (
              <TableRow key={_id}>
                <TableColumn>
                  <TableBodyCell>{assignmentId}</TableBodyCell>
                </TableColumn>
                <TableColumn>
                  <TableBodyCell>Ok, This is for Remarks</TableBodyCell>
                </TableColumn>
              </TableRow>
            );
          })}
        </TableBodyWrapper>
      </TableWrapper>
    </div>
  );
}

export default PaidPayment;
