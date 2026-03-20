import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 120
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false
    },
    role: {
      type: String,
      enum: ['patient', 'admin'],
      default: 'patient'
    },
    phone: {
      type: String,
      trim: true,
      default: ''
    },
    cep: {
      type: String,
      trim: true,
      default: ''
    },
    street: {
      type: String,
      trim: true,
      default: ''
    },
    number: {
      type: String,
      trim: true,
      default: ''
    },
    district: {
      type: String,
      trim: true,
      default: ''
    },
    city: {
      type: String,
      trim: true,
      default: ''
    },
    state: {
      type: String,
      trim: true,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

export const User = mongoose.model('User', userSchema);
