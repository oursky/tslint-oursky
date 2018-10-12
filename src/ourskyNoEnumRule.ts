import * as Lint from "tslint";
import * as ts from "typescript";

export class Rule extends Lint.Rules.AbstractRule {
  public static FAILURE_STRING = "enum is forbidden. Use union type instead.";

  public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    return this.applyWithFunction(sourceFile, walk);
  }
}

function walk(ctx: Lint.WalkContext<void>) {
  return ts.forEachChild(ctx.sourceFile, function cb(node: ts.Node): void {
    if (isEnumDeclaration(node)) {
      ctx.addFailureAtNode(node, Rule.FAILURE_STRING);
    }
    return ts.forEachChild(node, cb);
  });
}

function isEnumDeclaration(node: ts.Node): node is ts.EnumDeclaration {
  return node.kind === ts.SyntaxKind.EnumDeclaration;
}
