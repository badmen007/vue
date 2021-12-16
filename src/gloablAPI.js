

import {mergeOptions} from './utils'
export function initGlobalAPI(Vue) {

    Vue.options = {};
    Vue.mixin = function mixin(mixin) {
        this.options = mergeOptions(this.options, mixin); // 就是属性的合并
        return this;
    }
}