(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
})(this, (function () { 'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArrayLimit(arr, i) {
    var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];

    if (_i == null) return;
    var _arr = [];
    var _n = true;
    var _d = false;

    var _s, _e;

    try {
      for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  var ncname = "[a-zA-Z_][\\-\\.0-9_a-zA-Z]*";
  var qnameCapture = "((?:".concat(ncname, "\\:)?").concat(ncname, ")");
  var startTagOpen = new RegExp("^<".concat(qnameCapture)); // 他匹配到的分组是一个 标签名  <xxx 匹配到的是开始 标签的名字

  var endTag = new RegExp("^<\\/".concat(qnameCapture, "[^>]*>")); // 匹配的是</xxxx>  最终匹配到的分组就是结束标签的名字

  var attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // 匹配属性
  // 第一个分组就是属性的key value 就是 分组3/分组4/分组五

  var startTagClose = /^\s*(\/?)>/; // <div> <br/>

  function parseHTML(html) {
    //需要组装成一颗树
    var ELEMENT_TYPE = 1;
    var TEXT_TYPE = 3;
    var stack = [];
    var currentParent;
    var root;

    function createASTElement(tag, attrs) {
      return {
        tag: tag,
        type: ELEMENT_TYPE,
        attrs: attrs,
        children: [],
        parent: null
      };
    }

    function start(tag, attrs) {
      var node = createASTElement(tag, attrs);

      if (!root) {
        root = node;
      }

      if (currentParent) {
        // 父亲要记住儿子 儿子也要记住父亲
        node.parent = currentParent;
        currentParent.children.push(node);
      }

      stack.push(node);
      currentParent = node;
    }

    function end(tag) {
      stack.pop();
      currentParent = stack[stack.length - 1];
    }

    function chars(text) {
      text = text.replace(/\s/g, '');
      text && currentParent.children.push({
        type: TEXT_TYPE,
        text: text,
        parent: currentParent
      });
    }

    function advance(n) {
      html = html.substring(n);
    }

    function parseStartTag() {
      var start = html.match(startTagOpen);

      if (start) {
        var match = {
          tagName: start[1],
          attrs: []
        };
        advance(start[0].length);

        var attr, _end;

        while (!(_end = html.match(startTagClose)) && (attr = html.match(attribute))) {
          advance(attr[0].length);
          match.attrs.push({
            name: attr[1],
            value: attr[3] || attr[4] || attr[5]
          });
        }

        if (_end) {
          advance(_end[0].length);
        }

        return match;
      }

      return false;
    }

    while (html) {
      var textEnd = html.indexOf('<');

      if (textEnd === 0) {
        var startTagMatch = parseStartTag();

        if (startTagMatch) {
          start(startTagMatch.tagName, startTagMatch.attrs);
          continue;
        }

        var endTagMatch = html.match(endTag);

        if (endTag) {
          end(endTagMatch[1]);
          advance(endTagMatch[0].length);
          continue;
        }
      }

      if (textEnd > 0) {
        var text = html.substring(0, textEnd);

        if (text) {
          chars(text);
          advance(text.length);
        }
      }
    }

    return root;
  }

  function genProps(attrs) {
    var str = '';

    for (var i = 0; i < attrs.length; i++) {
      var attr = attrs[i];

      if (attr.name === 'style') {
        (function () {
          var obj = {}; //'color:red;background:skyblue'

          attr.value.split(';').forEach(function (item) {
            var _item$split = item.split(':'),
                _item$split2 = _slicedToArray(_item$split, 2),
                key = _item$split2[0],
                value = _item$split2[1];

            obj[key] = value;
          });
          attr.value = obj;
        })();
      }

      str += "".concat(attr.name, ":").concat(JSON.stringify(attr.value), ",");
    }

    return "{".concat(str.slice(0, -1), "}");
  }

  var defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g; // {{ asdsadsa }}  匹配到的内容就是我们表达式的变量

  function gen(node) {
    if (node.type === 1) {
      return codegen(node);
    } else {
      var text = node.text;

      if (!defaultTagRE.test(text)) {
        return "_v(".concat(JSON.stringify(text), ")");
      } else {
        var tokens = [];
        var match;
        defaultTagRE.lastIndex = 0;
        var lastIndex = 0;

        while (match = defaultTagRE.exec(text)) {
          var index = match.index;

          if (index > lastIndex) {
            tokens.push(JSON.stringify(text.slice(lastIndex, index)));
          }

          tokens.push("_s(".concat(match[1].trim(), ")"));
          lastIndex = index + match[0].length;
        }

        if (lastIndex < text.length) {
          tokens.push(JSON.stringify(text.slice(lastIndex)));
        }

        return "_v(".concat(tokens.join('+'), ")");
      }
    }
  }

  function genChildren(children) {
    return children.map(function (child) {
      return gen(child);
    }).join(',');
  }

  function codegen(ast) {
    var children = genChildren(ast.children);
    var code = "_c('".concat(ast.tag, "',").concat(ast.attrs.length > 0 ? genProps(ast.attrs) : 'null').concat(ast.children.length ? ",".concat(children) : '', ")");
    return code;
  }

  function compilerToFunction(template) {
    //将template转化成ast语法树
    var ast = parseHTML(template);
    var code = codegen(ast);
    code = "with(this){return ".concat(code, "}");
    var render = new Function(code); // 根据代码生成render函数
    //  _c('div',{id:'app'},_c('div',{style:{color:'red'}},  _v(_s(vm.name)+'hello'),_c('span',undefined,  _v(_s(age))))

    return render;
  }

  function createElementVNode(vm, tag, data) {
    if (data == null) {
      data = {};
    }

    var key = data.key;

    if (key) {
      delete data.key;
    }

    for (var _len = arguments.length, children = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
      children[_key - 3] = arguments[_key];
    }

    return vnode(vm, tag, key, data, children);
  }
  function createTextVNode(vm, text) {
    return vnode(vm, undefined, undefined, undefined, undefined, text);
  }

  function vnode(vm, tag, key, data, children, text) {
    return {
      vm: vm,
      tag: tag,
      key: key,
      data: data,
      children: children,
      text: text // ....

    };
  }

  function isSameVnode(vnode1, vnode2) {
    return vnode1.tag === vnode2.tag && vnode1.key === vnode2.key;
  }

  var id$1 = 0;

  var Dep = /*#__PURE__*/function () {
    function Dep() {
      _classCallCheck(this, Dep);

      this.id = id$1++;
      this.subs = [];
    }

    _createClass(Dep, [{
      key: "depend",
      value: function depend() {
        Dep.target.addDep(this);
      }
    }, {
      key: "addSub",
      value: function addSub(watcher) {
        this.subs.push(watcher);
      }
    }, {
      key: "notify",
      value: function notify() {
        this.subs.forEach(function (watcher) {
          return watcher.update();
        });
      }
    }]);

    return Dep;
  }();

  Dep.target = null;
  var stack = [];
  function pushTarget(watcher) {
    stack.push(watcher);
    Dep.target = watcher;
  }
  function popTarget() {
    stack.pop();
    Dep.target = stack[stack.length - 1];
  }

  var id = 0;

  var Watcher = /*#__PURE__*/function () {
    function Watcher(vm, exprOrFn, options, cb) {
      _classCallCheck(this, Watcher);

      this.id = id++;
      this.renderWatcher = options;

      if (typeof exprOrFn === 'string') {
        this.getter = function () {
          return vm[exprOrFn];
        };
      } else {
        this.getter = exprOrFn; // getter意味着调用这个函数可以发生取值操作
      }

      this.vm = vm;
      this.cb = cb;
      this.deps = [];
      this.depsId = new Set();
      this.lazy = options.lazy;
      this.dirty = this.lazy;
      this.user = options.user; // 检测是不是用户watcher

      this.value = this.lazy ? undefined : this.get();
    }

    _createClass(Watcher, [{
      key: "evaluate",
      value: function evaluate() {
        this.value = this.get();
        this.dirty = false;
      }
    }, {
      key: "get",
      value: function get() {
        pushTarget(this);
        var value = this.getter.call(this.vm); // 为了保证this的指向

        popTarget();
        return value;
      }
    }, {
      key: "addDep",
      value: function addDep(dep) {
        var id = dep.id;

        if (!this.depsId.has(id)) {
          this.deps.push(dep);
          this.depsId.add(id);
          dep.addSub(this);
        }
      } // 让属性去收集watcher

    }, {
      key: "depend",
      value: function depend() {
        var i = this.deps.length;

        while (i--) {
          this.deps[i].depend();
        }
      }
    }, {
      key: "update",
      value: function update() {
        if (this.lazy) {
          this.dirty = true;
        } else {
          queueWatcher(this); //this.get(); // 重新渲染
        }
      }
    }, {
      key: "run",
      value: function run() {
        var oldValue = this.value;
        var newValue = this.get();

        if (this.user) {
          this.cb.call(this.vm, newValue, oldValue);
        }
      }
    }]);

    return Watcher;
  }();

  function flushScheduleQueue() {
    var flushQueue = queue.slice(0); // 对数组的拷贝

    queue.length = 0;
    pending = true;
    has = {};
    flushQueue.forEach(function (q) {
      return q.run();
    });
  }

  var queue = [];
  var has = {};
  var pending = false;

  function queueWatcher(watcher) {
    var id = watcher.id;

    if (!has[id]) {
      queue.push(watcher);
      has[id] = true; //不管我们update执行多少次，但是最终都只执行一次

      if (!pending) {
        nextTick(flushScheduleQueue);
      }
    }
  }

  function flushCallbacks() {
    var cbs = callbacks.slice(0);
    waiting = false;
    callbacks = [];
    cbs.forEach(function (cb) {
      return cb();
    });
  }

  var timerFunc; // 这里就是做了兼容性的处理

  if (Promise) {
    timerFunc = function timerFunc() {
      Promise.resolve().then(flushCallbacks);
    };
  } else if (MutationObserver) {
    var observer = new MutationObserver(flushCallbacks); // 传入的回调是异步执行的

    var textNode = document.createTextNode(1);
    observer.observe(textNode, {
      characterData: true
    });

    timerFunc = function timerFunc() {
      textNode.textContent = 2;
    };
  } else if (setImmediate) {
    timerFunc = function timerFunc() {
      setImmediate(flushCallbacks);
    };
  } else {
    timerFunc = function timerFunc() {
      setTimeout(flushCallbacks);
    };
  }

  var callbacks = [];
  var waiting = false;
  function nextTick(cb) {
    callbacks.push(cb);

    if (!waiting) {
      timerFunc();
      waiting = true;
    }
  }

  function createElm(vnode) {
    var tag = vnode.tag,
        data = vnode.data,
        children = vnode.children,
        text = vnode.text;

    if (typeof tag === 'string') {
      // 标签
      vnode.el = document.createElement(tag); // 这里将真实节点和虚拟节点对应起来，后续如果修改属性了

      patchProps(vnode.el, {}, data);
      children.forEach(function (child) {
        vnode.el.appendChild(createElm(child));
      });
    } else {
      vnode.el = document.createTextNode(text);
    }

    return vnode.el;
  }
  function patchProps(el) {
    var oldProps = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var props = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    //老的属性中有 新的没有 就要删除老的 老的中有的样式 新的中没有的样式
    var oldStyles = oldProps.style || {};
    var newStyles = props.style || {};

    for (var key in oldStyles) {
      if (!newStyles[key]) {
        el.style[key] = '';
      }
    }

    for (var _key in oldProps) {
      // 老的中有的属性  但是新的中没有属性
      if (!props[_key]) {
        el.removeAttribute(_key);
      }
    }

    for (var _key2 in props) {
      if (_key2 === 'style') {
        // style{color:'red'}
        for (var styleName in props.style) {
          el.style[styleName] = props.style[styleName];
        }
      } else {
        el.setAttribute(_key2, props[_key2]);
      }
    }
  }
  function patch(oldVnode, vnode) {
    // 写的是初渲染流程 判断是不是第一次渲染
    var isRealElement = oldVnode.nodeType;

    if (isRealElement) {
      // 初次渲染的时候  
      var elm = oldVnode; // 获取真实元素

      var parentElm = elm.parentNode; // 拿到父元素

      var newElm = createElm(vnode);
      parentElm.insertBefore(newElm, elm.nextSibling);
      parentElm.removeChild(elm); // 删除老节点

      return newElm;
    } else {
      //1.两个节点不是同一个节点，直接删除老的换上新的
      //2.两个节点是同一个节点(就是tag和key相同)，比较两个节点的属性是否有差异，有的话  就要复用老的节点 将差异的属性更新
      //3.节点比较完成之后 就要比较儿子了
      return patchVnode(oldVnode, vnode);
    }
  }
  /**
   * 
   * @param {*} oldVnode 
   * @param {*} vnode 
   */

  function patchVnode(oldVnode, vnode) {
    if (!isSameVnode(oldVnode, vnode)) {
      // key===key tag === tag
      console.log(oldVnode.data, vnode.data);

      var _el = createElm(vnode);

      oldVnode.el.parentNode.replaceChild(_el, oldVnode.el);
      return _el;
    } //文本节点


    var el = vnode.el = oldVnode.el; // 复用老的节点  这行代码很好

    if (!oldVnode.tag) {
      if (oldVnode.text !== vnode.text) {
        el.textContent = vnode.text; // 用新的文本覆盖调老的文本
      }
    }

    patchProps(el, oldVnode.data, vnode.data); // 比较儿子了

    var oldChildren = oldVnode.children || [];
    var newChildren = vnode.children || [];

    if (oldChildren.length > 0 && newChildren.length > 0) {
      // 完整的diff算法
      updateChildren(el, oldChildren, newChildren);
    } else if (oldChildren.length > 0) {
      // 新的中没有 老的中有  要删除
      el.innerHTML = '';
    } else if (newChildren.length > 0) {
      // 老的中没有但是新的中有
      mountChildren(el, newChildren);
    }

    return el;
  }
  /**
   * 循环生成真实dom
   * @param {*} el 
   * @param {*} newChildren 
   */


  function mountChildren(el, newChildren) {
    for (var i = 0; i < newChildren.length; i++) {
      var child = newChildren[i];
      el.appendChild(createElm(child));
    }
  }

  function updateChildren(el, oldChildren, newChildren) {
    // 我们操作列表 经常会是有  push shift pop unshift reverse sort这些方法  （针对这些情况做一个优化）
    // vue2中采用双指针的方式 比较两个节点
    var oldStartIndex = 0;
    var newStartIndex = 0;
    var oldEndIndex = oldChildren.length - 1;
    var newEndIndex = newChildren.length - 1;
    var oldStartVnode = oldChildren[0];
    var newStartVnode = newChildren[0];
    var oldEndVnode = oldChildren[oldEndIndex];
    var newEndVnode = newChildren[newEndIndex];

    function makeIndexByKey(children) {
      var map = {};
      children.forEach(function (child, index) {
        map[child.key] = index;
      });
      return map;
    }

    var map = makeIndexByKey(oldChildren); // 循环的时候为什么要+key

    while (oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
      // 有任何一个不满足则停止  || 有一个为true 就继续走
      // 双方有一方头指针，大于尾部指针则停止循环
      if (!oldStartVnode) {
        oldStartVnode = oldChildren[++oldStartIndex];
      } else if (!oldEndVnode) {
        oldEndVnode = oldChildren[--oldEndIndex];
      } else if (isSameVnode(oldStartVnode, newStartVnode)) {
        patchVnode(oldStartVnode, newStartVnode); // 如果是相同节点 则递归比较子节点

        oldStartVnode = oldChildren[++oldStartIndex];
        newStartVnode = newChildren[++newStartIndex]; // 比较开头节点
      } else if (isSameVnode(oldEndVnode, newEndVnode)) {
        patchVnode(oldEndVnode, newEndVnode); // 如果是相同节点 则递归比较子节点

        oldEndVnode = oldChildren[--oldEndIndex];
        newEndVnode = newChildren[--newEndIndex]; // 比较开头节点
      } else if (isSameVnode(oldEndVnode, newStartVnode)) {
        patchVnode(oldEndVnode, newStartVnode); // insertBefore 具备移动性 会将原来的元素移动走

        el.insertBefore(oldEndVnode.el, oldStartVnode.el); // 将老的尾巴移动到老的前面去

        oldEndVnode = oldChildren[--oldEndIndex];
        newStartVnode = newChildren[++newStartIndex];
      } else if (isSameVnode(oldStartVnode, newEndVnode)) {
        patchVnode(oldStartVnode, newEndVnode); // insertBefore 具备移动性 会将原来的元素移动走

        el.insertBefore(oldStartVnode.el, oldEndVnode.el.nextSibling); // 将老的尾巴移动到老的前面去

        oldStartVnode = oldChildren[++oldStartIndex];
        newEndVnode = newChildren[--newEndIndex];
      } else {
        // 在给动态列表添加key的时候 要尽量避免用索引，因为索引前后都是从0 开始 ， 可能会发生错误复用 
        // 乱序比对
        // 根据老的列表做一个映射关系 ，用新的去找，找到则移动，找不到则添加，最后多余的就删除
        var moveIndex = map[newStartVnode.key]; // 如果拿到则说明是我要移动的索引

        if (moveIndex !== undefined) {
          var moveVnode = oldChildren[moveIndex]; // 找到对应的虚拟节点 复用

          el.insertBefore(moveVnode.el, oldStartVnode.el);
          oldChildren[moveIndex] = undefined; // 表示这个节点已经移动走了

          patchVnode(moveVnode, newStartVnode); // 比对属性和子节点
        } else {
          el.insertBefore(createElm(newStartVnode), oldStartVnode.el);
        }

        newStartVnode = newChildren[++newStartIndex];
      }
    }

    if (newStartIndex <= newEndIndex) {
      // 新的多了 多余的就插入进去
      for (var i = newStartIndex; i <= newEndIndex; i++) {
        var childEl = createElm(newChildren[i]); // 这里可能是像后追加 ，还有可能是向前追加 新的下一个有没有值 有的话就是 插入 没有的话就是追加 

        var anchor = newChildren[newEndIndex + 1] ? newChildren[newEndIndex + 1].el : null; // 获取下一个元素
        // el.appendChild(childEl);

        el.insertBefore(childEl, anchor); // anchor 为null的时候则会认为是appendChild
      }
    }

    if (oldStartIndex <= oldEndIndex) {
      // 老的对了，需要删除老的
      for (var _i = oldStartIndex; _i <= oldEndIndex; _i++) {
        if (oldChildren[_i]) {
          var _childEl = oldChildren[_i].el;
          el.removeChild(_childEl);
        }
      }
    }
  }

  function initLifeCycle(Vue) {
    Vue.prototype._update = function (vnode) {
      // 将vnode转化成真实dom
      var vm = this;
      var el = vm.$el; // patch既有初始化的功能  又有更新 

      vm.$el = patch(el, vnode);
    }; // _c('div',{},...children)


    Vue.prototype._c = function () {
      return createElementVNode.apply(void 0, [this].concat(Array.prototype.slice.call(arguments)));
    }; // _v(text)


    Vue.prototype._v = function () {
      return createTextVNode.apply(void 0, [this].concat(Array.prototype.slice.call(arguments)));
    };

    Vue.prototype._s = function (value) {
      if (_typeof(value) !== 'object') return value;
      return JSON.stringify(value);
    };

    Vue.prototype._render = function () {
      // 当渲染的时候会去实例中取值，我们就可以将属性和视图绑定在一起
      return this.$options.render.call(this); // 通过ast语法转义后生成的render方法
    };
  }
  function mountComponent(vm, el) {
    // 这里的el 是通过querySelector处理过的
    vm.$el = el; // 1.调用render方法产生虚拟节点 虚拟DOM

    var updateComponent = function updateComponent() {
      vm._update(vm._render()); // vm.$options.render() 虚拟节点

    };

    new Watcher(vm, updateComponent, true); // 2.根据虚拟DOM产生真实DOM 
    // 3.插入到el元素中
  } // vue核心流程 1） 创造了响应式数据  2） 模板转换成ast语法树  
  // 3) 将ast语法树转换了render函数 4) 后续每次数据更新可以只执行render函数 (无需再次执行ast转化的过程)
  // render函数会去产生虚拟节点（使用响应式数据）
  // 根据生成的虚拟节点创造真实的DOM、

  function callHook(vm, hook) {
    var handlers = vm.$options[hook];

    if (handlers) {
      handlers.forEach(function (handler) {
        return handler.call(vm);
      });
    }
  }

  var oldArrayProto = Array.prototype;
  var newArrayProto = Object.create(oldArrayProto);
  var methods = ['push', 'pop', 'shift', 'unshift', 'sort', 'reverse', 'splice'];
  methods.forEach(function (method) {
    newArrayProto[method] = function () {
      var _oldArrayProto$method;

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      // 重写了数组的方法
      var result = (_oldArrayProto$method = oldArrayProto[method]).call.apply(_oldArrayProto$method, [this].concat(args)); // 内部调用了原来的方法
      // 此外还要对新增的内容进行观测


      var inserted;

      switch (method) {
        case 'push':
        case 'unshift':
          inserted = args;
          break;

        case 'splice':
          inserted = args.slice(2);
          break;
      }

      if (inserted) {
        this.__ob__.observeArray(inserted);
      }

      this.__ob__.dep.notify();

      return result;
    };
  });

  var Observer = /*#__PURE__*/function () {
    function Observer(data) {
      _classCallCheck(this, Observer);

      //给数组对象中都增加dep
      this.dep = new Dep();
      Object.defineProperty(data, '__ob__', {
        value: this,
        enumerable: false // 属性不可枚举

      });

      if (Array.isArray(data)) {
        data.__proto__ = newArrayProto;
        this.observeArray(data);
      } else {
        this.walk(data);
      }
    }

    _createClass(Observer, [{
      key: "walk",
      value: function walk(data) {
        Object.keys(data).forEach(function (key) {
          return defineReactive(data, key, data[key]);
        });
      }
    }, {
      key: "observeArray",
      value: function observeArray(data) {
        data.forEach(function (item) {
          return observe(item);
        });
      }
    }]);

    return Observer;
  }(); // 解决的是数组中套数组的情况  深层次递归 递归多了 性能比较差 不存在的属性检测不到 存在的属性要重写方法 反正没好 vue3-> proxy


  function dependArray(value) {
    for (var i = 0; i < value.length; i++) {
      var current = value[i];
      current.__ob__ && current.__ob__.dep.depend();

      if (Array.isArray(current)) {
        dependArray(current);
      }
    }
  }

  function defineReactive(data, key, value) {
    //依赖收集
    var childOb = observe(value); // 递归保证嵌套层级比较深的话  保证里面的属性能有响应式

    var dep = new Dep();
    Object.defineProperty(data, key, {
      get: function get() {
        if (Dep.target) {
          dep.depend();

          if (childOb) {
            childOb.dep.depend(); // 让数组和对象本身也实现依赖收集

            if (Array.isArray(value)) {
              dependArray(value);
            }
          }
        }

        return value;
      },
      set: function set(newValue) {
        if (value == newValue) return;
        value = newValue;
        observe(newValue);
        dep.notify();
      }
    });
  }

  function observe(data) {
    if (_typeof(data) !== 'object' || data == null) {
      //只劫持对象
      return;
    }

    if (data.__ob__ instanceof Observer) {
      // 被劫持了 就不需要再走进去了
      return data.__ob__;
    }

    return new Observer(data);
  }

  function initState(vm) {
    var opts = vm.$options;

    if (opts.data) {
      initData(vm);
    }

    if (opts.computed) {
      initComputed(vm);
    }

    if (opts.watch) {
      initWatch(vm);
    }
  }

  function initWatch(vm) {
    var watch = vm.$options.watch;

    for (var key in watch) {
      var handler = watch[key];

      if (Array.isArray(handler)) {
        createWatcher(vm, key, handler[i]);
      } else {
        createWatcher(vm, key, handler);
      }
    }
  }

  function createWatcher(vm, key, handler) {
    if (typeof handler === 'string') {
      handler = vm[handler];
    }

    return vm.$watch(key, handler);
  }

  function proxy(vm, target, key) {
    Object.defineProperty(vm, key, {
      get: function get() {
        return vm[target][key];
      },
      set: function set(newValue) {
        vm[target][key] = newValue;
      }
    });
  }

  function initData(vm) {
    var data = vm.$options.data;
    data = typeof data === 'function' ? data.call(vm) : data;
    vm._data = data;
    observe(data);

    for (var key in data) {
      // 为了外层取值的方便 所以多加了一层劫持
      proxy(vm, '_data', key);
    }
  }

  function initComputed(vm) {
    var computed = vm.$options.computed;
    var watchers = vm._computedWatchers = {};

    for (var key in computed) {
      var userDef = computed[key]; //需要监控计算属性中get的变化

      var fn = typeof userDef === 'function' ? userDef : userDef.get; //如果直接执行new Wather 默认就会执行fn 将属性和watcher对应起来

      watchers[key] = new Watcher(vm, fn, {
        lazy: true
      });
      defineComputed(vm, key, userDef);
    }
  }

  function defineComputed(vm, key, userDef) {
    var setter = userDef.set || function () {};

    Object.defineProperty(vm, key, {
      get: createComputedGetter(key),
      set: setter
    });
  } // 计算属性自己不回去收集依赖 只会让自己的属性去收集依赖


  function createComputedGetter(key) {
    return function () {
      var watcher = this._computedWatchers[key];

      if (watcher.dirty) {
        watcher.evaluate();
      }

      if (Dep.target) {
        watcher.depend();
      }

      return watcher.value;
    };
  }

  function initStateMixin(Vue) {
    Vue.prototype.$nextTick = nextTick;

    Vue.prototype.$watch = function (exprOrFn, cb) {
      new Watcher(this, exprOrFn, {
        user: true
      }, cb);
    };
  }

  var strats = {};
  var LIFECYCLE = ['beforeCreate', 'created'];
  LIFECYCLE.forEach(function (hook) {
    strats[hook] = function (p, c) {
      //  {} {created:function(){}}   => {created:[fn]}
      // {created:[fn]}  {created:function(){}} => {created:[fn,fn]}
      if (c) {
        // 如果儿子有 父亲有   让父亲和儿子拼在一起
        if (p) {
          return p.concat(c);
        } else {
          return [c]; // 儿子有父亲没有 ，则将儿子包装成数组
        }
      } else {
        return p; // 如果儿子没有则用父亲即可
      }
    };
  });
  function mergeOptions(parent, child) {
    var options = {};

    for (var key in parent) {
      // 循环老的  {}
      mergeField(key);
    }

    for (var _key in child) {
      // 循环老的   {a:1}
      if (!parent.hasOwnProperty(_key)) {
        mergeField(_key);
      }
    }

    function mergeField(key) {
      // 策略模式 用策略模式减少if /else
      if (strats[key]) {
        options[key] = strats[key](parent[key], child[key]);
      } else {
        // 如果不在策略中则以儿子为主
        options[key] = child[key] || parent[key]; // 优先采用儿子，在采用父亲
      }
    }

    return options;
  }

  function initMixin(Vue) {
    Vue.prototype._init = function (options) {
      var vm = this; // 全局的指令都会挂载到实例上

      vm.$options = mergeOptions(this.constructor.options, options);
      callHook(vm, 'beforeCreate');
      initState(vm);
      callHook(vm, 'created');

      if (options.el) {
        vm.$mount(options.el);
      }
    };

    Vue.prototype.$mount = function (el) {
      var vm = this;
      el = document.querySelector(el);
      var opts = vm.$options;

      if (!opts.render) {
        var template;

        if (!opts.template && el) {
          template = el.outerHTML;
        } else {
          if (el) {
            template = el.template;
          }
        }

        if (template && el) {
          var render = compilerToFunction(template);
          opts.render = render;
        }
      }

      mountComponent(vm, el);
    };
  }

  function initGlobalAPI(Vue) {
    Vue.options = {};

    Vue.mixin = function mixin(mixin) {
      this.options = mergeOptions(this.options, mixin); // 就是属性的合并

      return this;
    };
  }

  function Vue(options) {
    this._init(options);
  }

  initMixin(Vue);
  initLifeCycle(Vue);
  initGlobalAPI(Vue);
  initStateMixin(Vue); //实现了nextTick $watch
  //--------------------为了观察前后的虚拟节点  测试的

  var render1 = compilerToFunction("<ul style=\"color:red\">\n    <li key='a'>a</li>\n    <li key='b'>b</li>\n    <li key='c'>c</li>\n    <li key='d'>d</li>\n</ul>");
  var vm1 = new Vue({
    data: {
      name: 'xz'
    }
  });
  var prevVnode = render1.call(vm1);
  var el = createElm(prevVnode);
  document.body.appendChild(el);
  var render2 = compilerToFunction("<ul style=\"color:blue\">\n    <li key='b'>b</li>\n    <li key='m'>m</li>\n    <li key='a'>a</li>\n    <li key='p'>p</li>\n    <li key='c'>c</li>\n    <li key='q'>q</li>\n</ul>");
  var vm2 = new Vue({
    data: {
      name: '二哈'
    }
  });
  var nextVnode = render2.call(vm2); //直接将新的节点替换掉老的节点  不是直接替换 是比较两个人的区别之后再替换
  //diff算法是一个平级比较的过程 父亲和父亲比 儿子和儿子比较

  setTimeout(function () {
    patch(prevVnode, nextVnode); // let newEl = createElm(nextVnode);
    // el.parentNode.replaceChild(newEl,el);
  }, 1000);

  return Vue;

}));
//# sourceMappingURL=vue.js.map
