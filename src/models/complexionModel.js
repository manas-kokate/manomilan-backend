import mongoose from "mongoose";

const complexionSchema = new mongoose.Schema({
  complexion: {
    type: String,
  },
});

export default mongoose.model("complexion", complexionSchema);
