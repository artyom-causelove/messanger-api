import * as mongoose from 'mongoose';

const { ObjectId } = mongoose.Types;

export default mongoose.Schema({
  userId: ObjectId,
  friendId: ObjectId
});
