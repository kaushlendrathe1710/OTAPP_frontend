import * as sanitizeHtml from "sanitize-html";

function getSanitizedHtml(html) {
  return sanitizeHtml(html, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      img: ["src", "alt", "title", "loading"],
      a: ["href", "data-*"],
    },
  });
}

export default getSanitizedHtml;
