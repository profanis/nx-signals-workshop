import nx from '@nx/eslint-plugin';

export default [
  ...nx.configs['flat/base'],
  ...nx.configs['flat/typescript'],
  ...nx.configs['flat/javascript'],
  {
    ignores: ['**/dist'],
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: ['^.*/eslint(\\.base)?\\.config\\.[cm]?[jt]s$'],
          depConstraints: [
            {
              sourceTag: '*',
              onlyDependOnLibsWithTags: ['*'],
            },
            {
              "sourceTag": "type:feature",
              "onlyDependOnLibsWithTags": [
                "type:ui",
                "type:util",
                "type:model",
                "type:feature",
                "type:data-access"
              ]
            },
            {
              "sourceTag": "type:data-access",
              "onlyDependOnLibsWithTags": [
                "type:util",
                "type:model",
                "type:data-access"
              ]
            },
            {
              "sourceTag": "type:model",
              "onlyDependOnLibsWithTags": ["type:model"]
            },
            {
              "sourceTag": "type:ui",
              "onlyDependOnLibsWithTags": [
                "type:model",
                "type:util",
                "type:ui",
              ]
            },
            {
              "sourceTag": "scope:catalogue",
              "onlyDependOnLibsWithTags": ["scope:catalogue", "scope:shared"]
            },
            {
              "sourceTag": "scope:shared",
              "onlyDependOnLibsWithTags": ["scope:shared"]
            },
          ],
        },
      ],
    },
  },
  {
    files: [
      '**/*.ts',
      '**/*.tsx',
      '**/*.cts',
      '**/*.mts',
      '**/*.js',
      '**/*.jsx',
      '**/*.cjs',
      '**/*.mjs',
    ],
    // Override or add rules here
    rules: {},
  },
];
