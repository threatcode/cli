import * as threatcode from '../../lib';

const validMethods = ['set', 'get', 'unset', 'clear'];

export default async function config(
  method?: 'set' | 'get' | 'unset' | 'clear',
  ...args: string[]
): Promise<string> {
  if (method && !validMethods.includes(method)) {
    throw new Error(`Unknown config command "${method}"`);
  }

  const key = args[0];

  if (method === 'set') {
    let res = '';

    args.forEach((item) => {
      const [key, val] = item.split(/=(.+)/);
      threatcode.config.set(key, val);
      res += key + ' updated\n';

      // ensure we update the live library
      if (key === 'api') {
        (threatcode as any).api = val;
      }
    });

    return res;
  }

  if (method === 'get') {
    if (!key) {
      throw new Error('config:get requires an argument');
    }

    return threatcode.config.get(key) || '';
  }

  if (method === 'unset') {
    if (!key) {
      throw new Error('config:unset requires an argument');
    }
    threatcode.config.delete(key);

    if (key === 'api') {
      // ensure we update the live library
      (threatcode as any).api = null;
    }

    return `${key} deleted`;
  }

  if (method === 'clear') {
    threatcode.config.clear();
    // ensure we update the live library
    (threatcode as any).api = null;
    return 'config cleared';
  }

  return Object.keys(threatcode.config.all)
    .sort((a, b) => Number(a.toLowerCase() < b.toLowerCase()))
    .map((configKey) => `${configKey}: ${threatcode.config.all[configKey]}`)
    .join('\n')
    .trim();
}
