import express from 'express';
import { hash } from 'argon2';
import { User } from '@models/User';
import {
	checkSignIn,
	tokenVersionMatchesUserTokenVersion,
} from '@models/User/queries';
import { logger, validate } from '../../middlewares';
import {
	hasSession,
	signTokenPair,
	TOKEN_KEYS,
	verifyToken,
} from '../../middlewares/authorization';
import { signInSchema, signUpSchema } from './schemas';

const router = express.Router();

router.use(logger);

router.get('/private-ping', hasSession, async ({ session_payload }, res) => {
	res.status(200).json({ message: 'This session is valid!', session_payload });
});

router.post('/sign-up', validate(signUpSchema), async (req, res) => {
	try {
		const { name, lastName, email, identificationNumber, password } = req.body;
		const payload = {
			name,
			lastName,
			email,
			identificationNumber,
			password: await hash(password),
		};

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
			.status(200)
			.json({
				payload: {
					[TOKEN_KEYS.ACCESS]: accessToken,
				},
				message: 'Signed In',
			});
	} catch (error) {
		// eslint-disable-next-line no-console
		console.error(error);
		res.status(500).json(error.message);
	}
});

router.post('/refresh', async (req, res) => {
	const { tangerine_qid: token } = req.cookies;

	if (!token) {
		return res.status(403).json([
			{
				code: 'session_expired',
				message: 'Sign in required',
			},
		]);
	}

	try {
		const payload = verifyToken(token, 'refresh');
		const versionMatches = await tokenVersionMatchesUserTokenVersion(payload);

		if (!versionMatches) {
			return res.status(403).json([
				{
					code: 'version_mismatch',
					message: 'Sign in required',
				},
			]);
		}

		const { refreshToken, accessToken } = await signTokenPair(payload);

		return res
			.cookie(TOKEN_KEYS.REFRESH, refreshToken, { httpOnly: true })
			.status(200)
			.json({
				payload: {
					[TOKEN_KEYS.ACCESS]: accessToken,
				},
				message: 'Tokens updated!',
			});
	} catch (error) {
		// eslint-disable-next-line no-console
		console.error(error);

		return res.status(403).json([
			{
				code: 'session_expired',
				message: 'Bad token, sign in required.',
				details: error.message,
			},
		]);
	}
});

export { router };
