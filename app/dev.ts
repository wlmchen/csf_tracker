import prisma from "./lib/prisma";
import { mailer } from "./lib/mailer";
import jwt from "jsonwebtoken";

// get dot vars
require('dotenv').config()

const data = [
  { name: "Test test", email: "edoc.www@gmail.com" },
];

async function main() {
  await prisma.user.createMany({
    data: data,
  });
  const users = await prisma.user.findMany({
    where: {
      email: { in: data.map((e) => e.email) },
    },
  });
  for (const user of users) {
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, {
      expiresIn: "30d",
    });
    const url =
    (process.env.SERVER_URL || "http://localhost:3000") +
    "/pwreset?key=" +
    token
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
  }
}

main();
