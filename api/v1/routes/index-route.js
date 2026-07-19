const taskRoutes = require('./task-route');
const authRoutes = require('./auth-route');
const userRoutes = require('./user-route');
const authMiddleware = require('../middleware/auth-middleware');
module.exports = (app) => {
    const version = '/api/v1'
    app.use(version + '/tasks', authMiddleware.requireAuth, taskRoutes);
    app.use(version + '/auth', authRoutes);
    app.use(version + '/users', authMiddleware.requireAuth, userRoutes);
}