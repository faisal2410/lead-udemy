const express =require("express");

const router = express.Router();

// middleware
const { requireSignin,isAdmin } = require("../middlewares/authorization");
// controllers
const {
  makeInstructor, 
  currentInstructor,
  instructorCourses,
  studentCount,
  
} =require("../controllers/instructor");

router.post("/make-instructor/:id",requireSignin,isAdmin, makeInstructor);
router.get("/current-instructor", requireSignin, currentInstructor);

router.get("/instructor-courses", requireSignin, instructorCourses);

router.post("/instructor/student-count", requireSignin, studentCount);



module.exports = router;
