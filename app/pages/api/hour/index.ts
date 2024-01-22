import { NextApiRequest, NextApiResponse } from "next";
import { authOptions } from "../auth/[...nextauth]";
import { getServerSession } from "next-auth/next";
import  prisma from "@/lib/prisma";
import { hourSchema } from "@/lib/schemas";
import { mailer } from "@/lib/mailer";
import jwt from "jsonwebtoken";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    res.status(401).json({ message: "You must be logged in." });
    return;
  }

  if (req.method !== "POST") return res.status(400).json({ message: "Oops" });

  const response = hourSchema.safeParse(req.body);
  console.log(response)
  if (!response.success) {
    const { errors } = response.error;

    return res.status(400).json({
      error: {
        message: "Invalid",
        errors,
      },
    });
  }

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
          id: session.user!.id,
        },
      },
    },
    include: {
      user: true,
    },
  });

  const token = jwt.sign(
    { hourid: result.id },
    process.env.JWT_SECRET as string,
    {
      expiresIn: "30d",
    }
  );

  const url =
    (process.env.SERVER_URL || "http://localhost:3000") +
    "/api/verify?id=" +
    token;

  // prettier-ignore
  const resp = await mailer.sendMail({
    from: `CSF Volunteer Tracking <${process.env.MAIL_USERNAME as string}>`,
    to: result.supervisor_contact,
    subject: `Volunteer Hour Verification for ${result.user.name}`,
    text: `\
Hello, I hope you are having a great day!

Please click on the link below to verify that ${result.user.name} has completed the following volunteer hours, as they have listed you as a supervisor. If you have any questions, please contact quarrylanecsf@gmail.com.\n
  Name: ${result.name}
  Description: ${result.description}
  Date: ${result.date.toLocaleDateString("en-US")}
  Hours: ${result.hours}

${url}

Sincerely,
Quarry Lane California Scholarship Federation
  `,
  });

  // Impossible to check for bounced mail :(
  console.log(resp);

  return res.json(result);
}
