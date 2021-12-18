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
        let opts = vm.$options;

        if(!opts.render){
            let template;
            if(!opts.template && el) {
                template = el.outerHTML;
            }else{
                if(el) {
                    template = el.template;
                }
            }
            if(template && el) {
                const render = compilerToFunction(template);
                opts.render = render;
            }
        }
        mountComponent(vm, el);
    }

}