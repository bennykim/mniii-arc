module.exports = {
  ci: {
    collect: {
      staticDistDir: './dist',
      numberOfRuns: 3,
    },
    upload: {
      target: 'temporary-public-storage',
    },
    assert: {
      assertions: {
        'categories:performance': ['warn', {minScore: 0.8}],
        'categories:accessibility': ['error', {minScore: 0.9}],
        'first-contentful-paint': ['warn', {maxNumericValue: 2000}],
        'interactive': ['error', {maxNumericValue: 3500}],
      },
    },
  },
};