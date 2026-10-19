import ts from 'typescript';

/**
 * Sources are ordered public component first, then its local primitives.
 * Defaults can flow through a wrapper; binding capability cannot.
 * @param {{ declaration: import('typescript').VariableDeclaration, ast: import('typescript').SourceFile }[]} sources
 */
export function collectPropDefaults(sources) {
	const defaults = new Map();
	for (const source of [...sources].reverse()) {
		if (!ts.isObjectBindingPattern(source.declaration.name)) continue;
		for (const binding of source.declaration.name.elements) {
			if (binding.dotDotDotToken) continue;
			const name = (binding.propertyName ?? binding.name).getText(source.ast);
			const value = binding.initializer?.getText(source.ast);
			defaults.set(name, {
				default: value?.replace(/^\$bindable\((.*)\)$/, '$1') || undefined,
				bindable: source === sources[0] && !!value?.startsWith('$bindable(')
			});
		}
	}
	return defaults;
}
