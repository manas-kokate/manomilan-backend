import mongoose from "mongoose";

const familyBgSchema = new mongoose.Schema({
  familyBg: {
    type: String,
  },
});

export default mongoose.model("familyBg", familyBgSchema);
