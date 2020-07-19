import { Response } from "express";

export const sendPayload = (res:Response ,statusCode: number, payload?:any):void => {
  if (!payload || !Object.keys(payload).length) {
    const defaultPayload = {};
    if (statusCode === 401) {
      defaultPayload["message"] = "Not Authenticate."
    } else if (statusCode === 403 ) {
      defaultPayload["message"] = "Forbidden."
    } else if (statusCode === 404) {
      defaultPayload["message"] = "Not Found."
    } else {
      defaultPayload["message"] = "Error."
    };
    res.status(statusCode).json({
      statusCode,
      payload: defaultPayload,
      date: new Date().toISOString()
    });
    return;
  } else {
    res.status(statusCode).json({
      statusCode,
      payload,
      date: new Date().toISOString()
    });
    return;
  };
};