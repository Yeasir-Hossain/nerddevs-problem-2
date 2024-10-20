import { Address } from "nodemailer/lib/mailer";

export interface IUser {
  id: string;
  firstName: string;
  lastName: string;
  mobileNumber: string;
  email: string;
  password: string;
  emailVerfied: boolean;
}

export interface SMTPConfig {
  host: string;
  port: number;
  secure?: boolean;
  auth: {
    user: string;
    pass: string;
  };
  tls?: {
    rejectUnauthorized: boolean;
  };
}