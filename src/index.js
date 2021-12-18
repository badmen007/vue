import {initMixin} from './init'
import { initLifeCycle } from './lifeCycle';
import Watcher, { nextTick } from './observe/watcher';
import { initGlobalAPI } from "./gloablAPI";

function Vue(options) {
    this._init(options)
}


Vue.prototype.$nextTick = nextTick
initMixin(Vue)
initLifeCycle(Vue);
initGlobalAPI(Vue)

Vue.prototype.$watch = function (exprOrFn, cb) {

    new Watcher(this, exprOrFn, {user: true}, cb);
}






export default Vue;