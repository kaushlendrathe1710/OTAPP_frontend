import React from "react";
import DocumentCard from "./documentCard";
import styles from "./projectDetails.module.css";
import { BsUpload } from "react-icons/bs";

const ProjectDetails = () => {
  return (
    <div className={styles.container}>
      <h3
        style={{
          textAlign: "center",
          margin: "20px 5px",
          textTransform: "uppercase",
        }}
      >
        Assignment Details
      </h3>
      <div className={styles.row}>
        <div>
          <div>Assignment id</div>
          <div className={styles.ProjectDetails}>Mar_snehal_20230323_000069</div>
        </div>
        <div>
          <div>Assignment title</div>
          <div>Aisha third</div>
        </div>
      </div>
      <div className={styles.row}>
        <div>
          <div>Subject</div>
          <div className={styles.whiteBg}>
            <select name="" id="">
              <option value="Marketing">Marketing</option>
              <option value="Javascript">Javascript</option>
              <option value="Economics">Economics</option>
              <option value="English">English</option>
            </select>
          </div>
        </div>
        <div>
          <div>Document Type</div>
          {/* <div className={styles.docTypeContainer}>
                        <label><input type="checkbox" />word</label>
                        <label><input type="checkbox" />PPT</label>
                        <label><input type="checkbox" />Excel</label>
                        <label><input type="checkbox" />Miscellaneous</label>
                    </div> */}
          <div className={styles.whiteBg}>
            <select name="" id="" style={{ marginRight: "20px" }}>
              <option value="word">word</option>
              <option value="PPT">PPT</option>
              <option value="Excel">Excel</option>
              <option value="Miscellaneous">Miscellaneous</option>
            </select>
            <select>
              <option value="No of pages">No of pages</option>
              <option value="No of word">No of word</option>
            </select>
            <input className={styles.numOfPagesInput} type="number" value={2} />
          </div>
        </div>
      </div>
      <div className={styles.row}>
        <div>
          <div>English Level</div>
          <div className={styles.ProjectDetails}>
            <select className={styles.selectStyles}>
              <option value="No of pages">Basic</option>
              <option value="No of word">Intermediate</option>
              <option value="No of word">Professional</option>
            </select>
          </div>
        </div>
        <div>
          <div>Referencing Style</div>
          <div className={styles.ProjectDetails}>
            <select className={styles.selectStyles}>
              <option value="No of pages">Apa</option>
              <option value="No of word">Harvard</option>
              <option value="No of word">Chicago</option>
              <option value="No of word">MLA</option>
              <option value="No of word">Others</option>
            </select>
          </div>
        </div>
      </div>
      <div className={styles.row}>
        <div>
          <div>Deadline</div>
          <div className={styles.ProjectDetails}>
            <input
              type="datetime-local"
              defaultValue={"2023-03-29T10:58"}
              onChange={(e) => console.log(e.target.value)}
            />
          </div>
        </div>
        <div>
          <div>Upload date</div>
          <div>
            <input
              type="datetime-local"
              defaultValue={"2023-03-29T10:58"}
              onChange={(e) => console.log(e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className={styles.row}>
        <div>
          <div>Description</div>
          <div className={styles.ProjectDetails}>
            <textarea
              style={{ width: "100%", minHeight: "140px" }}
              value={"Follow the guidelines."}
            ></textarea>
          </div>
        </div>
        <div>
          <div>Guidelines</div>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "flex-start",
              flexWrap: "wrap",
            }}
          >
            <DocumentCard doc={{ name: "Document File Name" }} />
            <DocumentCard doc={{ name: "Document File Name" }} />
          </div>
          <div>Upload Assignment Guidelines And Supporting Docs</div>
          <div className={styles.whiteBg}>
            <label className={styles.uploadDocument}>
              Upload Document <BsUpload style={{ marginLeft: "8px" }} />
              <input type="file" style={{ display: "none" }} />
            </label>
          </div>
        </div>
      </div>
      <div className={styles.row}>
        <div>
          <div>Assign Co-Admin</div>
          <div className={styles.ProjectDetails}>
            <select name="coadmins" id="coadminSelect">
              <option value="Ayushi Chopra">Ayushi Chopra</option>
              <option value="Ayushi Chopra">Parul Sharma</option>
              <option value="Ayushi Chopra">Snehal</option>
              <option value="Ayushi Chopra">Pranav Kumar</option>
            </select>
          </div>
        </div>
        <div>
          <div>Assigned to</div>
          <div>
            <input type="text" value={"Assigned to"} />
          </div>
        </div>
      </div>
      <div className={styles.row}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "space-between",
            justifyContent: "space-between",
          }}
        >
          <div>Tutor Payment</div>
          <div className={styles.whiteBg} style={{ display: "flex", flexDirection: "column" }}>
            <input type="number" value={0} />
          </div>
          <div>Student Payment</div>
          <div className={styles.whiteBg} style={{ display: "flex", flexDirection: "column" }}>
            <input type="number" value={0} />
          </div>
        </div>
        <div>
          <div>Feedback review</div>
          <div>
            <textarea
              style={{ width: "100%", minHeight: "124px" }}
              value={"Follow the guidelines."}
            ></textarea>
          </div>
        </div>
      </div>
      <div className={styles.row}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "space-between",
            justifyContent: "space-between",
          }}
        >
          <div>Additional Notes</div>
          <div className={styles.whiteBg} style={{ display: "flex", flexDirection: "column" }}>
            <textarea style={{ width: "100%", minHeight: "112px" }}></textarea>
          </div>
        </div>
        <div>
          <div>Status</div>
          <div className={styles.whiteBg}>
            <select name="payStatus" id="payStatus">
              <option value={"Un-Paid"}>Un-Paid</option>
              <option value={"Paid"}>Paid</option>
            </select>
          </div>
          <div>Assignment Status</div>
          <div className={styles.whiteBg}>
            <select name="payStatus" id="payStatus">
              <option value={"New-Assignment"}>New Assignment</option>
              <option value={"Approved"}>Approved</option>
              <option value={"Broadcasted"}>Broadcasted</option>
              <option value={"Assigned"}>Assigned</option>
              <option value={"Completed"}>Completed</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
