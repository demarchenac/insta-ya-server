import express from 'express';
import { User } from '@models/User';
import { logger } from '../../middlewares';

const router = express.Router();

router.use(logger);

router.get('/find-all', async (_req, res) => {
	try {
		const query = await User.find();

		res.status(200).json({ payload: query, message: 'Users fetched' });
	} catch (error) {
		// eslint-disable-next-line no-console
		console.error(error);
		res.status(500).json(error.message);
	}
});

export { router };
