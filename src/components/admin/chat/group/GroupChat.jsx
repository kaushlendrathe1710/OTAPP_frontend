import React, { useContext, useEffect, useRef, useState } from "react";
import userdefault from "../../../../assets/defaultImage.jpg";
import { BiSend } from "react-icons/bi";
import { BsFillCameraVideoFill, BsFillTelephoneFill, BsThreeDotsVertical } from "react-icons/bs";
import api, { SOCKET_BASE_URL } from "../../../../services/api";
import { io } from "socket.io-client";
import stylesStudent from '../../../../styles/StudentChat.module.scss'
import styles from "../../../../styles/StudentAdmin.module.scss";
import MainChat from "./MainChat";
import { RiAttachment2, RiCloseLine } from "react-icons/ri";
import { motion, AnimatePresence } from "framer-motion";
import { useClickOutside } from "../../../../hooks/useClickOutside";
import {
  IoAddOutline,
  IoDocumentTextOutline,
  IoImageOutline,
  IoSend,
  IoVideocamOutline,
} from "react-icons/io5";
import { BsFillFileEarmarkPdfFill } from "react-icons/bs";
import { CgFileDocument } from "react-icons/cg";
import { FcDocument } from "react-icons/fc";
import userContext from "../../../../context/userContext";
import { getConversation, getMessages, getMessagesOnScroll, handelInputChange, removeSocketListeners, sendMessage, socketListeners } from "./logic";

const AdminChat = () => {
  io
};

export default AdminChat;