import { Router } from "express";
import userRoutes from "../services/user/route";


const router: Router = Router();

const api = [userRoutes];

router.use("/api", api);

export default router;
