// src/utils/response.js

export const successResponse = (res, data = {}, message = 'Success', status = 200) => {
  return res.status(status).json({
    success: true,
    message,
    data
  });
};

export const errorResponse = (res, error = 'Something went wrong', status = 400, details = null) => {
  return res.status(status).json({
    success: false,
    error,
    details
  });
};

export default { successResponse, errorResponse };
