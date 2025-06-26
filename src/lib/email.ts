import { env } from "@/data/env/server";
import nodemailer from "nodemailer";

type EmailPayload = {
  from: string;
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
};

const smtpOptions = {
  host: env.SMTP_HOST,
  port: parseInt(env.SMTP_PORT),
  secure: true,
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASSWORD,
  },
};

export const sendEmail = async (data: EmailPayload) => {
  const transporter = nodemailer.createTransport({
    ...smtpOptions,
  });

  return await transporter.sendMail({
    ...data,
  });
};
