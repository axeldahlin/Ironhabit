const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const userSchema = new Schema({
  email: String,
  firstName: String,
  password: String,
  avatarImgPath: {type: String, default: '/images/avatar.png'},
  totalPoints: {type: Number, default: 0},
  pastGoals: [
    {
      title: String,
      success: Boolean,
      frequency: Number,
      endDate: String, 
    }
  ]
  }, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
