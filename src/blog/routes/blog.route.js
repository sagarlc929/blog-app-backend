import express from 'express';
import { authenticateAccessToken } from '../../user/middlewares/authenticateToken.middleware.js';
import { blogCreate, blogsMy , delMyBlog, modMyBlog } from '../controllers/blog.controller.js';
const blogRouter = express.Router();

blogRouter.post('/create-blog', authenticateAccessToken, blogCreate);
blogRouter.get('/get-my-blogs', authenticateAccessToken, blogsMy);
blogRouter.delete('/delete-my-blog', authenticateAccessToken, delMyBlog);
blogRouter.patch('/update-my-blog', authenticateAccessToken, modMyBlog);
export default blogRouter;
