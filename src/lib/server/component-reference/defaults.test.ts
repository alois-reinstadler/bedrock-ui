import { describe, expect, it } from 'vitest';
import ts from 'typescript';
import { collectPropDefaults } from '../../../../scripts/component-prop-defaults.mjs';

function source(code: string) {
	const ast = ts.createSourceFile('fixture.ts', code, ts.ScriptTarget.Latest, true);
	const statement = ast.statements[0] as ts.VariableStatement;
	return { ast, declaration: statement.declarationList.declarations[0] };
}

describe('public component binding contracts', () => {
	const primitive = source('let { value = $bindable(1), ref = $bindable(null) } = $props();');
	it('inherits defaults without advertising inaccessible bindings', () => {
		const wrapper = source('let props = $props();');
		const defaults = collectPropDefaults([wrapper, primitive]);
		expect(defaults.get('value')).toEqual({ default: '1', bindable: false });
		expect(defaults.get('ref')).toEqual({ default: 'null', bindable: false });
	});
	it('exposes only explicitly declared public bindings, including aliases', () => {
		const wrapper = source('let { value = $bindable(), ref: element = null } = $props();');
		const defaults = collectPropDefaults([wrapper, primitive]);
		expect(defaults.get('value')).toEqual({ default: undefined, bindable: true });
		expect(defaults.get('ref')).toEqual({ default: 'null', bindable: false });
	});
});
