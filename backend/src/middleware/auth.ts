import express from "express";
import prisma from "../db";
import { Role } from "@prisma/client";

export default function userAuth(roles: Role[]) {
  return async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Not Logged In" });
    }
    const user = await prisma.user.findUnique({
        where: {
            id: req.session.userId
        }
    })

    if (user == null) return res.status(401).json({message: "Not Logged In"})

    if (!roles.includes(user.role)) return res.status(401).json({message: "Unauthorized"})

    next();
  };
}
