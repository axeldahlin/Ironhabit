const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const goalSchema = new Schema({
  title: String,
<<<<<<< HEAD
  history: [
    {date: Number}
  ],
  // recurring: Boolean,
=======
  history: [Number],
  history2: [],
>>>>>>> 2e944de02d1e01c2aa146e874a3d5239ce0045da
  _user: {type: Schema.Types.ObjectId, ref: "User"}
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const Goal = mongoose.model('Goal', goalSchema);
module.exports = Goal;
