import mongoose from 'mongoose';
import validate from 'mongoose-validator';
import paginate from 'mongoose-paginate';
import uniqueValidator from 'mongoose-unique-validator';
import fieldRemover from 'mongoose-field-remover';
import crypto from 'crypto';

const Schema = mongoose.Schema;

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
    unique: true,
    uniqueCaseInsensitive: true,
    sparse: true,
  },
  password: {
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
  authenticate(password) {
    return crypto.createHash('md5').update(password).digest('hex') === this.password;
  },
};

UserSchema.pre('save', function (next) {
  if (!this.isModified('password')) return next();

  this.password = crypto.createHash('md5').update(this.password).digest('hex');
  next();
});

UserSchema.plugin(fieldRemover, 'password __v');
UserSchema.plugin(uniqueValidator);
UserSchema.plugin(paginate);

export default mongoose.model('User', UserSchema);
