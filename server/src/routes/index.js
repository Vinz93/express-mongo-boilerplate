import express from 'express';
import path from 'path';

import { upload } from '../helpers/utils';
import common from './common';

const router = express.Router();  // eslint-disable-line new-cap

router.get('/time', (req, res) => {
  const time = new Date();

  res.json({ time });
});

router.post('/files', (req, res) => {
  upload()(req, res, err => {
    if (err) return res.status(400).send(err);
    // console.log(path.join(req.app.locals.config.root, 'uploads'));
    if (!req.file) return res.status(400).end();

    const config = req.app.locals.config;
    let url = config.host;

    if (config.basePort) url = `${url}:${config.basePort}`;

    url = `${url}/uploads/${req.file.filename}`;

    res.json({ url });
  });
});

router.use(common);

export default router;
