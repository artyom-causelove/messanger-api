import * as mongoose from 'mongoose';

const { ObjectId } = mongoose.Types;

export default mongoose.Schema({
  name: String,
  date: Date,
  avatar: String,
  ownerUserId: ObjectId,
  messageBlocks: Array,
  participants: Array
});
