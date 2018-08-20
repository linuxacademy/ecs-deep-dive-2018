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

module.exports = (req, res) => {
  if (!Buffer.isBuffer(req.body)) {
    return res.status(400).json({
      code: 'BadRequest',
      message: 'Unable to parse request. Verify your content-type to be of image/*',
    });
  }

  req.app.locals.jimp.read(req.body, (err, image) => {
    if (err) {
      return res.status(500).json({
        code: 'InternalServerError',
        name: err.name,
        message: err.message,
      });
    }

    image.greyscale().getBuffer(req.app.locals.jimp.AUTO, (bufferErr, buffer) => {
      if (bufferErr) {
        return res.status(500).json({
          code: 'InternalServerError',
          name: bufferErr.name,
          message: bufferErr.message,
        });
      }

      res.send(buffer);
    });
  });
};
