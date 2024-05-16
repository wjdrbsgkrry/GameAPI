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
    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Item',
    },
  },
  { versionKey: false }
);

export default mongoose.model('items', item);
