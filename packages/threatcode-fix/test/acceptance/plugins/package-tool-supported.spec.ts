import * as pipenvPipfileFix from '@threatcode/fix-pipenv-pipfile';
import * as poetryFix from '@threatcode/fix-poetry';

import { checkPackageToolSupported } from '../../../src/plugins/package-tool-supported';

jest.mock('@threatcode/fix-pipenv-pipfile');
jest.mock('@threatcode/fix-poetry');

describe('checkPackageToolSupported', () => {
  it('pipenv fix package called with correct data', async () => {
    // Arrange
    const isPipenvSupportedVersionSpy = jest
      .spyOn(pipenvPipfileFix, 'isPipenvSupportedVersion')
      .mockReturnValue({
        supported: true,
        versions: ['123.123.123'],
      });
    const isPipenvInstalledSpy = jest
      .spyOn(pipenvPipfileFix, 'isPipenvInstalled')
      .mockResolvedValue({
        version: '123.123.123',
      });

    // Act
    await checkPackageToolSupported('pipenv', {});

    // Assert
    expect(isPipenvInstalledSpy).toHaveBeenCalled();
    expect(isPipenvInstalledSpy).toHaveBeenNthCalledWith(1);

    expect(isPipenvSupportedVersionSpy).toHaveBeenCalled();
    expect(isPipenvSupportedVersionSpy).toHaveBeenCalledWith('123.123.123');
  });
  it('poetry fix package called with correct data', async () => {
    // Arrange
    const isPipenvSupportedVersionSpy = jest
      .spyOn(poetryFix, 'isPoetrySupportedVersion')
      .mockReturnValue({
        supported: true,
        versions: ['1', '2'],
      });
    const isPipenvInstalledSpy = jest
      .spyOn(poetryFix, 'isPoetryInstalled')
      .mockResolvedValue({
        version: '3',
      });

    // Act
    await checkPackageToolSupported('poetry', {});

    // Assert
    expect(isPipenvInstalledSpy).toHaveBeenCalled();
    expect(isPipenvInstalledSpy).toHaveBeenNthCalledWith(1);

    expect(isPipenvSupportedVersionSpy).toHaveBeenCalled();
    expect(isPipenvSupportedVersionSpy).toHaveBeenCalledWith('3');
  });
});
