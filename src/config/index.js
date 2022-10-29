export const config = {
	http: {
		port: process.env.PORT || process.env.HOST_PORT || 3000,
	},
	log: {
		access: '../../../logs/' + (process.env.LOG_ACCESS || 'access.log'),
	},
	database: {
		connectionString: process.env.DB_CONNECTION_STRING,
	},
	jwt: {
		secrets: {
			access: process.env.ACCESS_TOKEN_SECRET,
			refresh: process.env.REFRESH_TOKEN_SECRET,
		},
	},
};
