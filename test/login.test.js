const userController = require('../controller/loginController');
const User = require('../models/userModel');
const bcrypt = require('bcrypt');

jest.mock('../models/userModel');
jest.mock('bcrypt');

describe('User Controller', () => {
    describe('loginfonction', () => {
        it('should return 401 if user is not found', async () => {
            User.findOne.mockResolvedValue(null);

            const req = {
                body: {
                    email: 'test@test.com',
                    password: 'password'
                }
            };
            const res = {
                status: jest.fn(() => res),
                json: jest.fn()
            };

            await userController.loginfonction(req, res);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ message: 'Utilisateur non trouvÃ©.' });
        });

        it('should return 401 if password is incorrect', async () => {
            User.findOne.mockResolvedValue({ password: 'hashedPassword' });
            bcrypt.compare.mockResolvedValue(false);

            const req = {
                body: {
                    email: 'test@test.com',
                    password: 'password'
                }
            };
            const res = {
                status: jest.fn(() => res),
                json: jest.fn()
            };

            await userController.loginfonction(req, res);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ message: 'Mot de passe incorrect.' });
        });

        it('should set session data and redirect if login is successful', async () => {
            User.findOne.mockResolvedValue({ _id: 'some-id', username: 'test-user', password: 'hashedPassword' });
            bcrypt.compare.mockResolvedValue(true);

            const req = {
                body: {
                    email: 'test@test.com',
                    password: 'password'
                },
                session: {}
            };
            const res = {
                redirect: jest.fn()
            };

            await userController.loginfonction(req, res);

            expect(req.session.userId).toBe('some-id');
            expect(req.session.username).toBe('test-user');
            expect(res.redirect).toHaveBeenCalledWith('/');
        });

        it('should handle errors', async () => {
            User.findOne.mockRejectedValue(new Error('Database error'));

            const req = {
                body: {
                    email: 'test@test.com',
                    password: 'password'
                }
            };
            const res = {
                status: jest.fn(() => res),
                json: jest.fn()
            };

            await userController.loginfonction(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Une erreur est survenue lors de la connexion.' });
        });
    });
});

