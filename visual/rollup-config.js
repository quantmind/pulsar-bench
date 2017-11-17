import json from 'rollup-plugin-json';
import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import node from 'rollup-plugin-node-resolve';
import sourcemaps from 'rollup-plugin-sourcemaps';

const resolveVisualize = true;
const externalRequires = new Set(['handlebars']);
const externalResolve = new Set(['d3-view', 'd3-visualize']);

const commonPath = ['node_modules/**'];
const logger = require('console');
const pkg = require('../../package.json');
const external = Object.keys(pkg.dependencies).filter(name => {
    return !externalResolve.has(name) && (name.substring(0, 3) === 'd3-' || externalRequires.has(name));
});

if (resolveVisualize) {
    commonPath.push('../d3-visualize/node_modules/**');
    commonPath.push('../d3-view/node_modules/**');
}


export default {
    input: 'visual/index.js',
    external: external,
    output: {
        file: 'visual/visual.js',
        format: 'umd',
        name: 'd3',
        sourcemap: true,
        extend: true,
        globals: external.reduce((g, name) => {g[name] = name.substring(0, 3) === 'd3-' ? 'd3' : name; return g;}, {})
    },
    plugins: [
        json(),
        node(),
        commonjs({include: commonPath}),
        sourcemaps()
    ]
};
