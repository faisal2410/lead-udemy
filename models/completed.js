const mongoose =require("mongoose");
const { ObjectId } = mongoose.Schema;

const completedSchema = new mongoose.Schema(
  {
    user: {
      type: ObjectId,
      ref: "User",
    },
    course: {
      type: ObjectId,
      ref: "Course",
    },
    lessons: [],
  },
  { timestamps: true }
);

const Completed=mongoose.model("Completed", completedSchema);
module.exports=Completed;
