import { defaultClasses, getModelForClass, modelOptions, prop } from '@typegoose/typegoose';
import { User, UserType } from '../../types/index.js';
import { createSHA256 } from '../../helpers/index.js';

const MIN_NAME_LENGTH = 1;
const MAX_NAME_LENGTH = 15;

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface UserEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'users',
    timestamps: true
  }
})
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class UserEntity extends defaultClasses.TimeStamps implements User {
  @prop({ required: true, minlength: [MIN_NAME_LENGTH, `Min user name length ${MIN_NAME_LENGTH}`], maxlength: [MAX_NAME_LENGTH, `Max user name length ${MAX_NAME_LENGTH}`]})
  public name: string;

  @prop({ unique: true, required: true})
  public email: string;

  @prop({ required: true })
  public avatar: string;

  @prop({ required: true })
  public password: string;

  @prop({
    required: true,
    type: () => String,
    enum: UserType
  })
  public type!: UserType;

  constructor(userData: User) {
    super();

    this.email = userData.email;
    this.name = userData.name;
    this.avatar = userData.avatar;
    this.password = userData.password;
    this.type = userData.type;
  }

  public setPassword(password: string, salt: string) {
    this.password = createSHA256(password, salt);
  }

  public getPassword() {
    return this.password;
  }
}

export const UserModel = getModelForClass(UserEntity);
