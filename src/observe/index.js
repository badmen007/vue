import { newArrayProto } from "./array";

class Observer{
    constructor(data) {

        Object.defineProperty(data, '__ob__', {
            value: this,
            enumerable: false    // 属性不可枚举
        })

        if(Array.isArray(data)) {
            data.__proto__ = newArrayProto;

            this.observeArray(data);

        }else{
            this.walk(data);
        }
        
    }

    walk(data){
        Object.keys(data).forEach(key => defineReactive(data,key,data[key]))
    }

    observeArray(data) {
        data.forEach(item => observe(item));
    }
}

function defineReactive(data,key,value) {

    observe(value);  // 递归保证嵌套层级比较深的话  保证里面的属性能有响应式

    Object.defineProperty(data,key, {
        get(){
            return value;
        },
        set(newValue) {
            if(value == newValue) return;
            value = newValue;
        }
    })
}

export function observe(data) {

    if(typeof data !== 'object' || data == null) { //只劫持对象
        return;
    }

    if(data.__ob__ instanceof Observer){  // 被劫持了 就不需要再走进去了
        return data.__ob__;
    }

    return new Observer(data)

}