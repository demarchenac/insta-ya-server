import express from 'express';
import { hash } from 'argon2';
import { User } from '@models/User';
import { logger, validate } from '../../middlewares';
import { signUpSchema } from './schemas';

const router = express.Router();

router.use(logger);

router.post('/sign-up', validate(signUpSchema), async (req, res) => {
	try {
		const { name, lastName, password, email } = req.body;
		const payload = { name, lastName, password: await hash(password), email };

		const user = new User(payload);
		await user.save();

		const query = await User.findById(user._id);

		res.status(201).json({ payload: query, message: 'New user created' });
	} catch (error) {
		if (error?.code === 11000) {
			res.status(409).json([
				{
					code: 'user_already_exists',
					message: 'This user has already signed up!',
				},
			]);
			return;
		}

		// eslint-disable-next-line no-console
		console.error(error);
	}
});

export { router };
