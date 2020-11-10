function securityPolicy(req, res, next) {
    res.set("Content-Security-Policy", "script-src 'self' cdn.jsdelivr.net code.jquery.com stackpath.bootstrapcdn.com unpkg.com ;");
    next();
}

module.exports = {
    securityPolicy
}