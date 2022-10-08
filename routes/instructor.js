const express =require("express");

const router = express.Router();

// middleware
const {verifyToken} =require("../middlewares/auth");
const { isAdmin } = require("../middlewares/authorization");

// controllers
const {
  makeInstructor, 
  currentInstructor,
  instructorCourses,
  studentCount,
  
} =require("../controllers/instructor");

router.post("/make-instructor/:id",verifyToken,isAdmin, makeInstructor);
router.get("/current-instructor", verifyToken, currentInstructor);

router.get("/instructor-courses", verifyToken, instructorCourses);

router.post("/instructor/student-count", verifyToken, studentCount);



module.exports = router;
