import path from 'path';
import multer from 'multer';
import uuid from 'node-uuid';
import mime from 'mime';

export const paginate = {
  limit(limit, value) {
    return limit !== undefined ? limit : value || 20;
  },
  offset(offset, value) {
    return offset !== undefined ? offset : value || 0;
  },
};

export function upload() {
  console.log('call');
  const storage = multer.diskStorage({
    destination(req, file, cb) {
      cb(null, path.join(__dirname, '../../uploads'));
    },
    filename(req, file, cb) {
      cb(null, `${uuid.v4()}.${mime.extension(file.mimetype)}`);
    },
  });
  return multer({ storage }).single('file');
}
