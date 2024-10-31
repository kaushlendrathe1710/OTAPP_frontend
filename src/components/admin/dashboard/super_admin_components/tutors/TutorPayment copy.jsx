import React, { useState } from "react";
import "../../../../../styles/PaymentTable.css";
import { Loader1 } from "../../../../Loaders/Loader1";

export const TutorPayment = () => {
  const [week, setWeek] = useState(new Date().toISOString().substring(0, 10));

  const paymentData = [
    {
      id: 12345,
      name: "John Doe",
      payment: "$100",
      status: "Paid",
      date: "2023-05-01",
    },
    {
      id: 67890,
      name: "Jane Smith",
      payment: "$75",
      status: "Pending",
      date: "2023-05-03",
    },
    {
      id: 13579,
      name: "Bob Johnson",
      payment: "$50",
      status: "Paid",
      date: "2023-05-02",
    },
    // add more payment data objects here...
  ];

  const [filteredData, setFilteredData] = useState(paymentData);

  const handleWeekChange = (event) => {
    setWeek(event.target.value);
    const filteredData = paymentData.filter((payment) => {
      const paymentDate = new Date(payment.date);
      const weekStart = new Date(week);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 7);

      setFilteredData(paymentDate >= weekStart && paymentDate < weekEnd);
      return;
    });
  };

  return (
    <div className="table-container">
      <div className="header">
        <h2 className="title">Tutor Payments</h2>
        <label htmlFor="week" className="week-label">
          Select week:
        </label>
        <input
          type="week"
          id="week"
          name="week"
          value={week}
          onChange={handleWeekChange}
          className="week-input"
        />
      </div>

      <div
        className={glassStyles.tableWrapper}
        onScroll={(e) => {
          if (e.target.scrollTop > 0) {
            setIsTableScrolled(true);
          } else {
            setIsTableScrolled(false);
          }
        }}
      >
        <table className={glassStyles.table} id="jobTable">
          <thead className={`${glassStyles.scrolledTableHead}`}>
            <tr>
              <th>Name</th>
              <th>Subjects</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {true ? (
              <span className={glassStyles.insideTableLoaderWrapper}>
                <Loader1 />
              </span>
            ) : filteredData?.length !== 0 ? (
              filteredData?.map((userDetail, i) => {
                return (
                  <tr key={i}>
                    <td>
                      <button
                        className="btn--small"
                        style={{ background: "purple", color: "white" }}
                      >
                        Subjects
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <span className={glassStyles.insideTableLoaderWrapper}>
                <h2>0 Approved Tutors</h2>
              </span>
            )}
          </tbody>
        </table>
      </div>
      <table className="payment-table">
        <thead>
          <tr>
            <th>Assignment ID</th>
            <th>Tutor Name</th>
            <th>Tutor Payment</th>
            <th>Payment Status</th>
            <th>Chat</th>
          </tr>
        </thead>
        <tbody>
          {filteredData?.map((payment) => (
            <tr key={payment.id}>
              <td>{payment.id}</td>
              <td>{payment.name}</td>
              <td>{payment.payment}</td>
              <td>{payment.status}</td>
              <td>
                <button className="chat-button">Chat</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
