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

const app = require('express')();
const bodyParser = require('body-parser');
const jimp = require('jimp');

const PORT = process.env.API_PORT || 3002;

const validMimeTypes = ['image/bmp', 'image/jpeg', 'image/png'];
const isValidImageMimeType = req => validMimeTypes.includes(req.headers['content-type']);

app.locals = { jimp };

app.use(bodyParser.raw({ limit: '10mb', type: isValidImageMimeType }));

app.use((err, req, res, next) => {
  if (err.statusCode === 413) {
    return res.status(413).json({ code: 'EntityTooLarge' });
  }

  next();
});

app.get('/', (req, res) => {
  res.send('welcome to the photo-filter api');
});

// Endpoint: Apply greyscale filter to an image
app.post('/greyscale', require('./middleware/greyscale'));

// catch all if a path does not exist
app.use((req, res) => {
  res.status(404).json({ code: 'RouteNotFound' });
});

app.listen(PORT, () => {
  console.log(`Photo Filter API listening on http://localhost:${PORT}`);
});
