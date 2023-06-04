import { Schema, model } from "mongoose";

const pollSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  options: {
    type: [String],
    required: true
  },
  votes: {
    type: [Number],
    default: []
  },
  open: {
    type: Boolean,
    default: true
  },
  password: {
    type: String,
    required: true
  }
});

export default model("Poll", pollSchema);
