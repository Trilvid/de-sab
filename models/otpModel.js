const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema(
  {
    otp: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      // required: true
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);

// remeber to add user name and photo so it can show those details sure

otpSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
  });
  next();
});

const Otp = mongoose.model('Otp', otpSchema);

module.exports = Otp;
