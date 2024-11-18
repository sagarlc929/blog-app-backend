// routes/users.routes.js
import express from 'express';
import {
  userRegister,
  userLogin,
  userHome,
  userLogout,
  userGenerateToken,
  userSaveUser,
  // userProfilePic,
} from '../controllers/users.controller.js';
import {
  authenticateAccessToken,
  authenticateRefreshToken,
} from '../middlewares/authenticateToken.middleware.js';
import {
  registerValidator,
  loginValidator,
} from '../middlewares/joiValidation.middleware.js';
import { registerOtpValidation } from '../middlewares/otpValidation.middleware.js';
// import upload from "../../global/utils/multer.util.js";

const usersRouter = express.Router();

usersRouter.post('/register', registerValidator, userRegister);
usersRouter.post('/login', loginValidator, userLogin);
usersRouter.get('/home', authenticateAccessToken, userHome);
usersRouter.get('/generate-token', authenticateRefreshToken, userGenerateToken);
usersRouter.delete('/logout', authenticateAccessToken, userLogout);
usersRouter.post(
  '/registration-generate-otp',
  registerOtpValidation,
  userSaveUser
);
// usersRouter.post('/profile-pic-upload', authenticateAccessToken, userProfilePic);

export { usersRouter };
