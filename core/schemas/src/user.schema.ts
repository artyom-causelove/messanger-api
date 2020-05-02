import * as mongoose from 'mongoose';

export default mongoose.Schema({
  personalId: String,
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
