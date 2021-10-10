import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import typescript from '@rollup/plugin-typescript';
import css from 'rollup-plugin-css-only';
import serve from 'rollup-plugin-serve';

const generateConfigDemo = (input, outputDir, enableServe) => {
	let config = {
		input,
		output: {
			dir: outputDir,
			format: 'umd',
			name: 'm13pwgen',
			sourcemap: true,
		},
		plugins: [
			replace({
				'process.env.NODE_ENV': JSON.stringify(process.env.BUILD),
			}),
			typescript({
				outDir: outputDir,
				declaration: false,
				sourceMap: true,
			}),
			nodeResolve(),
			commonjs(),
			css({
				output: 'style.css'
			}),
		],
	};
	if (enableServe) {
		config.plugins.push(serve({
			contentBase: ['./demo', './'],
			port: 10001,
		}));
	}
	return config;
}

let config = [
	generateConfigDemo('./demo-src/m13pwgen.tsx', './demo', true),
	generateConfigDemo('./src/worker-generatePw/index.ts', './demo/worker-generatePw', true),
];

export default config;
