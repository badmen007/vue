import { compilerToFunction } from "./compiler";
import { mountComponent } from "./lifeCycle";
import { initState } from "./state";


export function initMixin(Vue) {
    
    Vue.prototype._init = function(options) {
        const vm = this;
        vm.$options = options;

        initState(vm);

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