import * as mongoose from 'mongoose';

const { ObjectId } = mongoose.Types;

export default mongoose.Schema({
  personalId: String,
  outerId: ObjectId,
  nickname: String,
  password: String,
  age: Number,
  status: String,
  lastVisit: Date,
  apiKey: String,
  roles: Array,
  avatar: String,
  conferences: Array
});
