import React, { useState, useRef, memo, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

function calculateReadTime(text) {
  const wordsPerMinute = 200;
  const numberOfWords = text.split(/\s/g).length;
  const readTime = Math.ceil(numberOfWords / wordsPerMinute);
  return readTime;
}

const TOOLBAR_OPTIONS = [
  [{ header: [1, 2, 3, false] }],
  ["bold", "italic", "underline", "strike"],
  ["blockquote", "code-block"],
  [{ color: [] }, { background: [] }],
  [{ script: "sub" }, { script: "super" }],
  [{ list: "ordered" }, { list: "bullet" }],
  [{ indent: "-1" }, { indent: "+1" }],
  [{ direction: "rtl" }],
  ["link", "image"],
  ["clean"],
];

const Editor = ({ value, onChange }) => {
  const quillRef = useRef(null);
  const toolbar = quillRef.current?.getEditor().getModule("toolbar");
  const [editorValue, setEditorValue] = useState(value || "");

  const editorOnChange = (content) => {
    setEditorValue(content);

    if (onChange && quillRef.current) {
      onChange({
        html: content,
        readTime: calculateReadTime(quillRef.current?.getEditor().getText()),
      });
    }
  };

  useEffect(() => {
    if (toolbar) {
      toolbar.addHandler("image", (event) => {
        let imgSrc = window.prompt("Enter image url: ");
        if (!imgSrc) return;
        let altText = window.prompt("Enter image alt text: ");
        let delta = {
          ops: [
            {
              attributes: {
                alt: altText || "Blog image",
              },
              insert: {
                image: imgSrc,
              },
            },
          ],
        };
        let existingDelta = quillRef.current.editor.getContents();
        let combinedDelta = existingDelta.concat(delta);
        quillRef.current.editor.setContents(combinedDelta);
      });
    }
  }, [toolbar]);
  return (
    <ReactQuill
      ref={quillRef}
      theme="snow"
      placeholder="Start writing..."
      modules={{
        toolbar: {
          container: TOOLBAR_OPTIONS,
        },
      }}
      value={editorValue}
      onChange={editorOnChange}
      className="blogEditorContainer"
    />
  );
};

export default memo(Editor);
