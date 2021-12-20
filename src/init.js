import { compilerToFunction } from "./compiler";
import { callHook, mountComponent } from "./lifeCycle";
import { initState } from "./state";
import { mergeOptions } from "./utils";


export function initMixin(Vue) {
    
    Vue.prototype._init = function(options) {
        const vm = this;

        // 全局的指令都会挂载到实例上
        vm.$options = mergeOptions(this.constructor.options, options);

        callHook(vm, 'beforeCreate')
        initState(vm);
        callHook(vm, 'created')

        if(options.el) {
            vm.$mount(options.el);
        }

    }

    Vue.prototype.$mount = function (el) {
        const vm = this;
        el = document.querySelector(el);
        let ops = vm.$options
        if (!ops.render) { // 先进行查找有没有render函数 
            let template; // 没有render看一下是否写了tempate, 没写template采用外部的template
            if (!ops.template && el) { // 没有写模板 但是写了el
                template = el.outerHTML
            }else{
                template = ops.template // 如果有el 则采用模板的内容
            }
            // 写了temlate 就用 写了的template
            if(template){ // 只要有模板就挂载
                // 这里需要对模板进行编译 
                const render = compilerToFunction(template);
                ops.render = render; // jsx 最终会被编译成h('xxx')
            }
        }
        mountComponent(vm,el); // 组件的挂载  
         // 最终就可以获取render方法
        // script 标签引用的vue.global.js 这个编译过程是在浏览器运行的
        // runtime是不包含模板编译的, 整个编译是打包的时候通过loader来转义.vue文件的, 用runtime的时候不能使用template
    }

}