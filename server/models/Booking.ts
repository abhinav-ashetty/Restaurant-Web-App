import { Document,Types } from 'mongoose';
import {model, Schema} from 'mongoose'
import crypto from "crypto"

export interface IBooking extends Document {
    user:Types.ObjectId;
    restaurant:Types.ObjectId;
    date: Date;
    time: String;
    guests: number;
    occassion?: String;
    specialRequests?: String;
    status: "confirmed" | "cancelled" | "completed";
    bookingsId: String;
    createdAt: Date;
    updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>({
    user: {type: Types.ObjectId, ref: 'User', required: true},
    restaurant: {type: Types.ObjectId, ref: 'Restaurant', required: true},
    date: {type: Date, required: true},
    time: {type: String, required: true},
    guests: {type: Number, required: true,min:1},
    occassion: {type: String,trim: true},
    specialRequests: {type: String,trim: true},
    status: {type: String, enum: ["confirmed", "cancelled", "completed"], default: "confirmed"},
    bookingsId: {type: String, unique: true}
},
    {timestamps: true}
    // createdAt: {type: Date, default: Date.now},
    // updatedAt: {type: Date, default: Date.now}
    // instead of created at and updated at separately we can use timestamps option in schema which will automatically create createdAt and updatedAt fields
)

// Remove paassword field from the response when sending user data to the client. This is a security measure to prevent exposing sensitive information.
BookingSchema.pre("save", function(){
    if(!this.bookingsId){
        this.bookingsId = `GR-${crypto.randomBytes(4).toString("hex").toUpperCase()}`
    }
})

export const Booking = model<IBooking>('Booking', BookingSchema)