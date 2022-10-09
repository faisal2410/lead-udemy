const User =require("../models/user");
const Course =require("../models/course");
const queryString =require("query-string");
const { findUserById } = require("../services/auth");


exports.makeInstructor = async (req, res) => {
  try {
    // 1. find user from db  
    const user = await User.updateOne({_id:req.params.id},{role:"instructor"});  
    res.status(200).json({
      status:`User is successfully updated as instructor`,
      user
    })
   
  } catch (err) {
    console.log("MAKE INSTRUCTOR ERR ", err);
  }
};

exports.getAccountStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).exec();
    const account = await stripe.accounts.retrieve(user.stripe_account_id);
    // console.log("ACCOUNT => ", account);
    if (!account.charges_enabled) {
      return res.staus(401).send("Unauthorized");
    } else {
      const statusUpdated = await User.findByIdAndUpdate(
        user._id,
        {
          stripe_seller: account,
          $addToSet: { role: "Instructor" },
        },
        { new: true }
      )
        .select("-password")
        .exec();
      res.json(statusUpdated);
    }
  } catch (err) {
    console.log(err);
  }
};

exports.currentInstructor = async (req, res) => {
  console.log(req.auth._id)
  try {
    let user = await findUserById(req.auth._id);
    // let user = await findUserByRole({role:req.user.role}).select("-password").exec();
    // console.log("CURRENT INSTRUCTOR => ", user);
    // const test=!user.role.includes("instructor")&&!user.role.includes("admin")
    // console.log("we are testing======>",test)
    if (!user.role.includes("instructor")&&!user.role.includes("admin")) {
      return res.status(403).json({
        status:"Fail",
        message:"Access Denied. Instructor Resources"
      });
    } else {
      res.json({ ok: true });
    }
  } catch (err) {
    console.log(err);
    res.status(403).json({
      status:"Fail",
      message:"Access Denied. Instructor Resources"
    })
  }
};

exports.instructorCourses = async (req, res) => {
  try {
    const courses = await Course.find({ instructor: req.auth._id })
      .sort({ createdAt: -1 })
      .exec();
    res.json(courses);
  } catch (err) {
    console.log(err);
  }
};

exports.studentCount = async (req, res) => {
  try {
    const users = await User.find({ courses: req.body.courseId })
      .select("_id")
      .exec();
    res.json(users);
  } catch (err) {
    console.log(err);
  }
};

exports.instructorBalance = async (req, res) => {
  try {
    let user = await User.findById(req.user._id).exec();
    const balance = await stripe.balance.retrieve({
      stripeAccount: user.stripe_account_id,
    });
    res.json(balance);
  } catch (err) {
    console.log(err);
  }
};

exports.instructorPayoutSettings = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).exec();
    const loginLink = await stripe.accounts.createLoginLink(
      user.stripe_seller.id,
      { redirect_url: process.env.STRIPE_SETTINGS_REDIRECT }
    );
    res.json(loginLink.url);
  } catch (err) {
    console.log("stripe payout settings login link err => , err");
  }
};
