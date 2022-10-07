/**
 * export const enrollmentWithoutStripe = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId).exec();
 
    const result = await User.findByIdAndUpdate(
      req.user._id,
      {
        $addToSet: { courses: course._id },
      },
      { new: true }
    ).exec();
    console.log(result);
    res.json({
      message: "Congratulations! You have successfully enrolled",
      course,
    });
  } catch (err) {
    console.log("free enrollment err", err);
    return res.status(400).send("Enrollment create failed");
  }
};
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * */ 