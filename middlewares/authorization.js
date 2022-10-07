
const { findUserById,findUserByCourseSlug,findUserByEmail,findOneService,findUserByRole } = require("../services/auth");

exports.isAdmin = async (req, res, next) => {
  // console.log(req.user.role)
  try {
    const user = await findUserByRole({role:req.user.role});  
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
    const user = await findUserByRole({role:req.user.role});
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
    const user = await findUserByEmail(req.user.email);
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