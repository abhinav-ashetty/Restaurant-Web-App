import { Document } from 'mongoose';
import {model, Schema} from 'mongoose'

export interface IUser extends Document {
    name: string;
    email: string;
    password?: string;
    phone?: string;
    role: "user" | "admin" | "owner";
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
    name: {type: String, required: true, trim: true},
    email: {type: String, required: true, unique: true, trim: true, lowercase: true},
    password: {type: String, required: true, minlength: 8},
    phone: {type: String, required: true, minlength: 10},
    role: {type: String, enum: ["user", "admin", "owner"], default: "user"}
},
    {timestamps: true}
    // createdAt: {type: Date, default: Date.now},
    // updatedAt: {type: Date, default: Date.now}
    // instead of created at and updated at separately we can use timestamps option in schema which will automatically create createdAt and updatedAt fields
)

// Remove paassword field from the response when sending user data to the client. This is a security measure to prevent exposing sensitive information.
UserSchema.set('toJSON', {
    transform: (doc, ret, options) => {
        delete ret.password;
        return ret;
    }
})

export const User = model<IUser>('User', UserSchema)