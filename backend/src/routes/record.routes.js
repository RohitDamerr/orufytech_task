import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import {
  createRecord,
  getRecords,
  updateRecord,
  deleteRecord
} from "../controllers/record.controller.js";

const router = express.Router();

router.use(protect);
router.post("/", createRecord);
router.get("/", getRecords);
router.put("/:id", updateRecord);
router.delete("/:id", deleteRecord);

export default router;
