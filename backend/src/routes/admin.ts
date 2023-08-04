import { Router } from "express";
import userAuth from "../middleware/auth";
import prisma from "../db";
import validation from "../middleware/validate";
import Joi from "joi";
import { hourSchema } from "../schemas";

// TODO: don't return entire list again

const router = Router();

router.use(userAuth(["ADMIN", "SITEADMIN"]));

router.get("/hours", async (req, res) => {
  const hours = await prisma.user.findMany({
    include: {
      hours: true,
    },
  });
  res.json(hours);
});

router.post("/:user_id", validation(hourSchema), async (req, res) => {
  const result = await prisma.hour.create({
    data: {
      date: req.body.date,
      hours: req.body.hours,
      name: req.body.name,
      description: req.body.description,
      supervisor_name: req.body.supervisor_name,
      supervisor_contact: req.body.supervisor_contact,
      user: {
        connect: {
          id: req.params.user_id,
        },
      },
    },
  });
  const hours = await prisma.user.findMany({
    include: {
      hours: true,
    },
  });
  res.json(hours);
});

router.delete("/:hour_id", async (req, res) => {
  await prisma.hour.delete({
    where: {
      id: req.params.hour_id,
    },
  });
  const hours = await prisma.user.findMany({
    include: {
      hours: true,
    },
  });
  res.json(hours);
});

router.put("/:hour_id", async (req, res) => {
  await prisma.hour.update({
    where: {
      id: req.params.hour_id,
    },
    data: {
      date: req.body.date,
      hours: req.body.hours,
      name: req.body.name,
      description: req.body.description,
      supervisor_name: req.body.supervisor_name,
      supervisor_contact: req.body.supervisor_contact,
      approved: req.body.approved
    },
  });
  const hours = await prisma.user.findMany({
    include: {
      hours: true,
    },
  });
  res.json(hours);
});

export default router;
