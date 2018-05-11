'use strict';

module.exports = (crypto, jwt) => {

	function generateSalt() {
		return crypto.randomBytes(24).toString('hex');
	}

	function generateJWToken(payload, salt) {
		let token;
		token = jwt.encode(payload, salt, 'HS256'); // HS256, HS384, HS512, RS256.
		return { token: token, salt: salt };
	}

	function decryptJWToken(token, salt) {
		if (!token || !salt) return false;
		return jwt.decode(token, salt, 'HS256'); // HS256, HS384, HS512, RS256.
	}

	return {
		generateJWToken: (payload, salt) => generateJWToken(payload, salt),
		decryptJWToken: (token, salt) => decryptJWToken(token, salt),
		generateSalt: () => generateSalt()
	};
};
