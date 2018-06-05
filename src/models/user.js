import mongoose from 'mongoose';
import validate from 'mongoose-validator';
import paginate from 'mongoose-paginate';
import uniqueValidator from 'mongoose-unique-validator';
import fieldRemover from 'mongoose-field-remover';
import bcrypt from 'bcrypt';

import { constants }from '../config/vars';

const Schema = mongoose.Schema;

/**
 * @swagger
 * definition:
 *   User:
 *     properties:
 *       email:
 *         type: string
 *       firstName:
 *         type: string
 *       password:
 *         type: string
 *       bornAt:
 *         type: string
 *         format: date-time
 *     required:
 *       - email
 *       - firstName
 *       - password
 */

const UserSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    validate: validate({
      validator: 'isEmail',
      message: 'not a valid email',
    }),
    required: true,
    unique: 'the email is already taken',
    uniqueCaseInsensitive: true,
    sparse: true,
    trim: true,
  },
  password: {
    required: true,
    type: String,
  },
  bornAt: {
    type: Date,
    default: new Date(),
  },

}, {
  timestamps: true,
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
});

UserSchema.virtual('age').get(function () {
  const today = new Date();
  const bornAt = this.bornAt;
  const m = today.getMonth() - bornAt.getMonth();
  let age = today.getFullYear() - bornAt.getFullYear();

  if (m < 0 || (m === 0 && today.getDate() < bornAt.getDate())) age--;

  return age;
});

UserSchema.methods = {
  async authenticate(password) {
    return await bcrypt.compare(password, this.password);
  },
};

UserSchema.pre('save', async function (next) {
  const { saltRounds } = constants;
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, saltRounds);
  next();
});

UserSchema.plugin(fieldRemover, 'password __v');
UserSchema.plugin(uniqueValidator);
UserSchema.plugin(paginate);

export default mongoose.model('User', UserSchema);
