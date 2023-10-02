import prisma from "@/lib/prisma";
import { mailer } from "@/lib/mailer";
import jwt from "jsonwebtoken";

// get dot vars

const data = [
  { name: "test", email: "test@test.com" },
  { name: "test2", email: "bozo@gmail.com" },
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
const resp = await mailer.sendMail({
    from: `CSF Volunteer Tracking <${process.env.MAIL_USERNAME as string}>`,
    to: user.email,
    subject: `Password Reset for ${user.name}`,
    text: `\
Hello, I hope you are having a great day!

Please click on the link below to reset your password

// TOODLES

Sincerely,
Quarry Lane California Scholarship Federation
  `,
  });

  // Impossible to check for bounced mail :(
  console.log(resp);
  }
}

main();
