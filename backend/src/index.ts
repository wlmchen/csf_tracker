import * as dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import expressSession from "express-session"
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import prisma from "./db";
import { PrismaClient } from "@prisma/client";

const app = express();

const port = process.env.PORT || 3000;

declare module "express-session" {
  interface SessionData {
    userId: string;
  }
}

app.use(
  cors({
    origin: "http://localhost:3001",
    credentials: true,
  })
);
app.use(express.json());
app.use(
    expressSession({
        cookie: {
            maxAge: 7 * 24 * 60 * 60 * 1000 // ms
        },
        secret: process.env.SECRET || "yolo",
        resave: true,
        saveUninitialized: true,
        rolling: true,
        store: new PrismaSessionStore(
            prisma,
            {
                checkPeriod: 2 * 60 *1000,
                dbRecordIdIsSessionId: true,
                dbRecordIdFunction: undefined
            }
        )
    })
)

import admin from "./routes/admin"
import auth from "./routes/auth"
import hours from "./routes/hours"
import siteadmin from "./routes/siteadmin"
import verify from "./routes/verify"
app.use("/admin", admin)
app.use(auth)
app.use(hours)
app.use(siteadmin)
app.use(verify)


app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
