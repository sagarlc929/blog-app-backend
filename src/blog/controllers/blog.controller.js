// modified for test
import BlogSchema from "../models/blog.model.js";
import {
  sendSuccessResponse,
  sendErrorResponse,
} from "./../../global/utils/sendResponse.util.js";
import logger from "../../global/utils/logger.util.js";

export const blogCreate = async (req, res) => {
  const newBlog = new BlogSchema({
    text: req.body.text,
    user_id: req.user.id,
  });
  try {
    const blogToSave = await newBlog.save();
    if (blogToSave)
      return sendSuccessResponse(res, 200, "Blog saved successfully");
  } catch (error) {
    logger.error(error);
    return sendSuccessResponse(res, 500, "Error storing blog.");
  }

  return sendSuccessResponse(res, 200, "controllerBlogCreate");
};

export const blogsMy = async (req, res) => {
  const userId = req.user.id;
  try {
    const myBlogs = await BlogSchema.find({ user_id: userId });
    const formattedMyBlogs = myBlogs.map((blog) => ({
      id: blog._id,
      text: blog.text,
    }));
    return sendSuccessResponse(res, 200, "Successfully fetch blogs", {
      formattedMyBlogs,
    });
  } catch (error) {
    logger.error(error);
    return sendErrorResponse(res, 500, "Error while fetching blog");
  }
};
export const delMyBlog = async (req, res) => {
  const userId = req.user.id;
  const blogId = req.body.blog_id;
  try {
    const blog = await BlogSchema.findById({ _id: blogId });
    if (!blog) return sendErrorResponse(res, 404, "Blog id not found");
    if (blog.user_id.toString() === userId) {
      const result = await BlogSchema.findByIdAndDelete({ _id: blogId });
      return sendSuccessResponse(res, 200, "Blog deleted successfully");
    }
    return sendErrorResponse(res, 401, "Unauthorized to delete the blog");
  } catch (error) {
    logger.error(error);
    return sendErrorResponse(res, 500, "Error while deleting blog");
  }
};
export const modMyBlog = async (req, res) => {
  const userId = req.user.id;
  const blogId = req.body.blog_id;
  const newText = req.body.text;
  try {
    const blog = await BlogSchema.findById({ _id: blogId });
    if (!blog) return sendErrorResponse(res, 404, "Blog id not found");
    if (blog.user_id.toString() === userId) {
      const result = await BlogSchema.findByIdAndUpdate(
        { _id: blogId },
        { text: newText, updatedAt: Date.now() },
      );
      if (result)
        return sendSuccessResponse(res, 200, "Blog updated successfully");
    }
    return sendErrorResponse(res, 401, "Unauthorized to update the blog");
  } catch (error) {
    logger.error(error);
    return sendErrorResponse(res, 500, "Error while updating blog");
  }
};
