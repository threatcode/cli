const requireThreatcodeToken = (): string => {
  const result =
    process.env.THREATCODE_TOKEN || // default
    process.env.THREATCODE_API_TOKEN || // smoke tests
    process.env.THREATCODE_API_KEY; // circle ci

  if (!result) {
    throw new Error('No Threatcode Token found in test environment.');
  }

  return result;
};

export { requireThreatcodeToken };
