import { Router } from "express";
import makeAsync from "../../utils/makeAsync";
import { createUser, login, verify } from "./entity";


const router = Router();

router.post("/user/register", makeAsync(createUser));

router.post("/user/login", makeAsync(login));

router.get("/user/verify", makeAsync(verify));

export default router;
