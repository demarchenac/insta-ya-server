import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';

import { createWriteStream } from 'fs';
import { join } from 'path';

import { config } from '@config';
import { AuthRouter } from './controllers/auth';
import { UserRouter } from './controllers/user';

const router = express.Router();

router.get('/', (_req, res) => {
	res.send(
		'<h1>This is the InstaYa API, hosted from <a href="https://fly.io">Fly.io</a>!</h1>',
	);
});

const accessLogDirectory = config.log.access;

const logStream = createWriteStream(join(__dirname, accessLogDirectory), {
	flags: 'a',
});

router.use(helmet());
router.use(morgan('combined', { stream: logStream }));

// register routers
router.use('/auth', AuthRouter);
router.use('/user', UserRouter);

export { router };
