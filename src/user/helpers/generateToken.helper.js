import { redisClient } from '../../global/configs/redis.js';
import jwt from 'jsonwebtoken';

const generateAccessToken = (userInfo) => {
  const signedAccessToken = jwt.sign(
    userInfo,
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: '1h' }
  );
  redisClient.setEx(
    `accessToken:${userInfo.username}`,
    60, // 1 minute valid token
    JSON.stringify({ accessToken: signedAccessToken })
  );
  return signedAccessToken;
};
const generateRefreshToken = (userInfo) => {
  const signedRefreshToken = jwt.sign(
    userInfo,
    process.env.REFRESH_TOKEN_SECRET
  );
  return signedRefreshToken;
};

export { generateAccessToken, generateRefreshToken };
