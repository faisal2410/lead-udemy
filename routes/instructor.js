const express =require("express");

const router = express.Router();

// middleware
const {verifyToken} =require("../middlewares/auth");
const { isAdmin } = require("../middlewares/authorization");

// controllers
const {
  makeInstructor,
  getAccountStatus,
  currentInstructor,
  instructorCourses,
  studentCount,
  instructorBalance,
  instructorPayoutSettings,
} =require("../controllers/instructor");

router.post("/make-instructor/:id",verifyToken,isAdmin, makeInstructor);
// router.post("/get-account-status", verifyToken, getAccountStatus);
router.get("/current-instructor", verifyToken, currentInstructor);

router.get("/instructor-courses", verifyToken, instructorCourses);

router.post("/instructor/student-count", verifyToken, studentCount);

// router.get("/instructor/balance", verifyToken, instructorBalance);

router.get(
  "/instructor/payout-settings",
  verifyToken,
  instructorPayoutSettings
);

module.exports = router;
