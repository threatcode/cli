import { packageJsonBelongsToWorkspace } from '../../../../../src/lib/plugins/nodejs-plugin/yarn-workspaces-parser';

const yarnWorkspacesMap = {
  'threatcode/test/acceptance/workspaces/yarn-workspace-out-of-sync/package.json': {
    workspaces: ['packages/*'],
  },
  'threatcode/test/acceptance/workspaces/yarn-workspace/package.json': {
    workspaces: ['libs/*/**', 'tools/*'],
  },
};

const yarnWorkspacesMapWindows = {
  'C:\\threatcode\\test\\acceptance\\workspaces\\yarn-workspace-out-of-sync\\package.json': {
    workspaces: ['packages'],
  },
  'C:\\threatcode\\test\\acceptance\\workspaces\\yarn-workspace\\package.json': {
    workspaces: ['libs/*/**', 'tools/*'],
  },
  'C:\\threatcode\\yarn-workspace\\package.json': {
    workspaces: ['libs\\*\\**', 'tools\\*'],
  },
};
describe('packageJsonBelongsToWorkspace', () => {
  test('does not match workspace root', () => {
    const packageJsonFileName =
      'threatcode/test/acceptance/workspaces/yarn-workspace-out-of-sync/package.json';
    const workspaceRoot =
      'threatcode/test/acceptance/workspaces/yarn-workspace-out-of-sync/package.json';
    expect(
      packageJsonBelongsToWorkspace(
        packageJsonFileName,
        yarnWorkspacesMap,
        workspaceRoot,
      ),
    ).toBeFalsy();
  });
  test('correctly matches a workspace with /* globs (meaning all folders)', () => {
    // docs: https://yarnpkg.com/features/workspaces#how-to-declare-a-worktree
    const packageJsonFileName =
      'threatcode/test/acceptance/workspaces/yarn-workspace-out-of-sync/packages/apple/package.json';
    const workspaceRoot =
      'threatcode/test/acceptance/workspaces/yarn-workspace-out-of-sync/package.json';
    expect(
      packageJsonBelongsToWorkspace(
        packageJsonFileName,
        yarnWorkspacesMap,
        workspaceRoot,
      ),
    ).toBeTruthy();
  });

  test('correctly matches a workspace with /*/** globs', () => {
    const packageJsonFileName =
      'threatcode/test/acceptance/workspaces/yarn-workspace/libs/a/package.json';
    const workspaceRoot =
      'threatcode/test/acceptance/workspaces/yarn-workspace/package.json';
    expect(
      packageJsonBelongsToWorkspace(
        packageJsonFileName,
        yarnWorkspacesMap,
        workspaceRoot,
      ),
    ).toBeTruthy();
  });

  test('does not match a workspace outside declared globs', () => {
    const packageJsonFileName =
      'threatcode/test/acceptance/workspaces/yarn-workspace/packages/a/package.json';
    const workspaceRoot =
      'threatcode/test/acceptance/workspaces/yarn-workspace/package.json';
    expect(
      packageJsonBelongsToWorkspace(
        packageJsonFileName,
        yarnWorkspacesMap,
        workspaceRoot,
      ),
    ).toBeFalsy();
  });
});

describe('packageJsonBelongsToWorkspace Windows', () => {
  test('does not match workspace root', () => {
    const packageJsonFileName =
      'C:\\threatcode\\test\\acceptance\\workspaces\\yarn-workspace-out-of-sync\\package.json';
    const workspaceRoot =
      'C:\\threatcode\\test\\acceptance\\workspaces\\yarn-workspace-out-of-sync\\package.json';
    expect(
      packageJsonBelongsToWorkspace(
        packageJsonFileName,
        yarnWorkspacesMapWindows,
        workspaceRoot,
      ),
    ).toBeFalsy();
  });
  test('correctly matches a workspace with /* globs (meaning all folders)', () => {
    // docs: https://yarnpkg.com/features/workspaces#how-to-declare-a-worktree
    const packageJsonFileName =
      'C:\\threatcode\\test\\acceptance\\workspaces\\yarn-workspace-out-of-sync\\packages\\apple\\package.json';
    const workspaceRoot =
      'C:\\threatcode\\test\\acceptance\\workspaces\\yarn-workspace-out-of-sync\\package.json';
    expect(
      packageJsonBelongsToWorkspace(
        packageJsonFileName,
        yarnWorkspacesMapWindows,
        workspaceRoot,
      ),
    ).toBeTruthy();
  });

  test('correctly matches a workspace with \\* globs (meaning all folders)', () => {
    // docs: https://yarnpkg.com/features/workspaces#how-to-declare-a-worktree
    const packageJsonFileName =
      'C:\\threatcode\\yarn-workspace\\tools\\apple\\package.json';
    const workspaceRoot = 'C:\\threatcode\\yarn-workspace\\package.json';
    expect(
      packageJsonBelongsToWorkspace(
        packageJsonFileName,
        yarnWorkspacesMapWindows,
        workspaceRoot,
      ),
    ).toBeTruthy();
  });

  test('correctly matches a workspace with /*/** globs', () => {
    const packageJsonFileName =
      'C:\\threatcode\\test\\acceptance\\workspaces\\yarn-workspace\\libs\\a\\package.json';
    const workspaceRoot =
      'C:\\threatcode\\test\\acceptance\\workspaces\\yarn-workspace\\package.json';
    expect(
      packageJsonBelongsToWorkspace(
        packageJsonFileName,
        yarnWorkspacesMapWindows,
        workspaceRoot,
      ),
    ).toBeTruthy();
  });

  test('does not match a workspace outside declared globs', () => {
    const packageJsonFileName =
      'C:\\threatcode\\test\\acceptance\\workspaces\\yarn-workspace\\packages\\a\\package.json';
    const workspaceRoot =
      'C:\\threatcode\\test\\acceptance\\workspaces\\yarn-workspace\\package.json';
    expect(
      packageJsonBelongsToWorkspace(
        packageJsonFileName,
        yarnWorkspacesMapWindows,
        workspaceRoot,
      ),
    ).toBeFalsy();
  });
});
