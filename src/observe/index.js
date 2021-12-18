import { newArrayProto } from "./array";
import Dep from "./dep";

class Observer{
    constructor(data) {

        //给数组对象中都增加dep
        this.dep = new Dep();


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

// 解决的是数组中套数组的情况  深层次递归 递归多了 性能比较差 不存在的属性检测不到 存在的属性要重写方法 反正没好 vue3-> proxy
function dependArray(value) {
    for(let i = 0; i < value.length; i++) {
        let current = value[i];
        current.__ob__ && current.__ob__.dep.depend();
        if(Array.isArray(current)) {
            dependArray(current);
        }
    }
}


function defineReactive(data,key,value) {
    //依赖收集
    let childOb = observe(value);  // 递归保证嵌套层级比较深的话  保证里面的属性能有响应式
    let dep = new Dep();
    Object.defineProperty(data,key, {
        get(){
            if(Dep.target) {
                dep.depend();
                if(childOb){
                    childOb.dep.depend(); // 让数组和对象本身也实现依赖收集
                    
                    if(Array.isArray(value)) {
                        dependArray(value);
                    }
                }
            }
            return value;
        },
        set(newValue) {
            if(value == newValue) return;
            value = newValue;
            observe(newValue);
            dep.notify();
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