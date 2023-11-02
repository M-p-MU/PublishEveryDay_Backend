/* eslint-disable no-unused-vars */
const path = require("path");
const { JSDOM } = require("jsdom");
const domPurify = require("dompurify")(new JSDOM().window);

// Sanitize the content
async function sanitizeContent(content) {
  const sanitizedContent = await domPurify.sanitize(content, {
    ADD_TAGS: ["img"],
    RETURN_DOM: true,
    IN_PLACE: true,
    RETURN_TRUSTED_TYPE: true,
    WHOLE_DOCUMENT: true,
    RETURN_DOM_FRAGMENT: true,
    FORBID_ATTR: ["onerror"],
    FORBID_TAGS: ["script", "style"],
    RETURN_DOM_IMPORT: true,
  });

  // Return the sanitized content as a string
  return sanitizedContent.outerHTML;
}

// Export the sanitizeContent function
module.exports = {
  sanitizeContent,
};
