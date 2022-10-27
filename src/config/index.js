export const config = {
	http: {
		port: process.env.PORT || process.env.HOST_PORT || 3000,
	},
	log: {
		access: '../../../logs/' + (process.env.LOG_ACCESS || 'access.log'),
	},
};
