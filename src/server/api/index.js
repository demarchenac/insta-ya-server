import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';

import { createWriteStream } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

import { config } from '../../config/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();

router.route('/').get((_req, res) => {
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

export { router };
