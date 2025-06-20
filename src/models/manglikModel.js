import mongoose from "mongoose";

const manglikSchema = new mongoose.Schema({
  manglik: {
    type: String,
  },
});

export default mongoose.model("manglik", manglikSchema);
