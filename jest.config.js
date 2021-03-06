module.exports = {
    preset: 'ts-jest',
    testMatch: [
        `${__dirname}/tests/**/*.test.ts`
    ],
    verbose: true,
    globalSetup: `${__dirname}/node_modules/@databases/pg-test/jest/globalSetup.js`,
    globalTeardown: `${__dirname}/node_modules/@databases/pg-test/jest/globalTeardown.js`,
};

