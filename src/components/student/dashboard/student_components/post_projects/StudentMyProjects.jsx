import React, { useState, useEffect, useRef, useContext } from "react";
import api, { getAccessToken } from "../../../../../services/api";
import glassStyles from "../../../../../styles/glass.module.scss";
import utilStyles from "../../../../../styles/utils.module.scss";
import styles from "../../../../../styles/student.module.scss";
import { toast } from "react-hot-toast";

import MainChat from "../../../../projectChat/MainChat";

import userContext from "../../../../../context/userContext";
import {
  socketListeners,
} from "../../chat/logic";
import PaymentModal from "./paymentModal";
import { getBetterDateTime } from "../../../../project/common/utils";
import { ADMINS_PROJECT_TABS } from "../../../../../../constants/helpers";
import { useInfiniteStudentProjectsQuery } from "../../../../../hooks/useProjects";
import StudentProjectsOutlet from "../../../../project/StudentProjectsOutlet";

export const StudentMyProjects = () => {
  const limitRef = useRef(20);
  // const { data } = useInfiniteStudentProjectsQuery();
  const [projects, setProjects] = useState([]);
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState(false);
  const { userData, socket } = useContext(userContext);
  const [chatStatus, setChatStatus] = useState(false);
  const [selectedProject, setSelectedProject] = useState();
  const [selectedProjectType, setSelectedProjectType] = useState();

  const [studentAdminRoom, setStudentAdminRoom] = useState();


  const [currency, setCurrency] = useState("INR");
  const [openPayment, setOpenPayment] = useState(false);
  const [assignmentTitle, setAssignmentTitle] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    socketListeners(
      socket,
      studentAdminRoom,
      userData,
      setStudentAdminRoom,
      setMessages,
      setTyping
    );

    return () => {
      console.log("removed");
      // removeSocketListeners(socket, userData);
    };
  }, []);

  const toggleModalP = (e, val) => {
    setSelectedProject(e);
    setSelectedProjectType(val);
    setChatStatus(!chatStatus);
  };

  async function handlePaymentUpdate(paymentStatus) {
    let formData;

    if (paymentStatus) {
      formData = {
        _id: selectedProject._id,
        status: "Paid",
      };
    }

    try {
      let res = await api.post("/project/student-payment-update", formData, {
        headers: { Authorization: getAccessToken() },
      });
      // console.log(res.data);
      toast.success("You're all set! Your payment has been processed.", {
        duration: 4000,
      });
      if (res.data) {
        // update the status of the project to paid with project id as res.data._id in the projects array

        let temp = [...projects];
        let index = temp.findIndex((e) => e._id === res.data._id);
        temp[index].status = "Paid";
        setProjects(temp);

        setOpenPayment(false);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong.\nPlease try again");
    }
  }

  const setPayment = (e) => {
    setCurrency("INR");
    setAssignmentTitle(e.assignmentId);
    setTotalAmount(e.sPayment);
    setSelectedProject(e);
    setOpenPayment(e);
  };


  const [isTableScrolled, setIsTableScrolled] = useState(false);
  return (
    <>
      <StudentProjectsOutlet />
    </>
  );
};
