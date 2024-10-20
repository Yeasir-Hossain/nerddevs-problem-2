export interface IUser {
  id: string;
  firstName: string;
  lastName: string;
  mobileNumber: string;
  email: string;
  password: string;
  emailVerfied: boolean;
}

export interface MailOptions {
  from?: string;
  to: string | string[];
  cc?: string | string[];
  bcc?: string | string[];
  subject: string;
  text?: string;
  html?: string;
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