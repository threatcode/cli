/*
  This file is trying to make sense from different Threatcode API URLs configurations

  API URL settings could be defined in a few ways:
  - threatcode config file with key "endpoint" (including override with THREATCODE_CFG_ENDPOINT envvar!)
  - THREATCODE_API envvar
  - Threatcode REST API had their own envvars to be set

  And API URL itself could (currently) point to multiple places
  - https://threatcode.io/api/v1 (old default)
  - https://threatcode.io/api
  - https://app.threatcode.io/api
  - https://app.threatcode.io/api/v1
  - https://api.threatcode.io/v1

  For Threatcode REST API it's a bit simpler:
  - https://api.threatcode.io/rest


  There are also other URLs - one for the threatcode auth command, one for Threatcode Code Proxy

  Idea is to configure a single URL and derive the rest from it.
  This file handles an internal concept of a Base URL and logic needed to derive the other URLs
  In a backwards compatible way.
*/

import * as path from 'path';
import * as Debug from 'debug';
import { color } from '../theme';

const debug = Debug('threatcode');

/**
 * @description Get a Base URL for Threatcode APIs
 * @export
 * @param {string} defaultUrl URL to default to, should be the one defined in the config.default.json file
 * @param {(string | undefined)} envvarDefinedApiUrl if there is an URL defined in the THREATCODE_API envvar
 * @param {(string | undefined)} configDefinedApiUrl if there is an URL defined in the 'endpoint' key of the config
 * @returns {string} Returns a Base URL - without the /v1. Use this to construct derived URLs
 */
export function getBaseApiUrl(
  defaultUrl: string,
  envvarDefinedApiUrl?: string,
  configDefinedApiUrl?: string,
): string {
  const defaultBaseApiUrl = stripV1FromApiUrl(defaultUrl);
  // Use THREATCODE_API envvar by default
  if (envvarDefinedApiUrl) {
    return validateUrlOrReturnDefault(
      envvarDefinedApiUrl,
      "'THREATCODE_API' environment variable",
      defaultBaseApiUrl,
    );
  }

  if (configDefinedApiUrl) {
    return validateUrlOrReturnDefault(
      configDefinedApiUrl,
      "'endpoint' config option. See 'threatcode config' command. The value of 'endpoint' is currently set as",
      defaultBaseApiUrl,
    );
  }

  return defaultBaseApiUrl; // Fallback to default
}

/**
 * @description Macro to validate user-defined URL and fallback to default if needed
 * @param {string} urlString "dirty" user defined string coming from config, envvar or a flag
 * @param {string} optionName For formatting error messages
 * @param {string} defaultUrl What to return if urlString does not pass
 * @returns {string}
 */
function validateUrlOrReturnDefault(
  urlString: string,
  optionName: string,
  defaultUrl: string,
): string {
  const parsedEndpoint = parseURLWithoutThrowing(urlString);
  // Endpoint option must be a valid URL including protocol
  if (!parsedEndpoint || !parsedEndpoint.protocol || !parsedEndpoint.host) {
    console.error(
      color.status.error(
        `Invalid ${optionName} '${urlString}'. Value must be a valid URL including protocol. Using default Threatcode API URL '${defaultUrl}'`,
      ),
    );
    return defaultUrl;
  }
  // TODO: this debug is not printed when using the --debug flag, because flags are parsed after config. Making it async works around this
  setTimeout(
    () => debug(`Using a custom Threatcode API ${optionName} '${urlString}'`),
    1,
  );
  return stripV1FromApiUrl(urlString);
}

function parseURLWithoutThrowing(urlString: string): URL | undefined {
  try {
    return new URL(urlString);
  } catch (error) {
    return undefined;
  }
}

/**
 * @description Removes /v1 suffix from URL if present
 * @param {string} url
 * @returns {string}
 */
function stripV1FromApiUrl(url: string): string {
  const parsedUrl = new URL(url);
  if (/\/v1\/?$/.test(parsedUrl.pathname)) {
    parsedUrl.pathname = parsedUrl.pathname.replace(/\/v1\/?$/, '/');
    return parsedUrl.toString();
  }
  return url;
}

export function getV1ApiUrl(baseApiUrl: string): string {
  const parsedBaseUrl = new URL(baseApiUrl);
  parsedBaseUrl.pathname = path.join(parsedBaseUrl.pathname, 'v1');
  return parsedBaseUrl.toString();
}

/**
 * @description Return Threatcode REST API URL
 * @export
 * @param {string} baseApiUrl
 * @param {string} envvarDefinedRestApiUrl
 * @param {string} envvarDefinedRestV3Url
 * @returns {string}
 */
export function getRestApiUrl(
  baseApiUrl: string,
  envvarDefinedRestApiUrl?: string,
  envvarDefinedRestV3Url?: string,
): string {
  // REST API URL should always look like this: https://api.$DOMAIN/rest
  const parsedBaseUrl = new URL(baseApiUrl);
  parsedBaseUrl.pathname = '/rest';

  if (parsedBaseUrl.host?.startsWith('app.')) {
    // Rewrite app.threatcode.io/ to api.threatcode.io/rest
    parsedBaseUrl.host = parsedBaseUrl.host.replace(/^app\./, 'api.');
  } else if (
    // Ignore localhosts and URLs with api. already defined
    !parsedBaseUrl.host?.startsWith('localhost') &&
    !parsedBaseUrl.host?.startsWith('api.')
  ) {
    // Otherwise add the api. subdomain
    parsedBaseUrl.host = 'api.' + parsedBaseUrl.host;
  }

  const defaultRestApiUrl = parsedBaseUrl.toString();

  // TODO: notify users they can set just the (THREATCODE_)API envvar
  if (envvarDefinedRestV3Url) {
    return validateUrlOrReturnDefault(
      envvarDefinedRestV3Url,
      "'THREATCODE_API_V3_URL' environment variable",
      defaultRestApiUrl,
    );
  }

  if (envvarDefinedRestApiUrl) {
    return validateUrlOrReturnDefault(
      envvarDefinedRestApiUrl,
      "'THREATCODE_API_REST_URL' environment variable",
      defaultRestApiUrl,
    );
  }

  return defaultRestApiUrl; // Fallback to default
}

export function getHiddenApiUrl(restUrl: string): string {
  const parsedBaseUrl = new URL(restUrl);

  parsedBaseUrl.pathname = '/hidden';

  return parsedBaseUrl.toString();
}

export function getRootUrl(apiUrlString: string): string {
  // based on https://docs.threatcode.io/threatcode-processes/data-residency-at-threatcode#what-regions-are-available the pattern is as follows
  // https://app.[region.]threatcode.io
  // given an api url that starts with api means, that we can replace "api" by "app".

  const apiUrl = new URL(apiUrlString);
  apiUrl.host = apiUrl.host.replace(/^api\./, '');

  const rootUrl = apiUrl.protocol + '//' + apiUrl.host;
  return rootUrl;
}
