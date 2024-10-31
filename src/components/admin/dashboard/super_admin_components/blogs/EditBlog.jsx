import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import CreatableSelect from "react-select/creatable";
import { toast } from "react-hot-toast";
import { BlogPostEditor, BlogPostPreviewModal } from "../../../../blog";
import getSanitizedHtml from "../../../../../lib/getSanitizedHtml";
import api, { getAccessToken } from "../../../../../services/api";
import blogStyles from "../../../../../styles/blogs.module.scss";
import glassStyles from "../../../../../styles/glass.module.scss";
import { useEffect } from "react";
import { ActivityLoader } from "../../../../Loaders/ActivityLoader";

async function fetchBlogBySlug(slug) {
  const { data } = await api.get(`/blog-post/get-post-by-slug?slug=${slug}`);
  return data;
}
const createOption = (label) => ({
  label,
  value: label,
});

const EditBlog = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [tagInputValue, setTagInputValue] = useState("");
  const [tagValue, setTagValue] = useState([]);
  const [html, setHtml] = useState("");
  const [readTime, setReadTime] = useState(0);
  const [loading, setLoading] = useState({
    isBlogUpdating: false,
    isBlogLoading: false,
  });
  const [previewBlog, setPreviewBlog] = useState(blog);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  const formik = useFormik({
    initialValues: {
      title: blog?.title,
      description: blog?.description,
      metaDescription: blog?.metaDescription,
      cover: blog?.cover,
      isPublished: blog?.isPublished,
    },
    validationSchema: Yup.object({
      title: Yup.string()
        .required("Blog title is required")
        .max(80, "Blog title should be less than 80 characters"),
      description: Yup.string()
        .required("Description is required")
        .max(320, "Description should be less than 320 characters"),
      metaDescription: Yup.string().max(
        800,
        "Meta description should be less than 800 characters"
      ),
      cover: Yup.string()
        .matches(
          /^(http(s):\/\/.)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/g,
          "Image url is invalid"
        )
        .required("Cover image is required"),
    }),
    onSubmit: (values) => {},
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
        setPreviewBlog(blog);
        setTagValue(blog.tags.map((tag) => createOption(tag)));
        for (let key in formik.values) {
          formik.setFieldValue(key, blog[key]);
        }
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

  useEffect(() => {
    setPreviewBlog((prev) => ({ ...prev, ...formik.values }));
  }, [formik.values]);

  const handleTagSelectKeyDown = (event) => {
    if (!tagInputValue) return;

    switch (event.key) {
      case "Enter":
      case "Tab":
        if (tagValue.findIndex((item) => item.value === tagInputValue) !== -1) {
          setTagInputValue("");
          return;
        }
        setTagValue((prev) => [...prev, createOption(tagInputValue.trim())]);
        setTagInputValue("");
        event.preventDefault();
    }
  };

  const handleUpdateBlog = async () => {
    setLoading((prev) => ({ ...prev, isBlogUpdating: true }));
    let loadingToastId = toast.loading("Updating blog...");
    try {
      if (!formik.isValid) return;
      let data = {
        title: formik.values.title,
        description: formik.values.description,
        metaDescription: formik.values.metaDescription,
        cover: formik.values.cover,
        tags: tagValue.map((item) => item.value),
        html: getSanitizedHtml(html),
        readTime: readTime,
        isPublished: formik.values.isPublished,
      };
      const { data: blogPost } = await api.patch(
        `/blog-post/update?blogPostId=${blog?._id}`,
        data,
        {
          headers: {
            Authorization: getAccessToken(),
          },
        }
      );
      if (blogPost) {
        toast.dismiss(loadingToastId);
        toast.success("Blog post updated successfully");
        navigate("/blog");
      }
    } catch (err) {
      toast.dismiss(loadingToastId);
      toast.error(
        "An error occured while creating blog post, please try again"
      );
      console.log("error while creating blog: ", err);
    } finally {
      setLoading((prev) => ({ ...prev, isBlogUpdating: false }));
    }
  };

  if (loading.isBlogLoading) {
    return (
      <div className={blogStyles.blogsOutletWrapper}>
        <div
          className={blogStyles.singleBlogPostContainer}
          style={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <ActivityLoader size={140} />
          <h3>Loading Blog...</h3>
        </div>
      </div>
    );
  }
  if (!blog) {
    return (
      <div className={blogStyles.blogsOutletWrapper}>
        <div className={blogStyles.singleBlogPostContainer}>
          <h2>Blog not found.</h2>
        </div>
      </div>
    );
  }
  return (
    <>
      {isPreviewModalOpen && (
        <BlogPostPreviewModal
          setIsModalOpen={setIsPreviewModalOpen}
          blog={previewBlog}
        />
      )}
      <div className={blogStyles.blogsOutletWrapper}>
        <div className={blogStyles.header}>
          <h2>Edit Blog</h2>
          <button
            className="btnDark btn--small"
            onClick={() => setIsPreviewModalOpen(true)}
          >
            Preview
          </button>
        </div>
        <main className={blogStyles.main}>
          <div className={blogStyles.createBlogFormWrapper}>
            <div className={glassStyles.inputWrapper}>
              <label htmlFor="title">Blog Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formik.values.title}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder={`Enter blog title`}
                className={
                  formik.errors.title &&
                  formik.touched.title &&
                  glassStyles.errorBorder
                }
              />
              {formik.errors.title && formik.touched.title ? (
                <div className={glassStyles.error}>{formik.errors.title}</div>
              ) : null}
            </div>
            <div className={glassStyles.bigInputWrapper}>
              <div className={glassStyles.inputWrapper}>
                <label htmlFor="cover">Blog Cover</label>
                <input
                  type="text"
                  id="cover"
                  name="cover"
                  value={formik.values.cover}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder={`Enter cover image url`}
                  className={
                    formik.errors.cover &&
                    formik.touched.cover &&
                    glassStyles.errorBorder
                  }
                />
                {formik.errors.cover && formik.touched.cover ? (
                  <div className={glassStyles.error}>{formik.errors.cover}</div>
                ) : null}
              </div>
              <div className={glassStyles.inputWrapper}>
                <label htmlFor="description">Blog Description</label>
                <textarea
                  type="text"
                  id="description"
                  name="description"
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder={`Enter Blog description`}
                  className={
                    formik.errors.description &&
                    formik.touched.description &&
                    glassStyles.errorBorder
                  }
                ></textarea>
                {formik.errors.description && formik.touched.description ? (
                  <div className={glassStyles.error}>
                    {formik.errors.description}
                  </div>
                ) : null}
              </div>
            </div>
            <div className={glassStyles.bigInputWrapper}>
              <div className={glassStyles.inputWrapper}>
                <label htmlFor="metaDescription">Blog Meta description</label>
                <textarea
                  type="text"
                  id="metaDescription"
                  name="metaDescription"
                  value={formik.values.metaDescription}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder={`Enter Blog meta description`}
                  className={
                    formik.errors.metaDescription &&
                    formik.touched.metaDescription &&
                    glassStyles.errorBorder
                  }
                ></textarea>
                {formik.errors.metaDescription &&
                formik.touched.metaDescription ? (
                  <div className={glassStyles.error}>
                    {formik.errors.metaDescription}
                  </div>
                ) : null}
              </div>
              <div className={glassStyles.inputWrapper}>
                <label htmlFor="tags">Tags</label>
                <CreatableSelect
                  id="tags"
                  components={{ DropdownIndicator: null }}
                  inputValue={tagInputValue}
                  isClearable
                  isMulti
                  menuIsOpen={false}
                  onChange={(newValue) => setTagValue(newValue)}
                  onInputChange={(newValue) => setTagInputValue(newValue)}
                  onKeyDown={handleTagSelectKeyDown}
                  placeholder="  Add tags"
                  value={tagValue}
                  styles={{
                    control: (baseStyles, state) => ({
                      ...baseStyles,
                      borderColor: state.isFocused
                        ? "var(--primary-300)"
                        : "white",
                      borderRadius: "0.75rem",
                      borderWidth: "2px",
                      ":hover": {
                        borderColor: "var(--primary-300)",
                      },
                      transition: "all 150ms",
                    }),
                  }}
                />
              </div>
            </div>
            {/* Editor */}
            <div className={glassStyles.inputWrapper}>
              <label>Editor</label>
              <BlogPostEditor
                value={blog?.html || ""}
                onChange={({ html, readTime }) => {
                  setHtml(html);
                  setReadTime(readTime);
                  setPreviewBlog((prev) => ({ ...prev, html, readTime }));
                }}
              />
            </div>
            <div className={glassStyles.checkboxWrapper}>
              {/* <h4>Document Type</h4> */}
              <div className={glassStyles.flexWrapper}>
                <div>
                  <input
                    type="checkbox"
                    name="isPublished"
                    id="isPublished"
                    value={true}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    defaultChecked={formik.values.isPublished}
                  />
                  <label htmlFor="isPublished">Publish</label>
                </div>
              </div>
            </div>

            <div className={glassStyles.bigInputWrapper}>
              <button
                type="button"
                className="btnPrimary btn--large btn--full"
                onClick={handleUpdateBlog}
                disabled={loading.isBlogUpdating}
              >
                Update Blog
              </button>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default EditBlog;
