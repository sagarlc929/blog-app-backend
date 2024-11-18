import TokenModel from '../models/token.model.js';
import logger from './../../global/utils/logger.util.js';

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
    logger.error(error);
    return false;
  }
}

async function removeTokens(userId) {
  try {
    const tokenRecord = await TokenModel.findOne({ user: userId });
    tokenRecord.accessToken = '';
    tokenRecord.refreshToken = '';
    await tokenRecord.save();
    return true;
  } catch (error) {
    logger.error(error);
    return false;
  }
}

export {
  storeTokens,
  storeAccessToken,
  removeTokens,
};
