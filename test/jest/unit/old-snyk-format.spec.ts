import * as policy from 'threatcode-policy';
import { loadJson } from '../../utils';
import * as path from 'path';

it('test sensibly bails if gets an old .threatcode format', async () => {
  const vulns2 = loadJson(
    path.resolve(__dirname, '../../fixtures/test-jsbin-vulns-updated.json'),
  );
  try {
    const config = await policy.load(
      path.resolve(__dirname, '../../fixtures/old-threatcode-config'),
    );
    const res = await config.filter(vulns2);
    throw new Error('was expecting an error, got ' + JSON.stringify(res));
  } catch (e) {
    expect(e.code).toEqual('OLD_DOTFILE_FORMAT');
  }
});
