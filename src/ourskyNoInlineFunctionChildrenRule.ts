import * as Lint from "tslint";
import * as ts from "typescript";

export class Rule extends Lint.Rules.AbstractRule {
  public static FAILURE_STRING = "No inline function children";

  public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    return this.applyWithFunction(sourceFile, walk);
  }
}

function walk(ctx: Lint.WalkContext<void>) {
  return ts.forEachChild(ctx.sourceFile, function cb(node: ts.Node): void {
    if (isJsxElement(node)) {
      const { children } = node;
      for (const child of children) {
        if (!isJsxExpression(child)) {
          continue;
        }
        const { expression } = child;
        if (expression !== undefined && isInlineFunction(expression)) {
          ctx.addFailureAtNode(child, Rule.FAILURE_STRING);
        }
      }
    }
    return ts.forEachChild(node, cb);
  });
}

function isJsxElement(node: ts.Node): node is ts.JsxElement {
  return node.kind === ts.SyntaxKind.JsxElement;
}

function isJsxExpression(node: ts.Node): node is ts.JsxExpression {
  return node.kind === ts.SyntaxKind.JsxExpression;
}

function isInlineFunction(node: ts.Node): boolean {
  switch (node.kind) {
    case ts.SyntaxKind.FunctionExpression:
    case ts.SyntaxKind.ArrowFunction:
      return true;
    case ts.SyntaxKind.ParenthesizedExpression:
      return isInlineFunction((node as ts.ParenthesizedExpression).expression);
    default:
      return false;
  }
}
