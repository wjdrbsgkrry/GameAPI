import mongoose from 'mongoose';

const character = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: Number,
      required: false,
      unique: false,
    },
    count: {
      type: Number,
      required: true,
      unique: true,
    },
  },
  { versionKey: false }
);

export default mongoose.model('characters', character);
