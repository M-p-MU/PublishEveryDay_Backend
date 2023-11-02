const { getCollection } = require("../database.js");
const { ObjectId } = require("mongodb");
const { verifyAuthToken } = require("../Middlewares/jwtAuthorization.js");
const {
  processContentWithImages,
} = require("../Middlewares/sanitizeContent.js");
const fs = require("fs");

//__________Create a new blog/any content type___________/
// eslint-disable-next-line no-undef
const createBlog = async (req, res) => {
  try {
    // Check if a valid token is present in the request headers
    const token = req.headers.authorization;
    console.log("token before splitting :"+token);
    if (!token) {
      return res.status(401).json({ error: "Unauthorized: Token is missing" });
    }

    try {
      const decoded = await verifyAuthToken(token);
      req.user = decoded;
      const blogData = req.body;
      const blogsCollection = await getCollection("blogs");

      // Handle image uploads if included in the request
      if (req.file) {
        const uploadDir = "./blogImages/";

        const originalName = req.file.originalname;

        const timestamp = Date.now();
        const filename = `${timestamp}_${originalName}`;

        blogData.image = filename;

        const filePath = uploadDir + filename;

        // Save the image
        fs.writeFile(filePath, req.file.buffer, (err) => {
          if (err) {
            console.error("Error saving image:", err);
          } else {
            console.log("Image saved successfully");
          }
        });
      }
      // sanitize the content
      const { sanitizedContent } = processContentWithImages(blogData.content);

      // Set blog data
      blogData.content = sanitizedContent;
      (blogData.comments = [
        {
          _id: ObjectId,
          text: "This is default comment by admin 1.",
          user: {
            userId: ObjectId,
            username: "admin 1",
          },
          replies: [
            {
              _id: ObjectId,
              commentId: ObjectId,
              text: "Reply to the comment by admin 2.",
              user: {
                userId: ObjectId,
                username: "admin 2",
              },
              createdAt: Date().now,
              updatedAt: Date().now,
              replies: [
                {
                  _id: ObjectId,
                  commentId: ObjectId,
                  text: "Reply to the reply.",
                  user: {
                    userId: ObjectId,
                    username: "replyer_username",
                  },
                  createdAt: Date().now,
                  updatedAt: Date().now,
                },
              ],
            },
          ],
          createdAt: Date().now,
          updatedAt: Date().now,
        },
      ]),
      (blogData.likes = []);
      blogData.writterId = req.user._id;
      blogData.author = req.user.username;
      blogData.likesCount = 0;
      blogData.commentsCount = 0;
      blogData.createdAt = new Date();
      blogData.updatedAt = new Date();

      // Insert the blog data into the MongoDB collection
      const result = await blogsCollection.insertOne(blogData);

      const createdBlog = {
        _id: result.insertedId,
        title: blogData.title,
        content: sanitizedContent,
        image: blogData.image,
      };

      res.status(201).json({
        message: "Content created successfully.",
        blog: createdBlog,
      });
    } catch (error) {
      return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }
  } catch (error) {
    console.error("Error creating the content:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//___________Get All Blogs ______________________________/
const getAllBlogs = async (req, res) => {
  try {
    // Get token to make sure it is admin who wants unpaginated blogs
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ error: "Unauthorized: Token is missing" });
    }

    try {
      const decoded = await verifyAuthToken(token);
      req.user = decoded;

      if (req.user.role === "admin") {
        const blogsCollection = getCollection("blogs");
        const blogs = await blogsCollection.find({}).toArray();

        return res.status(200).json({
          metadata: {
            count: blogs.length,
            message: "List of all created blogs retrieved successfully.",
          },
          blogs: blogs,
          request: {
            type: "GET",
            description: "Get all blogs",
            url: "/api/v1/ped/blogs",
          },
        });
      } else {
        // Handle unauthorized access for non-admin users,
        return res.status(403).json({
          error: "Forbidden: You don't have the required privileges.",
        });
      }
    } catch (error) {
      console.error("Error verifying token:", error);
      return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

//____________Get All Blogs by category__________________/
const getBlogsByCategory = async (req, res) => {
  try {
    // Get the category from the request parameters
    const category = req.params.category;

    // Check if the category is provided
    if (!category) {
      return res.status(400).json({ error: "Category parameter is missing" });
    }

    // Convert the category to lowercase for a case-insensitive search
    const lowercaseCategory = category.toLowerCase();

    // Fetch blogs that match the category
    const blogsCollection = getCollection("blogs");
    const blogs = await blogsCollection
      .find({ category: lowercaseCategory })
      .toArray();

    // Check if any blogs were found
    if (blogs.length === 0) {
      return res
        .status(404)
        .json({ error: "No blogs found for the specified category" });
    }

    // Customize the response format, including pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = blogs.length;

    const paginatedBlogs = blogs.slice(startIndex, endIndex);

    const response = {
      metadata: {
        count: paginatedBlogs.length,
        total,
        page,
        message: "Blogs retrieved successfully.",
      },
      blogs: paginatedBlogs,
      request: {
        type: "GET",
        description: "Get blogs by category",
        url: `/api/v1/ped/blogs/by-category/${category}`,
      },
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching blogs by category:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//___________Get a single blog by ID_____________________/
const getBlogById = async (req, res) => {
  try {
    const id = `${req.params.id}`;
    if (!id) {
      return res.status(400).json({ error: "Blog ID is missing" });
    }
    const blogsCollection = getCollection("blogs");
    const blog = await blogsCollection.findOne(new ObjectId(id));
    if (!blog) {
      return res.status(404).json({ error: "Blog not available " });
    }
    const formattedBlog = {
      _id: blog._id,
      title: blog.title,
      content: blog.content,
      image: blog.image,
      ...blog,
    };

    res.status(200).json({
      blog: formattedBlog,
      request: {
        type: "GET",
        description: "You can still see all blogs",
        url: `/api/v1/ped/blogs`,
      },
    });
  } catch (error) {
    console.error("Error fetching a blogpost:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//______________ Update an existing blog_________________/
const updateBlog = async (req, res) => {
  const id = `${req.params.id}`;
  const blogUpdatedData = {};
  const file = req.file;
  try {
    const blogsCollection = getCollection("blogs");

    if (!ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ error: "Invalid ObjectId. You can't update content then." });
    }

    if (typeof blogUpdatedData !== "object" || blogUpdatedData === null) {
      return res.status(400).json({ error: "Invalid update data" });
    }

    if (file) {
      const uploadDir = "./blogImages/";
      const originalName = file.originalname;
      const timestamp = Date.now();
      const filename = `${timestamp}_${originalName}`;
      const filePath = uploadDir + filename;

      fs.rename(file.path, filePath, (err) => {
        if (err) {
          console.error("Error renaming image:", err);
        } else {
          console.log("Image renamed and updated successfully");
          blogUpdatedData.image = filename;
        }
      });
    }

    for (const key in req.body) {
      blogUpdatedData[key] = req.body[key];
    }

    const updatedBlog = await blogsCollection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: blogUpdatedData },
      { returnDocument: "after" }
    );

    if (updatedBlog === null) {
      return res
        .status(404)
        .json({ error: "Blog not found, content didn't get updated." });
    }

    const formattedBlog = {
      _id: updatedBlog._id,
      ...updatedBlog,
    };

    res.status(200).json({
      message: "Blog updated successfully.",
      blog: formattedBlog,
      request: {
        type: "GET",
        description: "Get the content of updated blog",
        url: `/api/v1/ped/blogs/${id}`,
      },
    });
  } catch (error) {
    console.error("Error updating a blog:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//______________ Delete a blog by ID_____________________/
const deleteBlog = async (req, res) => {
  const id = `${req.params.id}`;
  const blogsCollection = getCollection("blogs");
  // Get the token to make sure it is an admin who wants to delete the blog
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: Token is missing" });
  }

  try {
    // Verify the token
    const decoded = await verifyAuthToken(token);
    req.user = decoded;

    // Check if the user is an admin
    if (req.user.role === "admin") {
      const blogsCollection = getCollection("blogs");
      const result = await blogsCollection.deleteOne({
        _id: new ObjectId(id),
      });

      if (result.deletedCount === 0) {
        return res
          .status(404)
          .json({ error: "Blog not found, can't perform delete" });
      }

      // Successful deletion with 204 status (No Content)
      res.status(204).end();
    } else {
      // The user is not an admin, check ownership
      const blog = await blogsCollection.findOne({ _id: new ObjectId(id) });
      if (blog.ownerId !== req.user._id) {
        return res.status(403).json({
          error: "Forbidden: You don't have the required privileges.",
        });
      }

      // User is the owner; proceed with deletion
      const result = await blogsCollection.deleteOne({
        _id: new ObjectId(id),
      });

      if (result.deletedCount === 0) {
        return res
          .status(404)
          .json({ error: "Blog not found, can't perform delete" });
      }

      res.status(204).end();
    }
  } catch (error) {
    console.error("Error deleting a blog:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//__________Get all blogs with pagination_______________/
const getAllBlogsPaginated = async (req, res) => {
  try {
    const blogsCollection = getCollection("blogs");
    const page = parseInt(req.query.page) || 1;
    const blogsPerPage = 10;
    const skip = (page - 1) * blogsPerPage;

    const blogs = await blogsCollection
      .find({})
      .skip(skip)
      .limit(blogsPerPage)
      .toArray();

    res.status(200).json({
      metadata: {
        count: blogs.length,
        message: "List of all created blogs retrieved successfully.",
        page: page,
      },
      blogs: blogs,
      request: {
        type: "GET",
        description: "Get all blogs with pagination",
        url: `/api/v1/ped/blogs/paginated?page=${page + 1}`,
      },
    });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//___________Get the top 10 popular blogs ______________/
const getTopBlogs = async (req, res) => {
  try {
    const blogsCollection = getCollection("blogs");

    // Sort top 10 blogs by likes and comments
    const topBlogs = await blogsCollection
      .find({})
      .sort({ likesCount: -1, commentsCount: -1 })
      .limit(10)
      .toArray();

    res.status(200).json({
      metadata: {
        count: topBlogs.length,
        message:
          "Top 10 blogs with most likes and comments retrieved successfully.",
      },
      topBlogs: topBlogs,
    });
  } catch (error) {
    console.error("Error fetching top blogs:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//____________Get certain blogger's blogs_______________/
const getBlogsByOwner = async (req, res) => {
  const token = req.headers.authorization;
  const userId = req.params.id;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: Token is missing" });
  }

  try {
    // Verify the token
    const decoded = await verifyAuthToken(token);
    req.user = decoded;

    if (req.user.role === "admin") {
      const blogsCollection = getCollection("blogs");

      // Check if the user has any blogs
      const userBlogs = await blogsCollection
        .find({ ownerId: userId })
        .toArray();

      if (userBlogs.length === 0) {
        return res
          .status(404)
          .json({ error: "No blogs found for this person." });
      }

      // Check if the request has a "page" query parameter for pagination
      const page = parseInt(req.query.page) || 1;
      const blogsPerPage = 10;
      const skip = (page - 1) * blogsPerPage;

      const paginatedUserBlogs = userBlogs.slice(skip, skip + blogsPerPage);

      const metadata = {
        count: paginatedUserBlogs.length,
        message: "Blogs retrieved successfully for this owner.",
      };

      // Provide a link to the next page if there are more blogs
      if (userBlogs.length > skip + blogsPerPage) {
        metadata.nextPage = `/api/v1/ped/blogs/by-owner/${userId}?page=${
          page + 1
        }`;
      }

      res.status(200).json({
        metadata,
        userBlogs: paginatedUserBlogs,
      });
    } else {
      // Handle the case where the requester is not an admin
      return res.status(403).json({
        error:
          "Forbidden: You don't have the required privileges to access this resource.",
      });
    }
  } catch (error) {
    console.error("Error fetching owner's blogs:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// ___________Comment on particular blog________________/
const commentOnBlog = async (req, res) => {
  const id = `${req.params.id}`;
  const comment = req.body.comment;
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: Token is missing" });
  }

  try {
    // Verify the token
    const decoded = await verifyAuthToken(token);
    req.user = decoded;

    const blogsCollection = getCollection("blogs");
    const blog = await blogsCollection.findOne({ _id: new ObjectId(id) });

    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    const commentData = {
      _id: new ObjectId(),
      text: comment,
      user: {
        userId: new ObjectId(),
        username: req.user.username,
      },
      replies: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await blogsCollection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $push: { comments: commentData }, $inc: { commentsCount: 1 } },
      { returnDocument: "after" }
    );

    if (result.value === null) {
      return res
        .status(404)
        .json({ error: "Blog not found, can't perform comment" });
    }

    const formattedBlog = {
      _id: result.value._id,
      ...result.value,
    };

    res.status(200).json({
      message: "Comment added successfully.",
      blog: formattedBlog,
      request: {
        type: "GET",
        description: "Get the content of the updated blog",
        url: `/api/v1/ped/blogs/${id}`,
      },
    });
  } catch (error) {
    console.error("Error commenting on a blog:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
//____________Reply on particular comment_______________/
const replyOnComment = async (req, res) => {
  const blogId = req.params.blogId;
  const commentId = req.params.commentId;
  const replyText = req.body.replyText;
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: Token is missing" });
  }

  try {
    // Verify the token
    const decoded = await verifyAuthToken(token);
    req.user = decoded;

    const blogsCollection = getCollection("blogs");
    const blog = await blogsCollection.findOne({ _id: new ObjectId(blogId) });

    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    // Find the target comment to which you want to reply
    const targetComment = blog.comments.find((comment) =>
      comment._id.equals(new ObjectId(commentId))
    );

    if (!targetComment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    // Create the reply data
    const replyData = {
      _id: new ObjectId(),
      text: replyText,
      user: {
        userId: new ObjectId(),
        username: req.user.username,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Update the target comment with the new reply
    targetComment.replies.push(replyData);

    const result = await blogsCollection.findOneAndUpdate(
      { _id: new ObjectId(blogId) },
      { $set: { comments: blog.comments } },
      { returnDocument: "after" }
    );

    if (result.value === null) {
      return res
        .status(404)
        .json({ error: "Blog not found, can't perform reply" });
    }

    const formattedBlog = {
      _id: result.value._id,
      ...result.value,
    };

    res.status(200).json({
      message: "Reply added successfully.",
      blog: formattedBlog,
      request: {
        type: "GET",
        description: "Get the content of the updated blog",
        url: `/api/v1/ped/blogs/${blogId}`,
      },
    });
  } catch (error) {
    console.error("Error replying to a comment:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
//____________Delete a comment__________________________/

const deleteComment = async (req, res) => {
  const blogId = req.params.blogId;
  const commentId = req.params.commentId;
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: Token is missing" });
  }

  try {
    // Verify the token
    const decoded = await verifyAuthToken(token);
    req.user = decoded;

    const blogsCollection = getCollection("blogs");
    const blog = await blogsCollection.findOne({ _id: new ObjectId(blogId) });

    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    // Find the comment to delete
    const commentIndex = blog.comments.findIndex((c) =>
      c._id.equals(new ObjectId(commentId))
    );

    if (commentIndex === -1) {
      return res.status(404).json({ error: "Comment not found" });
    }

    // Check if the user is the owner of the comment or an admin
    if (
      req.user.userId.equals(blog.comments[commentIndex].user.userId) ||
      req.user.role === "admin"
    ) {
      // Remove the comment from the comments array
      blog.comments.splice(commentIndex, 1);

      const result = await blogsCollection.findOneAndUpdate(
        { _id: new ObjectId(blogId) },
        {
          $set: {
            comments: blog.comments,
            commentsCount: blog.commentsCount - 1,
          },
        },
        { returnDocument: "after" }
      );

      if (result.value === null) {
        return res
          .status(404)
          .json({ error: "Blog not found, can't perform delete" });
      }

      const formattedBlog = {
        _id: result.value._id,
        ...result.value,
      };

      res.status(200).json({
        message: "Comment deleted successfully.",
        blog: formattedBlog,
        request: {
          type: "GET",
          description: "Get the content of the updated blog",
          url: `/api/v1/ped/blogs/${blogId}`,
        },
      });
    } else {
      res.status(403).json({
        error:
          "Forbidden: You don't have the required privileges to delete this comment.",
      });
    }
  } catch (error) {
    console.error("Error deleting a comment:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//____________Update a comment__________________________/
const updateComment = async (req, res) => {
  const commentId = req.params.commentId;
  const newCommentText = req.body.comment;

  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ error: "Unauthorized: Token is missing" });
  }

  try {
    // Verify the token
    const decoded = await verifyAuthToken(token);
    req.user = decoded;

    const blogsCollection = getCollection("blogs");

    // Find the blog containing the comment
    const blog = await blogsCollection.findOne({
      "comments._id": new ObjectId(commentId),
    });

    if (!blog) {
      return res.status(404).json({ error: "Blog or comment not found" });
    }

    // Find the specific comment
    const commentIndex = blog.comments.findIndex(
      (comment) => comment._id.toString() === commentId
    );

    // Check if the user is the comment owner
    if (blog.comments[commentIndex].user.userId.toString() !== req.user._id) {
      return res.status(403).json({
        error: "Forbidden: You don't have the required privileges.",
      });
    }

    // Store the replies for the comment
    const existingReplies = blog.comments[commentIndex].replies;

    // Update the comment text and updatedAt
    blog.comments[commentIndex].text = newCommentText;
    blog.comments[commentIndex].updatedAt = new Date();

    // Restore the existing replies
    blog.comments[commentIndex].replies = existingReplies;

    // Update the blog document in the database
    const result = await blogsCollection.updateOne(
      { _id: blog._id },
      { $set: { comments: blog.comments } }
    );

    if (result.modifiedCount === 0) {
      return res
        .status(404)
        .json({ error: "Blog or comment not found, can't perform update" });
    }

    res.status(200).json({
      message: "Comment updated successfully.",
      request: {
        type: "GET",
        description: "Get the content of the updated blog",
        url: `/api/v1/ped/blogs/${blog._id}`,
      },
    });
  } catch (error) {
    console.error("Error updating a comment:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//_____________Like the blog____________________________/
const likeBlog = async (req, res) => {
  const blogId = req.params.blogId;
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: Token is missing" });
  }

  try {
    // Verify the token
    const decoded = await verifyAuthToken(token);
    req.user = decoded;

    const blogsCollection = getCollection("blogs");
    const blog = await blogsCollection.findOne({ _id: new ObjectId(blogId) });

    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    // Check if the user has already liked the blog
    const hasLiked = blog.likes.some((like) =>
      like.user.userId.equals(new ObjectId(req.user.userId))
    );

    if (hasLiked) {
      return res
        .status(400)
        .json({ error: "You have already liked this blog." });
    }

    // Create a like data
    const likeData = {
      user: {
        userId: new ObjectId(req.user.userId),
        username: req.user.username,
      },
      createdAt: new Date(),
    };

    // Push the new like into the blog's likes array
    blog.likes.push(likeData);

    // Increment the likesCount field
    blog.likesCount = blog.likesCount + 1;

    const result = await blogsCollection.findOneAndUpdate(
      { _id: new ObjectId(blogId) },
      {
        $set: {
          likes: blog.likes,
          likesCount: blog.likesCount,
        },
      },
      { returnDocument: "after" }
    );

    if (result.value === null) {
      return res
        .status(404)
        .json({ error: "Blog not found, can't perform like" });
    }

    const formattedBlog = {
      _id: result.value._id,
      ...result.value,
    };

    res.status(200).json({
      message: "Blog liked successfully.",
      blog: formattedBlog,
      request: {
        type: "GET",
        description: "Get the content of the updated blog",
        url: `/api/v1/ped/blogs/${blogId}`,
      },
    });
  } catch (error) {
    console.error("Error liking a blog:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
// ____________Unlike the blog__________________________/

const unlikeBlog = async (req, res) => {
  const blogId = req.params.blogId;
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: Token is missing" });
  }

  try {
    // Verify the token
    const decoded = await verifyAuthToken(token);
    req.user = decoded;

    const blogsCollection = getCollection("blogs");
    const blog = await blogsCollection.findOne({ _id: new ObjectId(blogId) });

    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    // Check if the user has liked the blog
    const likeIndex = blog.likes.findIndex((like) =>
      like.user.userId.equals(new ObjectId(req.user.userId))
    );

    if (likeIndex === -1) {
      return res.status(400).json({ error: "You have not liked this blog." });
    }

    // Remove the like from the likes array
    blog.likes.splice(likeIndex, 1);

    // Decrement the likesCount field
    blog.likesCount = blog.likesCount - 1;

    const result = await blogsCollection.findOneAndUpdate(
      { _id: new ObjectId(blogId) },
      {
        $set: {
          likes: blog.likes,
          likesCount: blog.likesCount,
        },
      },
      { returnDocument: "after" }
    );

    if (result.value === null) {
      return res
        .status(404)
        .json({ error: "Blog not found, can't perform unlike" });
    }

    const formattedBlog = {
      _id: result.value._id,
      ...result.value,
    };

    res.status(200).json({
      message: "Blog unliked successfully.",
      blog: formattedBlog,
      request: {
        type: "GET",
        description: "Get the content of the updated blog",
        url: `/api/v1/ped/blogs/${blogId}`,
      },
    });
  } catch (error) {
    console.error("Error unliking a blog:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//_____________Replying  to a certain reply______________/

const replyToReply = async (req, res) => {
  const blogId = req.params.blogId;
  const commentId = req.params.commentId;
  const replyId = req.params.replyId;
  const replyText = req.body.replyText;
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: Token is missing" });
  }

  try {
    // Verify the token
    const decoded = await verifyAuthToken(token);
    req.user = decoded;

    const blogsCollection = getCollection("blogs");
    const blog = await blogsCollection.findOne({ _id: new ObjectId(blogId) });

    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    // Find the comment
    const comment = blog.comments.find((c) =>
      c._id.equals(new ObjectId(commentId))
    );

    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    // Find the reply
    const reply = comment.replies.find((r) =>
      r._id.equals(new ObjectId(replyId))
    );

    if (!reply) {
      return res.status(404).json({ error: "Reply not found" });
    }

    //Create a new reply to the reply
    const newReply = {
      _id: ObjectId(),
      text: replyText,
      user: {
        userId: ObjectId(req.user.userId),
        username: req.user.username,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Add the new reply to the replies of the reply
    reply.replies.push(newReply);

    const result = await blogsCollection.findOneAndUpdate(
      { _id: new ObjectId(blogId) },
      { $set: { comments: blog.comments } },
      { returnDocument: "after" }
    );

    if (result.value === null) {
      return res
        .status(404)
        .json({ error: "Blog not found, can't perform reply" });
    }

    const formattedBlog = {
      _id: result.value._id,
      ...result.value,
    };

    res.status(200).json({
      message: "Replied to the reply successfully.",
      blog: formattedBlog,
      request: {
        type: "GET",
        description: "Get the content of the updated blog",
        url: `/api/v1/ped/blogs/${blogId}`,
      },
    });
  } catch (error) {
    console.error("Error replying to a reply:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//____________Delete a reply_____________________________/
const deleteReply = async (req, res) => {
  const blogId = req.params.blogId;
  const commentId = req.params.commentId;
  const replyId = req.params.replyId;
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: Token is missing" });
  }

  try {
    // Verify the token
    const decoded = await verifyAuthToken(token);
    req.user = decoded;

    const blogsCollection = getCollection("blogs");
    const blog = await blogsCollection.findOne({ _id: new ObjectId(blogId) });

    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    // Find the target comment and reply
    const targetComment = blog.comments.find((comment) =>
      comment._id.equals(new ObjectId(commentId))
    );

    if (!targetComment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    const targetReplyIndex = targetComment.replies.findIndex((reply) =>
      reply._id.equals(new ObjectId(replyId))
    );

    if (targetReplyIndex === -1) {
      return res.status(404).json({ error: "Reply not found" });
    }

    // Check if the user has permission to delete the reply
    if (
      targetComment.replies[targetReplyIndex].user.userId.toString() !==
      req.user.userId
    ) {
      return res.status(403).json({
        error: "Forbidden: You don't have permission to delete this reply",
      });
    }

    // Remove the reply
    targetComment.replies.splice(targetReplyIndex, 1);

    const result = await blogsCollection.findOneAndUpdate(
      { _id: new ObjectId(blogId) },
      { $set: { comments: blog.comments } },
      { returnDocument: "after" }
    );

    if (result.value === null) {
      return res
        .status(404)
        .json({ error: "Blog not found, can't perform reply deletion" });
    }

    const formattedBlog = {
      _id: result.value._id,
      ...result.value,
    };

    res.status(200).json({
      message: "Reply deleted successfully.",
      blog: formattedBlog,
      request: {
        type: "GET",
        description: "Get the content of the updated blog",
        url: `/api/v1/ped/blogs/${blogId}`,
      },
    });
  } catch (error) {
    console.error("Error deleting a reply:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//_____________Edit a reply______________________________/
const editReply = async (req, res) => {
  const blogId = req.params.blogId;
  const commentId = req.params.commentId;
  const replyId = req.params.replyId;
  const editedReplyText = req.body.editedReplyText;
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: Token is missing" });
  }

  try {
    // Verify the token
    const decoded = await verifyAuthToken(token);
    req.user = decoded;

    const blogsCollection = getCollection("blogs");
    const blog = await blogsCollection.findOne({ _id: new ObjectId(blogId) });

    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    // Find the target comment and reply to edit
    const targetComment = blog.comments.find((comment) =>
      comment._id.equals(new ObjectId(commentId))
    );

    if (!targetComment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    const targetReply = targetComment.replies.find((reply) =>
      reply._id.equals(new ObjectId(replyId))
    );

    if (!targetReply) {
      return res.status(404).json({ error: "Reply not found" });
    }

    // Update the reply text
    targetReply.text = editedReplyText;
    targetReply.updatedAt = new Date();

    const result = await blogsCollection.findOneAndUpdate(
      { _id: new ObjectId(blogId) },
      { $set: { comments: blog.comments } }, // Update the comments array
      { returnDocument: "after" }
    );

    if (result.value === null) {
      return res
        .status(404)
        .json({ error: "Blog not found, can't perform reply edit" });
    }

    const formattedBlog = {
      _id: result.value._id,
      ...result.value,
    };

    res.status(200).json({
      message: "Reply edited successfully.",
      blog: formattedBlog,
      request: {
        type: "GET",
        description: "Get the content of the updated blog",
        url: `/api/v1/ped/blogs/${blogId}`,
      },
    });
  } catch (error) {
    console.error("Error editing a reply:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
module.exports = {
  createBlog,
  getAllBlogs,
  getBlogsByCategory,
  getBlogById,
  updateBlog,
  deleteBlog,
  getAllBlogsPaginated,
  getTopBlogs,
  getBlogsByOwner,
  commentOnBlog,
  replyOnComment,
  deleteComment,
  updateComment,
  likeBlog,
  unlikeBlog,
  replyToReply,
  deleteReply,
  editReply,
};
