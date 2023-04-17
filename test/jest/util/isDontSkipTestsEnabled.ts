export const isDontSkipTestsEnabled = (): boolean => {
  const dontSkip = !!process.env.TEST_THREATCODE_DONT_SKIP_ANYTHING;
  return dontSkip;
};
