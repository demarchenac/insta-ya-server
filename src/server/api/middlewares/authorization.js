import { sign } from 'jsonwebtoken';

import { readFileSync } from 'fs';
import { join } from 'path';

/**
 * Don't worry if you don't understand these keywords, I'm not going to explain
 * them either.
 */
export const TOKEN_KEYS = {
	ACCESS: 'lemon_qid',
	REFRESH: 'tangerine_qid',
};

export const signRefreshToken = async (payload) => {
	const key = readFileSync(join(process.cwd(), '/keys/refresh.pem'));

	const token = await sign(payload, key, {
		algorithm: 'ES256',
		expiresIn: '7d',
		header: {
			kid: process.env.REFRESH_TOKEN_SECRET,
		},
	});

	return token;
};

export const signAccessToken = async (payload) => {
	const key = readFileSync(join(process.cwd(), '/keys/access.pem'));

	const token = await sign(payload, key, {
		algorithm: 'ES256',
		expiresIn: '15m',
		header: {
			kid: process.env.ACCESS_TOKEN_SECRET,
		},
	});

	return token;
};

export const signTokenPair = async (payload) => {
	const refreshToken = await signRefreshToken(payload);
	const accessToken = await signAccessToken(payload);

	return { refreshToken, accessToken };
};
