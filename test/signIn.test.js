const { expect } = require('chai');
const sinon = require('sinon');
const bcrypt = require('bcrypt');
const User = require("../models/userModel");
const { signInReturn, createUser } = require("../controller/signInController"); 

describe('Test de la fonction signInReturn', () => {
    it('devrait rendre la page signIn', async () => {
        const req = {};
        const res = {
            render: sinon.spy()
        };

        await signInReturn(req, res);

        expect(res.render.calledOnceWithExactly('signIn')).to.be.true;
    });
});

describe('Test de la fonction createUser', () => {
    afterEach(() => {
        sinon.restore();
    });

    it('devrait créer un nouvel utilisateur avec succès', async () => {
        const req = {
            body: {
                nom: 'John',
                prenom: 'Doe',
                email: 'john@example.com',
                password: 'password'
            }
        };
        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.spy(),
            redirect: sinon.spy()
        };

        sinon.stub(User, 'findOne').resolves(null);
        sinon.stub(bcrypt, 'hash').resolves('hashedPassword');
        sinon.stub(User.prototype, 'save').resolves();

        await createUser(req, res);

        expect(User.findOne.calledOnceWithExactly({ email: req.body.email })).to.be.true;
        expect(bcrypt.hash.calledOnceWithExactly(req.body.password, 10)).to.be.true;
        expect(User.prototype.save.calledOnce).to.be.true;
        expect(res.redirect.calledOnceWithExactly('/')).to.be.true;
        expect(res.status.notCalled).to.be.true;
        expect(res.json.notCalled).to.be.true;
    });

    it('devrait renvoyer une erreur si l\'utilisateur existe déjà', async () => {
        const req = {
            body: {
                nom: 'John',
                prenom: 'Doe',
                email: 'john@example.com',
                password: 'password'
            }
        };
        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.spy(),
            redirect: sinon.spy()
        };

        sinon.stub(User, 'findOne').resolves({ email: req.body.email });

        await createUser(req, res);

        expect(User.findOne.calledOnceWithExactly({ email: req.body.email })).to.be.true;
        expect(bcrypt.hash.notCalled).to.be.true;
        expect(User.prototype.save.notCalled).to.be.true;
        expect(res.status.calledOnceWithExactly(400)).to.be.true;
        expect(res.json.calledOnceWithExactly({ message: 'L\'utilisateur existe déjà.' })).to.be.true;
        expect(res.redirect.notCalled).to.be.true;
    });

    it('devrait renvoyer une erreur en cas d\'échec de la création de l\'utilisateur', async () => {
        const req = {
            body: {
                nom: 'John',
                prenom: 'Doe',
                email: 'john@example.com',
                password: 'password'
            }
        };
        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.spy(),
            redirect: sinon.spy()
        };

        sinon.stub(User, 'findOne').resolves(null);
        sinon.stub(bcrypt, 'hash').resolves('hashedPassword');
        sinon.stub(User.prototype, 'save').rejects(new Error('Erreur de sauvegarde'));

        await createUser(req, res);

        expect(User.findOne.calledOnceWithExactly({ email: req.body.email })).to.be.true;
        expect(bcrypt.hash.calledOnceWithExactly(req.body.password, 10)).to.be.true;
        expect(User.prototype.save.calledOnce).to.be.true;
        expect(res.redirect.notCalled).to.be.true;
        expect(res.status.calledOnceWithExactly(500)).to.be.true;
        expect(res.json.calledOnceWithExactly({ message: 'Une erreur est survenue lors de l\'inscription.' })).to.be.true;
    });
});
