export const isCLIV2 = (): boolean => {
  return !!(
    process.env.TEST_THREATCODE_COMMAND &&
    (process.env.TEST_THREATCODE_COMMAND.includes('cliv2') ||
      process.env.TEST_THREATCODE_ALL_VERSIONS)
  );
};
