import json from 'rollup-plugin-json';
import node from 'rollup-plugin-node-resolve';
import sourcemaps from 'rollup-plugin-sourcemaps';


export default {
    input: 'visual/require.js',
    output: {
        file: 'site/assets/d3-require.js',
        format: 'umd',
        sourcemap: true,
        extend: true,
        name: 'd3'
    },
    plugins: [
        json(),
        node(),
        sourcemaps()
    ]
};
