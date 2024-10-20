import { Router } from "express";
import makeAsync from "../../utils/makeAsync";
import { createUser, login } from "./entity";


const router = Router();

router.post("/user/register", makeAsync(createUser));

router.post("/user/login", makeAsync(login));

export default router;
