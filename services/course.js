const Course=require("../models/course")
exports.findCourseBySlug=async(slug)=>{
    const course = await Course.findOne({ slug }).exec();
    return course;
}