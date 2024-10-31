import { useState, useRef, useEffect } from "react";
import { BlogPostCard } from "../../../../blog";
import api from "../../../../../services/api";
import blogStyles from "../../../../../styles/blogs.module.scss";
import { ActivityLoader } from "../../../../Loaders/ActivityLoader";

async function fetchBlogs(page, limit) {
  const { data } = await api.get(
    `/blog-post/get-all-posts?page=${page}&limit=${limit}`
  );
  return data;
}

const ViewAllBlogs = () => {
  const pageRef = useRef(1);
  const limitRef = useRef(10);
  const [allBlogs, setAllBlogs] = useState([]);
  const [loading, setLoading] = useState({
    isBlogLoading: false,
  });

  useEffect(() => {
    (async () => {
      setLoading((prev) => ({ ...prev, isBlogLoading: true }));
      const blogs = await fetchBlogs(pageRef.current, limitRef.current);
      setAllBlogs(blogs);
      setLoading((prev) => ({ ...prev, isBlogLoading: false }));
    })();
  }, []);

  return (
    <div className={blogStyles.blogsOutletWrapper}>
      <div className={blogStyles.header}>
        <h2>All Blogs</h2>
      </div>

      <main className={blogStyles.main}>
        <div className={blogStyles.blogsContainer}>
          {loading.isBlogLoading ? (
            <div
              className={blogStyles.singleBlogPostContainer}
              style={{ display: "flex", justifyContent: "center" }}
            >
              <ActivityLoader size={140} />
            </div>
          ) : (
            allBlogs.map((blog) => <BlogPostCard key={blog?._id} blog={blog} canViewExtraOptions />)
          )}
        </div>
      </main>
    </div>
  );
};

export default ViewAllBlogs;
