export const validate = (schema) => (req, res, next) => {
	try {
		schema.parse({
			body: req.body,
			query: req.query,
			params: req.params,
		});

		next();
	} catch (error) {
		// eslint-disable-next-line no-console
		console.error(error);
		return res.status(400).json(error);
	}
};
