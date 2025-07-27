const jsonwebtoken = require("jsonwebtoken");

/*************  ✨ Windsurf Command 🌟  *************/
/**
 * Verify Token Middleware
 * 
 * This middleware verifies the token sent in the request's header.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
function auth(req, res, next) {
    // Get the token from the request's header
    const token = req.header('auth-token');

    // If no token is found, return an unauthorized response
    if (!token) return res.status(401).send('Access Denied');

    try {
        // Verify the token using the secret key
        const verified = jsonwebtoken.verify(token, process.env.TOKEN_SECRET);

        // Add the user to the request
        req.user = verified;

        // Call the next middleware
        next();
    } catch (err) {
        // If the token is invalid, return a bad request response
        res.status(400).send('Invalid Token');
    }
}

module.exports = auth
