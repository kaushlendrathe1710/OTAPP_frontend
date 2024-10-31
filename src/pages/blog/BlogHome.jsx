import { useRef, useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { Header } from "../../components/header/Header";
import { Footer } from "../../components/footer/Footer";
import api from "../../services/api";
import { BlogPostCard } from "../../components/blog";
import blogStyles from "../../styles/blogs.module.scss";
import servicesStyles from "../../styles/services.module.scss";

async function fetchBlogs(page, limit) {
  const { data } = await api.get(
    `/blog-post/get-all-posts?page=${page}&limit=${limit}`
  );
  return data;
}

const BlogHome = () => {
  const pageRef = useRef(1);
  const limitRef = useRef(10);
  const [allBlogs, setAllBlogs] = useState([]);

  useEffect(() => {
    (async () => {
      const blogs = await fetchBlogs(pageRef.current, limitRef.current);
      setAllBlogs(blogs);
    })();
  }, []);
  return (
    <>
      <Helmet>
        <title>Blog | Megaminds</title>
      </Helmet>
      <Header />
      <div className={servicesStyles.pageWrapper}>
        <h1 className={servicesStyles.gradientHeading}>Blog</h1>

        {/* <main className={blogStyles.blogsContainer}></main> */}
        <main className={blogStyles.main}>
          <div className={blogStyles.blogsContainer}>
            {allBlogs.map((blog) => (
              <BlogPostCard key={blog?._id} blog={blog} />
            ))}
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
};

export default BlogHome;
