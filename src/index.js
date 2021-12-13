import {initMixin} from './init'
import { lifeCycle } from './lifeCycle';

function Vue(options) {
    this._init(options)
}

initMixin(Vue)
lifeCycle(Vue);

export default Vue;