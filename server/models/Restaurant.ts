import { Document, Types } from 'mongoose';
import {model, Schema} from 'mongoose'

export interface IRestaurant extends Document {
    name: string;
    slug: string;
    description: string;
    cuisine: string;
    priceRange: "$" | "$$" | "$$$" | "$$$$$";
    rating: number;
    reviewCount: number;
    location: String;
    address: string;
    image: string;
    chef: String;
    tags: string[];
    availableSlots: String[];
    featured: boolean;
    exclusive: boolean;
    owner: Types.ObjectId; // Reference to the User model
    status: "pending" | "approved" | "rejected";
    totalSeats: number;
    createdAt: Date;
    updatedAt: Date;
}

const RestaurantSchema = new Schema<IRestaurant>({
    name: {type: String, required: true, trim: true},
    slug: {type: String, required: true, unique: true, trim: true, lowercase: true},
    description: {type: String, required: true},
    priceRange: {type: String, enum: ["$","$$", "$$$","$$$$$"], required: true},
    cuisine: {type: String, required: true, trim: true},
    rating: {type: Number, default: 5.0, min:1,max:5},
    reviewCount: {type: Number, default:0},
    location: {type: String, required: true, trim: true},
    address: {type: String, required: true},
    image: {type: String, default : ""},
    chef: {type: String, required: true},
    tags: [{type: String}],
    availableSlots: [{type: String}],
    featured: {type: Boolean, default: false},
    exclusive: {type: Boolean, default: false},
    owner: {type: Schema.Types.ObjectId, ref: 'User',required : true}, // Reference to the User model
    status: {type: String, enum: ["pending", "approved", "rejected"], default: "pending"},
    totalSeats: {type: Number, default:20}
},
    {timestamps: true}
    // createdAt: {type: Date, default: Date.now},
    // updatedAt: {type: Date, default: Date.now}
    // instead of created at and updated at separately we can use timestamps option in schema which will automatically create createdAt and updatedAt fields
)


export const Restaurant = model<IRestaurant>('Restaurant', RestaurantSchema)