import {initMixin} from './init'
import { initLifeCycle } from './lifeCycle';
import { nextTick } from './observe/watcher';
import { initGlobalAPI } from "./gloablAPI";

function Vue(options) {
    this._init(options)
}


Vue.prototype.$nextTick = nextTick
initMixin(Vue)
initLifeCycle(Vue);
initGlobalAPI(Vue)
export default Vue;