import express from 'express';

import { upload } from '../helpers/utils';
import common from './common';

const router = express.Router();  // eslint-disable-line new-cap

/**
 * @swagger
 * /time:
 *   get:
 *     tags:
 *       - Times
 *     description: Returns current time
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Current time
 *         schema:
 *           properties:
 *             time:
 *               type: string
 *               format: date-time
 */

router.get('/time', (req, res) => {
  const time = new Date();

  res.json({ time });
});

/**
 * @swagger
 * /files:
 *   post:
 *     tags:
 *      - Files
 *     description: uploads files in the server
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: file
 *         description: file to upload.
 *         in: formData
 *         required: true
 *         type: file
 *     responses:
 *       200:
 *         description: Successfully uploaded
 *         schema:
*           properties:
*             url:
*               type: string
*/


router.post('/files', (req, res) => {
  upload()(req, res, err => {
    if (err) return res.status(400).send(err);

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
