import mongoose from 'mongoose';

const item = mongoose.Schema(
  {
    code: {
      type: Number,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: Number,
      unique: false,
    },
  },
  { versionKey: false }
);

export default mongoose.model('items', item);
