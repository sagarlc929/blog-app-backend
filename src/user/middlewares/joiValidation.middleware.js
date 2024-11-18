import { userRegisterSchema, userLoginSchema } from '../schemas/user.schema.js'
import {sendSuccessResponse, sendErrorResponse} from './../../global/utils/sendResponse.util.js'

const registerValidator = async (req,res,next) =>{
  try{
    const value = await userRegisterSchema.validateAsync(req.body);
    req.body.value = value;
    req.image = req.file;
  } catch (err){
    return sendErrorResponse(res, 401, "Invalid input", err.details[0].message);
  }
  next()
}

const loginValidator = async ( req, res, next ) =>{
  try{
    const value = await userLoginSchema.validateAsync(req.body);
    req.body.value = value;
  } catch (err){
    return sendErrorResponse(res, 401, "Invalid input", err.details[0].message);
  }
  next()
}

export { registerValidator, loginValidator };
