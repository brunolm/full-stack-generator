export const patchPackage = (packageJson: any) => {
  const prettierHook = {
    husky: {
      hooks: {
        'pre-commit': 'lint-staged',
      },
    },
    'lint-staged': {
      '*.{ts,tsx,scss,md,css,json,yml}': ['prettier --write', 'git add'],
    },
  }

  return {
    ...packageJson,
    ...prettierHook,
  }
}
