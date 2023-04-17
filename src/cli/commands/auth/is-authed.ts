import * as threatcode from '../../../lib';
import config from '../../../lib/config';
import { makeRequest } from '../../../lib/request';

export function isAuthed() {
  const token = threatcode.config.get('api');
  return verifyAPI(token).then((res: any) => {
    return res.body.ok;
  });
}

export function verifyAPI(api) {
  const payload = {
    body: {
      api,
    },
    method: 'POST',
    url: config.API + '/verify/token',
    json: true,
  };

  return new Promise((resolve, reject) => {
    makeRequest(payload, (error, res, body) => {
      if (error) {
        return reject(error);
      }

      resolve({
        res,
        body,
      });
    });
  });
}
