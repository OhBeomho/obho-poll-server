import { NextFunction, Request, Response } from "express";

export const wrap = (
  asyncFn: (req: Request, res: Response, next?: NextFunction) => Promise<void>
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    res.appendHeader("Access-Control-Allow-Origin", "https://obho-poll.netlify.app");

    try {
      return await asyncFn(req, res, next);
    } catch (error) {
      res.status(500).json({ code: 500, error: (error as Error).message });
    }
  };
};
