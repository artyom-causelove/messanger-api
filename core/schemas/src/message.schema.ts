import * as mongoose from 'mongoose';

const { ObjectId } = mongoose.Types;

export default mongoose.Schema({
  text: String,
  date: Date,
  isRead: Boolean,
  userId: ObjectId,
  conferenceId: ObjectId
});
