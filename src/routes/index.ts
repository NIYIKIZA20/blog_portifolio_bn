import { userRouter } from "./userRoutes";
import { blogRouter } from "./blogRoutes";
import { commentRouter } from "./commentRoutes";
import { likeRouter } from "./likeRoutes";

import { Router } from "express";
import { ReadFileName } from "../utils/upload";

const routers = Router();
const allRoutes = [blogRouter, userRouter, commentRouter, likeRouter];
routers.use('/api/v1', ...allRoutes);
routers.get('/uploads/:filename',ReadFileName)
export { routers };