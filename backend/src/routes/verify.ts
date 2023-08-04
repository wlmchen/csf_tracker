import { Router } from "express";
import jwt from "jsonwebtoken";
import prisma from "../db";

const router = Router();

router.get("/verify", async (req, res) => {
  const token = req.query.id as string;
  if (!token) {
    res
      .status(403)
      .send("The volunteer hours you have tried to verify do not exist");
  }
  try {
    const data: any = await jwt.verify(token, process.env.SECRET_KEY as string);
    await prisma.hour.update({
      where: {
        id: data.hourid,
      },
      data: {
        approved: true,
      },
    });
    return res.send("Thank you for verifying volunteer hours");
  } catch (err: any) {
    return res.status(403).send("Invalid Token");
  }
});

export default router;
