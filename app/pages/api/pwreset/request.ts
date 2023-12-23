import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { mailer } from "@/lib/mailer";
import bcrypt from "bcrypt";
import { json } from "stream/consumers";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") return res.status(400).send("Oopsie");

  console.log(req.body);
  const email = req.body.email as string;

  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
  if (user == null) {
    return res.status(400).send("Invalid Email");
  }
  console.log(user);

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, {
    expiresIn: "30d",
  });
  const url =
    (process.env.SERVER_URL || "http://localhost:3000") +
    "/pwreset?key=" +
    token;
  const resp = await mailer.sendMail({
    from: `CSF Volunteer Tracking <${process.env.MAIL_USERNAME as string}>`,
    to: user.email,
    subject: `Password Reset for ${user.name}`,
    text: `\
Hello, I hope you are having a great day!

Please click on the link below to set your password

${url}

Sincerely,
Quarry Lane California Scholarship Federation
`,
  });

  // Impossible to check for bounced mail :(
  console.log(resp);
  return res.send("Password updated");
}
