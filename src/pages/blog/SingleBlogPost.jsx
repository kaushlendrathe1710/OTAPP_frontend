import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import moment from "moment";
import { HiOutlineBookOpen } from "react-icons/hi";
import { Footer } from "../../components/footer/Footer";
import { Header } from "../../components/header/Header";
import api from "../../services/api";
import userImg from "../../assets/img/chat-user.png";
import blogStyles from "../../styles/blogs.module.scss";
import { ActivityLoader } from "../../components/Loaders/ActivityLoader";

async function fetchBlogBySlug(slug) {
  const { data } = await api.get(`/blog-post/get-post-by-slug?slug=${slug}`);
  return data;
}

const SingleBlogPost = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState({
    isBlogLoading: false,
  });

  useEffect(() => {
    (async () => {
      setLoading((prev) => ({ ...prev, isBlogLoading: true }));
      try {
        const blog = await fetchBlogBySlug(slug);
        if (!blog) {
          toast.error("Blog not found");
          return;
        }
        setBlog(blog);
      } catch (err) {
        toast.error(
          "An error occured while fetching blog, please refresh the page"
        );
        console.log("Error occured while fetching blog by slug: ", err);
      } finally {
        setLoading((prev) => ({ ...prev, isBlogLoading: false }));
      }
    })();
  }, [slug]);

  if (loading.isBlogLoading) {
    return (
      <>
        <Header />
        <div
          className={blogStyles.singleBlogPostContainer}
          style={{ display: "flex", justifyContent: "center" }}
        >
          <ActivityLoader size={140} />
        </div>
        <Footer />
      </>
    );
  }
  if (!blog) {
    return (
      <>
        <Header />
        <div className={blogStyles.singleBlogPostContainer}>
          <h2>Blog not found or may be not pusblished.</h2>
        </div>
        <Footer />
      </>
    );
  }
  return (
    <>
      <Helmet>
        <title>{blog?.title || "Blog | Mymegaminds"}</title>
      </Helmet>
      <Header />
      <div className={blogStyles.singleBlogPostContainer}>
        <h1 className={blogStyles.title}>{blog.title}</h1>
        <div className={blogStyles.meta}>
          <div className={blogStyles.author}>
            <img src={userImg} width={16} height={16} />
            <b>{blog.author?.name}</b>
          </div>
          <div className={blogStyles.readTime}>
            <p>{moment(blog.createdAt).format("LL")}</p>
            <b>
              <HiOutlineBookOpen size={18} />
              {blog.readTime} {blog.readTime > 1 ? "minutes" : "minute"} read
            </b>
          </div>
        </div>
        <img src={blog.cover} alt={blog.title} className={blogStyles.cover} />
        <div
          className={blogStyles.blogContent}
          dangerouslySetInnerHTML={{ __html: blog.html }}
        ></div>
      </div>
      <Footer />
    </>
  );
};

export default SingleBlogPost;
