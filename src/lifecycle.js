/**
 * vue核心流程
 * 1. 创造了响应式数据
 * 2. 模板转换成ast语法树
 * 3. 将ast语法树转换成render函数
 * 4. 后续每次数据更新可以只执行render函数（无需再次执行ast转化过程）
*/
import Watcher from "./Observer/watcher";
import { createElementVNode,createTextVNode} from "./vdom/index";

// 创建真实DOM元素
function createElm(vnode){
  let {tag,data,text,children} = vnode;

  if(typeof tag === 'string'){
    vnode.el = document.createElement(tag)
    patchProps(vnode.el,data)
    children.forEach(child => { vnode.el.appendChild(createElm(child)) });
  }else{
    vnode.el = document.createTextNode(text)
  }
  return vnode.el;
}

// 更新属性
function patchProps(el,props){
  for (const key in props) {
    if (key === 'style') {
      for (const styleName in props.style) {
        el.style[styleName] = props.style[styleName];
      }
    }else{
      el.setAttribute(key,props[key])
    }
  }
}

// 比对新老节点进行更新
function patch(oldVNode,vnode){
  // 看是否是真实的元素节点
  let isRealElement = oldVNode.nodeType;
  if(isRealElement){
    const elm = oldVNode;
    const parentElm = elm.parentNode;  //拿到父元素
    // 将虚拟DOM转为真实DOM
    const newElm = createElm(vnode);

    parentElm.insertBefore(newElm,elm.nextSibling) //插入新节点

    parentElm.removeChild(elm); //删除老节点
    
    // 将新的节点返回，重新赋值 $el 用于下次更新
    return newElm;
  }
}

// update方法 与 render方法
export function initLifeCycle(Vue){
  Vue.prototype._update = function(vnode){
    const vm = this;
    let el = vm.$el;

    // 这里patch既有初始化方法  又有更新（vm.$el重新赋值新的节点） 
    vm.$el = patch(el,vnode);
  }

  Vue.prototype._render = function(){
    // 指向Vue 因为render函数使用with 当this传入vm的时候，_s(xxx)中的变量会自动去vm上拿取
    return this.$options.render.call(this);
  }

  Vue.prototype._c = function(){
    // console.log('1',arguments);
    return createElementVNode(this,...arguments)
  }
  Vue.prototype._v = function(){
    // console.log('2',arguments);
    return createTextVNode(this,...arguments);
  }

  // 因为render函数使用with的原因 所以_s(xxx)中的变量 可以直接获取对应的值
  Vue.prototype._s = function(value){
    if( typeof value !== 'object') return value;
    return JSON.stringify(value);
  }
}

export function mountComponent(vm,el){
  vm.$el = el;
  // 1.调用_render方法产生虚拟节点，虚拟DOM
  // 2.调用_update将虚拟DOM转化成真实DOM，并更新
  // console.log('vm----------',vm,vm._render());
 
  // 
  const updateComponents = ()=>{
    vm._update(vm._render());
  }

  let watcher = new Watcher(vm,updateComponents,true) //true 用于标识 是一个渲染watcher
  console.log('1111111111------------',watcher);
}