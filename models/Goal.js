const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const goalSchema = new Schema({
  title: String,
  history: [Number],
  // recurring: Boolean,
  _user: {type: Schema.Types.ObjectId, ref: "User"}
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const Goal = mongoose.model('Goal', goalSchema);
module.exports = Goal;
