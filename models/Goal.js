const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const goalSchema = new Schema({
  title: String,
  // currentWeek: [Number],
  // history: [],
  items: [{
    date: {type: String, match: /\d{4}-\d{2}-\d{2}/}, // ex: "2018-10-02"
    value: {type: Number, default: 0}
  }],
  _user: {type: Schema.Types.ObjectId, ref: "User"}
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const Goal = mongoose.model('Goal', goalSchema);
module.exports = Goal;
