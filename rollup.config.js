
import babel from 'rollup-plugin-babel';
import resolve from '@rollup/plugin-node-resolve';

export default {
    input: './src/index.js',  // 入口
    output: { // 出口
        file: './dist/vue.js',  //文件名
        format: 'umd',  // esm es6模块 iife自执行函数 umd(umd commonjs)
        name: 'Vue',  //会有一个全局变量 global.Vue
        sourcemap: true,   //调试源码
    },
    plugins:[
        babel({
            exclude: 'node_modules/**'
        }),
        resolve(),
    ]
}