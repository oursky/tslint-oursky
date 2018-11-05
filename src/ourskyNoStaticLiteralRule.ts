import * as Lint from "tslint";
import * as ts from "typescript";

export class Rule extends Lint.Rules.AbstractRule {
  public static FAILURE_STRING = "No static literal";

  public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    return this.applyWithFunction(sourceFile, walk);
  }
}

function walk(ctx: Lint.WalkContext<void>) {
  return ts.forEachChild(ctx.sourceFile, function cb(node: ts.Node): void {
    if (isJsxOpeningLikeElement(node)) {
      const children = isJsxOpeningElement(node)
        ? node.parent.children
        : undefined;
      const { properties } = node.attributes;
      if (children != null) {
        for (const child of children) {
          if (!isJsxExpression(child)) {
            continue;
          }
          const { expression } = child;
          if (expression != null && isStaticLiteral(expression)) {
            ctx.addFailureAtNode(child, Rule.FAILURE_STRING);
          }
        }
      }
      for (const property of properties) {
        if (isJsxAttribute(property)) {
          const { initializer } = property;
          if (
            initializer != null &&
            isJsxExpression(initializer) &&
            initializer.expression != null &&
            isStaticLiteral(initializer.expression)
          ) {
            ctx.addFailureAtNode(property, Rule.FAILURE_STRING);
          }
        } else if (isJsxSpreadAttribute(property)) {
          const { expression } = property;
          if (isStaticLiteral(expression)) {
            ctx.addFailureAtNode(property, Rule.FAILURE_STRING);
          }
        }
      }
    }
    return ts.forEachChild(node, cb);
  });
}

function isStaticLiteral(expression: ts.Expression): boolean {
  if (isParenthesizedExpression(expression)) {
    return isStaticLiteral(expression.expression);
  }
  if (isObjectLiteralExpression(expression)) {
    return isStaticObjectLiteral(expression);
  }
  if (isArrayLiteralExpression(expression)) {
    return isStaticArrayLiteral(expression);
  }
  if (isRegularExpressionLiteral(expression)) {
    return isStaticExpression(expression);
  }
  return false;
}

function isStaticObjectLiteral(
  expression: ts.ObjectLiteralExpression
): boolean {
  const { properties } = expression;
  for (const property of properties) {
    if (isPropertyAssignment(property)) {
      if (!isStaticProperty(property.name, property.initializer)) {
        return false;
      }
    } else if (isSpreadAssignment(property)) {
      if (!isStaticExpression(property.expression)) {
        return false;
      }
    } else {
      return false;
    }
  }
  return true;
}

function isStaticArrayLiteral(expression: ts.ArrayLiteralExpression): boolean {
  const { elements } = expression;
  for (const element of elements) {
    if (!isStaticExpression(element)) {
      return false;
    }
  }
  return true;
}

function isStaticProperty(
  name: ts.PropertyName,
  initializer: ts.Expression
): boolean {
  if (isComputedPropertyName(name)) {
    return (
      isStaticExpression(name.expression) && isStaticExpression(initializer)
    );
  }
  return isStaticExpression(initializer);
}

function isStaticExpression(node: ts.Expression): boolean {
  if (isParenthesizedExpression(node)) {
    return isStaticExpression(node.expression);
  }
  if (
    isNumericLiteral(node) ||
    isStringLiteral(node) ||
    isNoSubstitutionTemplateLiteral(node) ||
    isRegularExpressionLiteral(node)
  ) {
    return true;
  }
  if (isObjectLiteralExpression(node)) {
    return isStaticObjectLiteral(node);
  }
  if (isArrayLiteralExpression(node)) {
    return isStaticArrayLiteral(node);
  }
  return false;
}

// type guards

function isComputedPropertyName(
  node: ts.Node
): node is ts.ComputedPropertyName {
  return node.kind === ts.SyntaxKind.ComputedPropertyName;
}

function isNumericLiteral(node: ts.Node): node is ts.NumericLiteral {
  return node.kind === ts.SyntaxKind.NumericLiteral;
}

function isStringLiteral(node: ts.Node): node is ts.StringLiteral {
  return node.kind === ts.SyntaxKind.StringLiteral;
}

function isNoSubstitutionTemplateLiteral(
  node: ts.Node
): node is ts.NoSubstitutionTemplateLiteral {
  return node.kind === ts.SyntaxKind.NoSubstitutionTemplateLiteral;
}

function isRegularExpressionLiteral(
  node: ts.Node
): node is ts.RegularExpressionLiteral {
  return node.kind === ts.SyntaxKind.RegularExpressionLiteral;
}

function isPropertyAssignment(node: ts.Node): node is ts.PropertyAssignment {
  return node.kind === ts.SyntaxKind.PropertyAssignment;
}

function isSpreadAssignment(node: ts.Node): node is ts.SpreadAssignment {
  return node.kind === ts.SyntaxKind.SpreadAssignment;
}

function isParenthesizedExpression(
  node: ts.Node
): node is ts.ParenthesizedExpression {
  return node.kind === ts.SyntaxKind.ParenthesizedExpression;
}

function isArrayLiteralExpression(
  node: ts.Node
): node is ts.ArrayLiteralExpression {
  return node.kind === ts.SyntaxKind.ArrayLiteralExpression;
}

function isObjectLiteralExpression(
  node: ts.Node
): node is ts.ObjectLiteralExpression {
  return node.kind === ts.SyntaxKind.ObjectLiteralExpression;
}

function isJsxAttribute(node: ts.Node): node is ts.JsxAttribute {
  return node.kind === ts.SyntaxKind.JsxAttribute;
}

function isJsxSpreadAttribute(node: ts.Node): node is ts.JsxSpreadAttribute {
  return node.kind === ts.SyntaxKind.JsxSpreadAttribute;
}

function isJsxOpeningElement(node: ts.Node): node is ts.JsxOpeningElement {
  return node.kind === ts.SyntaxKind.JsxOpeningElement;
}

function isJsxExpression(node: ts.Node): node is ts.JsxExpression {
  return node.kind === ts.SyntaxKind.JsxExpression;
}

function isJsxOpeningLikeElement(
  node: ts.Node
): node is ts.JsxOpeningLikeElement {
  return (
    node.kind === ts.SyntaxKind.JsxSelfClosingElement ||
    node.kind === ts.SyntaxKind.JsxOpeningElement
  );
}
