import json from 'rollup-plugin-json';
import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import node from 'rollup-plugin-node-resolve';
import sourcemaps from 'rollup-plugin-sourcemaps';

const pkg = require('../package.json');
const external = Object.keys(pkg.dependencies).filter(name => name.substring(0, 3) === 'd3-');
const commonPath = [
    'node_modules/**',
    '../d3-visualize/node_modules/**',
    '../d3-view/node_modules/**'
];


export default {
    input: 'visual/index.js',
    external: external,
    output: {
        file: 'site/assets/visual.js',
        format: 'umd',
        name: 'd3',
        sourcemap: true,
        extend: true,
        globals: external.reduce((g, name) => {g[name] = 'd3'; return g;}, {})
    },
    plugins: [
        json(),
        node(),
        babel({
            babelrc: false,
            runtimeHelpers: true,
            presets: ['es2015-rollup']
        }),
        commonjs({include: commonPath}),
        sourcemaps()
    ]
};
