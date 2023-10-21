/**
 * @swagger
 * tags:
 *   name:  Blogs
 *   description: Blog Restful APIs with operations that can be performed.
 */
/**
 * @swagger
 * /api/v1/ped/blogs:
 *   post:
 *     summary: Create a new blog /article/product review or any other content.
 *     description: Create a new piece of content with an optional title, content, and an image.
 *     tags: [Blogs]
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Title of the content.
 *               content:
 *                 type: string
 *                 description: Main content with optional embedded images.
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Image file for thumbnail or main image.
 *             required:
 *               - title
 *               - content
 *
 *     responses:
 *       201:
 *         description: Content created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 blog:
 *                   type: object
 *                   description: The created content data.
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: Content unique id The unique identifier.
 *                     title:
 *                       type: string
 *                       description: The title of the blog.
 *                     content:
 *                       type: string
 *                       description: The content of the blog.
 *                 request:
 *                   type: object
 *                   description: Details about how to retrieve the created content.
 *                   properties:
 *                     type:
 *                       type: string
 *                       description: The HTTP request type (GET).
 *                     description:
 *                       type: string
 *                       description: Description of the request.
 *                     url:
 *                       type: string
 *                       description: URL to retrieve the created blog.
 *  */

/**
 * @swagger
 * /api/v1/ped/blogs:
 *   get:
 *     summary: Get all blogs
 *     description: Retrieves a list of all blogs.
 *     tags: [Blogs]
 *     responses:
 *       200:
 *         description: List of all created blogs retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               description: An array of blogs.
 *               items:
 *                 type: object
 *                 description: Details about each blog.
 *                 properties:
 *                   metadata:
 *                     type: object
 *                     description: Metadata about the blogs.
 *                     properties:
 *                       count:
 *                         type: integer
 *                         description: The total number of blogs in the list.
 *                       message:
 *                         type: string
 *                         description: A message about the list.
 *                   blog:
 *                     type: object
 *                     description: The blog details.
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: The unique identifier of the blog.
 *                       title:
 *                         type: string
 *                         description: The title of the blog.
 *                       content:
 *                         type: string
 *                         description: The content of the blog.
 *                   request:
 *                     type: object
 *                     description: Details about how to retrieve each blog.
 *                     properties:
 *                       type:
 *                         type: string
 *                         description: The HTTP request type (GET).
 *                       description:
 *                         type: string
 *                         description: Description of the request.
 *                       url:
 *                         type: string
 *                         description: URL to retrieve the blog.
 */

/**
 * @swagger
 * /api/v1/ped/blogs/{id}:
 *   get:
 *     summary: Get a single blog by ID
 *     description: Retrieves a single blog by its unique identifier.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique identifier of the blog.
 *         schema:
 *           type: string
 *     tags: [Blogs]
 *     responses:
 *       200:
 *         description: Blog retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               description: Details about the retrieved blog.
 *               properties:
 *                 blog:
 *                   type: object
 *                   description: The blog details.
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: The unique identifier of the blog.
 *                     title:
 *                       type: string
 *                       description: The title of the blog.
 *                     content:
 *                       type: string
 *                       description: The content of the blog.
 *                 request:
 *                   type: object
 *                   description: Details about how to delete the blog.
 *                   properties:
 *                     type:
 *                       type: string
 *                       description: The HTTP request type (DELETE).
 *                     description:
 *                       type: string
 *                       description: Description of the request.
 *                     url:
 *                       type: string
 *                       description: URL to delete the blog.
 */
/**
 * @swagger
 * /api/v1/ped/blogs/by-category/{category}:
 *   get:
 *     summary: Get blogs by category with optional pagination.
 *     description: Retrieves blogs by category with optional pagination.
 *     parameters:
 *       - in: path
 *         name: category
 *         required: true
 *         description: The category of the blogs to be retrieved.
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         required: false
 *         description: The page number for pagination. Default is 1.
 *     tags: [Blogs]
 *     responses:
 *       200:
 *         description: Blogs retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 metadata:
 *                   type: object
 *                   properties:
 *                     count:
 *                       type: integer
 *                       description: The number of blogs on the current page.
 *                     message:
 *                       type: string
 *                       description: A success message.
 *                     page:
 *                       type: integer
 *                       description: The current page number.
 *                 userBlogs:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Blog'
 *                 request:
 *                   type: object
 *                   properties:
 *                     type:
 *                       type: string
 *                       description: The HTTP request type.
 *                     description:
 *                       type: string
 *                       description: A description of the request.
 *                     url:
 *                       type: string
 *                       description: The URL for the next page of blogs.
 *       404:
 *         description: No blogs found for this category.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: An error message indicating no blogs found for this category.
 *       500:
 *         description: Internal Server Error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/v1/ped/blogs/{id}:
 *   put:
 *     summary: Update an existing blog
 *     description: Updates an existing blog with the provided data.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique identifier of the blog.
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: New title of the blog.
 *               content:
 *                 type: string
 *                 description: New content of the blog.
 *               image:
 *                 type: string
 *                 description: Updated blog image file.
 *             required:
 *               - title
 *               - content
 *     tags: [Blogs]
 *     responses:
 *       200:
 *         description: Blog updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A success message.
 *                 blog:
 *                   type: object
 *                   description: The updated blog.
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: The unique identifier of the blog.
 *                     title:
 *                       type: string
 *                       description: The updated title of the blog.
 *                     content:
 *                       type: string
 *                       description: The updated content of the blog.
 *                 request:
 *                   type: object
 *                   description: Details about how to retrieve the updated blog.
 *                   properties:
 *                     type:
 *                       type: string
 *                       description: The HTTP request type (GET).
 *                     description:
 *                       type: string
 *                       description: Description of the request.
 *                     url:
 *                       type: string
 *                       description: URL to retrieve the updated blog.
 */

/**
 * @swagger
 * /api/v1/ped/blogs/{id}:
 *   delete:
 *     summary: Delete a blog by ID
 *     description: Deletes a blog by its unique identifier.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique identifier of the blog to delete.
 *         schema:
 *           type: string
 *     tags: [Blogs]
 *     responses:
 *       200:
 *         description: Blog deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A success message.
 *                 request:
 *                   type: object
 *                   description: Details about how to create a new blog.
 *                   properties:
 *                     type:
 *                       type: string
 *                       description: The HTTP request type (POST).
 *                     description:
 *                       type: string
 *                       description: Description of the request.
 *                     url:
 *                       type: string
 *                       description: URL to create a new blog.
 *                     body:
 *                       type: object
 *                       description: Example request body for creating a new blog.
 *                       properties:
 *                         title:
 *                           type: string
 *                           description: Title of the blog.
 *                         content:
 *                           type: string
 *                           description: Content of the blog.
 *                         image:
 *                           type: string
 *                           description: Blog image file.
 */
/**
 * @swagger
 * /api/v1/ped/blogs/paginated:
 *   get:
 *     summary: Get all blogs with pagination
 *     description: Retrieve all blogs with pagination.
 *     tags: [Blogs]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         required: false
 *         description: The page number for pagination. Default is 1.
 *     responses:
 *       200:
 *         description: Blogs retrieved successfully with pagination.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 metadata:
 *                   type: object
 *                   properties:
 *                     count:
 *                       type: integer
 *                       description: The number of blogs on the current page.
 *                     message:
 *                       type: string
 *                       description: A success message.
 *                     page:
 *                       type: integer
 *                       description: The current page number.
 *                 blogs:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Blog'
 *                 request:
 *                   type: object
 *                   properties:
 *                     type:
 *                       type: string
 *                       description: The HTTP request type.
 *                     description:
 *                       type: string
 *                       description: A description of the request.
 *                     url:
 *                       type: string
 *                       description: The URL for the next page of blogs.
 *       500:
 *         description: Internal Server Error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
/**
 * @swagger
 * /api/v1/ped/top-blogs:
 *   get:
 *     summary: Get the Top 10 Blogs with Most Likes and Comments
 *     description: Retrieve the top 10 blogs with the highest number of likes and comments.
 *     tags: [Blogs]
 *     responses:
 *       200:
 *         description: Top 10 blogs with most likes and comments retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 metadata:
 *                   type: object
 *                   properties:
 *                     count:
 *                       type: integer
 *                       description: The number of top blogs retrieved.
 *                     message:
 *                       type: string
 *                       description: A success message.
 *                 topBlogs:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Blog'
 *       500:
 *         description: Internal Server Error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/v1/ped/blogs/paginated:
 *   get:
 *     summary: Get all blogs with pagination
 *     description: Retrieve all blogs with pagination.
 *     tags: [Blogs]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         required: false
 *         description: The page number for pagination. Default is 1.
 *     responses:
 *       200:
 *         description: Blogs retrieved successfully with pagination.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 metadata:
 *                   type: object
 *                   properties:
 *                     count:
 *                       type: integer
 *                       description: The number of blogs on the current page.
 *                     message:
 *                       type: string
 *                       description: A success message.
 *                     page:
 *                       type: integer
 *                       description: The current page number.
 *                 blogs:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Blog'
 *                 request:
 *                   type: object
 *                   properties:
 *                     type:
 *                       type: string
 *                       description: The HTTP request type.
 *                     description:
 *                       type: string
 *                       description: A description of the request.
 *                     url:
 *                       type: string
 *                       description: The URL for the next page of blogs.
 *       500:
 *         description: Internal Server Error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/v1/ped/top-blogs:
 *   get:
 *     summary: Get the Top 10 Blogs with Most Likes and Comments
 *     description: Retrieve the top 10 blogs with the highest number of likes and comments.
 *     tags: [Blogs]
 *     responses:
 *       200:
 *         description: Top 10 blogs with most likes and comments retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 metadata:
 *                   type: object
 *                   properties:
 *                     count:
 *                       type: integer
 *                       description: The number of top blogs retrieved.
 *                     message:
 *                       type: string
 *                       description: A success message.
 *                 topBlogs:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Blog'
 *       500:
 *         description: Internal Server Error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
/**
 * @swagger
 * /api/v1/ped/blogs/by-owner/{id}:
 *   get:
 *     summary: Get blogs by owner or admin with optional pagination.
 *     description: Retrieves blogs owned by a specific user or admin with optional pagination.
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: The unique identifier of the owner or admin whose blogs are to be retrieved.
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         required: false
 *         description: The page number for pagination. Default is 1.
 *     tags: [Blogs]
 *     responses:
 *       200:
 *         description: Blogs retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 metadata:
 *                   type: object
 *                   properties:
 *                     count:
 *                       type: integer
 *                       description: The number of blogs on the current page.
 *                     message:
 *                       type: string
 *                       description: A success message.
 *                     page:
 *                       type: integer
 *                       description: The current page number.
 *                 userBlogs:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Blog'
 *                 request:
 *                   type: object
 *                   properties:
 *                     type:
 *                       type: string
 *                       description: The HTTP request type.
 *                     description:
 *                       type: string
 *                       description: A description of the request.
 *                     url:
 *                       type: string
 *                       description: The URL for the next page of blogs.
 *       404:
 *         description: No blogs found for this owner.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: An error message indicating no blogs found for this owner.
 *       500:
 *         description: Internal Server Error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
/**
 * @swagger
 * /api/v1/ped/blogs/by-category/{category}:
 *   get:
 *     summary: Get blogs by category with optional pagination.
 *     description: Retrieves blogs by category with optional pagination.
 *     parameters:
 *       - in: path
 *         name: category
 *         required: true
 *         description: The category of the blogs to be retrieved.
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         required: false
 *         description: The page number for pagination. Default is 1.
 *     tags: [Blogs]
 *     responses:
 *       200:
 *         description: Blogs retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 metadata:
 *                   type: object
 *                   properties:
 *                     count:
 *                       type: integer
 *                       description: The number of blogs on the current page.
 *                     message:
 *                       type: string
 *                       description: A success message.
 *                     page:
 *                       type: integer
 *                       description: The current page number.
 *                 userBlogs:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Blog'
 *                 request:
 *                   type: object
 *                   properties:
 *                     type:
 *                       type: string
 *                       description: The HTTP request type.
 *                     description:
 *                       type: string
 *                       description: A description of the request.
 *                     url:
 *                       type: string
 *                       description: The URL for the next page of blogs.
 *       404:
 *         description: No blogs found for this category.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: An error message indicating no blogs found for this category.
 *       500:
 *         description: Internal Server Error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
/**
 * @swagger
 * /api/v1/ped/blogs/{id}/comments:
 *   post:
 *     summary: Comment on a blog.
 *     description: Add a new comment to a blog by its unique identifier.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique identifier of the blog to comment on.
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *                 description: The content of the comment.
 *             required:
 *               - text
 *     tags: [Blogs]
 *     responses:
 *       201:
 *         description: Comment added successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A success message.
 *                 comment:
 *                   type: object
 *                   description: The added comment.
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: The unique identifier of the comment.
 *                     text:
 *                       type: string
 *                       description: The content of the comment.
 *                     createdAt:
 *                       type: string
 *                       description: The timestamp when the comment was created.
 *                 request:
 *                   type: object
 *                   description: Details about how to retrieve the added comment.
 *                   properties:
 *                     type:
 *                       type: string
 *                       description: The HTTP request type (GET).
 *                     description:
 *                       type: string
 *                       description: Description of the request.
 *                     url:
 *                       type: string
 *                       description: URL to retrieve the added comment.
 *       500:
 *         description: Internal Server Error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
/**
 * @swagger
 * /api/v1/ped/blogs/{blogId}/comments/{commentId}/replies:
 *   post:
 *     summary: Reply to a comment.
 *     description: Add a reply to a specific comment on a blog by their unique identifiers.
 *     parameters:
 *       - in: path
 *         name: blogId
 *         required: true
 *         description: The unique identifier of the blog containing the comment to reply to.
 *         schema:
 *           type: string
 *       - in: path
 *         name: commentId
 *         required: true
 *         description: The unique identifier of the comment to reply to.
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *                 description: The content of the reply.
 *             required:
 *               - text
 *     tags: [Blogs]
 *     responses:
 *       201:
 *         description: Reply added successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A success message.
 *                 reply:
 *                   type: object
 *                   description: The added reply.
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: The unique identifier of the reply.
 *                     text:
 *                       type: string
 *                       description: The content of the reply.
 *                     createdAt:
 *                       type: string
 *                       description: The timestamp when the reply was created.
 *                 request:
 *                   type: object
 *                   description: Details about how to retrieve the added reply.
 *                   properties:
 *                     type:
 *                       type: string
 *                       description: The HTTP request type (GET).
 *                     description:
 *                       type: string
 *                       description: Description of the request.
 *                     url:
 *                       type: string
 *                       description: URL to retrieve the added reply.
 *       500:
 *         description: Internal Server Error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
/**
 * @swagger
 * /api/v1/ped/blogs/{blogId}/comments/{commentId}:
 *   delete:
 *     summary: Delete a comment.
 *     description: Delete a specific comment on a blog by their unique identifiers.
 *     parameters:
 *       - in: path
 *         name: blogId
 *         required: true
 *         description: The unique identifier of the blog containing the comment to delete.
 *         schema:
 *           type: string
 *       - in: path
 *         name: commentId
 *         required: true
 *         description: The unique identifier of the comment to delete.
 *         schema:
 *           type: string
 *     tags: [Blogs]
 *     responses:
 *       200:
 *         description: Comment deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A success message.
 *                 request:
 *                   type: object
 *                   description: Details about how to create a new blog.
 *                   properties:
 *                     type:
 *                       type: string
 *                       description: The HTTP request type (POST).
 *                     description:
 *                       type: string
 *                       description: Description of the request.
 *                     url:
 *                       type: string
 *                       description: URL to create a new blog.
 *                     body:
 *                       type: object
 *                       description: Example request body for creating a new blog.
 *                       properties:
 *                         title:
 *                           type: string
 *                           description: Title of the blog.
 *                         content:
 *                           type: string
 *                           description: Content of the blog.
 *                         image:
 *                           type: string
 *                           description: Blog image file.
 *       500:
 *         description: Internal Server Error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
/**
 * @swagger
 * /api/v1/ped/blogs/{blogId}/comments/{commentId}:
 *   put:
 *     summary: Update a comment.
 *     description: Update a specific comment on a blog by their unique identifiers.
 *     parameters:
 *       - in: path
 *         name: blogId
 *         required: true
 *         description: The unique identifier of the blog containing the comment to update.
 *         schema:
 *           type: string
 *       - in: path
 *         name: commentId
 *         required: true
 *         description: The unique identifier of the comment to update.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 description: Updated content of the comment.
 *             required:
 *               - content
 *     tags: [Blogs]
 *     responses:
 *       200:
 *         description: Comment updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A success message.
 *                 request:
 *                   type: object
 *                   description: Details about how to retrieve the updated comment.
 *                   properties:
 *                     type:
 *                       type: string
 *                       description: The HTTP request type (GET).
 *                     description:
 *                       type: string
 *                       description: Description of the request.
 *                     url:
 *                       type: string
 *                       description: URL to retrieve the blog with the updated comment.
 *       500:
 *         description: Internal Server Error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
/**
 * @swagger
 * /api/v1/ped/blogs/{blogId}/like:
 *   post:
 *     summary: Like a blog.
 *     description: Like a specific blog by its unique identifier.
 *     parameters:
 *       - in: path
 *         name: blogId
 *         required: true
 *         description: The unique identifier of the blog to like.
 *         schema:
 *           type: string
 *     tags: [Blogs]
 *     responses:
 *       200:
 *         description: Blog liked successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A success message.
 *                 request:
 *                   type: object
 *                   description: Details about how to retrieve the blog with the updated like.
 *                   properties:
 *                     type:
 *                       type: string
 *                       description: The HTTP request type (GET).
 *                     description:
 *                       type: string
 *                       description: Description of the request.
 *                     url:
 *                       type: string
 *                       description: URL to retrieve the liked blog.
 *       500:
 *         description: Internal Server Error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
/**
 * @swagger
 * /api/v1/ped/blogs/{blogId}/unlike:
 *   post:
 *     summary: Unlike a blog.
 *     description: Unlike a specific blog by its unique identifier.
 *     parameters:
 *       - in: path
 *         name: blogId
 *         required: true
 *         description: The unique identifier of the blog to unlike.
 *         schema:
 *           type: string
 *     tags: [Blogs]
 *     responses:
 *       200:
 *         description: Blog unliked successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A success message.
 *                 request:
 *                   type: object
 *                   description: Details about how to retrieve the blog with the updated like status.
 *                   properties:
 *                     type:
 *                       type: string
 *                       description: The HTTP request type (GET).
 *                     description:
 *                       type: string
 *                       description: Description of the request.
 *                     url:
 *                       type: string
 *                       description: URL to retrieve the unliked blog.
 *       500:
 *         description: Internal Server Error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
/**
 * @swagger
 * /api/v1/ped/blogs/{blogId}/comments/{commentId}/replies/{replyId}:
 *   post:
 *     summary: Reply to a reply on a comment.
 *     description: Reply to a reply on a comment by its unique identifiers.
 *     parameters:
 *       - in: path
 *         name: blogId
 *         required: true
 *         description: The unique identifier of the blog.
 *         schema:
 *           type: string
 *       - in: path
 *         name: commentId
 *         required: true
 *         description: The unique identifier of the parent comment.
 *         schema:
 *           type: string
 *       - in: path
 *         name: replyId
 *         required: true
 *         description: The unique identifier of the reply to which you want to reply.
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *                 description: The text of the reply.
 *             required:
 *               - text
 *     tags: [Blogs]
 *     responses:
 *       201:
 *         description: Reply to reply created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A success message.
 *                 reply:
 *                   type: object
 *                   description: The created reply to the reply.
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: The unique identifier of the reply.
 *                     text:
 *                       type: string
 *                       description: The text of the reply.
 *                 request:
 *                   type: object
 *                   description: Details about how to retrieve the created reply to reply.
 *                   properties:
 *                     type:
 *                       type: string
 *                       description: The HTTP request type (GET).
 *                     description:
 *                       type: string
 *                       description: Description of the request.
 *                     url:
 *                       type: string
 *                       description: URL to retrieve the created reply to reply.
 *       500:
 *         description: Internal Server Error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
/**
 * @swagger
 * /api/v1/ped/blogs/{blogId}/comments/{commentId}/replies/{replyId}:
 *   delete:
 *     summary: Delete a reply to a reply on a comment.
 *     description: Delete a reply to a reply on a comment by its unique identifiers.
 *     parameters:
 *       - in: path
 *         name: blogId
 *         required: true
 *         description: The unique identifier of the blog.
 *         schema:
 *           type: string
 *       - in: path
 *         name: commentId
 *         required: true
 *         description: The unique identifier of the parent comment.
 *         schema:
 *           type: string
 *       - in: path
 *         name: replyId
 *         required: true
 *         description: The unique identifier of the reply to which you want to delete a reply.
 *         schema:
 *           type: string
 *     tags: [Blogs]
 *     responses:
 *       200:
 *         description: Reply to reply deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A success message.
 *                 request:
 *                   type: object
 *                   description: Details about how to delete a reply to reply.
 *                   properties:
 *                     type:
 *                       type: string
 *                       description: The HTTP request type (POST).
 *                     description:
 *                       type: string
 *                       description: Description of the request.
 *                     url:
 *                       type: string
 *                       description: URL to delete a reply to reply.
 *       404:
 *         description: Reply to reply not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: An error message indicating that the reply to reply was not found.
 *       500:
 *         description: Internal Server Error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
/**
 * @swagger
 * /api/v1/ped/blogs/{blogId}/comments/{commentId}/replies/{replyId}:
 *   put:
 *     summary: Edit a reply to a reply on a comment.
 *     description: Edit a reply to a reply on a comment by its unique identifiers.
 *     parameters:
 *       - in: path
 *         name: blogId
 *         required: true
 *         description: The unique identifier of the blog.
 *         schema:
 *           type: string
 *       - in: path
 *         name: commentId
 *         required: true
 *         description: The unique identifier of the parent comment.
 *         schema:
 *           type: string
 *       - in: path
 *         name: replyId
 *         required: true
 *         description: The unique identifier of the reply to reply.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 description: New content for the reply to reply.
 *             required:
 *               - content
 *     tags: [Blogs]
 *     responses:
 *       200:
 *         description: Reply to reply edited successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A success message.
 *                 request:
 *                   type: object
 *                   description: Details about how to edit a reply to reply.
 *                   properties:
 *                     type:
 *                       type: string
 *                       description: The HTTP request type (PUT).
 *                     description:
 *                       type: string
 *                       description: Description of the request.
 *                     url:
 *                       type: string
 *                       description: URL to edit the reply to reply.
 *       404:
 *         description: Reply to reply not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: An error message indicating that the reply to reply was not found.
 *       500:
 *         description: Internal Server Error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
