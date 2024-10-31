import React from "react";
import moment from "moment/moment";
import { Link } from "react-router-dom";
import { HiOutlineBookOpen } from "react-icons/hi";
import userImg from "../../assets/img/chat-user.png";
import blogStyles from "../../styles/blogs.module.scss";
import sliceText from "../../lib/sliceText";
import { AiOutlineEdit, AiOutlineEye } from "react-icons/ai";

const BlogCard = ({ blog, canViewExtraOptions = false }) => {
  const {
    author,
    title,
    description,
    cover,
    slug,
    readTime,
    isPublished,
    createdAt,
  } = blog;
  let viewLink = `/blog/${slug}`;
  return (
    <div className={blogStyles.blogCardContainer}>
      <div className={blogStyles.blogCover}>
        <Link to={viewLink}>
          <img src={cover} alt={title} />
        </Link>
      </div>
      <div className={blogStyles.blogMetaInfo}>
        <p>{moment(createdAt).format("LL")}</p>
        <b>
          <HiOutlineBookOpen size={18} />
          {readTime} {readTime > 1 ? "minutes" : "minute"} read
        </b>
      </div>
      <div className={blogStyles.blogTitle}>
        <Link to={viewLink}>
          <h3>{sliceText(title, 75)}</h3>
        </Link>
      </div>
      <div className={blogStyles.author}>
        <img src={userImg} width={16} height={16} />
        <b>{author?.name}</b>
      </div>
      {canViewExtraOptions && (
        <div className={blogStyles.blogMetaInfo} style={{marginTop: "1.5rem"}}>
          <Link to={`/${author?.userType.toLowerCase()}/blog/edit-blog/${slug}`} className="btnDark btn--medium"><AiOutlineEdit /> Edit</Link>
          <Link to={viewLink} className="btnInfo btn--medium"><AiOutlineEye /> View</Link>
        </div>
      )}
    </div>
  );
};

export default BlogCard;
