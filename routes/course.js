const express =require("express");
const router = express.Router();

// middleware

const {requireSignin,isInstructor, isEnrolled,isAdmin } =require("../middlewares/authorization");

// controllers
const {
  uploadImage,
  removeImage,
  create,
  read,
  uploadVideo,
  removeVideo,
  addLesson,
  update,
  removeLesson,
  updateLesson,
  publishCourse,
  unpublishCourse,
  courses,
  checkEnrollment,
  freeEnrollment,
  paidEnrollment, 
  userCourses,
  markCompleted,
  listCompleted,
  markIncomplete,
  activateCourse
} =require("../controllers/course");

router.get("/courses", courses);
// image
router.post("/course/upload-image", uploadImage);
router.post("/course/remove-image", removeImage);
// course
router.post("/course", requireSignin,isInstructor, create);
router.put("/course/:slug", requireSignin,isInstructor, update);
router.get("/course/:slug", read);
router.post(
  "/course/video-upload/:instructorId",
  requireSignin, 
  uploadVideo
);
router.post("/course/video-remove/:instructorId", requireSignin, removeVideo);

// publish unpublish
router.put("/course/publish/:courseId", requireSignin, publishCourse);
router.put("/course/unpublish/:courseId", requireSignin, unpublishCourse);

// `/api/course/lesson/${slug}/${course.instructor._id}`,
router.post("/course/lesson/:slug/:instructorId", requireSignin, addLesson);
router.put("/course/lesson/:slug/:instructorId", requireSignin, updateLesson);
router.put("/course/:slug/:lessonId", requireSignin, removeLesson);

router.get("/check-enrollment/:courseId", requireSignin, checkEnrollment);

// enrollment
router.post("/free-enrollment/:courseId", requireSignin, freeEnrollment);
router.post("/paid-enrollment/:courseId", requireSignin, paidEnrollment);
router.put("/activate-course/:courseId/:userId",requireSignin,isAdmin,activateCourse)


router.get("/user-courses", requireSignin, userCourses);
router.get("/user/course/:slug", requireSignin, isEnrolled, read);

// mark completed
router.post("/mark-completed", requireSignin, markCompleted);
router.post("/list-completed", requireSignin, listCompleted);
router.post("/mark-incomplete", requireSignin, markIncomplete);

module.exports = router;
