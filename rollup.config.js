import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import typescript from '@rollup/plugin-typescript';
import css from 'rollup-plugin-css-only';
import serve from 'rollup-plugin-serve';
import { terser } from 'rollup-plugin-terser';
import workerFactory from 'rollup-plugin-worker-factory';
import pkg from './package.json';


// Demo向けのプラグイン

let pluginsDemoTS = [
	replace({
		'process.env.NODE_ENV': JSON.stringify(process.env.BUILD)
	}),
	typescript({
		outDir: './demo',
		declaration: false,
		sourceMap: process.env.BUILD === 'development'
	}),
	nodeResolve(),
	commonjs()
];

if (process.env.BUILD === 'production') {
	pluginsDemoTS.push(terser());
}

let pluginsDemo = [
	...pluginsDemoTS,
	workerFactory({
		plugins: [...pluginsDemoTS],
		type: 'browser'
	}),
	css({
		output: 'style.css'
	})
];

if (process.env.BUILD === 'production') {
	pluginsDemo.push(terser());
}

if (process.env.BUILD === 'development') {
	pluginsDemo.push(serve({
		contentBase: ['./demo', './'],
		port: 10001,
	}));
}

// モジュール向けのプラグイン

const generatePluginsModuleTS = (format) => {
	return [
		typescript({
			outDir: './' + format,
			declaration: true,
		})
	];
}

// デモ向けの設定

const generateConfigDemo = (input) => {
	return {
		input,
		output: {
			dir: './demo',
			format: 'umd',
			name: 'm13pwgen',
			sourcemap: process.env.BUILD === 'development'
		},
		plugins: pluginsDemo
	}
}

// モジュール向けの設定

const generateConfigModule = (input, format) => {
	return {
		input,
		output: {
			dir: './' + format,
			format,
			sourcemap: false
		},
		plugins: [
			...generatePluginsModuleTS(format),
			workerFactory({
				plugins: [...generatePluginsModuleTS(format), terser()]
			}),
			terser()
		],
		external: [
			...Object.keys(pkg.dependencies || {}),
			...Object.keys(pkg.devDependencies || {})
		]
	}
}

let config = [
	generateConfigDemo('./demo-src/m13pwgen.tsx'),
];

if (process.env.BUILD === 'production') {
	config.push(
		generateConfigModule(pkg.entry, 'esm'),
		generateConfigModule(pkg.entry, 'cjs')
	);
}

export default config;
