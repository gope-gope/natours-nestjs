import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Query } from 'mongoose';
import * as validator from 'validator';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';

export type UserDocument = HydratedDocument<User>;

export enum UserRole {
  USER = 'user',
  GUIDE = 'guide',
  LEAD_GUIDE = 'lead-guide',
  ADMIN = 'admin',
}

@Schema({ timestamps: true })
export class User {
  @Prop({
    required: [true, 'Your name is a required field.'],
    minlength: 2,
  })
  name: string;

  @Prop({
    required: [true, 'Your email is a required field.'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email.'],
  })
  email: string;

  @Prop({
    validate: validator.isURL,
  })
  photo?: string;

  @Prop({
    enum: Object.values(UserRole),
    default: UserRole.USER,
  })
  role: UserRole;

  @Prop({
    required: [true, 'Your password is a required field.'],
    select: false,
  })
  password: string;

  @Prop({
    required: [true, 'Your confirmPassword is a required field.'],
    validate: {
      validator: function (this: UserDocument, val: string) {
        return val === this.password;
      },
      message: 'Password and confirm password must match',
    },
  })
  passwordConfirm?: string;

  @Prop()
  passwordChangedAt?: Date;

  @Prop()
  passwordResetToken?: string;

  @Prop()
  passwordResetExpires?: Date;

  @Prop({
    default: true,
    select: false,
  })
  active: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', function () {
  if (!this.isModified('password') || this.isNew) return;

  this.passwordChangedAt = new Date(Date.now() - 1000);
});

UserSchema.pre('save', async function () {
  if (!this.isModified('password')) return;

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
});

type UserQuery = Query<UserDocument[], UserDocument>;

UserSchema.pre<UserQuery>(/^find/, function () {
  this.find({ active: { $ne: false } });
});

UserSchema.methods.correctPassword = async function (
  candidatePassword: string,
  userPassword: string,
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, userPassword);
};

UserSchema.methods.changedPasswordAfter = function (
  jwtIssueTimestamp: number,
): boolean {
  if (this.passwordChangedAt) {
    const changedTimestamp = Math.floor(
      this.passwordChangedAt.getTime() / 1000,
    );
    return jwtIssueTimestamp < changedTimestamp;
  }
  return false;
};

UserSchema.methods.createPasswordResetToken = function (): string {
  const resetToken = crypto.randomBytes(12).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 min

  return resetToken;
};
