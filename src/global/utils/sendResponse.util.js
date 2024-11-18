export const sendSuccessResponse = (res, statusCode, message, data = null)=>{
  res.status(statusCode).json({ "success":true, message, ...data });
}
export function sendErrorResponse(res,statusCode, message, data = null){
  res.status(statusCode).json({ "success": false, message, data });
}
