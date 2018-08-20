/*
  Copyright 2017 Linux Academy
  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at
  http://www.apache.org/licenses/LICENSE-2.0
  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/

const { test } = require('ava');
const sinon = require('sinon');
const greyscale = require('../../middleware/greyscale.js');

const verifyMocks = (t) => {
  t.context.mockRes.send.verify();
  t.context.mockRes.status.verify();
  t.context.mockRes.json.verify();
  t.context.mockReq.app.locals.jimp.read.verify();
};

test.beforeEach((t) => {
  // eslint-disable-next-line no-param-reassign
  t.context.mockRes = {
    send: sinon.mock(),
    status: sinon.mock(),
    json: sinon.mock(),
  };

  // eslint-disable-next-line no-param-reassign
  t.context.mockReq = {
    app: {
      locals: {
        jimp: {
          read: sinon.mock(),
          AUTO: 'auto',
        },
      },
    },
    body: new Buffer('foo'),
  };
});

test.cb('should return apply greyscale filter to given image buffer', (t) => {
  const mockImage = {
    greyscale: sinon.mock(),
    getBuffer: sinon.mock(),
  };

  mockImage.greyscale
    .once()
    .withArgs()
    .returns(mockImage);

  mockImage.getBuffer
    .once()
    .callsFake((type, cb) => {
      cb(null, new Buffer('gray-foo'));
    });

  t.context.mockReq.app.locals.jimp.read
    .once()
    .callsFake((buffer, cb) => {
      t.is(buffer.toString(), 'foo');
      cb(null, mockImage);
    });

  t.context.mockRes.status.never();
  t.context.mockRes.json.never();

  t.context.mockRes.send
    .once()
    .callsFake((buffer) => {
      t.is(buffer.toString(), 'gray-foo');
      verifyMocks(t);
      t.end();
    });

  greyscale(t.context.mockReq, t.context.mockRes);
});

test.cb('should return error if could not get buffer for filtered image', (t) => {
  const mockImage = {
    greyscale: sinon.mock(),
    getBuffer: sinon.mock(),
  };

  mockImage.greyscale
    .once()
    .withArgs()
    .returns(mockImage);

  mockImage.getBuffer
    .once()
    .callsFake((type, cb) => {
      cb(new Error('oops'));
    });

  t.context.mockReq.app.locals.jimp.read
    .once()
    .callsFake((buffer, cb) => {
      t.is(buffer.toString(), 'foo');
      cb(null, mockImage);
    });

  t.context.mockRes.send.never();

  t.context.mockRes.status
    .once()
    .withArgs(500)
    .returns(t.context.mockRes);

  t.context.mockRes.json
    .once()
    .callsFake((body) => {
      t.is(body.code, 'InternalServerError');
      t.is(body.name, 'Error');
      t.is(body.message, 'oops');
      mockImage.greyscale.verify();
      mockImage.getBuffer.verify();
      verifyMocks(t);
      t.end();
    });

  greyscale(t.context.mockReq, t.context.mockRes);
});

test.cb('should return error if image buffer cannot be read', (t) => {
  t.context.mockReq.app.locals.jimp.read
    .once()
    .callsFake((buffer, cb) => {
      t.is(buffer.toString(), 'foo');
      cb(new Error('oops'));
    });

  t.context.mockRes.send.never();

  t.context.mockRes.status
    .once()
    .withArgs(500)
    .returns(t.context.mockRes);

  t.context.mockRes.json
    .once()
    .callsFake((body) => {
      t.is(body.code, 'InternalServerError');
      t.is(body.name, 'Error');
      t.is(body.message, 'oops');
      verifyMocks(t);
      t.end();
    });

  greyscale(t.context.mockReq, t.context.mockRes);
});

test.cb('should return error if body is invalid', (t) => {
  // eslint-disable-next-line no-param-reassign
  t.context.mockReq.body = undefined;

  t.context.mockReq.app.locals.jimp.read.never();
  t.context.mockRes.send.never();

  t.context.mockRes.status
    .once()
    .withArgs(400)
    .returns(t.context.mockRes);

  t.context.mockRes.json
    .once()
    .callsFake((body) => {
      t.is(body.code, 'BadRequest');
      t.is(
        body.message,
        'Unable to parse request. Verify your content-type to be of image/*'
      );
      verifyMocks(t);
      t.end();
    });

  greyscale(t.context.mockReq, t.context.mockRes);
});
