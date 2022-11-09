import express from 'express';
import { findRequestsByUser, saveRequest } from '@models/Request/queries';
import { logger, validate } from '../../middlewares';
import { hasSession } from '../../middlewares/authorization';
import { newRequestSchema } from './schemas';

const router = express.Router();

router.use(logger);

router.get('/find-all', hasSession, async (req, res) => {
	try {
		const query = await findRequestsByUser(req.session_payload.id);

		res.status(200).json({ payload: query, message: 'Requests fetched' });
	} catch (error) {
		// eslint-disable-next-line no-console
		console.error(error);
		res.status(500).json(error.message);
	}
});

router.post(
	'/',
	hasSession,
	validate(newRequestSchema),
	async ({ body, session_payload }, res) => {
		try {
			const payload = await saveRequest(session_payload.id, body);

			res.status(200).json({ payload, message: 'Request saved!' });
		} catch (error) {
			// eslint-disable-next-line no-console
			console.error(error);
			res.status(500).json(error.message);
		}
	},
);

export { router };
