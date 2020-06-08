import * as mongoose from 'mongoose';

const { ObjectId } = mongoose.Types;

export default mongoose.Schema({
  number: Number,
  conferenceId: ObjectId,
  messages: Array
});
