const mongoose = require('mongoose');
const validate = require('validator');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const uniqueValidator = require("mongoose-unique-validator")


/**
 * @openapi
 * components:
 *  schemas:
 *    CreateUserInput:
 *      type: object
 *      required:
 *        - fullname
 *        - email
 *        - password
 *      properties:
 *        fullname:
 *          type: string
 *          default: John Deo
 *        email:
 *          type: string
 *          default: deo@gmail.com
 *        password:
 *          type: string
 *          default: pass1234
 *        confirmPassword:
 *          type: string
 *          default: pass1234
 *        mobile:
 *          type: string
 *          default: 09034187388
 *        department:
 *          type: string
 *          default: laundry
 *    CreateUserResponse:
 *      type: object
 *      properties:
 *        _id:
 *          type: string
 *        fullname:
 *          type: string
 *        email:
 *          type: string
 *        password:
 *          type: string
 *        mobile:
 *          type: string
 *        department:
 *          type: string
 *    LoginUser:
 *      type: object
 *      properties:
 *        mobile:
 *          type: string
 *        password:
 *          type: string
 *        rememberme:
 *          type: boolean
 *    UserForgottenPassword:
 *      type: object
 *      properties:
 *        mobile:
 *          type: string
 *    UserResetPassword:
 *      type: object
 *      properties:
 *        password:
 *          type: string
 *        passwordConfirm:
 *          type: string
 * 
 *    updatePassword:
 *      type: object
 *      properties:
 *        currentPassword:
 *          type: string
 *        password:
 *          type: string
 *        passwordConfirm:
 *          type: string
 * 
 *    userProfile:
 *      type: object
 *      properties:
 *        firstname:
 *          type: string
 *        lastname:
 *          type: string
 *        photo:
 *          type: string
 * 
 *    ManageUser:
 *      type: object
 *      properties:
 *        id:
 *          type: string
 *        role:
 *          type: string
 */


const userSchema = new mongoose.Schema(
  {
    fullname: {
        type: String,
        required: [true, 'this User must have a fullname'],
        trim: true
    },
    email: {
      type: String,
      // required: [true, 'this user must have an email'],
      lowercase: true,
      trim: true,
      validate: [validate.isEmail, 'please provide a valid email']
    },
    mobile: {
      type: Number,
      unique: true,
      required: true,
      maxlength: [11, "this phone no is not valids"]
    },
    department: {
      type: String,
      required: true,
      enum: ['laundry', 'logistics', 'sewing']
    },
    photo: {
      type: String,
    },
    password: {
        type: String,
        required: [true, 'please provide a password'],
        minLength: [8, 'minimum password lenght is 8 '],
        select: false
    },
    role: {
      type: String,
      default: 'employee',
      enum: ['employee','admin', 'superAdmin']
    },
    rememberme:{
      type:Boolean,
      default: false
    },
    verified:{type:Boolean, default:true},
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
      type: Boolean,
      default: true,
      select: false
    },
    passwordConfirm: {
      type: String,
      validate: {
        validator: function(el) {
          return el === this.password;
        },
        message: 'please password does not match'
      }
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true
  }
);


userSchema.methods.correctPassword = async function(
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next()
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;
    next();
  });

userSchema.pre('save', function(next) {
  if (!this.isModified('password') || this.isNew) return next();
    this.passswordChangedAt = Date().now - 1000;
    next();
});

userSchema.pre(/^find/, function(next) {
  this.find({ active: { $ne: false } });
  next();
});

  userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
    if (this.passwordChangedAt) {
      const changedTimestamp = parseInt(
        this.passwordChangedAt.getTime() / 1000,
        10
      );
  
      return changedTimestamp < JWTTimestamp; 
    }
  
    return false;
  };
  
  userSchema.methods.createPasswordResetToken = function() {
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    console.log({resetToken}, this.passwordResetToken);

    this.passwordResetExpires = Date.now() + 15 * 60 * 1000;

    return resetToken;
  };

  userSchema.plugin(uniqueValidator, {
    message: " This {PATH} already exists"
  });

const User = mongoose.model('User', userSchema);
module.exports = User;
