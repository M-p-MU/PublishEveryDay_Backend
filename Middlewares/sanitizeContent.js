/* eslint-disable no-unused-vars */
const path = require("path");
const { JSDOM } = require("jsdom");
const domPurify = require("dompurify")(new JSDOM().window);
const fs = require("fs");

/**
 * Extract and modify content with embedded images.
 * @param {string} content - The content to process.
 * @param {Object} options - Configuration options.
 * @returns {Promise<Object>} An object containing the sanitized content and embedded images.
 */
/**
 * Extract and modify content with embedded images.
 * @param {string} content - The content to process.
 * @param {Object} options - Configuration options.
 * @returns {Promise<Object>} An object containing the sanitized content and embedded images.
 */
async function processContentWithImages(content, options = {}) {
  const { uploadDir = "./embeddedImages/" } = options;

  const embeddedImages = [];
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

  // Extract the image tags from the sanitized content
  const dom = new JSDOM(sanitizedContent);
  const imgTags = dom.window.document.getElementsByTagName("img");

  for (const imgTag of imgTags) {
    const src = imgTag.getAttribute("src");
    if (src) {
      // Store the image data with the original src URL
      const image = {
        src,
        data: imgTag.outerHTML,
      };

      embeddedImages.push(image);

      // Modify the src to point to a placeholder URL (e.g., a unique identifier)
      imgTag.setAttribute(
        "src",
        `/embeddedImages/${embeddedImages.length}${path.extname(src)}`
      );
    }
  }

  // Return the sanitized content and embedded images
  return {
    sanitizedContent: sanitizedContent.outerHTML,
    embeddedImages,
  };
}

// Function to store embedded images in a designated directory.
/**
 * @param {Object[]} images - An array of embedded image data.
 * @param {string} uploadDir - The directory to store the images.
 */
async function storeEmbeddedImages(images, uploadDir = "./embeddedImages/") {
  for (let i = 0; i < images.length; i++) {
    const image = images[i];
    const imagePath = `${uploadDir}/${i + 1}${path.extname(image.src)}`;

    try {
      await fs.promises.writeFile(imagePath, image.data);
    } catch (error) {
      console.error(`Error saving image ${i + 1}:`, error);
    }
  }
}

module.exports = {
  processContentWithImages,
  storeEmbeddedImages,
};
