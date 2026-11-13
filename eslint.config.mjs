import pluginQuery from '@tanstack/eslint-plugin-query';
import nextVitals from 'eslint-config-next/core-web-vitals';
import prettier from 'eslint-config-prettier/flat';
import boundaries from 'eslint-plugin-boundaries';
import tseslint from 'typescript-eslint';

const element = (type, extra = {}) => ({ element: { type, ...extra } });

/**
 * Architecture rules. See docs/architecture.md.
 *   app        routes only, composes features
 *   feature    one business capability, imported from outside only through its index.ts
 *   shared     reusable code with no knowledge of features
 */
const architecture = {
  files: ['src/**/*.{ts,tsx}'],
  plugins: { boundaries },
  settings: {
    'boundaries/include': ['src/**/*'],
    'boundaries/elements': [
      { type: 'app', pattern: 'src/app' },
      { type: 'feature', pattern: 'src/features/*', capture: ['featureName'] },
      { type: 'shared', pattern: 'src/shared' },
      { type: 'providers', pattern: 'src/providers' },
      { type: 'i18n', pattern: 'src/i18n' },
      { type: 'mocks', pattern: 'src/mocks' },
      { type: 'observability', pattern: 'src/observability' },
    ],
  },
  rules: {
    'boundaries/dependencies': [
      'error',
      {
        default: 'disallow',
        policies: [
          // Any element may use its own files.
          { allow: { dependency: { relationship: { to: 'internal' } } } },
          {
            from: element('app'),
            allow: {
              to: [
                element('feature', { fileInternalPath: 'index.ts' }),
                element('shared'),
                element('providers'),
                element('i18n'),
                element('observability'),
              ],
            },
          },
          {
            from: element('feature'),
            allow: {
              to: [
                element('feature', { fileInternalPath: 'index.ts' }),
                element('shared'),
                element('i18n'),
              ],
            },
          },
          { from: element('shared'), allow: { to: [element('i18n')] } },
          {
            from: element('providers'),
            allow: { to: [element('shared'), element('i18n'), element('mocks')] },
          },
          {
            from: element('mocks'),
            allow: {
              to: [element('feature', { fileInternalPath: 'mocks/**' }), element('shared')],
            },
          },
        ],
      },
    ],
  },
};

/** Files directly in src/ (env, proxy, instrumentation) stay independent of app code. */
const rootFiles = {
  files: ['src/*.ts'],
  rules: {
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: ['@/app/*', '@/features/*', '@/shared/*', '@/providers/*'],
            message: 'Files in src/ root must not depend on app, features, shared or providers.',
          },
        ],
      },
    ],
  },
};

export default tseslint.config(
  {
    ignores: [
      '.next/**',
      'node_modules/**',
      'coverage/**',
      'playwright-report/**',
      'test-results/**',
      'public/**',
      'next-env.d.ts',
      'src/shared/ui/**',
    ],
  },

  ...nextVitals,

  {
    files: ['**/*.{ts,tsx,mts}'],
    extends: [tseslint.configs.strictTypeChecked, tseslint.configs.stylisticTypeChecked],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],
      '@typescript-eslint/no-misused-promises': [
        'error',
        { checksVoidReturn: { attributes: false } },
      ],
      '@typescript-eslint/no-confusing-void-expression': ['error', { ignoreArrowShorthand: true }],
      '@typescript-eslint/restrict-template-expressions': [
        'error',
        { allowNumber: true, allowBoolean: true },
      ],
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'variable',
          types: ['boolean'],
          format: ['PascalCase'],
          prefix: ['is', 'has', 'can', 'should', 'will', 'did', 'was'],
        },
      ],
    },
  },

  {
    files: ['src/**/*.{ts,tsx}'],
    plugins: { '@tanstack/query': pluginQuery },
    rules: {
      ...pluginQuery.configs['flat/recommended'][0].rules,
      'no-console': ['error', { allow: ['warn', 'error'] }],
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: 'next/link',
              message: 'Use Link from @/i18n/navigation so links keep the current locale.',
            },
            {
              name: 'next/navigation',
              importNames: ['redirect', 'permanentRedirect', 'useRouter', 'usePathname'],
              message: 'Use the locale-aware versions from @/i18n/navigation.',
            },
          ],
        },
      ],
      'no-restricted-syntax': [
        'error',
        {
          selector:
            "MemberExpression[object.name='process'][property.name='env']:not([parent.property.name='NODE_ENV'])",
          message: 'Read environment variables through @/env so they are validated.',
        },
      ],
    },
  },

  {
    files: [
      'src/env.ts',
      'src/i18n/navigation.ts',
      'src/observability/**',
      'src/instrumentation*.ts',
    ],
    rules: {
      'no-restricted-imports': 'off',
      'no-restricted-syntax': 'off',
    },
  },

  architecture,

  rootFiles,

  {
    files: ['**/*.test.{ts,tsx}', 'tests/**/*.{ts,tsx}'],
    rules: {
      'boundaries/dependencies': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-unnecessary-condition': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-deprecated': 'off',
      '@typescript-eslint/unbound-method': 'off',
    },
  },

  {
    files: ['**/*.{js,mjs,cjs}'],
    extends: [tseslint.configs.disableTypeChecked],
  },

  prettier,
);
