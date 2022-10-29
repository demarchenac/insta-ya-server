export const logger = (req, _res, next) => {
	const date = new Date().toLocaleString();
	const { ip = '', method = '', path = '', hostname = '' } = req;

	// eslint-disable-next-line no-console
	console.log(`${date} :: ${method} :: ${hostname} :: ${path} :: ${ip}`);

	next();
};
