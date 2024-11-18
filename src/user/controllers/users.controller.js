// controllers/users.controller.js
import 'dotenv/config';
import bcrypt from 'bcrypt';
import logger from '../../global/utils/logger.util.js';
import {
  sendSuccessResponse,
  sendErrorResponse,
} from './../../global/utils/sendResponse.util.js';
import { redisClient } from '../../global/configs/redis.js';
import {
  generateAccessToken,
  generateRefreshToken,
} from '../helpers/generateToken.helper.js';
import {
  // removeRefreshToken,
  storeAccessToken,
  storeTokens,
  removeTokens,
} from '../helpers/manageToken.helper.js';
import { transporter } from '../../global/configs/nodemailer.js';
import speakeasy from 'speakeasy';
import { emailOtpCompiledFunction } from '../../global/template/emailOtpCompiled.js';
import UserModel from '../models/users.models.js';

// import cloudinary from "../../global/configs/cloudinary.js";

export const userRegister = async (req, res) => {
  const reqData = req.body.value;
  // validate username exists
  const isUsernameExist = await UserModel.findOne({
    username: reqData.username,
  });
  if (isUsernameExist)
    return sendErrorResponse(res, 400, 'Username already exists');
  const hashPass = await bcrypt.hash(reqData.password, 10);
  const newUser = {
    firstName: reqData.firstName,
    lastName: reqData.lastName,
    phone: reqData.phone,
    dateOfBirth: reqData.dateOfBirth ? reqData.dateOfBirth : null,
    age: reqData.age,
    username: reqData.username,
    email: reqData.email,
    password: hashPass,
  };
  /*
  const image = req.image;


  try{
    // upload imge buffer to Cloudinary
    cloudinary.uploader.upload_stream(
      {resource_type: 'image'},
      (error, uploadResult)=>{
        if(error){
          logger.error(error);
          return sendErrorResponse(res, 500, 'Image upload failed');
        }
        console.log("usrCon:46]->", uploadResult.secure_url);
        newUser[image] = uploadResult.secure_url;
      }
    ).end(image.buffer); // upload the image buffer to cloudinary
  } catch(error){
    return sendErrorResponse(res, 500, "Failed to upload Image");
  }
*/
  // temporaily storing the data in redis
  redisClient.setEx(
    `registrationUserInfo:${newUser.email}`,
    300, // 5 minute as otp
    JSON.stringify({ newUserInfo: newUser })
  );

  // Generate a unique secret for each user and store it temporarily
  const secret = speakeasy.generateSecret({ length: 20 });
  redisClient.setEx(
    `registrationSecret:${newUser.email}`,
    300, // 5 min as otp
    JSON.stringify({ secret: secret.base32 })
  );

  const otp = speakeasy.totp({
    secret: secret.base32,
    encoding: 'base32',
    step: 300, // OTP validity in seconds (5 minutes)
  });

  redisClient.setEx(
    `RegistrationOtp:${newUser.email}`,
    300, // 5 min as otp
    JSON.stringify({ otp: otp })
  );

  const mailOption = {
    from: process.env.GMAIL_USER,
    to: newUser.email,
    subject: 'Your OTP Code',
    // pug template
    html: emailOtpCompiledFunction({
      des: 'Registration',
      otp: otp,
    }),
  };
  // Send OTP via email
  transporter.sendMail(mailOption, (error) => {
    if (error) {
      logger.error('Error sending email:', error);
      return sendErrorResponse(res, 500, 'Error sending OTP email');
    } else {
      return sendSuccessResponse(res, 200, 'OTP sent successfully');
    }
  });
};
export const userSaveUser = async (req, res) => {
  const { email, otp } = req.body;
  const cachedUserSecret = JSON.parse(
    await redisClient.get(`registrationSecret:${email}`)
  );
  if (!cachedUserSecret) {
    return sendErrorResponse(res, 400, 'No OTP request found for this email');
  }
  const verified = speakeasy.totp.verify({
    secret: cachedUserSecret.secret,
    encoding: 'base32',
    token: otp,
    step: 300,
    window: 2, // Allows for slight time drift
  });
  if (verified) {
    const cachedUserData = JSON.parse(
      await redisClient
        .get(`registrationUserInfo:${email}`)
        .catch((err) => logger.error(err))
    );
    if (!cachedUserData)
      return sendErrorResponse(
        res,
        500,
        'Unable to get the cached info. Please try again'
      );
    console.log(cachedUserData);
    const newUserData = UserModel(cachedUserData.newUserInfo);
    try {
      const dataToSave = await newUserData.save();
      if (dataToSave)
        return sendSuccessResponse(
          res,
          200,
          ' OTP verified successfully as well as user registration successfully'
        );
      sendErrorResponse(res, 400, 'Failed to save user.');
    } catch (error) {
      logger.error(error);
      sendErrorResponse(res, 500, 'Error while saving user.');
    }
    redisClient
      .del(`registrationSecret:${email}`)
      .catch((err) => logger.error(err));
    redisClient
      .del(`registrationOtp:${email}`)
      .catch((err) => logger.error(err));
    redisClient
      .del(`registrationUserInfo:${email}`)
      .catch((err) => logger.error(err));
  }
};

export const userLogin = async (req, res) => {
  const reqData = req.body.value;
  const existingUser = await UserModel.findOne({ username: reqData.username });
  if (!existingUser) return sendErrorResponse(res, 200, 'Invalid credentials');
  bcrypt.compare(reqData.password, existingUser.password, (err, data) => {
    if (data) {
      const username = req.body.value.username;
      const userInfo = {
        id: existingUser._id.toHexString(),
        username: username,
      };
      const accessToken = generateAccessToken(userInfo);
      const refreshToken = generateRefreshToken(userInfo);
      // store to database
      if (!storeTokens(refreshToken, accessToken, userInfo.id)) {
        return sendErrorResponse(res, 500, 'Error storing token');
      }
      sendSuccessResponse(res, 200, {
        accessToken: accessToken,
        refreshToken: refreshToken,
      });
    } else {
      if (!existingUser)
        return sendErrorResponse(res, 400, 'Invalid credentials');
    }
  });
};

export const userHome = async (req, res) => {
  sendSuccessResponse(
    res,
    200,
    `Welcome to home page.Hi ${req.user.username}.`
  );
};

export const userGenerateToken = async (req, res) => {
  console.log('userToken', req.user);
  const userInfo = {
    id: req.user.id,
    username: req.user.username,
  };
  const accessToken = generateAccessToken(userInfo);
  if (!storeAccessToken(accessToken, req.user.id))
    return sendErrorResponse(res, 500, 'Failed to store access token');
  sendSuccessResponse(res, 200, 'New access token created successfully', {
    accessToken,
  });
};

export const userLogout = async (req, res) => {
  if (removeTokens(req.user.id))
    return sendSuccessResponse(res, 200, 'Logout successfully');
  sendErrorResponse(res, 400, 'Error logging out');
};
// watch following for unused function
export const userProfilePic = async () => {};
