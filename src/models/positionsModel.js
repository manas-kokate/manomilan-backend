import mongoose from "mongoose";

const positionsSchema = new mongoose.Schema({
  positions: {
    type: String,
  },
});

export default mongoose.model("positions", positionsSchema);
