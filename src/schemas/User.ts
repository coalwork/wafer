import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const userSchema = new Schema({
  name: {
    required: true,
    unique: true,
    type: String
  },
  hash: {
    required: true,
    type: String
  },
  email: String,
  created: {
    type: Date,
    default: Date.now
  }
});

const User = model('User', userSchema);

export default User;
