module.exports = {
    moduleFileExtensions: ['js', 'ts', 'json'],
    testRegex: '\\.spec\\.ts$',
    transform: {
        '^.+\\.(t|j)s$': 'ts-jest',
    },
    setupFilesAfterEnv: ['./test/setup.ts'],
    // collectCoverage: true,
    // collectCoverageFrom: ['src/**/*.ts', '!src/**/index.ts'],
    // coverageDirectory: 'coverage',
    // coveragePathIgnorePatterns: ['<rootDir>/dist/', '<rootDir>/node_modules/', '<rootDir>/test/'],
    // coverageThreshold: {
    //     global: {
    //         branches: 95,
    //         functions: 95,
    //         lines: 95,
    //         statements: -5,
    //     },
    // },
    testEnvironment: 'node',
    moduleNameMapper: {
        '~src/(.*)': '<rootDir>/src/$1',
        '~test/(.*)': '<rootDir>/test/$1',
        '~mock': '<rootDir>/test/mock/index.ts',
        '~mock/(.*)': '<rootDir>/test/mock/$1',
    },
    globals: {
        'ts-jest': {
            tsConfig: 'test/tsconfig.json',
        },
    },
}
