import jwt from 'jsonwebtoken';
import {sendSuccessResponse, sendErrorResponse} from './../../global/utils/sendResponse.util.js'
import {redisClient} from '../../global/configs/redis.js';
import TokenModel from '../models/token.model.js'

const authenticateAccessToken = async (req, res, next)=>{
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if(token == null) return sendErrorResponse(res, 400, "Provide access token.");
  try{
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err ,userInfo)=>{
      if(err){
        if(err.name === 'TokenExpiredError'){
          return sendErrorResponse(res, 401, 'Access token has expired. Please generate new access token');
        }
        return sendErrorResponse(res, 401, 'Invalid access token');
      }
      req.user = userInfo;
      // check in redis where token is valid or not
      const cachedUserInfo = JSON.parse(await redisClient.get(`accessToken:${userInfo.username}`));
      if(cachedUserInfo && cachedUserInfo.accessToken === token){
        // console.log('authToken: 22]-> validated from cache');
          next();
        }
      // check of the token exists in db
      let tokenRecord = await TokenModel.findOne({user:userInfo.id});
      if(!tokenRecord) return sendErrorResponse(res, 401, 'Invalid user for given token');
      if(tokenRecord.accessToken === token){
        next();
      }else{
        if(!tokenRecord.accessToken) return sendErrorResponse(res, 401, 'Invalid token for the user. The user may have logged out. Please log in again.');
      }

    });
  } catch (error){
    return sendErrorResponse(res, 500, 'Server error during token verification');
  }
}

const authenticateRefreshToken = (req, res, next )=>{
  const token = req.body.token;
  if(token == null) return sendErrorResponse(res, 400, "Provide refresh token");
  try{
    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, async(err, userInfo)=>{
      if(err){
        return sendErrorResponse(res, 401, 'Invalid refresh token');
      }
      console.log('authToken 54:->');
      // check the token exists in db
      const tokenRecord = await TokenModel.findOne({user:userInfo.id});
      if(!tokenRecord) return sendErrorResponse(res, 401, 'No user for given token');
      if(tokenRecord.refreshToken === token){
      console.log('authToken 59:->');
        req.user = userInfo;
        next()
      }
      else{
        if(!tokenRecord.accessToken) return sendErrorResponse(res, 401, 'Invalid token for the user. The user may have logged out. Please log in again.');
        return sendErrorResponse(res, 401, 'Expired refresh token. Provide leatest token.')
      }
    });
  } catch(err){
    return sendErrorResponse(res, 500, 'Server error during token verification');
  }
}

export {
  authenticateAccessToken,
  authenticateRefreshToken
}
