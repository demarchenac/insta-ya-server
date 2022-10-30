import express from 'express';
import { hash } from 'argon2';
import { User } from '@models/User';
import { checkSignIn } from '@models/User/queries';
import { logger, validate } from '../../middlewares';
import { signTokenPair, TOKEN_KEYS } from '../../middlewares/authorization';
import { signInSchema, signUpSchema } from './schemas';

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
		res.status(500).json(error.message);
	}
});

router.post('/sign-in', validate(signInSchema), async ({ body }, res) => {
	try {
		const payload = await checkSignIn(body);
		if (!payload) {
			res.status(404).json([
				{
					code: 'user_not_found',
					message: 'Either the provided email or password are wrong.',
				},
			]);
			return;
		}

		const { refreshToken, accessToken } = await signTokenPair(payload);

		res
			.cookie(TOKEN_KEYS.REFRESH, refreshToken, { httpOnly: true })
			.cookie(TOKEN_KEYS.ACCESS, accessToken, { httpOnly: true })
			.status(200)
			.json({ message: 'Signed In' });
	} catch (error) {
		// eslint-disable-next-line no-console
		console.error(error);
		res.status(500).json(error.message);
	}
});

export { router };
