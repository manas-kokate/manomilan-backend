import mongoose from "mongoose";

const bodyTypeSchema = new mongoose.Schema({
  bodyType: {
    type: String,
  },
});

export default mongoose.model("bodyType", bodyTypeSchema);
