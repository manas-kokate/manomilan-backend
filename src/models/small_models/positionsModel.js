import mongoose from "mongoose";

const positionsSchema = new mongoose.Schema({
  position: {
    type: String,
  },
});

export default mongoose.model("positions", positionsSchema);
