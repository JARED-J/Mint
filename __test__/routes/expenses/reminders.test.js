/* global describe, it */

const chai = require('chai')
const sinon = require('sinon');
const spies = require('chai-spies');

const db = require('../../../db');
const reminders = require('../../../routes/expenses/reminders');

chai.use(spies);
const expect = chai.expect;

describe('reminders', () => {
  let resMock = {};

  beforeEach(() => {
    resMock = {
      send: chai.spy(),
    };
  });

  it('is a function', () => {
    expect(reminders).to.be.a('function');
  });

  it('calls create with the right parameters', async () => {
    const result = ['bar'];
    const callback = chai.spy(() => result);
    const stub = sinon.stub(db.reminder, 'findAll').callsFake(callback);

    await reminders(
      { body: { user: 'foo' }},
      resMock
    );

    expect(callback).to.have.been.called.once;
    expect(resMock.send).to.have.been.called.once;

    stub.restore();
  });

  it('response is still sent if errors are thrown', async () => {
    const error = new Error();
    const callback = chai.spy(() => { throw error; });
    const stub = sinon.stub(db.reminder, 'findAll').callsFake(callback);

    await reminders(
      { body: { user: 'foo' }},
      resMock
    );

    expect(callback).to.have.been.called.once;
    expect(resMock.send).to.have.been.called.once;
    expect(resMock.send).to.have.been.called.with(error);

    stub.restore();
  });

});