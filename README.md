# tslint-oursky

This is a tslint config that does 2 things.

1. Include opinionated non-stylistic rules that prevent you from making mistakes.
2. Include some custom useful rules.

## Rule version

The included rules are as of tslint@v5.11.0

## Example

```json
{
  "extends": [
    "@oursky/tslint-oursky"
  ],
  "rules": {
    "oursky-ban-imports": [true, ["react-native", ["Text", "Image"]]]
  }
}
```

## Custom rules

### oursky-ban-imports

This rule allows you to ban named imports from specific modules.

This rule is not enabled by default because we do not know what you
want to ban.

For example,

```
"oursky-ban-imports": [true,
  ["react-native", ["Text", "Image"]],
  ["react", ["Component"]]
]
```

The above configuration bans `Text` and `Image` from `react-native`,
`Component` from `react`.

### oursky-no-inline-function-children

This rule disallows inline function as JSX children.

This rule is enabled by default.
