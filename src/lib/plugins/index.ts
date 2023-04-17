import * as rubygemsPlugin from './rubygems';
import * as mvnPlugin from 'threatcode-mvn-plugin';
import * as gradlePlugin from 'threatcode-gradle-plugin';
import * as sbtPlugin from 'threatcode-sbt-plugin';
import * as pythonPlugin from 'threatcode-python-plugin';
import * as goPlugin from 'threatcode-go-plugin';
import * as nugetPlugin from 'threatcode-nuget-plugin';
import * as phpPlugin from 'threatcode-php-plugin';
import * as nodejsPlugin from './nodejs-plugin';
import * as cocoapodsPlugin from '@threatcode/threatcode-cocoapods-plugin';
import * as hexPlugin from '@threatcode/threatcode-hex-plugin';
import * as swiftPlugin from 'threatcode-swiftpm-plugin';
import * as types from './types';
import { SupportedPackageManagers } from '../package-managers';
import { UnsupportedPackageManagerError } from '../errors';

export function loadPlugin(
  packageManager: SupportedPackageManagers | undefined,
): types.Plugin {
  switch (packageManager) {
    case 'npm': {
      return nodejsPlugin;
    }
    case 'rubygems': {
      return rubygemsPlugin;
    }
    case 'maven': {
      return mvnPlugin;
    }
    case 'gradle': {
      return gradlePlugin;
    }
    case 'sbt': {
      return sbtPlugin;
    }
    case 'yarn': {
      return nodejsPlugin;
    }
    case 'pip':
    case 'poetry': {
      return pythonPlugin;
    }
    case 'golangdep':
    case 'gomodules':
    case 'govendor': {
      return goPlugin;
    }
    case 'nuget': {
      return nugetPlugin;
    }
    case 'paket': {
      return nugetPlugin;
    }
    case 'composer': {
      return phpPlugin;
    }
    case 'cocoapods': {
      return cocoapodsPlugin;
    }
    case 'hex': {
      return hexPlugin;
    }
    case 'swift': {
      return swiftPlugin;
    }
    default: {
      throw new UnsupportedPackageManagerError(packageManager);
    }
  }
}
