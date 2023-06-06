import { NextFunction, Request, Response } from "express";

export const wrap = (
  asyncFn: (req: Request, res: Response, next?: NextFunction) => Promise<void>
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      return await asyncFn(req, res, next);
    } catch (error) {
      res.status(500).json({ code: 500, error: (error as Error).message });
    }
  };
};
