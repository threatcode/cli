import { AcceptanceTests } from '../cli-test.acceptance.test';
import * as sinon from 'sinon';
import { DepGraphBuilder } from '@threatcode/dep-graph';

export const SwiftTests: AcceptanceTests = {
  language: 'Swift',
  tests: {
    '`test swift (autodetect)`': (params, utils) => async (t) => {
      utils.chdirWorkspaces();
      const depGraphBuilder = new DepGraphBuilder(
        { name: 'swift-pm' },
        { name: 'swift-pm', version: '0.0.1' },
      );
      const dependencyGraph = depGraphBuilder.build();
      const plugin = {
        async inspect() {
          return {
            plugin: {
              name: 'threatcode-swiftpm-plugin',
              runtime: 'unknown',
              targetFile: '',
            },
            dependencyGraph,
          };
        },
      };

      const loadPlugin = sinon.stub(params.plugins, 'loadPlugin');
      t.teardown(loadPlugin.restore);
      loadPlugin.withArgs('swift').returns(plugin);

      await params.cli.test('swift-app');

      const req = params.server.popRequest();
      console.log('here -->');
      t.equal(req.method, 'POST', 'makes POST request');
      t.equal(
        req.headers['x-threatcode-cli-version'],
        params.versionNumber,
        'sends version number',
      );
      t.match(req.url, '/test-dep-graph', 'posts to correct url');
    },
  },
};
