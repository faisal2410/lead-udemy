const express =require("express");
const router = express.Router();

// middleware
const {verifyToken} =require("../middlewares/auth");
const {isInstructor, isEnrolled } =require("../middlewares/authorization");

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
  stripeSuccess,
  userCourses,
  markCompleted,
  listCompleted,
  markIncomplete,
  enrollmentWithoutStripe
} =require("../controllers/course");

router.get("/courses", courses);
// image
router.post("/course/upload-image", uploadImage);
router.post("/course/remove-image", removeImage);
// course
router.post("/course", verifyToken,isInstructor, create);
router.put("/course/:slug", verifyToken, update);
router.get("/course/:slug", read);
router.post(
  "/course/video-upload/:instructorId",
  verifyToken, 
  uploadVideo
);
router.post("/course/video-remove/:instructorId", verifyToken, removeVideo);

// publish unpublish
router.put("/course/publish/:courseId", verifyToken, publishCourse);
router.put("/course/unpublish/:courseId", verifyToken, unpublishCourse);

// `/api/course/lesson/${slug}/${course.instructor._id}`,
router.post("/course/lesson/:slug/:instructorId", verifyToken, addLesson);
router.put("/course/lesson/:slug/:instructorId", verifyToken, updateLesson);
router.put("/course/:slug/:lessonId", verifyToken, removeLesson);

router.get("/check-enrollment/:courseId", verifyToken, checkEnrollment);

// enrollment
router.post("/free-enrollment/:courseId", verifyToken, freeEnrollment);
// router.post("/paid-enrollment/:courseId", verifyToken, paidEnrollment);
router.post("/enrollmentWithoutStripe/:courseId", verifyToken, enrollmentWithoutStripe);
// router.get("/stripe-success/:courseId", verifyToken, stripeSuccess);

router.get("/user-courses", verifyToken, userCourses);
router.get("/user/course/:slug", verifyToken, isEnrolled, read);

// mark completed
router.post("/mark-completed", verifyToken, markCompleted);
router.post("/list-completed", verifyToken, listCompleted);
router.post("/mark-incomplete", verifyToken, markIncomplete);

module.exports = router;
