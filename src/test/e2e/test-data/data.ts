const { ADMIN_USER, ADMIN_PASSWORD, ADMIN_USER_EMAIL } = process.env;

const admin = {
	username: ADMIN_USER ?? 'admin',
	password: ADMIN_PASSWORD ?? 'password',
	email: ADMIN_USER_EMAIL ?? 'wordpress@example.com',
};

export { admin };
