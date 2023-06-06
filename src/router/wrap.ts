import { NextFunction, Request, Response } from "express";

export const wrap = (
  asyncFn: (req: Request, res: Response, next?: NextFunction) => Promise<void>
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    res.setHeader("Access-Control-Allow-Origin", "https://obho-poll.netlify.app");
    res.setHeader("Access-Control-Allow-Methods", "*");
    res.setHeader("Access-Control-Allow-Headers", "*");

    try {
      return await asyncFn(req, res, next);
    } catch (error) {
      const errMsg = (error as Error).message;
      const code = Number(errMsg.substring(0, 3)) || 500;
      const message = errMsg.substring(4);
      const response = res.status(code);

      response.setHeader("Access-Control-Allow-Origin", "https://obho-poll.netlify.app");
      response.setHeader("Access-Control-Allow-Methods", "*");
      response.setHeader("Access-Control-Allow-Headers", "*");
      response.json({ error: message });
    }
  };
};
