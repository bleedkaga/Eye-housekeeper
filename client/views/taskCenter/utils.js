const Utils = {};

//寻找父元素
Utils.findFatherItemByValue = (arr, value) => arr.find(item => item.value === value);

//寻找子元素
Utils.findChildrenItemByValue = (arr, value) => {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].children) {
      const item = arr[i].children.find(o => o.value === value);
      if (item) return item;
    }
  }
};

//寻找元素
Utils.findItemByIdToCallback = (arr, id, cb) => {
  for (let i = 0; i < arr.length; i++) {
    const o = arr[i];
    if (o.id === id) return cb(o, i);
    if (o.children) {
      const index = o.children.findIndex(c => c.id === id);
      if (index !== -1) return cb(o, i, index);
    }
  }
};

//循环所有的子元素
Utils.forEachChildren = (arr = [], cb, key = 'children') => {
  arr.forEach((item) => {
    if (Array.isArray(item[key])) {
      item[key].forEach((o) => {
        cb && cb(o);
      });
    }
  });
};

//获取当前选择的任务数量
Utils.getSelectSize = (arr) => {
  let count = 0;
  Utils.forEachChildren(arr, () => {
    count++;
  });
  return count;
};

//克隆当前选择项， 用于记住历史
Utils.cloneTaskArr = arr => arr.map((item) => {
  let children = [];
  if (Array.isArray(item.children)) {
    children = item.children.map(o => ({...o}));
  }
  return ({...item, children});
});

//校正全选
Utils.checkAllSelect = (showItem, taskIds) => {
  let count = 0;
  if (showItem && showItem.children) {
    for (let i = 0; i < showItem.children.length; i++) {
      const item = showItem.children[i];
      if (Utils.findChildrenItemByValue(taskIds, item.value)) {
        item.active = true;
        count++;
      } else {
        item.active = false;
      }
    }
    return count >= showItem.children.length;
  } else {
    return false;
  }
};

//全选与反选
Utils.onAllChange = (taskIds, father, type, nextCheckAll, nextUnCheckAll, nextUnServerCheckAll) => {
  //list的father
  const arr = [];
  const serverList = [];

  if (father.children && father.children.length) {
    father.children.forEach((o) => {
      const selectItem = Utils.findChildrenItemByValue(taskIds, o.value);
      if (selectItem && selectItem.id) serverList.push(selectItem.id);
      arr.push(o);
    });
  } else {
    const tempFather = Utils.findFatherItemByValue(taskIds, father.value);
    const children = tempFather.children ? tempFather.children : [];
    children.forEach((o) => {
      const selectItem = Utils.findChildrenItemByValue(taskIds, o.value);
      if (selectItem && selectItem.id) serverList.push(selectItem.id);
      arr.push(o);
    });
  }

  if (father.all || (type !== undefined && type === false)) {
    //反选
    if (serverList.length) {
      //需要服务器删除
      //加入父ID
      const serverFather = Utils.findFatherItemByValue(taskIds, father.value);
      if (serverFather) serverList.push(serverFather.id);
      nextUnServerCheckAll(arr, serverList);
    } else {
      nextUnCheckAll(arr);
    }
  } else {
    //全选
    nextCheckAll(arr);
  }
};

//增加，取消
Utils.onChange = (taskIds, father, item, activeType, nextCheck, nextUnCheck, nextUnServerCheck) => {
  // console.log(father, item);
  const active = activeType !== undefined ? activeType : item.active;
  if (active) {
    //取消
    if (item.server) {
      //需要后端删除
      const serverList = [item.id];
      const serverFather = Utils.findFatherItemByValue(taskIds, item);
      if (serverFather && serverFather.children.length <= 1) {
        //父元素下没有元素了
        serverList.push(serverFather.id);
      }
      nextUnServerCheck([item], serverList);
    } else {
      nextUnCheck([item]);
    }
  } else {
    //选择
    nextCheck([item]);
  }
};

//更新克隆对象
Utils.updateCloneArr = (arr, ids) => {
  ids.forEach((id) => {
    Utils.findItemByIdToCallback(arr, id, (item, fIndex, cIndex) => {
      if (cIndex === undefined) {
        arr.splice(fIndex, 1);
      } else {
        arr[fIndex].children.splice(cIndex, 1);
      }
    });
  });
};


export default Utils;
