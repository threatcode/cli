const merge = require('lodash.merge');
import * as Debug from 'debug';
import { legacyPlugin as pluginApi } from '@threatcode/cli-interface';

const debug = Debug('threatcode-module-info');

export function ModuleInfo(plugin, policy) {
  return {
    async inspect(
      root,
      targetFile,
      options,
      threatcodeHttpClient,
    ): Promise<pluginApi.SinglePackageResult | pluginApi.MultiProjectResult> {
      const pluginOptions = merge(
        {
          args: options._doubleDashArgs,
        },
        options,
      );

      debug('calling plugin inspect()', { root, targetFile, pluginOptions });
      const info = await plugin.inspect(
        root,
        targetFile,
        pluginOptions,
        threatcodeHttpClient,
      );
      debug('plugin inspect() done');

      // attach policy if not provided by plugin
      if (policy && !info.package.policy) {
        info.package.policy = policy.toString();
      }

      return info;
    },
  };
}
