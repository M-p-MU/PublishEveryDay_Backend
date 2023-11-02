/* eslint-disable no-unused-vars */
const path = require("path");
const { JSDOM } = require("jsdom");
const DOMPurify = require("dompurify")(new JSDOM().window);

// Sanitize the content
async function sanitizeContent(content) {
  const sanitizedContent = DOMPurify.sanitize(content, {
    ADD_TAGS: ["img"],
    ALLOWED_TAGS: [
      "p",
      "a",
      "strong",
      "em",
      "ul",
      "li",
      "ol",
      "br",
      "img",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "blockquote",
      "pre",
      "code",
      "table",
      "thead",
      "caption",
      "tbody",
      "tr",
      "th",
      "td",
      "strike",
      "del",
      "hr",
      "sup",
      "sub",
      "div",
      "span",
    ],
    ALLOWED_ATTR: ["href", "target", "rel", "src", "alt"],
    FORBID_ATTR: ["onerror"],
    FORBID_TAGS: ["script", "style"],
  });


  return sanitizedContent.toString();
}

// Export the sanitizeContent function
module.exports = { sanitizeContent };
