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
      res.status(500).json({ code: 500, error: (error as Error).message });
    }
  };
};
