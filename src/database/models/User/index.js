import mongoose, { Schema } from 'mongoose';

export const collection = 'users';

const objectSchema = {
	name: { type: String, required: true },
	identificationNumber: { type: String, required: true, unique: true },
	lastName: { type: String, required: true },
	password: { type: String, required: true, select: false },
	email: { type: String, required: true, unique: true },
	tokenVersion: { type: Number, default: 1 },
};

const options = { timestamps: true };

const schema = new Schema(objectSchema, options);

export const User = mongoose.model(collection, schema);
