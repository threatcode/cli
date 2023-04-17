import {
  getBaseApiUrl,
  getV1ApiUrl,
  getRestApiUrl,
  getRootUrl,
} from '../../../../src/lib/config/api-url';

const urls = [
  {
    userInput: 'https://threatcode.github.io/api/v1',
    expectedBase: 'https://threatcode.github.io/api/',
    expectedV1: 'https://threatcode.github.io/api/v1',
    expectedRest: 'https://threatcode.github.io/api/rest',
    expectedRoot: 'https://threatcode.github.io',
  },
  {
    userInput: 'https://threatcode.github.io/api',
    expectedBase: 'https://threatcode.github.io/api',
    expectedV1: 'https://threatcode.github.io/api/v1',
    expectedRest: 'https://threatcode.github.io/api/rest',
    expectedRoot: 'https://threatcode.github.io',
  },
  {
    userInput: 'https://app.threatcode.github.io/api',
    expectedBase: 'https://app.threatcode.github.io/api',
    expectedV1: 'https://app.threatcode.github.io/api/v1',
    expectedRest: 'https://threatcode.github.io/api/rest',
    expectedRoot: 'https://app.threatcode.github.io',
  },
  {
    userInput: 'https://app.threatcode.github.io/api/v1',
    expectedBase: 'https://app.threatcode.github.io/api/',
    expectedV1: 'https://app.threatcode.github.io/api/v1',
    expectedRest: 'https://threatcode.github.io/api/rest',
    expectedRoot: 'https://app.threatcode.github.io',
  },
  {
    userInput: 'https://threatcode.github.io/api/v1',
    expectedBase: 'https://threatcode.github.io/api/',
    expectedV1: 'https://threatcode.github.io/api/v1',
    expectedRest: 'https://threatcode.github.io/api/rest',
    expectedRoot: 'https://threatcode.github.io',
  },
  {
    userInput: 'https://threatcode.github.io/api',
    expectedBase: 'https://threatcode.github.io/api',
    expectedV1: 'https://threatcode.github.io/api/v1',
    expectedRest: 'https://threatcode.github.io/api/rest',
    expectedRoot: 'https://threatcode.github.io',
  },
  {
    userInput: 'https://threatcode.github.io/api/',
    expectedBase: 'https://threatcode.github.io/api/',
    expectedV1: 'https://threatcode.github.io/api/v1',
    expectedRest: 'https://threatcode.github.io/api/rest',
    expectedRoot: 'https://threatcode.github.io',
  },
  {
    userInput: 'https://api.custom.threatcode.github.io',
    expectedBase: 'https://api.custom.threatcode.github.io',
    expectedV1: 'https://api.custom.threatcode.github.io/v1',
    expectedRest: 'https://api.custom.threatcode.github.io/rest',
    expectedRoot: 'https://custom.threatcode.github.io',
  },
  {
    userInput: 'http://localhost:9000/',
    expectedBase: 'http://localhost:9000/',
    expectedV1: 'http://localhost:9000/v1',
    expectedRest: 'http://localhost:9000/rest',
    expectedRoot: 'http://localhost:9000',
  },
  {
    userInput: 'http://localhost:9000/api/v1',
    expectedBase: 'http://localhost:9000/api/',
    expectedV1: 'http://localhost:9000/api/v1',
    expectedRest: 'http://localhost:9000/rest',
    expectedRoot: 'http://localhost:9000',
  },
  {
    userInput: 'http://alpha:omega@localhost:9000',
    expectedBase: 'http://alpha:omega@localhost:9000',
    expectedV1: 'http://alpha:omega@localhost:9000/v1',
    expectedRest: 'http://alpha:omega@localhost:9000/rest',
    expectedRoot: 'http://localhost:9000',
  },
  {
    userInput: 'https://threatcode.github.io/app.dev/v1',
    expectedBase: 'https://threatcode.github.io/app.dev/',
    expectedV1: 'https://threatcode.github.io/app.dev/v1',
    expectedRest: 'https://api.dev.threatcode.github.io/rest',
    expectedRoot: 'https://app.dev.threatcode.github.io',
  },
];

describe('CLI config - API URL', () => {
  // TODO: check that console.error was called for error states?
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => { });
  });

  describe('getBaseApiUrl', () => {
    describe('when only default URL is defined', () => {
      urls.forEach((url) => {
        it(`returns default API URL ${url.userInput} without the v1 suffix`, () => {
          expect(getBaseApiUrl(url.userInput)).toEqual(url.expectedBase);
        });
      });
    });

    it('returns envvar API if it is defined and valid', () => {
      expect(
        getBaseApiUrl('https://threatcode.github.io/api/', 'http://localhost:9000/'),
      ).toEqual('http://localhost:9000/');
      expect(
        getBaseApiUrl(
          'https://threatcode.github.io/api/',
          'http://alpha:omega@localhost:9000/',
          'https://endpoint-threatcode.github.io/api/',
        ),
      ).toEqual('http://alpha:omega@localhost:9000/');
    });

    it('returns default API if envvar is defined but not valid', () => {
      expect(getBaseApiUrl('https://threatcode.github.io/api/', 'localhost:10')).toEqual(
        'https://threatcode.github.io/api/',
      );
    });

    it('returns config API if it is defined and valid', () => {
      expect(
        getBaseApiUrl(
          'https://threatcode.github.io/api/',
          undefined,
          'http://localhost:9000/',
        ),
      ).toEqual('http://localhost:9000/');
      expect(
        getBaseApiUrl(
          'https://threatcode.github.io/api/',
          undefined,
          'http://alpha:omega@localhost:9000/',
        ),
      ).toEqual('http://alpha:omega@localhost:9000/');
    });

    it('returns default API if config endpoint is defined but not valid', () => {
      expect(
        getBaseApiUrl('https://threatcode.github.io/api/', undefined, 'localhost:10'),
      ).toEqual('https://threatcode.github.io/api/');
    });
  });

  describe('getV1ApiUrl', () => {
    urls.forEach((url) => {
      it(`returns V1 API URL ${url.expectedBase} with v1 path`, () => {
        expect(getV1ApiUrl(url.expectedBase)).toEqual(url.expectedV1);
      });
    });
  });

  describe('getRestApiUrl', () => {
    urls.forEach((url) => {
      it(`returns REST API URL ${url.expectedBase}`, () => {
        expect(getRestApiUrl(url.expectedBase)).toEqual(url.expectedRest);
      });
    });
  });

  describe('getRootUrl', () => {
    urls.forEach((url) => {
      it(`returns ROOT URL ${url.userInput}`, () => {
        expect(getRootUrl(url.userInput)).toEqual(url.expectedRoot);
      });
    });
  });
});
