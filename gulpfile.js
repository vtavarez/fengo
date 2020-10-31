const { rollup } = require('rollup');
const { terser } = require('rollup-plugin-terser');
const { babel } = require('@rollup/plugin-babel');
const { nodeResolve } = require('@rollup/plugin-node-resolve');
const path = require('path');
const commonjs = require('@rollup/plugin-commonjs');
const postcss = require('rollup-plugin-postcss');
const autoprefixer = require('autoprefixer');
const themeKit = require('@shopify/themekit');

exports.build = async function () {
    const bundle = await rollup({
        input: 'src/main.js',
        plugins: [
            nodeResolve(),
            commonjs(),
            postcss({
                extract: path.resolve('assets/theme.css.liquid'),
                minimize: true,
                plugins: [
                    autoprefixer()
                ]
            }),
            babel({
                babelHelpers: 'bundled'
            }),
            terser()
        ],
        external: ['vue']
    });

    return bundle.write({
        file: 'assets/theme.js',
        format: 'iife',
        name: 'theme',
        globals: {
            'vue' : 'Vue'
        }
    })
}

exports.deploy = function () {
    return themeKit.command('deploy', {
        env: 'development'
    })
}