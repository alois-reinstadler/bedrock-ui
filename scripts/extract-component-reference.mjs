import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';

const root = process.cwd();
const files = fs
	.readdirSync('src/lib', { recursive: true })
	.filter((file) => /\.(svelte|ts)$/.test(file))
	.map((file) => path.resolve('src/lib', file));
const virtual = new Map();
const props = new Map();
for (const file of files.filter((file) => file.endsWith('.svelte'))) {
	const source = fs.readFileSync(file, 'utf8');
	let script = [...source.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)]
		.map((match) => match[1])
		.join('\n');
	const ast = ts.createSourceFile(file + '.ts', script, ts.ScriptTarget.Latest, true);
	let declaration;
	function visit(node) {
		if (ts.isVariableDeclaration(node) && node.initializer?.getText(ast) === '$props()')
			declaration = node;
		ts.forEachChild(node, visit);
	}
	visit(ast);
	if (declaration?.type) {
		const annotation = declaration.type.getText(ast);
		script += `\ntype __PublicProps = ${annotation};\nexport default {} as import('svelte').Component<__PublicProps>;`;
		props.set(file, { declaration, ast, source });
	}
	virtual.set(file + '.ts', script);
}
const options = {
	target: ts.ScriptTarget.ESNext,
	module: ts.ModuleKind.ESNext,
	moduleResolution: ts.ModuleResolutionKind.Bundler,
	strict: true,
	skipLibCheck: true,
	allowJs: true,
	allowImportingTsExtensions: true
};
const host = ts.createCompilerHost(options);
const read = host.readFile.bind(host),
	exists = host.fileExists.bind(host);
host.fileExists = (file) => virtual.has(file) || exists(file);
host.readFile = (file) => virtual.get(file) ?? read(file);
host.getSourceFile = (file, languageVersion) => {
	const content = host.readFile(file);
	return content === undefined
		? undefined
		: ts.createSourceFile(file, content, languageVersion, true);
};
host.resolveModuleNames = (names, containing) =>
	names.map((name) => {
		let target = name;
		if (name.startsWith('#lib/')) target = path.resolve(root, 'src/lib', name.slice(5));
		if (name.startsWith('#lib/components/ui/'))
			target = path.resolve(root, 'src/lib/shadcn/ui', name.slice(19));
		if (name === '#lib/utils.js') target = path.resolve(root, 'src/lib/shadcn/utils.ts');
		if (name.startsWith('$lib/')) target = path.resolve(root, 'src/lib', name.slice(5));
		if (target.endsWith('.svelte')) {
			const file = path.resolve(path.dirname(containing), target) + '.ts';
			if (virtual.has(file)) return { resolvedFileName: file, extension: ts.Extension.Ts };
		}
		return ts.resolveModuleName(target, containing, options, host).resolvedModule;
	});
const program = ts.createProgram(
	[...virtual.keys(), ...files.filter((file) => file.endsWith('.ts'))],
	options,
	host
);
const checker = program.getTypeChecker();
const output = {};
const sourcePath = (file) =>
	path
		.relative(root, file)
		.replace(/\.svelte\.ts$/, '.svelte')
		.replace(/^.*node_modules\/(?!\.pnpm)(.*)$/, 'node_modules/$1');
function sourceUrl(file) {
	const relative = sourcePath(file);
	if (!relative.startsWith('node_modules/')) return undefined;
	const segments = relative.slice(13).split('/');
	const packageName = segments[0].startsWith('@')
		? segments.splice(0, 2).join('/')
		: segments.shift();
	try {
		const manifest = JSON.parse(
			fs.readFileSync(path.resolve('node_modules', packageName, 'package.json'), 'utf8')
		);
		return `https://unpkg.com/${packageName}@${manifest.version}/${segments.join('/')}`;
	} catch {
		return undefined;
	}
}
for (const directory of fs.readdirSync('src/lib/bedrock/ui')) {
	const index = program.getSourceFile(path.resolve('src/lib/bedrock/ui', directory, 'index.ts'));
	if (!index) continue;
	const module = checker.getSymbolAtLocation(index);
	if (!module) continue;
	const parts = [];
	for (const symbol of checker.getExportsOfModule(module)) {
		const resolved =
			symbol.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(symbol) : symbol;
		const declaration = resolved.declarations?.[0];
		if (!declaration) continue;
		if (!ts.isExportAssignment(declaration)) {
			if (!(resolved.flags & ts.SymbolFlags.Value) || !/^[A-Z]/.test(symbol.name)) continue;
			const exportedType = checker.getTypeOfSymbolAtLocation(resolved, declaration);
			const signature = exportedType.getCallSignatures()[0];
			if (!signature || signature.parameters.length < 2) continue;
			const contract = checker.getTypeOfSymbolAtLocation(signature.parameters[1], declaration);
			const source = `${sourcePath(declaration.getSourceFile().fileName)}#${resolved.name}`;
			const previous = parts.find((part) => part.source === source);
			if (previous) {
				previous.aliases.push(symbol.name);
				continue;
			}
			const entries = checker.getPropertiesOfType(contract).map((property) => ({
				name: property.name,
				kind: 'prop',
				type: checker.typeToString(
					checker.getTypeOfSymbolAtLocation(property, declaration),
					declaration,
					ts.TypeFormatFlags.NoTruncation
				),
				required: !(property.flags & ts.SymbolFlags.Optional),
				description:
					ts.displayPartsToString(property.getDocumentationComment(checker)) ||
					'External component contract; refer to its installed declaration for constraints and defaults.'
			}));
			parts.push({
				name: symbol.name,
				aliases: [],
				source,
				entries,
				inherited:
					'This component is re-exported directly from an external primitive. Defaults and binding behavior belong to that primitive; they are not invented by Bedrock.'
			});
			continue;
		}
		const file = declaration.getSourceFile().fileName.replace(/\.svelte\.ts$/, '.svelte');
		if (!props.has(file)) continue;
		let part = parts.find((part) => part.source === sourcePath(file));
		if (part) {
			part.aliases.push(symbol.name);
			continue;
		}
		const sf = program.getSourceFile(file + '.ts');
		const alias = sf.statements.find(
			(node) => ts.isTypeAliasDeclaration(node) && node.name.text === '__PublicProps'
		);
		if (!alias) continue;
		const type = checker.getTypeFromTypeNode(alias.type);
		const own = props.get(file);
		const defaults = new Map();
		const sources = [own];
		for (let i = 0; i < sources.length; i++) {
			for (const match of sources[i].source.matchAll(/from ['"](#lib\/[^'"]+\.svelte)['"]/g)) {
				const inherited = props.get(path.resolve('src/lib', match[1].slice(5)));
				if (inherited && !sources.includes(inherited)) sources.push(inherited);
			}
		}
		for (const own of [...sources].reverse())
			if (ts.isObjectBindingPattern(own.declaration.name))
				for (const binding of own.declaration.name.elements) {
					if (binding.dotDotDotToken) continue;
					const name = (binding.propertyName ?? binding.name).getText(own.ast);
					const value = binding.initializer?.getText(own.ast);
					defaults.set(name, {
						default: value?.replace(/^\$bindable\((.*)\)$/, '$1') || undefined,
						bindable: value?.startsWith('$bindable(')
					});
				}
		const entries = [];
		const properties = new Map(
			checker.getPropertiesOfType(type).map((property) => [property.name, property])
		);
		if (type.isUnion())
			for (const branch of type.types)
				for (const property of checker.getPropertiesOfType(branch)) {
					if (!properties.has(property.name)) properties.set(property.name, property);
				}
		for (const property of properties.values()) {
			const name = property.name;
			const declaration = property.declarations?.[0];
			const location = declaration ?? alias;
			const origin = declaration?.getSourceFile().fileName ?? '';
			// Native DOM attributes remain a linked inherited contract, avoiding hundreds of repeated rows per part.
			if (/svelte\/elements\.d\.ts|lib\.dom\.d\.ts/.test(origin) && !defaults.has(name)) continue;
			const value = defaults.get(name) ?? {};
			const propertyType = checker
				.typeToString(
					checker.getTypeOfSymbolAtLocation(property, location),
					alias,
					ts.TypeFormatFlags.NoTruncation
				)
				.replace(/(?:\.\.\/)+node_modules\//g, '')
				.replace(/\.svelte\.ts/g, '.svelte');
			entries.push({
				name,
				kind: value?.bindable
					? 'bindable'
					: /Snippet/.test(propertyType)
						? 'snippet'
						: /^on[A-Z]|^on[a-z]/.test(name)
							? 'event'
							: name === 'ref'
								? 'ref'
								: 'prop',
				type: propertyType,
				...(value?.default ? { default: value.default } : {}),
				required: !(property.flags & ts.SymbolFlags.Optional),
				description:
					ts.displayPartsToString(property.getDocumentationComment(checker)) ||
					`Accepted by ${symbol.name}; constrained by the source TypeScript contract.${propertyType === 'any' && declaration?.type?.getText() !== 'any' ? ' The external type could not be narrowed by extraction; inspect the linked declaration before relying on it.' : ''}`,
				source: sourcePath(origin),
				sourceUrl: sourceUrl(origin)
			});
		}
		for (const match of sources
			.map((item) => item.source)
			.join('\n')
			.matchAll(/\b(data-[\w-]+)=(?:"([^"]*)"|\{([^}]+)\})/g))
			if (!entries.some((entry) => entry.name === match[1]))
				entries.push({
					name: match[1],
					kind: 'data-attribute',
					type: match[2] !== undefined ? JSON.stringify(match[2]) : match[3],
					description: 'Rendered state or styling hook. Do not override primitive-owned state.'
				});
		part = {
			name: symbol.name,
			aliases: [],
			source: sourcePath(file),
			entries,
			inherited:
				'Native attributes, ARIA attributes and DOM handlers are inherited only where the source type includes them. Consult the linked Svelte element contract; primitive-specific properties are expanded above.'
		};
		if (!entries.length)
			part.inherited =
				'This external or generic contract could not be fully expanded by the TypeScript checker. Read the source contract before use; no common props are assumed.';
		parts.push(part);
	}
	output[directory] = parts;
}
fs.writeFileSync(
	'src/lib/server/component-reference/generated.json',
	JSON.stringify(output, null, 2) + '\n'
);
console.log(
	`Extracted ${Object.keys(output).length} families, ${Object.values(output).flat().length} parts, ${Object.values(
		output
	)
		.flat()
		.reduce((sum, part) => sum + part.entries.length, 0)} entries.`
);
