const {expressjwt} =require("express-jwt");
require("dotenv").config();
const { findUserById,findUserByCourseSlug,findUserByEmail,findOneService,findUserByRole } = require("../services/auth");

// req.user = _id
exports.requireSignin = expressjwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
});

exports.isAdmin = async (req, res, next) => {
  console.log(req.auth)
  try {
    const user = await findUserById(req.auth._id);  
    // console.log(user)
    if (!user.role.includes("admin")) {
      return res.status(403).json({
        status:"Fail",
        message:"Access Denied. Admin Resource"
      });
    } else {
      next();
    }
  } catch (err) {
    console.log(err);
  }
};

exports.isInstructor = async (req, res, next) => {
  try {
    const user = await findUserById(req.auth._id);
    if (!user.role.includes("instructor")) {
      return res.status(403).json({
        status:"Fail",
        message:"Access Denied. Instructor resources"

      });
    } else {
      next();
    }
  } catch (err) {
    console.log(err);
  }
};

exports.isEnrolled = async (req, res, next) => {
  try {
    const user = await findUserById(req.auth._id);
    const course = await findUserByCourseSlug({ slug: req.params.slug })

    // check if course id is found in user courses array
    let ids = [];
    for (let i = 0; i < user.courses.length; i++) {
      ids.push(user.courses[i].toString());
    }

    if (!ids.includes(course._id.toString())) {
      res.sendStatus(403);
    } else {
      next();
    }
  } catch (err) {
    console.log(err);
  }
};


// module.exports = (...role) => {

//   return (req, res, next) => {
//     const userRole = req.user.role;
//     if(!role.includes(userRole)){
//       return res.status(403).json({
//         status: "fail",
//         error: "You are not authorized to access this"
//       });
//     }

//     next();
//   };
// };