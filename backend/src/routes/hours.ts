import { Router } from "express";
import jwt from "jsonwebtoken";
import express from "express";
import userAuth from "../middleware/auth";
import prisma from "../db";
import validation from "../middleware/validate";
import Joi from "joi";
import { transporter } from "../mailer";

const router = Router();
router.use(userAuth(["ADMIN", "SITEADMIN", "USER"]));

router.get("/hours", async (req, res) => {
  const hours = await prisma.hour.findMany({
    where: {
      userId: req.session.userId,
    },
  });
  res.json(hours);
});

router.delete("/hour/:id", async (req, res) => {
  // TODO: is approved check
  await prisma.hour.delete({
    where: {
      id: req.params.id,
    },
  });
  res.json({
    message: "deleted",
  });
});

function toFixedNumber(num: number, digits: number) {
  var pow = Math.pow(10, digits);
  return Math.round(num * pow) / pow;
}

router.post(
  "/hour",
    validation(
      Joi.object({
        date: Joi.date().required(),
        hours: Joi.number().required(),
        name: Joi.string().required(),
        description: Joi.string().required(),
        supervisor_name: Joi.string().required(),
        supervisor_contact: Joi.string().email().required(),
      })
    ),
  async (req: express.Request, res: express.Response) => {
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
            id: req.session.userId,
          },
        },
      },
      include: {
        user: true,
      },
    });

    const token = jwt.sign(
      { hourid: result.id },
      process.env.SECRET_KEY as string,
      {
        expiresIn: "30d",
      }
    );

    const url =
      (process.env.SERVER_URL || "http://localhost:3000/") +
      "/api/verify?id=" +
      token;

    // prettier-ignore
    const resp = await transporter.sendMail({
      from: `CSF Volunteer Tracking <${process.env.MAIL_USERNAME as string}>`,
      to: result.supervisor_contact,
      subject: `Volunteer Hour Verification (${result.user.name})`,
      text: `\
Please click on the link below to verify that ${result.user.name} has completed the following volunteer hours\n
  Name: ${result.name}
  Description: ${result.description}
  Date: ${result.date.toLocaleDateString("en-US")}
  Hours: ${result.hours}

${url}
    `,
    });

    // Impossible to check for bounced mail :(
    console.log(resp);

    res.status(201).json(result);
  }
);


export default router;
