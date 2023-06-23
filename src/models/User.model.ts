import { Schema, model } from "mongoose"
import { IUser } from "../shared/interfaces/schema.interfaces"

const UserSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    require: true,
  },
}, { timestamps: true })

UserSchema.method("toJSON", function () {
    const { __v, _id, password, ...object } = this.toObject()
    object.id = _id

    return object
})

export default model<IUser>("User", UserSchema)
