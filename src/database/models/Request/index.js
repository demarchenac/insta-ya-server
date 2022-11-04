import mongoose, { Schema } from 'mongoose';
import MongooseSequence from 'mongoose-sequence';
import { collection as userRef } from '@models/User';

const AutoIncrement = MongooseSequence(mongoose);

export const collection = 'requests';

const objectSchema = {
	fromOwner: { type: Schema.Types.ObjectId, ref: userRef },
	arrivedBefore24h: { type: Boolean, default: false },
	isFragile: Boolean,
	width: Number,
	height: Number,
	depth: Number,
	weight: Number,
	state: {
		type: String,
		enum: ['guardado', 'cancelado', 'cumplido'],
		default: 'guardado',
	},
	due: Date,
	fromCity: String,
	fromAddress: String,
	toCity: String,
	toAddress: String,
	toOwner: String,
	toOwnerId: String,
};

const options = { timestamps: true };

const schema = new Schema(objectSchema, options);

schema.plugin(AutoIncrement, {
	id: 'service_counter',
	inc_field: 'serviceNumber',
});

export const Request = mongoose.model(collection, schema);
