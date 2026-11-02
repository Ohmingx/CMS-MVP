const User = require('../models/User');

const accountDefinitions = [
	{
		role: 'admin',
		usernameKey: 'BOOTSTRAP_ADMIN_USERNAME',
		passwordKey: 'BOOTSTRAP_ADMIN_PASSWORD',
	},
	{
		role: 'staff',
		usernameKey: 'BOOTSTRAP_STAFF_USERNAME',
		passwordKey: 'BOOTSTRAP_STAFF_PASSWORD',
	},
];

async function bootstrapUsers() {
	for (const account of accountDefinitions) {
		const username = process.env[account.usernameKey];
		const password = process.env[account.passwordKey];
		if (!username && !password) continue;
		if (!username || !password) {
			throw new Error(`${account.usernameKey} and ${account.passwordKey} must be set together`);
		}
		if (!username.endsWith('@vit.edu.in')) {
			throw new Error(`${account.usernameKey} must be a VIT email address ending with @vit.edu.in`);
		}

		const existingUser = await User.findOne({ username });
		if (existingUser) {
			if (existingUser.role !== account.role) {
				throw new Error(`${account.usernameKey} already belongs to a different role`);
			}
			continue;
		}

		await User.create({ username, password, role: account.role });
		console.log(`Bootstrapped ${account.role} account: ${username}`);
	}
}

module.exports = { bootstrapUsers };
