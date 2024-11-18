import TokenModel from "../models/token.model.js";
import logger from "./../../global/utils/logger.util.js";
import {
  sendSuccessResponse,
  sendErrorResponse,
} from "./../../global/utils/sendResponse.util.js";

async function storeTokens(refreshToken, accessToken, userId) {
  try {
    let tokenRecord = await TokenModel.findOne({ user: userId });
    if (tokenRecord) {
      // if token record exists update the accessToken and refreshToken
      tokenRecord.accessToken = accessToken;
      tokenRecord.refreshToken = refreshToken;
      await tokenRecord.save();
      return true;
    } else {
      // If no token record exits create new one
      tokenRecord = new TokenModel({
        accessToken,
        refreshToken,
        user: userId,
      });
      // save the new token record
      await tokenRecord.save();
      return true;
    }
  } catch (error) {
    console.log(error);
    // logger.error(error);
    return false;
  }
}
async function storeAccessToken(signedAccessToken, userId) {
  try {
    const tokenRecord = await TokenModel.findOne({ user: userId });
    tokenRecord.accessToken = signedAccessToken;
    await tokenRecord.save();
    return true;
  } catch (error) {
    return false;
  }
}

async function removeTokens(userId) {
  try {
    const tokenRecord = await TokenModel.findOne({ user: userId });
    tokenRecord.accessToken = "";
    tokenRecord.refreshToken = "";
    await tokenRecord.save();
    return true;
  } catch (error) {
    return false;
  }
}

// check below function is used or not
async function storeRefreshToken(signedRefreshToken) {
  const newRefreshToken = new TokenModel({
    refreshToken: signedRefreshToken,
  });
  try {
    const tokenToSave = await newRefreshToken.save();

    logger.debug("Error storing refresh token:", error);
  } catch (error) {
    logger.error("Error storing refresh token:", error);
  }
}

async function checkRefreshTokenExists(refreshToken) {
  try {
    const result = await TokenModel.findOne({ refreshToken: refreshToken });
    if (result) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    logger.error("Error checking refresh token:", error);
  }
}

async function removeRefreshToken(refreshToken) {
  try {
    const result = await RefreshTokenModel.deleteOne({
      refreshToken: refreshToken,
    });
    // console.log(result,"from mangtoken 41");
    if (result.acknowledged && result.deletedCount === 1) {
      // console.log("Token deleted successfully")
      return true;
    } else {
      logger.warn("Token unavailable");
      // console.log("Token unavailable")
      return false;
      // console.log("No token found or already deleted.")
    }
  } catch (error) {
    logger.error("Error deleting token:", error);
    return false;
  }
}
export {
  // storeRefreshToken,
  // removeRefreshToken,
  // checkRefreshTokenExists,
  // watch out for above to remove
  storeTokens,
  storeAccessToken,
  removeTokens,
};
