
// _h()
export function createElementVNode(vm,tag,data,...children){
  if(data == null){
    data = {};
  }
  
  // 不明白这里为什么要把key删除
  // let key = data.key;
  // if(key){
  //   delete data.key
  // }

  return vnode(vm,tag,data.key,data,children)
}

// _v()
export function createTextVNode(vm,text){
  // console.log('_v()---------------',vm,text);
  return vnode(vm,undefined,undefined,undefined,undefined,text)
}

function vnode(vm,tag,key,data,children,text){
  return {
    vm,
    tag,
    key,
    data,
    children,
    text
  }
}