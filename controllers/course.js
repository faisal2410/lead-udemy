const Course =require("../models/course");
const Completed =require("../models/completed");
const slugify =require("slugify");
const { unlinkSync }=require("fs");
const User =require("../models/user");
const multer = require('multer');
const { findUserByEmail,findUserById } = require("../services/auth");
const { findCourseBySlug } = require("../services/course");

exports.uploadImage = async (req, res) => {
  try {
    const storage=multer.diskStorage({
      destination: (req,file,callBack)=> {
          callBack(null,'public/course');
      },
      filename: (req,file,callBack)=> {
          callBack(null,file.originalname)
      }    
      
  });
  const maxSize = 1 * 1024 * 1024; // for 1MB  
  const upload=multer({
    storage:storage,
    fileFilter: (req, file, cb)=> {
      if(file.mimetype==="image/jpg"||
        file.mimetype==="image/png"||
        file.mimetype==="image/jpeg"||
        file.mimetype==="image/webp"      
      ){
        cb(null, true)
      }else{
        cb(null, false);
        return cb(new Error("Only jpg, png, jpeg and webp format is allowed"))
      }
    },
    limits: { fileSize: maxSize }
  }).array('photos', 12)
  
   
    upload(req,res, (error)=> {  
      if (error instanceof multer.MulterError) {        
        res.status(400).json({
          status:"Fail",
          message:error.message
        })
      } else if (error) {      
        res.status(400).json({
          status:"Fail",
          message:error.message
        })
      }    
      else{
          res.status(200).json({
            status:"Success",
            message:"File upload Success"
          })
      }
});
  } catch (err) {
    res.status(400).json({
      status:"Fail",
      message:err.message
    })
  }
};

exports.removeImage = async (req, res) => {
  // console.log("test=======>",req.body.image);
  try {   
    const path="public/course/attention-please.webp" //we will receive the path from front end to delete
    unlinkSync(req.body.image);    
    // unlinkSync(path);    
    res.status(200).json({
      status:"Success",
      message:"File delete success"
    })
  } catch (err) {
    res.status(400).json({
      status:"Fail",
      message:err.message
    })
  }
};

exports.create = async (req, res) => {
  // console.log("CREATE COURSE", req.body);
  // return;
  try {
    const slug= slugify(req.body.name.toLowerCase())
    const alreadyExist = await findCourseBySlug(slug);
    if (alreadyExist) return res.status(400).send("Title is taken");

    const course = await new Course({
      slug: slugify(req.body.name),
      instructor: req.auth._id,
      ...req.body,
    }).save();

    res.json(course);
  } catch (err) {
    console.log(err);
    return res.status(400).send("Course create failed. Try again.");
  }
};

exports.read = async (req, res) => {
  try {
    const course = await Course.findOne({ slug: req.params.slug })
      .populate("instructor", "_id name")
      .exec();
    res.json(course);
  } catch (err) {
    console.log(err);
  }
};

exports.uploadVideo = async (req, res) => {
  try {
    // console.log("req.user.email", req.user.email);
    // console.log("req.params.instructorId", req.params.instructorId);
    const user=await findUserById(req.auth._id);
    // console.log("user id====>",user._id)
    
    if (user._id != req.params.instructorId) {
      return res.status(400).json({
        status:"Fail",
        message:"Unauthorized"

      });
    }

    const storage=multer.diskStorage({
      destination: (req,file,callBack)=> {
          callBack(null,'public/course');
      },
      filename: (req,file,callBack)=> {
          callBack(null,file.originalname)
      }    
      
  });
  const maxSize = 50 * 1024 * 1024; // for 1MB  
  const upload=multer({
    storage:storage,
    fileFilter: (req, file, cb)=> {
      console.log(file.mimetype)
      if(file.mimetype==="video/mp4"){
        cb(null, true)
      }else{
        cb(null, false);
        return cb(new Error("Only video/mp4 mimetype format is allowed"))
      }
    },
    limits: { fileSize: maxSize }
  }).array('videos', 12)
  
   
    upload(req,res, (error)=> {  
      if (error instanceof multer.MulterError) {        
        res.status(400).json({
          status:"Fail",
          message:error.message
        })
      } else if (error) {      
        res.status(400).json({
          status:"Fail",
          message:error.message
        })
      }    
      else{
          res.status(200).json({
            status:"Success",
            message:"Video upload Success"
          })
      }
});

  } catch (err) {
    console.log(err);
  }
};

exports.removeVideo = async (req, res) => {
  try {
    // console.log("req.user.email", req.user.email);
    // console.log("req.params.instructorId", req.params.instructorId);
    const user=await findUserById(req.auth._id);
    // console.log("user id====>",user._id)
    
    if (user._id != req.params.instructorId) {
      return res.status(400).json({
        status:"Fail",
        message:"Unauthorized"

      });
    }

    const path="C:/Users/user/Desktop/ostad/ostadclass/lead-udemy/public/course/raihana.mp4" //we will receive the path from front end to delete
    unlinkSync(req.body.video);    
    // unlinkSync(path);    
    res.status(200).json({
      status:"Success",
      message:"Video delete success"
    })
  } catch (err) {
    res.status(400).json({
      status:"Fail",
      message:err.message
    })
  }
};

exports.addLesson = async (req, res) => {
  try {
    const user=await findUserById(req.auth._id);
    const { slug, instructorId } = req.params;
    const { title, content, video } = req.body;

    if (user._id != instructorId) {
      return res.status(400).send("Unauthorized");
    }

    const updated = await Course.findOneAndUpdate(
      { slug },
      {
        $push: { lessons: { title, content, video, slug: slugify(title) } },
      },
      { new: true }
    )
      .populate("instructor", "_id name")
      .exec();
    res.json(updated);
  } catch (err) {
    console.log(err);
    return res.status(400).send("Add lesson failed");
  }
};

exports.update = async (req, res) => {

  try {
    const user=await findUserById(req.auth._id);
    
    const { slug } = req.params;
    console.log(slug);
    const course = await findCourseBySlug(slug)
    // console.log("COURSE FOUND => ", course.instructor); 
    if (String(user._id) !== String(course.instructor)) {
      return res.status(400).send("Unauthorized.");
    }

    const updated = await Course.findOneAndUpdate({ slug }, req.body, {
      new: true,
    }).exec();

    res.json(updated);
  } catch (err) {
    console.log(err);
    return res.status(400).send(err.message);
  }
};

exports.removeLesson = async (req, res) => {
  const user=await findUserById(req.auth._id);
  const { slug, lessonId } = req.params;
  const course = await Course.findOne({ slug }).exec();
  if (String(user._id) != String(course.instructor)) {
    return res.status(400).json({
      status:"Fail",
      message:"Unauthorized"
    });
  }

  const deletedCourse = await Course.findByIdAndUpdate(course._id, {
    $pull: { lessons: { _id: lessonId } },
  }).exec();

  res.status(200).json({ 
    status:"success",
    message: "lesson removed successfully" });
};

exports.updateLesson = async (req, res) => {
  try {
    const user=await findUserById(req.auth._id);
    // console.log("UPDATE LESSON", req.body);
    const { slug } = req.params;
    const { _id, title, content, video, free_preview } = req.body;
    // console.log("lesson id",_id)
    const course = await Course.findOne({ slug }).select("instructor").exec();
    // console.log("course instructor",course.instructor._id)
    // console.log("user id",user._id)

    if (String(course.instructor._id) != String(user._id)) {
      return res.status(400).json({
        status:"Fail",
        message:"Unauthorized"
      });
    }

    const updated = await Course.updateOne(
      { "lessons._id": _id },
      {
        $set: {
          "lessons.$.title": title,
          "lessons.$.content": content,
          "lessons.$.video": video,
          "lessons.$.free_preview": free_preview,
        },
      },
      { new: true }
    ).exec();
    console.log("updated", updated);
    res.status(200).json({ 
      status:"success",
      message: "Lesson updated Successfully" 
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      status:"Fail",
      message:"Update lesson failed"
    });
  }
};

exports.publishCourse = async (req, res) => {
  try {
    const user=await findUserById(req.auth._id);
    const { courseId } = req.params;
    const course = await Course.findById(courseId).select("instructor").exec();

    if (String(course.instructor._id) != String(user._id)) {
      return res.status(400).json({
        status:"success",
        message:"Unauthorized"});
    }

    const updated = await Course.findByIdAndUpdate(
      courseId,
      { published: true },
      { new: true }
    ).exec();
    res.status(200).json({
      status:"success",
      message:"Course Published Successfully",
      updated
    });
  } catch (err) {
    console.log(err.message);
    return res.status(400).json({
      staus:"Fail",
      message:"Course Publish failed"
    });
  }
};

exports.unpublishCourse = async (req, res) => {
  try {
    const user=await findUserById(req.auth._id);
    const { courseId } = req.params;
    const course = await Course.findById(courseId).select("instructor").exec();

    if (String(course.instructor._id) != String(user._id)) {
      return res.status(400).json({
        status:"Fail",
        message:"Unauthorized"
      });
    }

    const updated = await Course.findByIdAndUpdate(
      courseId,
      { published: false },
      { new: true }
    ).exec();
    res.status(200).json({
      status:"success",
      message:"Course Unpublished successfully",
      updated
    });
  } catch (err) {
    console.log(err.message);
    return res.status(400).json({
      status:"Fail",
      message:"Unpublish course failed"
    });
  }
};

exports.courses = async (req, res) => {
  // const all = await Course.find({ published: false })
  const all = await Course.find({ published: true })
    .populate("instructor", "_id name")
    .exec();
  res.json(all);
};

exports.checkEnrollment = async (req, res) => {
  const { courseId } = req.params;
  // find courses of the currently logged in user
  const user = await findUserById(req.auth._id);
  // check if course id is found in user courses array
  let ids = [];
  let length = user.courses && user.courses.length;
  for (let i = 0; i < length; i++) {
    ids.push(user.courses[i].toString());
  }
  res.json({
    status: ids.includes(courseId),
    course: await Course.findById(courseId).exec(),
  });
};

exports.freeEnrollment = async (req, res) => {
  const user=await findUserById(req.auth._id); 
  try {
    // check if course is free or paid
    const course = await Course.findById(req.params.courseId).exec();
    if (course.paid){
      res.status(400).json({
        status:"Fail",
        message:"This is a paid course. Free enrollment is not allowed"
      })
      }else{
        const result = await User.findByIdAndUpdate(
          user._id,
          {
            $addToSet: { courses: course._id },
          },
          { new: true }
        ).exec();
       
        res.status(200).json({
          message: "Congratulations! You have successfully enrolled",
          course,
        });

      };
  } catch (err) {
    // console.log("free enrollment err", err);
    return res.status(400).json({
      status:"Fail",
      message:"Free Enrollment in the course failed"
    });
  }
};



exports.userCourses = async (req, res) => {
  const user=await findUserById(req.auth._id);
  // const user = await User.findById(req.user._id).exec();
  const courses = await Course.find({ _id: { $in: user.courses } })
    .populate("instructor", "_id name")
    .exec();
  res.json(courses);
};

exports.markCompleted = async (req, res) => {
  const user=await findUserById(req.auth._id);
  const { courseId, lessonId } = req.body;
  // console.log(courseId, lessonId);
  // find if user with that course is already created
  const existing = await Completed.findOne({
    user: user._id,
    course: courseId,
  }).exec();

  if (existing) {
    // update
    const updated = await Completed.findOneAndUpdate(
      {
        user:user._id,
        course: courseId,
      },
      {
        $addToSet: { lessons: lessonId },
      }
    ).exec();
    res.status(200).json({
      status:"success",
      message: `${lessonId} is successfully marked-completed`
     });
  } else {
    // create
    const created = await new Completed({
      user: user._id,
      course: courseId,
      lessons: lessonId,
    }).save();
    res.status(200).json({
      status:"success",
      message: `${lessonId} is successfully marked-completed`
     });
  }
};

exports.listCompleted = async (req, res) => {
  try {
    const user=await findUserById(req.auth._id);
    const list = await Completed.findOne({
      user: user._id,
      course: req.body.courseId,
    }).exec();
    list && res.json(list.lessons);
  } catch (err) {
    res.status(400).json({
      status:"Fail",
      message:err.message
    })
  }
};

exports.markIncomplete = async (req, res) => {
  try {
    const user=await findUserById(req.auth._id);
    const { courseId, lessonId } = req.body;

    const updated = await Completed.findOneAndUpdate(
      {
        user: user._id,
        course: courseId,
      },
      {
        $pull: { lessons: lessonId },
      }
    ).exec();
    res.status(200).json({
      status:"success",
      message: `${lessonId} is successfully marked as incomplete` });
  } catch (err) {
    res.status(400).json({
      status:"Fail",
      message:err.message
    })
  }
};


exports.paidEnrollment = async (req, res) => {
  try {
    const payment_status=req.body.payment_status;
    const user=await findUserById(req.auth._id)
    const course = await Course.findById(req.params.courseId).exec();
    if( payment_status===true){
      const result = await User.findByIdAndUpdate(
        user._id,
        {
          $addToSet: { courses: course._id },
        },
        { new: true }
      ).exec();
      console.log(result);
      res.json({
        message: "Congratulations! You have successfully enrolled.Course",
        course,
      });
    }else{     
      res.json({
        message: "Congratulations! You have successfully enrolled.Course will be activated with in 24 hours after payment verification",
        course,
      });
    }
   
  } catch (err) {
    console.log("free enrollment err", err);
    return res.status(400).send("Enrollment  failed.Try again");
  }
};

exports.activateCourse=async(req,res)=>{
  
  try {
    const { courseId,userId } = req.params;
    const payment_status=req.body.payment_status;
   
    const course = await Course.findById(courseId).exec();
    if( payment_status===true){
      const result = await User.findByIdAndUpdate(
        userId,
        {
          $addToSet: { courses: course._id },
        },
        { new: true }
      ).exec();
      console.log("test active course=======>",result);
      res.json({
        message: "Course is added to the requested userid",
        course,
      });
    }else{     
      res.status(400).json({
        status:"Fail",
        message: "Course is not added to the requested userid",
        
      });
    }
   
  } catch (err) {
  
    return res.status(400).json({
      status:"Fail",
      message:err.message
    });
  }
}