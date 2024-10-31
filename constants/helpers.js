const imageFileExtensions = [
  "bmp",
  "gif",
  "jpeg",
  "jpg",
  "png",
  "tif",
  "tiff",
  "webp",
];
const videoFileExtensions = [
  "3g2",
  "3gp",
  "3gp2",
  "3gpp",
  "3gpp2",
  "asf",
  "avi",
  "dat",
  "flv",
  "m2ts",
  "m4v",
  "mkv",
  "mod",
  "mov",
  "mp4",
  "mpe",
  "mpeg",
  "mpeg1",
  "mpeg2",
  "mpeg4",
  "mpg",
  "mts",
  "nsv",
  "ogm",
  "ogv",
  "qt",
  "tod",
  "ts",
  "vob",
  "wmv",
];
const audioFileExtensions = [
  "wav",
  "aif",
  "mp3",
  "mid",
  "aac",
  "ac3",
  "wma",
  "ogg",
];

const documentTypesWithColors = [
  { type: "pdf", color: "#F44336" },
  { type: "doc", color: "#4CAF50" },
  { type: "docx", color: "#4CAF50" },
  { type: "xls", color: "#2196F3" },
  { type: "xlsx", color: "#2196F3" },
  { type: "ppt", color: "#9C27B0" },
  { type: "pptx", color: "#9C27B0" },
  { type: "txt", color: "#FF9800" },
  { type: "zip", color: "#607D8B" },
  { type: "rar", color: "#607D8B" },
  { type: "7z", color: "#607D8B" },
  { type: "jpg", color: "#FFEB3B" },
  { type: "jpeg", color: "#FFEB3B" },
  { type: "png", color: "#FFEB3B" },
  { type: "gif", color: "#FFEB3B" },
  { type: "bmp", color: "#FFEB3B" },
  { type: "svg", color: "#FFEB3B" },
  { type: "mp3", color: "#2196F3" },
  { type: "wav", color: "#4CAF50" },
  { type: "ogg", color: "#FF9800" },
  { type: "m4a", color: "#9C27B0" },
  { type: "aac", color: "#F44336" },
  { type: "wma", color: "#607D8B" },
  { type: "flac", color: "#FF5722" },
  { type: "alac", color: "#E91E63" },
  { type: "aiff", color: "#3F51B5" },
  { type: "dsd", color: "#673AB7" },
  { type: "pcm", color: "#FFEB3B" },
  { type: "au", color: "#8BC34A" },
  { type: "raw", color: "#2196F3" },
  { type: "amr", color: "#FF9800" },
  { type: "mid", color: "#9C27B0" },
  { type: "midi", color: "#F44336" },
];

const acceptalbeDocTypes = `image/*, .doc,.docx,.xml,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document, .pdf, .csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, .xlsx, .xls, .ppt, .pptx,.txt, application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.slideshow,application/vnd.openxmlformats-officedocument.presentationml.presentation, text/plain,`;

const MESSAGE_TYPE = {
  text: "Text",
  file: "File",
  voice: "Voice",
};
const CHAT_TYPE = {
  quickChat: "Quick-Chat",
  adminAdminSingleChat: "Admin-Admin-Single-Chat",
  adminStudentSingleChat: "Admin-Student-Single-Chat",
  adminAdminGroupChat: "Admin-Admin-Group-Chat",
  adminTutorSingleChat: "Admin-Tutor-Single-Chat",
  tutorAdminSingleChat: "Tutor-Admin-Single-Chat",
  adminTutorGroupChat: "Admin-Tutor-Group-Chat",
  adminStudentGroupChat: "Admin-Student-Group-Chat",
  ipaStudentGroupChat: "IPA-Student-Group-Chat",
  ipaTutorGroupChat: "IPA-Tutor-Group-Chat",
  projectChat: "ProjectChat",
};
const AUDIO_RECORDING_TYPE = "audio/wav";

const ADMINS_PROJECT_TABS = [
  {
    key: "all",
    label: "All",
  },
  {
    key: "newAssignment",
    label: "New Assignment",
  },
  {
    key: "adminApproved",
    label: "Approved",
  },
  {
    key: "urgent",
    label: "Urgent",
  },
  {
    key: "coAdminApproved",
    label: "Broadcasted",
  },
  {
    key: "assigned",
    label: "Assigned",
  },
  {
    key: "assignmentSubmitted",
    label: "Completed",
  },
  {
    key: "submissionAccepted",
    label: "Accepted",
  },
  {
    key: "submissionRejected",
    label: "Rejected",
  },
  {
    key: "adminRejected",
    label: "Cancelled",
  },
];

const TUTOR_PROJECT_TABS = [
  {
    key: "all",
    label: "All",
  },
  {
    key: "coAdminApproved",
    label: "New Assignment",
  },
  {
    key: "myProjects",
    label: "My Projects",
  },
  {
    key: "assigned",
    label: "Assigned",
  },
  {
    key: "assignmentSubmitted",
    label: "Completed",
  },
  {
    key: "submissionAccepted",
    label: "Accepted",
  },
  {
    key: "submissionRejected",
    label: "Rejected",
  },
];

const ADMIN_PROJECT_ACTIONS = {
  approve: "approve",
  cancel: "cancel",
  broadcast: "broadcast",
  reBroadcast: "reBroadcast",
  updateInAdminModal: "updateInAdminModal",
  deleteFile: "deleteFile",
  assign: "assign",
  accept: "accept",
  reject: "reject",
  submitFeedback: "submitFeedback",
};
const TUTOR_PROJECT_ACTIONS = {
  apply: "apply",
  submit: "submit",
};
const STUDENT_PROJECT_ACTIONS = {
  submit: "submit",
  projectPayNow: "projectPayNow",
};

export {
  imageFileExtensions,
  videoFileExtensions,
  audioFileExtensions,
  documentTypesWithColors,
  acceptalbeDocTypes,
  MESSAGE_TYPE,
  AUDIO_RECORDING_TYPE,
  CHAT_TYPE,
  ADMINS_PROJECT_TABS,
  TUTOR_PROJECT_TABS,
  ADMIN_PROJECT_ACTIONS,
  TUTOR_PROJECT_ACTIONS,
  STUDENT_PROJECT_ACTIONS
};
