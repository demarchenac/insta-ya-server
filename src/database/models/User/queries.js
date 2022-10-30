import { verify } from 'argon2';

import { User } from '@models/User';

export const checkSignIn = async ({ email, password }) => {
	const user = await User.findOne({ email }).select('+password');
	if (!user) {
		return null;
	}

	const passwordMatches = await verify(user.password, password);

	if (!passwordMatches) {
		return null;
	}

	const payload = {
		session: user._id,
		version: user.tokenVersion,
	};

	return payload;
};
