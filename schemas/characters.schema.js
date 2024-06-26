import mongoose, { model } from 'mongoose';

const character = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: Number,
      default: 500,
      unique: false,
    },
    count: {
      type: Number,
      required: true,
      unique: true,
    },
    item: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'item',
      },
    ],
  },
  { versionKey: false }
);

export default mongoose.model('characters', character);
