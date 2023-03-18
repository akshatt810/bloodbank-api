const mongoose = require('mongoose');

const bloodSampleSchema = new mongoose.Schema({
  hospitalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  bloodType: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  availableQuantity: {
    type: Number,
    required: true,
    default : function() {
      return this.quantity;
    }
  },
  createdAt:{
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type : Date,
    default: function() {
      return new Date(this.createdAt.getTime() + 35 * 24 * 60 * 60 * 1000);
    }
  }
});

// Embedded function to check if blood sample is expired
bloodSampleSchema.methods.isExpired = function() {
  return Date.now() > this.expiryTime;
};

// Embedded function to check if blood sample is exhausted
bloodSampleSchema.methods.isExhausted = function() {
  return this.availableQuantity <= 0;
};

const BloodSample = mongoose.model('BloodSample', bloodSampleSchema);
module.exports = BloodSample;
