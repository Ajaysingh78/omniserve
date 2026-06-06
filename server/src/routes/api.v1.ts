import { Router } from "express";


const router = Router();

router.get("/", (req, res) => {
   res.json({connection: "OK"});
})

export default router;
