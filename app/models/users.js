'use-strict';

const fs = require('fs');

/**
 * User module
 * @module app/users
 */

module.exports = (cwd) => {

	const defaultUserObject = {
		email: '',
		password: '',
		salt: '',
		token: '',
		keys: {},
		passwords: []
	};

	const userConfigPath = `${cwd}/app/config/user.json`;

	const userPrivateKeyPath = `${cwd}/app/config/rsa.private`;
	const userPublicKeyPath = `${cwd}/app/config/rsa.public`;

	const handlers = {
		userDoesNotExist: (resolve) => {
			console.log('# > user does not exist, should be initialized first');
			resolve({});
		},
		errorUpdatingUser: (err, resolve, data) => {
			console.log('# > error updating user', err);
			resolve(JSON.parse(data.toString()));
		},
		userWasUpdated: (resolve, user) => {
			console.log(`# > ${userConfigPath} was updated`);
			resolve(user);
		},
		errorSavingKeys: (err, resolve, data) => {
			console.log('# > error saving user RSA keys', err);
			resolve(JSON.parse(data.toString()));
		},
		keysWereSaved: (resolve, user) => {
			console.log(`# > keys from ${userConfigPath} were saved: ${userPrivateKeyPath}, ${userPrivateKeyPath}`);
			resolve(user);
		}
	};

	function keyExists(privateKey) {
		return new Promise((resolve, reject) => {
			const keyPath = (privateKey) ? userPrivateKeyPath : userPublicKeyPath;
			fs.readFile(keyPath, (err, data) => {
				if (err) {
					console.log('# > private RSA key does not exist, ok');
					reject();
				} else {
					resolve(data);
				}
			});
		});
	}

	return {
		/**
		 * User data paths: config, keys.
		 */
		paths: {
			config: () => userConfigPath,
			keys: () => new Object({
				privateRSA: userPrivateKeyPath,
				publicRSA: userPublicKeyPath
			})
		},
		/**
		 * Holds methods for checking if private/public RSA keys exist.
		 */
		keyExists: {
			privateRSA: () => keyExists(true),
			publicRSA: () => keyExists()
		},
		/**
		 * Returns user object
		 * @return {object} User object
		 */
		user: () => {
			return new Promise((resolve) => {
				fs.readFile(userConfigPath, (err, data) => {
					if (err) {
						console.log('# > user does not exist, initializing');
						fs.writeFile(userConfigPath, JSON.stringify(defaultUserObject), (err) => {
							if (err) {
								console.log('# > error getting user', err);
								resolve({});
							}
							console.log(`# > ${userConfigPath} was created`);
							resolve(defaultUserObject);
						});
					} else {
						resolve(JSON.parse(data.toString()));
					}
				});
			});
		},

		/**
		 * Configures user object
		 * @param newValues user object with new values that should be updated
		 * @return {object} Updated user object
		 */
		config: (newValues) => {
			return new Promise((resolve) => {
				fs.readFile(userConfigPath, (err, data) => {
					if (err) {
						handlers.userDoesNotExist();
					} else {
						const user = JSON.parse(data.toString());
						if (newValues) {
							console.log('config, newValues', newValues);
							for (const [key, value] of Object.entries(newValues)) {
								if (user.hasOwnProperty(key)) {
									user[key] = value;
								}
							}
						}
						console.log('updated user', user);
						fs.writeFile(userConfigPath, JSON.stringify(user), (err) => {
							if (err) {
								handlers.errorUpdatingUser(err, resolve, data);
							}
							handlers.userWasUpdated(resolve, user);
						});
					}
				});
			});
		},

		/**
		 * Saves user RSA keys to files
		 * @param keyPair key pair object
		 * @return {object} Updated user object
		 */
		saveKeys: (keyPair) => {
			return new Promise((resolve) => {
				fs.readFile(userConfigPath, (err, data) => {
					if (err) {
						handlers.userDoesNotExist();
					} else {
						const user = JSON.parse(data.toString());
						if (keyPair) {
							console.log('saveKeys, keyPair', keyPair);
							fs.writeFile(userPrivateKeyPath, JSON.stringify(keyPair.private), (err) => {
								if (err) {
									handlers.errorSavingKeys(err, resolve, data);
								}
								fs.writeFile(userPublicKeyPath, JSON.stringify(keyPair.public), (err) => {
									if (err) {
										handlers.errorSavingKeys(err, resolve, data);
									}
									handlers.keysWereSaved(resolve, user);
								});
							});
						} else {
							handlers.errorSavingKeys({ error: 'Missing keyPair parameter' }, resolve, data);
						}
					}
				});
			});
		},

		/**
		 * Adds new password
		 * @return {object} Updated user object
		 */
		addPassword: (newPasswordObject) => {
			return new Promise((resolve) => {
				fs.readFile(userConfigPath, (err, data) => {
					if (err) {
						handlers.userDoesNotExist();
					} else {
						const user = JSON.parse(data.toString());
						if (newPasswordObject) {
							newPasswordObject.timestamp = new Date().getTime();
							console.log('add password, newPasswordObject', newPasswordObject);
							user.passwords.push(newPasswordObject);
						}
						console.log('updated user', user);
						fs.writeFile(userConfigPath, JSON.stringify(user), (err) => {
							if (err) {
								handlers.errorUpdatingUser(err, resolve, data);
							}
							handlers.userWasUpdated(resolve, user);
						});
					}
				});
			});
		},

		/**
		 * Removes a password
		 * @return {object} Updated user object
		 */
		deletePassword: (passwordObject) => {
			return new Promise((resolve) => {
				fs.readFile(userConfigPath, (err, data) => {
					if (err) {
						handlers.userDoesNotExist();
					} else {
						const user = JSON.parse(data.toString());
						if (passwordObject) {
							console.log('delete password, passwordObject', passwordObject);
							user.passwords = user.passwords.filter((item) => item.name !== passwordObject.name && item.password !== passwordObject.password);
						}
						console.log('updated user', user);
						fs.writeFile(userConfigPath, JSON.stringify(user), (err) => {
							if (err) {
								handlers.errorUpdatingUser(err, resolve, data);
							}
							handlers.userWasUpdated(resolve, user);
						});
					}
				});
			});
		}
	};
};
