const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate(value){
      if(!validator.isEmail(value)){
          throw new Error('Email is invalid!')
      }
    }
  },
  password: {
    type: String,
    required: true,
    minlength : 7,
    validate(value){
      if(validator.isEmpty(value,{ ignore_whitespace: true } )){
          throw new Error('Please enter your password!')
      }
    }
  },
  type: {
    type: String,
    enum: ['Hospital', 'Receiver'],
    required: true
  },
  tokens:[{
    token:{
        type:String,
        required: true
    }
  }],
 }, 
 {
  timestamps: true
});

userSchema.statics.findByCredentials = async function(email, password) {
  const user = await User.findOne({ email });
  // console.log( " hey  " , user);
  if (!user) {
    throw new Error('Invalid login credentials');
  }

  const isMatch = await bcrypt.compare(password, user.password);

  console.log({isMatch, hashed : password, password : user.password});
  if (!isMatch) {
    throw new Error('Invalid login credentials');
  }

  return user;
};

const User = mongoose.model('User', userSchema);
module.exports = User;