import * as ts from "typescript";
import * as Lint from "tslint";

interface Option {
  moduleName: string;
  bindings: string[];
}

export class Rule extends Lint.Rules.AbstractRule {
  public static FAILURE_STRING_FACTORY(
    moduleName: string,
    bindingName: string
  ) {
    return `Importing ${bindingName} from ${moduleName} is banned`;
  }

  public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    return this.applyWithFunction(
      sourceFile,
      walk,
      this.ruleArguments.map(parseOption)
    );
  }
}

function parseOption([moduleName, bindings]: [string, [string]]): Option {
  return {
    moduleName,
    bindings,
  };
}

function walk(ctx: Lint.WalkContext<Option[]>) {
  const optionByModuleName: {
    [key: string]: Option | undefined;
  } = ctx.options.reduce((acc, val) => {
    return {
      ...acc,
      [val.moduleName]: val,
    };
  }, {});

  return ts.forEachChild(ctx.sourceFile, function cb(node: ts.Node): void {
    if (isImportDeclaration(node)) {
      const { moduleSpecifier, importClause } = node;
      if (ts.isStringLiteral(moduleSpecifier) && importClause != null) {
        const modulePath = moduleSpecifier.text;
        const { namedBindings } = importClause;
        const option = optionByModuleName[modulePath];
        if (
          option != null &&
          namedBindings != null &&
          namedBindings.kind === ts.SyntaxKind.NamedImports
        ) {
          const { elements } = namedBindings;
          for (const e of elements) {
            let importedName = "";
            if (e.propertyName != null) {
              // For case of
              // import { a as b } from "m";
              importedName = e.propertyName.escapedText as string;
            } else {
              // For case of
              // import { a } from "m";
              importedName = e.name.escapedText as string;
            }

            const idx = option.bindings.indexOf(importedName);
            if (idx >= 0) {
              ctx.addFailureAtNode(
                e,
                Rule.FAILURE_STRING_FACTORY(modulePath, importedName)
              );
            }
          }
        }
      }
    }
    return ts.forEachChild(node, cb);
  });
}

function isImportDeclaration(node: ts.Node): node is ts.ImportDeclaration {
  return node.kind === ts.SyntaxKind.ImportDeclaration;
}
