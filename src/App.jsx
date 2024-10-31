import { useState, useEffect, useContext, useMemo } from "react";
import {
  Route,
  Routes,
  useLocation,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { useQueryClient } from "react-query";
import { LoginStudent } from "./pages/LoginStudent";
import { RegisterStudent } from "./pages/RegisterStudent";
import { RegisterTutor } from "./pages/RegisterTutor";
import "./styles/global.scss";
import api, { getAccessToken, SOCKET_BASE_URL } from "./services/api";
import userContext from "./context/userContext";
import { LoginTutor } from "./pages/LoginTutor";
import { LoginAdmin } from "./pages/LoginAdmin";
import { ForgotPassword } from "./components/auth/ForgotPassword";
import { Homepage } from "./pages/Homepage";
import styles from "./styles/app.module.scss";
import { Toaster } from "react-hot-toast";
import { About } from "./pages/About";
import ResetPassword from "./pages/ResetPassword";
import { AdminForgotPassword } from "./components/auth/AdminForgotPassword";
import { SuperAdminDashboard } from "./components/admin/dashboard/SuperAdminDashboard";
import { SuperAdminHome } from "./components/admin/dashboard/super_admin_components/SuperAdminHome";
import { ApprovedTutors } from "./components/admin/dashboard/super_admin_components/tutors/ApprovedTutors";
import { RejectedTutors } from "./components/admin/dashboard/super_admin_components/tutors/RejectedTutors";
import { RegisteredUnapprovedTutors } from "./components/admin/dashboard/super_admin_components/tutors/RegisteredUnapproved";
import { TutorPayment } from "./components/admin/dashboard/super_admin_components/tutors/TutorPayment";
import { TutorSessionHistory } from "./components/admin/dashboard/super_admin_components/tutors/TutorSessionHistory";
import { ViewAllStudents } from "./components/admin/dashboard/super_admin_components/students/ViewAllStudents";
import { StudentPayment } from "./components/admin/dashboard/super_admin_components/students/StudentPayment";
import { StudentsSessionHistory } from "./components/admin/dashboard/super_admin_components/students/StudentsSessionHistory";
import { SuperAdminMaps } from "./components/admin/dashboard/super_admin_components/SuperAdminMaps";
import { SuperAdminQuery } from "./components/admin/dashboard/super_admin_components/SuperAdminQuery";
import { SuperAdminTestResults } from "./components/admin/dashboard/super_admin_components/SuperAdminTestResults";
import { Create_CoAdmin_SubAdmin } from "./components/admin/dashboard/super_admin_components/admin/Create_CoAdmin_SubAdmin";
import { ViewAllAdmins } from "./components/admin/dashboard/super_admin_components/admin/ViewAllAdmins";
import { ActivityLog } from "./components/admin/dashboard/super_admin_components/ActivityLog";
import AddSubject from "./components/admin/dashboard/super_admin_components/addData/AddSubject";
import AddJobs from "./components/admin/dashboard/super_admin_components/addData/AddJobs";
import AddCountry from "./components/admin/dashboard/super_admin_components/addData/AddCountry";
import Career from "./pages/Career";
import JobDescription from "./pages/JobDescription";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import { SuperAdminApplicants } from "./components/admin/dashboard/super_admin_components/applicants/SuperAdminApplicants";

// import AdminChat from "./pages/AdminChat";
// import StudentChatPage from "./pages/StudentChatPage";
import StudentChat from "./components/student/dashboard/chat/StudentChat";
import AdminStudentChat from "./components/admin/dashboard/super_admin_components/adminChat/adminStudentChat/AdminStudentChat";
import SubAdminStudentChat from "./components/admin/dashboard/super_admin_components/adminChat/adminStudentChat/SubAdminChat";
import AdminTutorChat from "./components/admin/dashboard/super_admin_components/adminChat/adminTutorChat/AdminTutorChat";
import { StudentDashboard } from "./components/student/dashboard/StudentDashboard";
import { StudentHome } from "./components/student/dashboard/student_components/StudentHome";
import { StudentJoinRoom } from "./components/student/dashboard/student_components/StudentJoinRoom";
import { StudentGroupRoom } from "./components/student/dashboard/student_components/StudentGroupRoom";
import { StudentEnterSession } from "./components/student/dashboard/student_components/StudentEnterSession";
import { StudentMyProjects } from "./components/student/dashboard/student_components/post_projects/StudentMyProjects";
import { SuperAdminApplicantsHome } from "./components/admin/dashboard/super_admin_components/applicants/SuperAdminApplicantsHome";
import { StudentCreateNewProject } from "./components/student/dashboard/student_components/post_projects/StudentCreateNewProject";
import { TutorDashboard } from "./components/tutor/dashboard/TutorDashboard";
import { TutorHome } from "./components/tutor/dashboard/tutor_components/TutorHome";
import { TutorJoinRoom } from "./components/tutor/dashboard/tutor_components/TutorJoinRoom";
import { TutorGroupRoom } from "./components/tutor/dashboard/tutor_components/TutorGroupRoom";
import { TutorTakeTest } from "./components/tutor/dashboard/tutor_components/TutorTakeTest";
import { TutorEnterSession } from "./components/tutor/dashboard/tutor_components/TutorEnterSession";
import TutorUnderReview from "./components/tutor/dashboard/TutorUnderReview";
import TutorBlocked from "./components/tutor/dashboard/TutorBlocked";

import Camera from "./components/camera/Camera";
import Video from "./components/camera/Video";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

import TutorGroupChat from "./components/tutor/TutorGroupChat";
import { AdminDashboard } from "./components/admin/dashboard/AdminDashboard";
import { AdminHome } from "./components/admin/dashboard/admin_components/AdminHome";
import { CoAdminDashboard } from "./components/admin/dashboard/CoAdminDasboard";
import Chatter from "./components/student/Chatter";
import {
  CoAdminHome,
  CoAdminSessionShedule,
  CoAdminPersonalDetails,
  CoAdminMaps,
  CoAdminQuery,
  CoAdminTestResults,
  CoAdminPayments,
} from "./components/admin/dashboard/co_admin_components";
import { SubAdminDashboard } from "./components/admin/dashboard/SubAdminDashboard";
import {
  SubAdminHome,
  SubAdminMaps,
  SubAdminPayments,
  SubAdminPersonalDetails,
  SubAdminQuery,
  SubAdminSessionShedule,
  SubAdminTestResults,
} from "./components/admin/dashboard/sub_admin_components";
import StudentGroups from "./components/admin/dashboard/super_admin_components/createGroups/studentGroup/StudentsGroups";

import VideoCall from "./components/admin/dashboard/super_admin_components/adminChat/adminAdminChat/VideoCall";
import Room from "./components/Room/Room";
import Main from "./components/Main/Main";
import ProtectedRoute from "./context/ProtectedRoute";
import {
  SuperAdminBlockedTutors,
  SuperAdminLinkGeneration,
  SuperAdminPersonalDetails,
  SuperAdminProjectPayment,
  SuperAdminProjectRateCalculator,
  SuperAdminRateCalculatorByCountry,
  SuperAdminTutorPayment,
  SuperAdminTutorWeeklyPayment,
  SuperAdminUnregisteredNonVerifiedEmailTutors,
  SuperAdminSessionShedule,
  SuperAdminViewAllLeadUsers,
  SuperAdminCreateBlog,
  SuperAdminViewAllBlogs,
} from "./components/admin/dashboard/super_admin_components";
import { NotFound } from "./components/404/NotFound";
import AdminGroup from "./components/admin/dashboard/super_admin_components/createGroups/adminGroup/AdminGroup";
import IpaGroup from "./components/admin/dashboard/super_admin_components/createGroups/ipaGroup/IpaGroup";
import AdminGroupChat from "./components/admin/dashboard/super_admin_components/GroupChat/AdminGroupChat";
import {
  TutorPaidPayment,
  TutorUnPaidPayment,
  TutorPersonalDetails,
} from "./components/tutor/dashboard/tutor_components";
import {
  AdminPersonalDetails,
  AdminSessionShedule,
} from "./components/admin/dashboard/admin_components";
import { ChangePassword } from "./components/auth/ChangePassword";
import StudentGroupChat from "./components/student/StudentGroupChat";
import { StudentPersonalDetails } from "./components/student/dashboard/student_components";
import Whiteboard from "./components/whiteboard/Whiteboard";
import { WhiteboardProvider } from "./context/WhiteboardContext";
import { TermsConditions } from "./pages/TermsConditions";
import { RefundPolicy } from "./pages/RefundPolicy";
import BoardContextProvider from "./context/boardContext";
import Home from "./components/whiteboard/homePage/home";
import WhiteboardHomeScreen from "./components/whiteboard/whiteboardHomeScreen";
import Playboard from "./components/whiteboard/playboard/playboard";
import PlayboardWrapper from "./components/whiteboard/playboard/playboardWrapper";
import WhiteboardDashboard from "./components/whiteboard/whiteboard_dashboard/whiteboard_dashboard";
import WhiteboardDashBoardProvider from "./context/whiteboardDashboardContentext";
import { QuickChat } from "./components/admin/dashboard/super_admin_components/quick_chat/QuickChat";
import {
  DefaultMainChatIndex,
  GroupMainChat,
  SingleUserMainChat,
} from "./components/Chat";
import { OnlineTutoringServices } from "./pages/services/OnlineTutoringServices";
import { OnlineHomeworkHelp } from "./pages/services/OnlineHomeworkHelp";
import { AssignmentHelp } from "./pages/services/AssignmentHelp";
import { LandingPage_1, ThankYouPage } from "./landing_pages";
import QuickChatFixedButton from "./components/quickChat/QuickChatFixedButton";
import FixedQuickChat from "./components/quickChat/QuickChat";
import { QuickChatUserContext } from "./context/QuickChatUserContext";
import {
  SingleAdminAdminChat,
  SingleAdminStudentChat,
  SingleStudentChatWithAdmin,
  SingleAdminTutorChat,
} from "./components/single_chat";
import {
  AdminAdminGroupChat,
  AdminStudentGroupChat,
  AdminTutorGroupChat,
  IPAGroupChat,
  IPAStudentGroupChat,
  IPATutorGroupChat,
} from "./components/group_chat";
import { CHAT_TYPE } from "../constants/helpers";
import CustomMessageToast from "./components/CustomMessageToast";
import TutorAdminChat from "./components/tutor/dashboard/tutor_components/chat/TutorAdminChat";
import ProjectManagement from "./pages/services/ProjectManagement";
import BlogHome from "./pages/blog/BlogHome";
import SingleBlogPost from "./pages/blog/SingleBlogPost";
import EditBlog from "./components/admin/dashboard/super_admin_components/blogs/EditBlog";
import LeadUserPopup from "./components/popup/LeadUserPopup";
import Sitemap from "./pages/Sitemap";
import { ContactUs } from "./pages/ContactUs";
import { Update } from "./components/Update";
import PaymentSuccess from "./pages/payment/PaymentSuccess";
import {
  handleProjectUpdatedSocketEventInAdminProjects,
  handleProjectUpdatedSocketEventInStudentProjects,
  handleProjectUpdatedSocketEventInTutorProjects,
  handleStudentCreatedNewProjectEventInAdminProjects,
  handleStudentCreatedNewProjectEventInStudentProjects,
} from "./components/project/common/utils";
import { USER_TYPES } from "../constants/user";
import AdminProjectsOutlet from "./components/project/AdminProjectsOutlet";
import TutorProjectsOutlet from "./components/project/TutorProjectsOutlet";
import ViewTutorProjectsOutlet from "./components/project/ViewTutorProjectsOutlet";

function App() {
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);
  const [socket, setSocket] = useState(io(SOCKET_BASE_URL));
  const location = useLocation();
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const { isQuickChatVisible } = useContext(QuickChatUserContext);
  const [canShowLeadUserPopup, setCanShowLeadUserPopup] = useState(false);

  async function check_previous_session(token) {
    try {
      const { data } = await api.get("user/me", {
        headers: { Authorization: token },
      });
      setUserData(data);

      if (location.pathname === "/") {
        if (data.userType === "Student") {
          // skt.emit("student_admin_go_online", data?._id);
          navigate("/student");
        } else if (data.userType === "Tutor") {
          // skt.emit("tutor_admin_go_online", data?._id);
          navigate("/tutor");
        } else if (data.userType === "Super-Admin") {
          navigate("/super-admin");
        } else if (data.userType === "Admin") {
          navigate("/admin");
        } else if (data.userType === "Co-Admin") {
          navigate("/co-admin");
        } else if (data.userType === "Sub-Admin") {
          navigate("/sub-admin");
        }
      }
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    const token = getAccessToken();
    if (token === null) return;
    check_previous_session(token);
  }, []);

  useEffect(() => {
    if (socket && userData) {
      //   socket.emit("user_join", userData);
      socket.on("recieve_chat_message_notification", (notification) => {
        const { to, title, description, data } = notification;
        console.log(notification);
        if (to.includes(userData._id)) {
          const { chatType, conversation_id, messages } = data;
          let redirectLink = "";
          console.log(chatType);
          switch (chatType) {
            case CHAT_TYPE.adminAdminGroupChat:
              redirectLink = `/${userData?.userType.toLowerCase()}/admin-admin-group-chat/${conversation_id}`;
              break;
            case CHAT_TYPE.adminStudentGroupChat:
              redirectLink = `/${userData?.userType.toLowerCase()}/admin-student-group-chat/${conversation_id}`;
              break;
            case CHAT_TYPE.adminTutorGroupChat:
              redirectLink = `/${userData?.userType.toLowerCase()}/admin-tutor-group-chat/${conversation_id}`;
              break;
            case CHAT_TYPE.adminAdminSingleChat:
              redirectLink = `/${userData?.userType.toLowerCase()}/admin-admin-chat/${conversation_id}`;
              break;
            case CHAT_TYPE.quickChat:
              redirectLink = `/${userData?.userType.toLowerCase()}/quick-chat/${conversation_id}`;
              break;
            case CHAT_TYPE.ipaStudentGroupChat:
              redirectLink = `/${userData?.userType.toLowerCase()}/ipa-group-chat/${conversation_id}`;
              break;
            case CHAT_TYPE.ipaTutorGroupChat:
              redirectLink = `/${userData?.userType.toLowerCase()}/ipa-group-chat/${conversation_id}`;
              break;
            case CHAT_TYPE.adminTutorSingleChat:
              redirectLink = `/${userData?.userType.toLowerCase()}/admin-tutor-chat/${conversation_id}`;
              break;
            case CHAT_TYPE.adminStudentSingleChat:
              redirectLink = `/${userData?.userType.toLowerCase()}/admin-student-chat/${conversation_id}`;
              break;
            default:
              redirectLink = "/";
          }
          toast.custom(
            (t) => (
              <CustomMessageToast
                t={t}
                title={title}
                description={description}
                redirectLink={redirectLink}
              />
            ),
            {
              duration: 5000,
              position: "top-right",
            }
          );
        }
      });

      socket.on("update-server", () => {
        console.log("new_update");
        window.location.reload();
      });
    }
    return () => {
      socket.off("chat_message_notification");
      if (userData) {
        socket.emit("user_leave", userData);
      }
    };
  }, [socket, userData]);

  useEffect(() => {
    // handle project data realtime updates
    let firstSocketOff = () => {};
    let secondSocketOff = () => {};
    let thirdSocketOff = () => {};
    let fourthSocketOff = () => {};
    let fifthSocketOff = () => {};
    if (socket && userData) {
      if (
        userData?.userType !== USER_TYPES.tutor &&
        userData?.userType !== USER_TYPES.student
      ) {
        firstSocketOff = handleProjectUpdatedSocketEventInAdminProjects({
          socket,
          queryClient,
          user: userData,
        });
        fourthSocketOff = handleStudentCreatedNewProjectEventInAdminProjects({
          socket,
          queryClient,
          user: userData,
        });
      } else if (userData?.userType === USER_TYPES.tutor) {
        secondSocketOff = handleProjectUpdatedSocketEventInTutorProjects({
          socket,
          queryClient,
          user: userData,
        });
      } else {
        thirdSocketOff = handleProjectUpdatedSocketEventInStudentProjects({
          socket,
          queryClient,
          user: userData,
        });
        fifthSocketOff = handleStudentCreatedNewProjectEventInStudentProjects({
          socket,
          queryClient,
          user: userData,
        });
      }
    }
    return () => {
      firstSocketOff();
      secondSocketOff();
      thirdSocketOff();
      fourthSocketOff();
      fifthSocketOff();
    };
  }, [userData, socket, queryClient]);

  const Compilation_admin_subdomain = useMemo(
    () =>
      window.location.host.split(".")[0] === "admin" ? LoginAdmin : Homepage,
    [window.location.host.split(".")[0]]
  );

  const logout = async () => {
    try {
      const res = await api.post(
        "user/handle-logout-updates",
        {},
        {
          headers: {
            Authorization: getAccessToken(),
          },
        }
      );
      if (userData.userType === "Student") {
        socket.emit("student_admin_go_offline", userData?._id);
      } else if (userData.userType === "Tutor") {
        socket.emit("tutor_admin_go_offline", userData?._id);
      }
      localStorage.removeItem("access_token");
      setUserData();
      toast.success("loggedout successfully", {
        duration: 4000,
        position: "top-center",
        style: { border: "2px solid var(--success-color)" },
      });
    } catch (err) {
      console.log(err);
    }
    navigate("/");
  };

  return (
    <userContext.Provider
      value={{
        userData,
        setUserData,
        user,
        setUser,
        logout,
        socket,
        setSocket,
      }}
    >
      <WhiteboardProvider>
        <WhiteboardDashBoardProvider>
          <div className="App">
            <main
              className={
                location.pathname === "/" ||
                location.pathname === "/best-online-tutors-home"
                  ? styles.main
                  : ""
              }
            >
              <Routes>
                <Route path="/" element={<Compilation_admin_subdomain />} />
                <Route
                  path="/best-online-tutors-home"
                  element={<Compilation_admin_subdomain />}
                />
                <Route path="/login/admin" element={<LoginAdmin />} />
                <Route path="/login/student" element={<LoginStudent />} />
                <Route path="/login/tutor" element={<LoginTutor />} />
                <Route path="/register/student" element={<RegisterStudent />} />
                <Route path="/register/tutor" element={<RegisterTutor />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/camera" element={<Camera />} />
                <Route path="/video" element={<Video />} />
                <Route
                  path="/admin-forgot-password"
                  element={<AdminForgotPassword />}
                />
                <Route path="/career" element={<Career />} />
                <Route path="/contact-us" element={<ContactUs />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms-conditions" element={<TermsConditions />} />
                <Route path="/refund-policy" element={<RefundPolicy />} />
                <Route path="/sitemap" element={<Sitemap />} />
                <Route
                  path="/jobDescription/:id"
                  element={<JobDescription />}
                />
                <Route path="/about" element={<About />} />
                <Route
                  path="/reset-password/:token1/:token2/:token3"
                  element={<ResetPassword />}
                />
                <Route
                  path="/services/online-tutoring-services"
                  element={<OnlineTutoringServices />}
                />
                <Route
                  path="/services/online-homework-help"
                  element={<OnlineHomeworkHelp />}
                />
                <Route
                  path="/services/assignment-help"
                  element={<AssignmentHelp />}
                />
                <Route
                  path="/services/project-management-services-from-megamind"
                  element={<ProjectManagement />}
                />
                {/* Landing pages */}
                <Route
                  path="/homework-assignment-project"
                  element={<LandingPage_1 />}
                />
                <Route path="/thank-you" element={<ThankYouPage />} />
                <Route path="/blog" element={<BlogHome />} />
                <Route path="/blog/:slug" element={<SingleBlogPost />} />
                <Route path="/app/update" element={<Update />} />
                <Route
                  path="whiteboard/:boardId"
                  element={
                    <BoardContextProvider>
                      <Whiteboard />
                    </BoardContextProvider>
                  }
                />
                <Route
                  path="whiteboard/whiteboard_sessions"
                  element={
                    <BoardContextProvider>
                      <WhiteboardHomeScreen />
                    </BoardContextProvider>
                  }
                />
                <Route
                  path="whiteboard/play_board"
                  element={
                    <PlayboardWrapper>
                      <Playboard />
                    </PlayboardWrapper>
                  }
                />
                {/* payment link success page */}
                <Route
                  path="/payment/s/:bcryptPaymentLinkId"
                  element={<PaymentSuccess />}
                />
                {/* payment intent success page */}
                <Route
                  path="/payment/pi/s/:paymentIntentId"
                  element={<PaymentSuccess />}
                />
                <Route
                  path="/super-admin"
                  element={
                    <ProtectedRoute path="/super-admin" userType="Super-Admin">
                      <SuperAdminDashboard />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<Navigate to="home" replace />} />
                  <Route path="home" element={<SuperAdminHome />} />
                  <Route
                    path="session-shedule"
                    element={<SuperAdminSessionShedule />}
                  />
                  <Route path="tutors-chat" element={<TutorGroupChat />} />
                  <Route
                    path="personal-details"
                    element={<SuperAdminPersonalDetails />}
                  />
                  <Route
                    path="lead-users"
                    element={<SuperAdminViewAllLeadUsers />}
                  />
                  <Route path="quick-chat" element={<QuickChat />}>
                    <Route index element={<DefaultMainChatIndex />} />
                    <Route
                      path=":conversationId"
                      element={<SingleUserMainChat />}
                    />
                  </Route>
                  <Route
                    path="admin-admin-chat"
                    element={<SingleAdminAdminChat />}
                  >
                    <Route index element={<DefaultMainChatIndex />} />
                    <Route
                      path=":conversationId"
                      element={<SingleUserMainChat />}
                    />
                  </Route>
                  <Route
                    path="admin-student-chat"
                    element={<SingleAdminStudentChat />}
                  >
                    <Route index element={<DefaultMainChatIndex />} />
                    <Route
                      path=":conversationId"
                      element={<SingleUserMainChat />}
                    />
                  </Route>
                  <Route
                    path="admin-admin-group-chat"
                    element={<AdminAdminGroupChat />}
                  >
                    <Route index element={<DefaultMainChatIndex />} />
                    <Route path=":conversationId" element={<GroupMainChat />} />
                  </Route>
                  <Route
                    path="admin-tutor-group-chat"
                    element={<AdminTutorGroupChat />}
                  >
                    <Route index element={<DefaultMainChatIndex />} />
                    <Route path=":conversationId" element={<GroupMainChat />} />
                  </Route>
                  <Route
                    path="admin-student-group-chat"
                    element={<AdminStudentGroupChat />}
                  >
                    <Route index element={<DefaultMainChatIndex />} />
                    <Route path=":conversationId" element={<GroupMainChat />} />
                  </Route>
                  <Route path="ipa-group-chat" element={<IPAGroupChat />}>
                    <Route index element={<DefaultMainChatIndex />} />
                    <Route path=":conversationId" element={<GroupMainChat />} />
                  </Route>
                  <Route
                    path="personal-details/change-password"
                    element={
                      <ChangePassword
                        formFor={`Super-Admin`}
                        redirectTo={`/super-admin/personal-details`}
                      />
                    }
                  />
                  <Route path="add-country" element={<AddCountry />} />
                  <Route path="add-subject" element={<AddSubject />} />
                  <Route path="add-jobs" element={<AddJobs />} />
                  <Route path="student-groups" element={<StudentGroups />} />
                  <Route path="admin-groups" element={<AdminGroup />} />
                  <Route path="ipa-groups" element={<IpaGroup />} />
                  <Route path="group-chat" element={<AdminGroupChat />} />
                  {/* <Route path="ipa-chat" element={<IPAGroupChat />} /> */}
                  <Route path="chatter" element={<Chatter />} />
                  <Route path="video-call" element={<VideoCall />} />
                  <Route path="video" element={<Main />} />
                  <Route path="room/:roomId" element={<Room />} />
                  {/* <Route path="whiteboard" element={<Whiteboard />} /> */}

                  {/* // tutors start */}
                  <Route path="approved-tutors" element={<ApprovedTutors />} />
                  <Route path="rejected-tutors" element={<RejectedTutors />} />
                  <Route
                    path="registered-unapproved-tutors"
                    element={<RegisteredUnapprovedTutors />}
                  />
                  <Route
                    path="unregistered-nonverified-email-tutors"
                    element={<SuperAdminUnregisteredNonVerifiedEmailTutors />}
                  />
                  <Route
                    path="blocked-tutors"
                    element={<SuperAdminBlockedTutors />}
                  />
                  <Route path="tutors-payment" element={<TutorPayment />} />
                  <Route
                    path="tutors-session-history"
                    element={<TutorSessionHistory />}
                  />
                  <Route
                    path="admin-tutor-chat"
                    element={<SingleAdminTutorChat />}
                  >
                    <Route index element={<DefaultMainChatIndex />} />
                    <Route
                      path=":conversationId"
                      element={<SingleUserMainChat />}
                    />
                  </Route>
                  {/* // tutors end // students start */}
                  <Route
                    path="view-all-students"
                    element={<ViewAllStudents />}
                  />
                  <Route path="view-all-admins" element={<ViewAllAdmins />} />
                  <Route path="students-payment" element={<StudentPayment />} />
                  <Route
                    path="students-session-history"
                    element={<StudentsSessionHistory />}
                  />
                  {/* // students end */}
                  <Route path="maps" element={<SuperAdminMaps />} />
                  <Route path="query" element={<SuperAdminQuery />} />
                  {/* <Route path="test-results" element={<SuperAdminTestResults />} /> */}
                  <Route
                    path="create-coadmin-subadmin"
                    element={<Create_CoAdmin_SubAdmin />}
                  />
                  <Route path="view-all-admins" element={<ViewAllAdmins />} />
                  <Route
                    path="all-projects"
                    element={<AdminProjectsOutlet />}
                  />
                  <Route
                    path="all-projects/:id"
                    element={<AdminProjectsOutlet />}
                  />
                  <Route
                    path="all-projects/view-tutor-projects/:tutorId"
                    element={<ViewTutorProjectsOutlet />}
                  />
                  <Route path="activity-log" element={<ActivityLog />} />
                  {/* payments start */}
                  <Route
                    path="tutor-payment"
                    element={<SuperAdminTutorPayment />}
                  />
                  <Route
                    path="tutor-payment/:tutorId"
                    element={<SuperAdminTutorWeeklyPayment />}
                  />
                  <Route
                    path="project-payment"
                    element={<SuperAdminProjectPayment />}
                  />
                  <Route
                    path="link-generation"
                    element={<SuperAdminLinkGeneration />}
                  />
                  {/* payments end */}
                  <Route
                    path="job-applicants"
                    element={<SuperAdminApplicantsHome />}
                  />
                  <Route
                    path="job-applicants/applicants/:jobId"
                    element={<SuperAdminApplicants />}
                  />
                  <Route
                    path="project-rate-calculator"
                    element={<SuperAdminProjectRateCalculator />}
                  />
                  <Route
                    path="project-rate-calculator/:countryAndCode"
                    element={<SuperAdminRateCalculatorByCountry />}
                  />
                  <Route
                    path="whiteboard"
                    element={
                      <BoardContextProvider>
                        {/* <Home /> */}
                        <WhiteboardHomeScreen />
                      </BoardContextProvider>
                    }
                  />

                  <Route
                    path="whiteboard/play_board"
                    element={
                      <PlayboardWrapper>
                        <Playboard />
                      </PlayboardWrapper>
                    }
                  />
                  <Route
                    path="whiteboard/:boardId"
                    element={
                      // <BoardContextProvider>
                      //     <Whiteboard />
                      // </BoardContextProvider>
                      <WhiteboardDashboard />
                    }
                  />
                  <Route
                    path="whiteboard/whiteboard_sessions"
                    element={
                      <BoardContextProvider>
                        <WhiteboardHomeScreen />
                      </BoardContextProvider>
                    }
                  />
                  <Route
                    path="blog/create-blog"
                    element={<SuperAdminCreateBlog />}
                  />
                  <Route path="blog/edit-blog/:slug" element={<EditBlog />} />
                  <Route
                    path="blog/view-all-blogs"
                    element={<SuperAdminViewAllBlogs />}
                  />
                </Route>
                {/* ************************ */}
                {/* // Dashboard Admin Routes (all routes similar to the SuperAdmin */}
                {/* routes) */}
                {/* <Route path="/admin" element={<AdminDashboard />}> */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute path="/admin" userType="Admin">
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                >
                  {/* <ProtectedRoute path="/admin" userType="admin">
                                        <AdminDashboard />
                                    </ProtectedRoute> */}
                  <Route index element={<Navigate to="home" replace />} />
                  <Route path="admin-groups" element={<AdminGroup />} />
                  <Route path="home" element={<AdminHome />} />
                  <Route
                    path="session-shedule"
                    element={<AdminSessionShedule />}
                  />
                  <Route
                    path="personal-details"
                    element={<AdminPersonalDetails />}
                  />
                  <Route
                    path="personal-details/change-password"
                    element={
                      <ChangePassword
                        formFor={`Admin`}
                        redirectTo={`/admin/personal-details`}
                      />
                    }
                  />
                  <Route path="quick-chat" element={<QuickChat />}>
                    <Route index element={<DefaultMainChatIndex />} />
                    <Route
                      path=":conversationId"
                      element={<SingleUserMainChat />}
                    />
                  </Route>
                  <Route
                    path="admin-admin-chat"
                    element={<SingleAdminAdminChat />}
                  >
                    <Route index element={<DefaultMainChatIndex />} />
                    <Route
                      path=":conversationId"
                      element={<SingleUserMainChat />}
                    />
                  </Route>
                  <Route
                    path="admin-student-chat"
                    element={<SingleAdminStudentChat />}
                  >
                    <Route index element={<DefaultMainChatIndex />} />
                    <Route
                      path=":conversationId"
                      element={<SingleUserMainChat />}
                    />
                  </Route>
                  <Route
                    path="admin-admin-group-chat"
                    element={<AdminAdminGroupChat />}
                  >
                    <Route index element={<DefaultMainChatIndex />} />
                    <Route path=":conversationId" element={<GroupMainChat />} />
                  </Route>
                  <Route
                    path="admin-tutor-group-chat"
                    element={<AdminTutorGroupChat />}
                  >
                    <Route index element={<DefaultMainChatIndex />} />
                    <Route path=":conversationId" element={<GroupMainChat />} />
                  </Route>
                  <Route
                    path="admin-student-group-chat"
                    element={<AdminStudentGroupChat />}
                  >
                    <Route index element={<DefaultMainChatIndex />} />
                    <Route path=":conversationId" element={<GroupMainChat />} />
                  </Route>
                  <Route path="ipa-group-chat" element={<IPAGroupChat />}>
                    <Route index element={<DefaultMainChatIndex />} />
                    <Route path=":conversationId" element={<GroupMainChat />} />
                  </Route>
                  <Route path="group-chat" element={<AdminGroupChat />} />

                  {/* <Route path="whiteboard" element={<Whiteboard />} /> */}

                  <Route path="add-country" element={<AddCountry />} />
                  <Route path="add-subject" element={<AddSubject />} />
                  <Route path="add-jobs" element={<AddJobs />} />
                  {/* // tutors start */}
                  <Route
                    path="approved-tutors"
                    element={<ApprovedTutors isAdminComponent={true} />}
                  />
                  <Route
                    path="rejected-tutors"
                    element={<RejectedTutors isAdminComponent={true} />}
                  />
                  <Route
                    path="registered-unapproved-tutors"
                    element={
                      <RegisteredUnapprovedTutors isAdminComponent={true} />
                    }
                  />
                  <Route
                    path="unregistered-nonverified-email-tutors"
                    element={
                      <SuperAdminUnregisteredNonVerifiedEmailTutors
                        isAdminComponent={true}
                      />
                    }
                  />
                  <Route
                    path="blocked-tutors"
                    element={
                      <SuperAdminBlockedTutors isAdminComponent={true} />
                    }
                  />
                  <Route path="tutors-payment" element={<TutorPayment />} />
                  <Route
                    path="tutors-session-history"
                    element={<TutorSessionHistory />}
                  />
                  <Route path="admin-tutor-chat" element={<AdminTutorChat />} />
                  {/* // tutors end // students start */}
                  <Route
                    path="view-all-students"
                    element={<ViewAllStudents isAdminComponent={true} />}
                  />
                  <Route path="admin-chat" element={<AdminStudentChat />} />
                  <Route path="students-payment" element={<StudentPayment />} />
                  <Route
                    path="students-session-history"
                    element={<StudentsSessionHistory />}
                  />
                  {/* // students end */}
                  <Route path="maps" element={<SuperAdminMaps />} />
                  <Route path="query" element={<SuperAdminQuery />} />
                  <Route
                    path="test-results"
                    element={<SuperAdminTestResults />}
                  />
                  <Route
                    path="create-coadmin-subadmin"
                    element={
                      <Create_CoAdmin_SubAdmin isAdminComponent={true} />
                    }
                  />
                  <Route
                    path="view-all-admins"
                    element={<ViewAllAdmins isAdminComponent={true} />}
                  />
                  <Route
                    path="all-projects"
                    element={<AdminProjectsOutlet />}
                  />
                  <Route
                    path="all-projects/:id"
                    element={<AdminProjectsOutlet />}
                  />
                  <Route
                    path="all-projects/view-tutor-projects/:tutorId"
                    element={<ViewTutorProjectsOutlet />}
                  />
                  <Route path="activity-log" element={<ActivityLog />} />
                  {/* payments start */}
                  <Route
                    path="tutor-payment"
                    element={<SuperAdminTutorPayment />}
                  />
                  <Route
                    path="tutor-payment/:tutorId"
                    element={<SuperAdminTutorWeeklyPayment />}
                  />
                  <Route
                    path="project-payment"
                    element={<SuperAdminProjectPayment />}
                  />
                  <Route
                    path="link-generation"
                    element={<SuperAdminLinkGeneration />}
                  />
                  {/* payments end */}
                  <Route
                    path="job-applicants"
                    element={<SuperAdminApplicantsHome />}
                  />
                  <Route
                    path="job-applicants/applicants/:jobId"
                    element={<SuperAdminApplicants />}
                  />
                  <Route
                    path="whiteboard"
                    element={
                      <BoardContextProvider>
                        {/* <Home /> */}
                        <WhiteboardHomeScreen />
                      </BoardContextProvider>
                    }
                  />
                  <Route
                    path="whiteboard/whiteboard_sessions"
                    element={
                      <BoardContextProvider>
                        <WhiteboardHomeScreen />
                      </BoardContextProvider>
                    }
                  />
                  <Route
                    path="whiteboard/:boardId"
                    element={
                      <WhiteboardDashboard />

                      // <BoardContextProvider>
                      //     <Whiteboard />
                      // </BoardContextProvider>
                    }
                  />
                  <Route
                    path="whiteboard/play_board"
                    element={
                      <PlayboardWrapper>
                        <Playboard />
                      </PlayboardWrapper>
                    }
                  />

                  {/* <Route path="all-projects/:id" element={<ProjectDetails />} /> */}
                </Route>
                {/* ************************ */}
                {/* // Dashboard Co-Admin Routes */}
                <Route
                  path="/co-admin"
                  element={
                    <ProtectedRoute path="/co-admin" userType="Co-Admin">
                      <CoAdminDashboard />
                    </ProtectedRoute>
                  }
                >
                  {/* <Route path="/co-admin" element={<CoAdminDashboard />}> */}
                  <Route index element={<Navigate to="home" replace />} />
                  <Route path="home" element={<CoAdminHome />} />
                  <Route
                    path="session-shedule"
                    element={<CoAdminSessionShedule />}
                  />
                  <Route
                    path="personal-details"
                    element={<CoAdminPersonalDetails />}
                  />
                  <Route path="quick-chat" element={<QuickChat />}>
                    <Route index element={<DefaultMainChatIndex />} />
                    <Route
                      path=":conversationId"
                      element={<SingleUserMainChat />}
                    />
                  </Route>
                  <Route
                    path="admin-admin-chat"
                    element={<SingleAdminAdminChat />}
                  >
                    <Route index element={<DefaultMainChatIndex />} />
                    <Route
                      path=":conversationId"
                      element={<SingleUserMainChat />}
                    />
                  </Route>
                  <Route
                    path="admin-admin-group-chat"
                    element={<AdminAdminGroupChat />}
                  >
                    <Route index element={<DefaultMainChatIndex />} />
                    <Route path=":conversationId" element={<GroupMainChat />} />
                  </Route>
                  <Route
                    path="admin-tutor-group-chat"
                    element={<AdminTutorGroupChat />}
                  >
                    <Route index element={<DefaultMainChatIndex />} />
                    <Route path=":conversationId" element={<GroupMainChat />} />
                  </Route>
                  <Route
                    path="ipa-group-chat"
                    element={<IPAStudentGroupChat />}
                  >
                    <Route index element={<DefaultMainChatIndex />} />
                    <Route path=":conversationId" element={<GroupMainChat />} />
                  </Route>
                  <Route path="group-chat" element={<AdminGroupChat />} />
                  <Route path="tutors-chat" element={<TutorGroupChat />} />
                  <Route
                    path="personal-details/change-password"
                    element={
                      <ChangePassword
                        formFor={`Co-Admin`}
                        redirectTo={`/co-admin/personal-details`}
                      />
                    }
                  />
                  {/* // tutors routes start (rendering same components as super-admin tutor components) */}
                  <Route
                    path="approved-tutors"
                    element={<ApprovedTutors isCoAdminComponent={true} />}
                  />
                  <Route
                    path="rejected-tutors"
                    element={<RejectedTutors isCoAdminComponent={true} />}
                  />
                  <Route
                    path="registered-unapproved-tutors"
                    element={
                      <RegisteredUnapprovedTutors isCoAdminComponent={true} />
                    }
                  />
                  <Route
                    path="unregistered-nonverified-email-tutors"
                    element={
                      <SuperAdminUnregisteredNonVerifiedEmailTutors
                        isCoAdminComponent={true}
                      />
                    }
                  />
                  <Route
                    path="blocked-tutors"
                    element={
                      <SuperAdminBlockedTutors isCoAdminComponent={true} />
                    }
                  />
                  <Route path="tutors-payment" element={<TutorPayment />} />
                  <Route
                    path="tutors-session-history"
                    element={<TutorSessionHistory />}
                  />

                  <Route
                    path="coadmin-tutor-chat"
                    element={<AdminTutorChat />}
                  />
                  {/* // tutors routes end */}
                  <Route path="maps" element={<CoAdminMaps />} />
                  <Route path="query" element={<CoAdminQuery />} />
                  <Route path="test-results" element={<CoAdminTestResults />} />
                  <Route
                    path="all-projects"
                    element={<AdminProjectsOutlet />}
                  />
                  <Route
                    path="all-projects/:id"
                    element={<AdminProjectsOutlet />}
                  />

                  <Route path="payments" element={<CoAdminPayments />} />
                  {/* <Route
                                    path="whiteboard"
                                    element={
                                        <BoardContextProvider>
                                            <Home />
                                        </BoardContextProvider>
                                    }
                                /> */}
                  <Route
                    path="whiteboard/:boardId"
                    element={
                      <BoardContextProvider>
                        <Whiteboard />
                      </BoardContextProvider>
                    }
                  />
                  <Route
                    path="whiteboard/whiteboard_sessions"
                    element={
                      <BoardContextProvider>
                        <WhiteboardHomeScreen />
                      </BoardContextProvider>
                    }
                  />
                  <Route
                    path="whiteboard/play_board"
                    element={
                      <PlayboardWrapper>
                        <Playboard />
                      </PlayboardWrapper>
                    }
                  />
                </Route>
                {/* ************************ */}
                {/* // Dashboard Sub-Admin Routes */}
                <Route
                  path="/sub-admin"
                  element={
                    <ProtectedRoute path="/sub-admin" userType="Sub-Admin">
                      <SubAdminDashboard />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<Navigate to="home" replace />} />
                  <Route path="home" element={<SubAdminHome />} />
                  <Route
                    path="personal-details"
                    element={<SubAdminPersonalDetails />}
                  />
                  <Route
                    path="personal-details/change-password"
                    element={
                      <ChangePassword
                        formFor={`Sub-Admin`}
                        redirectTo={`/sub-admin/personal-details`}
                      />
                    }
                  />
                  <Route
                    path="session-shedule"
                    element={<SubAdminSessionShedule />}
                  />
                  <Route path="quick-chat" element={<QuickChat />}>
                    <Route index element={<DefaultMainChatIndex />} />
                    <Route
                      path=":conversationId"
                      element={<SingleUserMainChat />}
                    />
                  </Route>
                  <Route
                    path="admin-admin-chat"
                    element={<SingleAdminAdminChat />}
                  >
                    <Route index element={<DefaultMainChatIndex />} />
                    <Route
                      path=":conversationId"
                      element={<SingleUserMainChat />}
                    />
                  </Route>
                  <Route
                    path="admin-student-chat"
                    element={<SingleAdminStudentChat />}
                  >
                    <Route index element={<DefaultMainChatIndex />} />
                    <Route
                      path=":conversationId"
                      element={<SingleUserMainChat />}
                    />
                  </Route>
                  <Route
                    path="admin-admin-group-chat"
                    element={<AdminAdminGroupChat />}
                  >
                    <Route index element={<DefaultMainChatIndex />} />
                    <Route path=":conversationId" element={<GroupMainChat />} />
                  </Route>
                  <Route
                    path="admin-student-group-chat"
                    element={<AdminStudentGroupChat />}
                  >
                    <Route index element={<DefaultMainChatIndex />} />
                    <Route path=":conversationId" element={<GroupMainChat />} />
                  </Route>
                  <Route
                    path="ipa-group-chat"
                    element={<IPAStudentGroupChat />}
                  >
                    <Route index element={<DefaultMainChatIndex />} />
                    <Route path=":conversationId" element={<GroupMainChat />} />
                  </Route>
                  <Route path="group-chat" element={<AdminGroupChat />} />
                  <Route path="students-chat" element={<StudentGroupChat />} />
                  <Route
                    path="subadmin-student-chat"
                    element={<SubAdminStudentChat />}
                  />
                  {/* // students routes start (rendering same components as super-admin students components) */}
                  <Route
                    path="view-all-students"
                    element={<ViewAllStudents isSubAdminComponent={true} />}
                  />
                  {/* <Route path="admin-chat" element={<AdminChat />} /> */}
                  <Route path="students-payment" element={<StudentPayment />} />
                  <Route
                    path="students-session-history"
                    element={<StudentsSessionHistory />}
                  />
                  {/* // students routes end */}
                  <Route path="video-call" element={<VideoCall />} />

                  <Route path="maps" element={<SubAdminMaps />} />
                  <Route path="query" element={<SubAdminQuery />} />
                  <Route
                    path="test-results"
                    element={<SubAdminTestResults />}
                  />
                  <Route
                    path="all-projects"
                    element={<AdminProjectsOutlet />}
                  />
                  <Route
                    path="all-projects/:id"
                    element={<AdminProjectsOutlet />}
                  />
                  <Route path="payments" element={<SubAdminPayments />} />
                  <Route
                    path="whiteboard"
                    element={
                      <BoardContextProvider>
                        <Home />
                      </BoardContextProvider>
                    }
                  />
                  <Route
                    path="whiteboard/whiteboard_sessions"
                    element={
                      <BoardContextProvider>
                        <WhiteboardHomeScreen />
                      </BoardContextProvider>
                    }
                  />
                  <Route
                    path="whiteboard/play_board"
                    element={
                      <PlayboardWrapper>
                        <Playboard />
                      </PlayboardWrapper>
                    }
                  />
                  <Route
                    path="whiteboard/:boardId"
                    element={
                      <WhiteboardDashboard />
                      // <BoardContextProvider>
                      //     <Whiteboard />
                      // </BoardContextProvider>
                    }
                  />
                </Route>
                {/* ************************ */}
                {/* // Dashboard Student Routes */}
                <Route
                  path="/student"
                  element={
                    <ProtectedRoute
                      path="/student"
                      userType="Student"
                      userData={userData}
                    >
                      <StudentDashboard />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<Navigate to="home" replace />} />
                  <Route path="home" element={<StudentHome />} />
                  <Route path="chat" element={<StudentChat />} />
                  <Route
                    path="personal-details"
                    element={<StudentPersonalDetails />}
                  />
                  <Route
                    path="admin-student-chat"
                    element={<SingleStudentChatWithAdmin />}
                  >
                    <Route index element={<DefaultMainChatIndex />} />
                    <Route
                      path=":conversationId"
                      element={<SingleUserMainChat />}
                    />
                  </Route>
                  <Route path="students-chat" element={<StudentGroupChat />} />
                  <Route
                    path="admin-student-group-chat"
                    element={<AdminStudentGroupChat />}
                  >
                    <Route index element={<DefaultMainChatIndex />} />
                    <Route path=":conversationId" element={<GroupMainChat />} />
                  </Route>
                  <Route
                    path="ipa-group-chat"
                    element={<IPAStudentGroupChat />}
                  >
                    <Route index element={<DefaultMainChatIndex />} />
                    <Route path=":conversationId" element={<GroupMainChat />} />
                  </Route>

                  <Route
                    path="personal-details/change-password"
                    element={
                      <ChangePassword
                        formFor={`Student`}
                        redirectTo={`/student/personal-details`}
                      />
                    }
                  />
                  <Route path="join-room" element={<StudentJoinRoom />} />
                  <Route path="group-room" element={<StudentGroupRoom />} />
                  <Route
                    path="session-history"
                    element={<StudentsSessionHistory />}
                  />
                  <Route
                    path="enter-session"
                    element={<StudentEnterSession />}
                  />
                  <Route
                    path="create-new-project"
                    element={<StudentCreateNewProject />}
                  />
                  <Route path="my-projects" element={<StudentMyProjects />} />
                  <Route
                    path="my-projects/:id"
                    element={<StudentMyProjects />}
                  />
                  <Route
                    path="whiteboard/play_board"
                    element={
                      <PlayboardWrapper>
                        <Playboard />
                      </PlayboardWrapper>
                    }
                  />
                  <Route
                    path="whiteboard/whiteboard_sessions"
                    element={
                      <BoardContextProvider>
                        <WhiteboardHomeScreen />
                      </BoardContextProvider>
                    }
                  />
                  <Route
                    path="whiteboard/:boardId"
                    element={
                      <BoardContextProvider>
                        <Whiteboard />
                      </BoardContextProvider>
                    }
                  />
                </Route>
                {/* ************************ */}
                {/* // Dashboard Tutor Routes */}
                {/* <Route path="/tutor" element={<TutorDashboard />}> */}
                <Route
                  path="/tutor"
                  element={
                    <ProtectedRoute
                      path="/tutor"
                      userType="Tutor"
                      userData={userData}
                    >
                      <TutorDashboard />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<Navigate to="home" replace />} />
                  <Route path="home" element={<TutorHome />} />
                  <Route
                    path="personal-details"
                    element={<TutorPersonalDetails />}
                  />
                  <Route path="tutors-chat" element={<TutorGroupChat />} />
                  <Route
                    path="personal-details/change-password"
                    element={
                      <ChangePassword
                        formFor={`Tutor`}
                        redirectTo={`/tutor/personal-details`}
                      />
                    }
                  />
                  <Route path="join-room" element={<TutorJoinRoom />} />
                  <Route path="group-room" element={<TutorGroupRoom />} />
                  <Route path="take-test" element={<TutorTakeTest />} />
                  <Route
                    path="session-history"
                    element={<TutorSessionHistory />}
                  />
                  {/* tutor payment  */}
                  <Route path="paid-payment" element={<TutorPaidPayment />} />
                  <Route
                    path="admin-tutor-group-chat"
                    element={<AdminTutorGroupChat />}
                  >
                    <Route index element={<DefaultMainChatIndex />} />
                    <Route path=":conversationId" element={<GroupMainChat />} />
                  </Route>
                  <Route path="ipa-group-chat" element={<IPATutorGroupChat />}>
                    <Route index element={<DefaultMainChatIndex />} />
                    <Route path=":conversationId" element={<GroupMainChat />} />
                  </Route>
                  <Route
                    path="unpaid-payment"
                    element={<TutorUnPaidPayment />}
                  />
                  <Route path="enter-session" element={<TutorEnterSession />} />
                  <Route
                    path="all-projects"
                    element={<TutorProjectsOutlet />}
                  />
                  <Route
                    path="all-projects/:id"
                    element={<TutorProjectsOutlet />}
                  />
                  <Route path="admin-tutor-chat" element={<TutorAdminChat />}>
                    <Route index element={<DefaultMainChatIndex />} />
                    <Route
                      path=":conversationId"
                      element={<SingleUserMainChat />}
                    />
                  </Route>
                  <Route path="review" element={<TutorUnderReview />} />
                  <Route path="block" element={<TutorBlocked />} />
                  <Route
                    path="whiteboard/play_board"
                    element={
                      <PlayboardWrapper>
                        <Playboard />
                      </PlayboardWrapper>
                    }
                  />
                  <Route
                    path="whiteboard/whiteboard_sessions"
                    element={
                      <BoardContextProvider>
                        <WhiteboardHomeScreen />
                      </BoardContextProvider>
                    }
                  />
                  <Route
                    path="whiteboard/:boardId"
                    element={
                      // <BoardContextProvider>
                      //     <Whiteboard />
                      // </BoardContextProvider>
                      <WhiteboardDashboard />
                    }
                  />
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <FixedQuickChat visibility={isQuickChatVisible} />
            {userData === null ? <QuickChatFixedButton /> : null}
            {canShowLeadUserPopup && (
              <LeadUserPopup
                popupCloseCallback={() => setCanShowLeadUserPopup(false)}
              />
            )}
            <Toaster
              containerStyle={{
                zIndex: "999999999999999999999999999999999999999",
              }}
            />
          </div>
        </WhiteboardDashBoardProvider>
      </WhiteboardProvider>
    </userContext.Provider>
  );
}

export default App;
