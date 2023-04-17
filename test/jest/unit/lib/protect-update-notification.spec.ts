import * as path from 'path';
import * as pun from '../../../../src/lib/protect-update-notification';

describe('getPackageJsonPathsContainingThreatcodeDependency', () => {
  describe('with --file option used', () => {
    it('returns empty array when the given path does end with `package.json` or `package-lock.json`', () => {
      expect(
        pun.getPackageJsonPathsContainingThreatcodeDependency('/path/to/pom.xml', [
          '/dont-care',
        ]),
      ).toEqual([]);
    });

    it('returns empty array when the given path ends with `package.json` but the file does not actually exit', () => {
      expect(
        pun.getPackageJsonPathsContainingThreatcodeDependency(
          '/path/to/package.json',
          ['/dont-care'],
        ),
      ).toEqual([]);
    });

    it('returns empty array when the given path ends with `package-lock.json` but the file does not actually exit', () => {
      const p = path.resolve(
        __dirname,
        '../../../fixtures/protect-update-notification/no-package-json/package.json',
      );
      expect(
        pun.getPackageJsonPathsContainingThreatcodeDependency(p, ['/dont-care']),
      ).toEqual([]);
    });

    it('returns an array with a path to a package.json if the file passed exists and contains the `threatcode` dependency', () => {
      const p = path.resolve(
        __dirname,
        '../../../fixtures/protect-update-notification/with-package-json-with-threatcode-dep/package.json',
      );
      expect(
        pun.getPackageJsonPathsContainingThreatcodeDependency(p, ['/dont-care']),
      ).toEqual([p]);
    });
  });

  describe('no --file option used', () => {
    it('returns empty list when no paths are passed', () => {
      expect(
        pun.getPackageJsonPathsContainingThreatcodeDependency(undefined, []),
      ).toEqual([]);
    });

    describe('single path passed', () => {
      it('returns an empty array if no package.json is found in the given directory path', () => {
        const p = path.resolve(
          __dirname,
          '../../../fixtures/protect-update-notification/no-package-json',
        );
        expect(
          pun.getPackageJsonPathsContainingThreatcodeDependency(undefined, [p]),
        ).toEqual([]);
      });

      it('returns an empty array if no package.json is found in the given directory path', () => {
        const p = path.resolve(
          __dirname,
          '../../../fixtures/protect-update-notification/with-package-json-without-threatcode-dep',
        );
        expect(
          pun.getPackageJsonPathsContainingThreatcodeDependency(undefined, [p]),
        ).toEqual([]);
      });

      it('returns a path to a package.json if one is found in the given directory path', () => {
        const p = path.resolve(
          __dirname,
          '../../../fixtures/protect-update-notification/with-package-json-with-threatcode-dep',
        );
        expect(
          pun.getPackageJsonPathsContainingThreatcodeDependency(undefined, [p]),
        ).toEqual([path.resolve(p, 'package.json')]);
      });
    });

    describe('with multiple paths passed', () => {
      it('returns an array containing only those paths which have `package.json` with the `threatcode` dep', () => {
        const basePath = path.resolve(
          __dirname,
          '../../../fixtures/protect-update-notification',
        );

        const paths = [
          path.resolve(basePath, 'no-package-json'),
          path.resolve(basePath, 'with-package-json-with-threatcode-dep'),
          path.resolve(basePath, 'with-package-json-with-threatcode-dep-2'),
          path.resolve(basePath, 'with-package-json-without-threatcode-dep'),
        ];

        expect(
          pun.getPackageJsonPathsContainingThreatcodeDependency(undefined, paths),
        ).toEqual(
          expect.arrayContaining([
            path.resolve(
              basePath,
              'with-package-json-with-threatcode-dep/package.json',
            ),
            path.resolve(
              basePath,
              'with-package-json-with-threatcode-dep-2/package.json',
            ),
          ]),
        );
      });
    });
  });
});
