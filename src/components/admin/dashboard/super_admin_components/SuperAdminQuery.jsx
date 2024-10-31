import React, { useEffect, useState } from "react";

import { useWindowWidth } from "../../../../hooks/useWindowWidth";
import { TableBodyCell, TableBodyWrapper, TableColumn, TableHead, TableHeadCell, TableRow, TableWrapper } from "../../../table";

import { AiTwotoneDelete } from "react-icons/ai";

import utilStyles from "../../../../styles/utils.module.scss";
import styles from "../../../../styles/addData.module.scss";

import api from "../../../../services/api";
import { toast } from "react-hot-toast";

export const SuperAdminQuery = () => {
  const windowWidth = useWindowWidth();
  const [data, setData] = useState([]);

  const getQuery = async () => {
    const res = await api.get("/query/get-all");
    setData(res.data);
  };

  const handleDelete = async (id) => {
    try {
      const res = await api.delete(`/query/delete/${id}`);
      toast.success("Query deleted successfully");
      const filteredData = data.filter((item) => item._id !== id);

      setData(filteredData);
    } catch (e) {
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    getQuery();
  }, []);

  return (
    <div className="outletContainer">
      <h2 className={utilStyles.headingLg}>Queries</h2>
      <TableWrapper>
        <TableHead>
          <TableColumn>
            <TableHeadCell>Name</TableHeadCell>
          </TableColumn>
          <TableColumn>
            <TableHeadCell>Email</TableHeadCell>
          </TableColumn>
          <TableColumn>
            <TableHeadCell>Query</TableHeadCell>
          </TableColumn>
          <TableColumn>
            <TableHeadCell>Delete</TableHeadCell>
          </TableColumn>
        </TableHead>
        <TableBodyWrapper>
          {data?.map(({ _id, name, email, query }, i) => {
            return (
              <TableRow key={_id}>
                <TableColumn>
                  <TableBodyCell>{name}</TableBodyCell>
                </TableColumn>
                <TableColumn>
                  <TableBodyCell>{email}</TableBodyCell>
                </TableColumn>
                <TableColumn>
                  <TableBodyCell>{query}</TableBodyCell>
                </TableColumn>
                <TableColumn>
                  <TableBodyCell>
                    <AiTwotoneDelete onClick={() => handleDelete(_id)} className={`${styles.actionIcons} ${styles.trash}`} />
                  </TableBodyCell>
                </TableColumn>
              </TableRow>
            );
          })}
        </TableBodyWrapper>
      </TableWrapper>
    </div>
  );
};
