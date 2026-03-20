import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    doctorName: {
      type: String,
      required: true,
      trim: true
    },
    specialty: {
      type: String,
      required: true,
      trim: true
    },
    date: {
      type: String,
      required: true
    },
    time: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['scheduled', 'confirmed', 'cancelled', 'completed'],
      default: 'scheduled'
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 500,
      default: ''
    },
    weatherAlert: {
      type: Boolean,
      default: false
    },
    weatherDescription: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

appointmentSchema.index({ doctorName: 1, date: 1, time: 1 }, { unique: true });

export const Appointment = mongoose.model('Appointment', appointmentSchema);
