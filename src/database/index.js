import mongoose from 'mongoose';
import { env } from '@config/env';

export const initDatabase = async () => {
	const options = {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	};

	try {
		await mongoose.connect(env.database.connectionString, options);
		// eslint-disable-next-line no-console
		console.log('Connected to the database sucessfully!');
	} catch (err) {
		// eslint-disable-next-line no-console
		console.error(
			'Error connecting to database ->',
			`Error code: ${err.code}, error reference: ${err.codeName}, message: ${err.message}`,
		);
	}
};
