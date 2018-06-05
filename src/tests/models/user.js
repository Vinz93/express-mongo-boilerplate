import chai from 'chai';
import Promise from 'bluebird';
import mongoose from 'mongoose';
import User from '../../models/user';

mongoose.Promise = Promise;
describe('User Model', () => {
  before(done => {
    User.remove({})
      .then(() => {
        User.create({
          email: 'unique@gmail.com',
          firstName: 'Sr. Tester',
          password: 'secret',
        })
        .then(() => done());
      })
      .catch(err => console.log(err));
  });

  after(() => mongoose.connection.close());


  describe('fields and virtuals', () => {

    it('Email, password and firstName are required', done => {
      const user = new User({
        bornAt: Date.now(),
      });
      user.validate(err => {
        err.should.to.be.ok;
        err.should.have.property('errors');
        err.errors.should.have.property('email');
        err.errors.should.have.property('firstName');
        err.errors.should.have.property('password');
        done();
      });
    });

    it('reject invalid email format', done => {
      const user = new User({
        email: 'test',
      });
      user.validate(err => {
        err.should.to.be.ok;
        err.should.have.property('errors');
        err.errors.should.have.property('email');
        done();
      })
    });

    it('Accept a valid email format', done => {
      const user = new User({
        email: 'unique@should.com',
      });
      user.validate(err => {
        err.should.to.be.ok;
        err.should.have.property('errors');
        err.errors.should.not.have.property('email');
        done();
      });
    });

    it('email field should be unique', done => {
      const user = new User({
        email: 'unique@gmail.com',
      });
      user.validate(err => {
        err.should.to.be.ok;
        err.should.have.property('errors');
        err.errors.should.have.property('email');
        err.errors.email.should.have.property('kind');
        err.errors.email.kind.should.equal('unique');
        done();
      });
    });
  });
});

