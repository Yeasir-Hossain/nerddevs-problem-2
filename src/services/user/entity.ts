import bcrypt from "bcrypt";
import { NextFunction, Response, Request } from "express";
import jwt from "jsonwebtoken";
import ApiError from "../../errors/ApiError";
import User from "./model";
import MailService from "../../controllers/mail";
import { MailOptions } from "nodemailer/lib/json-transport";

const CREATE_ALLOWED = new Set(["firstName", "lastName", "mobileNumber", "email", "password"]);

export const createUser = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
  const isValid = Object.keys(req.body).every(k => CREATE_ALLOWED.has(k));
  if (!isValid) throw new ApiError(400, "Invalid Fields provided");

  // Check if email and required fields are provided
  if (!req.body.email || !req.body.password) {
    throw new ApiError(400, "Email and Password must be provided.");
  }

  const existingUser = await User.findOne({ email: req.body.email })
  if (existingUser) {
    throw new ApiError(400, "User already exists with this email.");
  }

  const newUser = await User.create({ ...req.body });
  const verificationToken = jwt.sign({ email: newUser.email }, process.env.SECRET_KEY!)

  const mailer = MailService.getInstance();
  const options: MailOptions = {
    to: newUser.email,
    subject: "Verify your Email",
    html: `<p>Dear User,</p>
          <p>Please verify your email by clicking the following link.</p>
          <p>${process.env.SERVER_URL}/api/user/verify?token=${verificationToken}</p>`
  }

  mailer.sendMail(options);

  return res.status(201).send(newUser);
}


export const login = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
  if (!req.body.email || !req.body.password) {
    throw new ApiError(400, "Email and Password must be provided.");
  }

  const user = await User.findOne({ email: req.body.email });
  if (!user) throw new ApiError(404, "User not found");
  if (!user.emailVerfied) throw new ApiError(403, "Email not verified. Please verify first.");

  const matchPass = bcrypt.compare(req.body.password, user.password!);
  if (!matchPass) throw new ApiError(400, "Invalid Credentials");

  const token = jwt.sign({ email: user.email }, process.env.SECRET_KEY!);

  res.cookie(process.env.COOKIE_KEY!, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    priority: "high",
    expires: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
  });

  return res.status(200).send(user);
};

export const verify = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
  if (!req.query.token) throw new ApiError(400, "Please use a valid link");

  const decoded: any = jwt.verify(req.query.token as string, process.env.SECRET_KEY!)
  if (!decoded) throw new ApiError(400, "Please use a valid link");

  const user = await User.findOne({ email: decoded.email });
  if (!user) throw new ApiError(404, "User not found");
  user.emailVerfied = true;
  await user.save();

  return res.status(200).send(user);
};