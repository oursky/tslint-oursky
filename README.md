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

### oursky-no-enum

This rule disallows the usage of enum.

The rationale of banning enum is that enum is not a EMCAScript language feature.
If you use this in your library, you need to be aware of what it compiles to and tell that to the users of your library.
Instead of using enum, use union type to represent an enumeration.
If you enable the strictest compiler options and use union type,
you can have exhaustive switch statement.

[Example Playground](https://www.typescriptlang.org/play/index.html#src=type%20Color%20%3D%20%22red%22%20%7C%20%22blue%22%20%7C%20%22green%22%3B%0D%0A%0D%0A%0D%0Afunction%20foobar(c%3A%20Color)%3A%20string%20%7B%0D%0A%20%20%20%20switch%20(c)%20%7B%0D%0A%20%20%20%20%20%20%20%20case%20%22red%22%3A%0D%0A%20%20%20%20%20%20%20%20%20%20%20%20return%20c%3B%0D%0A%20%20%20%20%20%20%20%20case%20%22blue%22%3A%0D%0A%20%20%20%20%20%20%20%20%20%20%20%20return%20c%3B%0D%0A%20%20%20%20%20%20%20%20%2F%2F%20case%20%22green%22%3A%0D%0A%20%20%20%20%20%20%20%20%2F%2F%20%20%20%20%20return%20c%3B%0D%0A%20%20%20%20%7D%0D%0A%7D%0D%0A%0D%0A)

You have to manually enable strictness options because the link does not remember selected options.

This rule is enabled by default.
