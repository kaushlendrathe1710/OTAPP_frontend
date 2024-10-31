import React, { useEffect, useContext, memo } from "react";
import moment from "moment/moment";
import { HiOutlineBookOpen } from "react-icons/hi";
import userImg from "../../assets/img/chat-user.png";
import userContext from "../../context/userContext";
import { useClickOutside } from "../../hooks/useClickOutside";
import blogStyles from "../../styles/blogs.module.scss";
import glassStyles from "../../styles/glass.module.scss";

let defaultCoverImg = `https://i.postimg.cc/fRmHNH9m/preview-default-cover-image.png`;
const PreviewModal = ({ blog, setIsModalOpen }) => {
  const { userData } = useContext(userContext);

  useEffect(() => {
    document.getElementById("mainSidebar").style.zIndex = "0";
    document.getElementById("mainSidebarButton").style.zIndex = "0";
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
      document.getElementById("mainSidebar").style.zIndex = "100";
      document.getElementById("mainSidebarButton").style.zIndex = "101";
    };
  }, []);

  const modalRef = useClickOutside(() => setIsModalOpen(false));

  return (
    <div className={glassStyles.modalWrapper}>
      <div ref={modalRef} className={glassStyles.modalBoxWrapper}>
        <div
          className={blogStyles.singleBlogPostContainer}
          style={{ paddingTop: "4rem" }}
        >
          <h1 className={blogStyles.title}>
            {blog.title || "Your blog title goes here"}
          </h1>
          <div className={blogStyles.meta}>
            <div className={blogStyles.author}>
              <img src={userImg} width={16} height={16} />
              <b>{blog.author?.name || userData?.name}</b>
            </div>
            <div className={blogStyles.readTime}>
              <p>{moment(blog?.createdAt).format("LL")}</p>
              <b>
                <HiOutlineBookOpen size={18} />
                {blog.readTime || 0} {blog.readTime > 1 ? "minutes" : "minute"} read
              </b>
            </div>
          </div>
          <img
            src={blog?.cover || defaultCoverImg}
            alt={blog?.title}
            className={blogStyles.cover}
          />
          {!blog?.html ? (
            <h3><i>To see changes here, Start writting into editor</i></h3>
          ) : (
            <div
              className={blogStyles.blogContent}
              dangerouslySetInnerHTML={{ __html: blog.html }}
            ></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default memo(PreviewModal);
