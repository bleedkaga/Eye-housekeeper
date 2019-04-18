import AJAX from 'client/utils/ajax';
import ajaxMap from 'client/services/taskCenter'; //该模块的ajax
import ajaxMapPublic from 'client/services/public';
import Tools from 'client/utils/tools';
import Utils from './utils';

const model = {
  namespace: 'taskCenter',

  state: {
    tab1: {
      list: [], //任务列表
      taskIds: [], //当前的选择的任务
      isLoad: false, //当前是否正在加载
      isResult: false, //当前是否有数据
    },

    tab2: {
      list: [], //任务列表
      taskIds: [], //当前的选择的任务
      isLoad: false, //当前是否正在加载
      isResult: false, //当前是否有数据
    },

    // list: [],
    // isLoad: false, //当前是否正在加载
    // isInit: false,
    // taskIds: [],
    // isEdit: false,
    // isResult: false,
  },

  reducers: {
    set(state, {payload}) {
      return {...state, ...payload};
    },

    reset(state) {
      return {...state, ...model.state};
    },

    setTab1(state, {payload}) {
      return {...state, tab1: {...state.tab1, ...payload}};
    },

    setTab2(state, {payload}) {
      return {...state, tab2: {...state.tab2, ...payload}};
    },

    addTask(state, {payload = {}}) {
      const {father, list, type} = payload;
      const oldList = state[type].taskIds;

      list.forEach((item) => {
        const fatherObj = Utils.findFatherItemByValue(oldList, father.value);
        if (fatherObj) {
          //判断当前任务是否存在
          if (!fatherObj.children.find(ro => ro.value === item.value)) {
            //不存在
            fatherObj.children.push({value: item.value, label: item.label});
          }
        } else {
          const temp = {
            value: father.value,
            label: father.label,
            children: [{value: item.value, label: item.label}],
          };
          oldList.push(temp);
        }
      });
      return {...state, [type]: {...state[type], taskIds: oldList}};
    },

    delTask(state, {payload = {}}) {
      const {father, list, type} = payload;
      const oldList = state[type].taskIds;

      list.forEach((item) => {
        const fatherObj = Utils.findFatherItemByValue(oldList, father.value);
        if (fatherObj) {
          //判断当前任务是否存在
          const ident = fatherObj.children.findIndex(ro => ro.value === item.value);
          if (ident !== -1) {
            fatherObj.children.splice(ident, 1);
            if (!fatherObj.children.length) {
              //父元素下已经没有任何子元素了
              const fInd = oldList.findIndex(o => o.value === father.value);
              oldList.splice(fInd, 1);
            }
          }
        }
      });

      const fatherObj = Utils.findFatherItemByValue(oldList, father.value);
      //会出现只有父元素的空节点的情况
      if (fatherObj && !fatherObj.children.length) {
        //父元素下已经没有任何子元素了
        const fInd = oldList.findIndex(o => o.value === father.value);
        oldList.splice(fInd, 1);
      }

      // return {...state, taskIds: oldList, isEdit: true};
      return {...state, [type]: {...state[type], taskIds: oldList}};
    },
  },

  effects: {
    * findFirstValList({payload, callback}, {call, put}) {
      const res = yield call(() => AJAX.send(ajaxMapPublic.findFirstValList, {...payload}));
      if (res.code === 0) {
        const {data = {}} = res;
        const list = Tools.formatValList(null, data.taskcenter || []) || [];
        yield put({type: 'setTab1', payload: {list}});
        callback && callback(list);
      }
      return res;
    },

    * findSecondValList({payload}, {call, put, select}) {
      const item = payload.selectedOptions.pop();
      item.loading = true;
      delete payload.selectedOptions;
      const {tab1: {list}} = yield select(state => state.taskCenter);
      const res = yield call(() => AJAX.send(ajaxMapPublic.findSecondValList, {...payload, parentId: item.value}));
      if (res.code === 0) {
        Tools.formatValList(item, res.data, false);
        yield put({type: 'setTab1', payload: {list}});
      }
    },

    //初始化tab1的数据
    * initializeTab1Data({payload, callback}, {call, put}) {
      yield put({type: 'setTab1', payload: {isEdit: false, isResult: false}});

      const listData = yield call(() => AJAX.send(ajaxMapPublic.findFirstValList, {
        ...payload.first,
      }));
      const tabData = yield call(() => AJAX.send(ajaxMap.getClassification, {
        ...payload.data,
        __autoLoading: true,
      }, false));

      //初始化字典第一段数据
      if (listData.code === 0) {
        const {data: data1 = {}} = listData;
        const list = Tools.formatValList(null, data1.taskcenter || []) || [];
        let taskIds = [];
        if (tabData.code === 0) {
          taskIds = tabData.data || [];
          taskIds = generateListByStatus(taskIds, '1');
          yield put({type: 'setTab1', payload: {taskIds, list, isResult: Utils.getSelectSize(taskIds) > 0}});
        } else {
          yield put({type: 'setTab1', payload: {list}});
        }
        let tempTaskId = '';

        if (taskIds.length) {
          tempTaskId = taskIds[0].value;
        } else if (list[0]) {
          tempTaskId = list[0].value;
        }

        //初始化第二段数据
        if (tempTaskId) {
          callback && callback(tempTaskId);
        } else {
          callback && callback(null);
        }
      } else {
        callback && callback(null);
      }
    },

    * getTab1Data({payload, callback}, {call, put}) {
      const res = yield call(() => AJAX.send(ajaxMap.getClassification, {
        ...payload,
      }, false));

      let taskIds = [];

      if (res.code === 0) {
        taskIds = res.data || [];

        taskIds = generateListByStatus(taskIds, '1');

        yield put({type: 'setTab1', payload: {taskIds, isResult: Utils.getSelectSize(taskIds) > 0}});

        callback && callback(res);
      }
    },

    * getFirstClassification({payload, callback}, {call, put}) {
      const res = yield call(() => AJAX.send(ajaxMap.getFirstClassification, {...payload}));
      if (res.code === 0) {
        const {data = []} = res;
        const list = formatTab2List(null, data || []) || [];
        yield put({type: 'setTab2', payload: {list}});
        callback && callback(list);
      }
    },

    * getSecondCustomTask({payload}, {call, put, select}) {
      const item = payload.selectedOptions.pop();
      item.loading = true;
      delete payload.selectedOptions;
      const {tab2: {list}} = yield select(state => state.taskCenter);
      const res = yield call(() => AJAX.send(ajaxMap.getSecondCustomTask, {...payload, id: item.value}));
      if (res.code === 0) {
        formatTab2List(item, res.data, false);
        yield put({type: 'setTab2', payload: {list}});
      }
    },

    //初始化tab2的数据
    * initializeTab2Data({payload, callback}, {call, put}) {
      yield put({type: 'setTab2', payload: {isEdit: false, isResult: false}});
      const listData = yield call(() => AJAX.send(ajaxMap.getFirstClassification, {
        ...payload.first,
      }));
      const tabData = yield call(() => AJAX.send(ajaxMap.getClassification, {
        ...payload.data,
        __autoLoading: true,
      }, false));

      if (listData.code === 0) {
        const {data: data1 = []} = listData;
        const list = formatTab2List(null, data1 || []) || [];
        let taskIds = [];
        if (tabData.code === 0) {
          taskIds = tabData.data || [];

          taskIds = generateListByStatus(taskIds, '2');

          yield put({type: 'setTab2', payload: {taskIds, list, isResult: Utils.getSelectSize(taskIds) > 0}});
        } else {
          yield put({type: 'setTab2', payload: {list}});
        }

        let tempTaskId = '';
        if (list[0]) {
          tempTaskId = list[0].value;
        }

        //初始化第二段数据
        if (tempTaskId) {
          callback && callback(tempTaskId);
        } else {
          callback && callback(null);
        }
      } else {
        callback && callback(null);
      }
    },

    * getTab2Data({payload, callback}, {call, put}) {
      const res = yield call(() => AJAX.send(ajaxMap.getClassification, {
        ...payload,
      }, false));

      let taskIds = [];

      if (res.code === 0) {
        taskIds = res.data || [];
        //拆分
        taskIds = generateListByStatus(taskIds, '2');

        yield put({type: 'setTab2', payload: {taskIds, isResult: Utils.getSelectSize(taskIds) > 0}});

        callback && callback(res);
      }
    },

    //废弃
    * addOrUpdateTaskInformation({payload, callback}, {call, put}) {
      yield put({type: 'set', payload: {isLoad: true}});

      const res = yield call(() => AJAX.send(ajaxMap.addOrUpdateTaskInformation, {...payload}));

      if (res.code === 0) {
        callback && callback(res);
      }

      yield put({type: 'set', payload: {isLoad: false}});
    },

    //添加系统推荐任务
    * addClassification({payload, callback}, {call, put}) {
      yield put({type: 'setTab1', payload: {isLoad: true}});
      yield put({type: 'setTab2', payload: {isLoad: true}});

      const res = yield call(() => AJAX.send(ajaxMap.addClassification, {...payload}));

      if (res.code === 0) {
        callback && callback(res);
      }

      yield put({type: 'setTab1', payload: {isLoad: false}});
      yield put({type: 'setTab2', payload: {isLoad: false}});
    },

    //添加自定义一级和二级任务
    * batchClassification({payload, callback}, {call, put}) {
      yield put({type: 'setTab2', payload: {isLoad: true}});

      const res = yield call(() => AJAX.send(ajaxMap.batchClassification, {...payload}));

      if (res.code === 0) {
        callback && callback(res);
      }

      yield put({type: 'setTab2', payload: {isLoad: false}});
    },

    //删除子任务
    * delClassification({payload, callback}, {call}) {
      const res = yield call(() => AJAX.send(ajaxMap.delClassification, {...payload}));
      if (res.code === 0) {
        callback && callback(res);
      }
    },

    //删除父任务
    * delFatherClassification({payload, callback}, {call}) {
      const res = yield call(() => AJAX.send(ajaxMap.delFatherClassification, {...payload}));
      if (res.code === 0) {
        callback && callback(res);
      }
    },

    //删除已选的任务
    * delSelectClassification({payload, callback}, {call}) {
      const res = yield call(() => AJAX.send(ajaxMap.delSelectClassification, {...payload}));
      if (res.code === 0) {
        callback && callback(res);
      }
    },
  },
};

const formatTab2List = (item, temp, isLeaf = true) => {
  const arr = [];
  if (Array.isArray(temp)) {
    temp.forEach((o) => {
      const opt = {
        label: o.name || o.taskName,
        value: `${o.id}`,
        isLeaf: !isLeaf,
      };
      if (o.classificationId) opt.classificationId = o.classificationId;
      arr.push(opt);
    });
  }
  if (item) {
    item.loading = false;
    item.children = arr;
  }
  return arr;
};

const generateListByStatus = (arr, status = '1') => {
  const a = []; //推荐
  arr.forEach((item) => {
    if (item.status == status) {
      const clone = {label: item.taskName, status: item.status, value: item.father, id: item.id, server: true};
      if (Array.isArray(item.child)) {
        clone.children = item.child.map(o => ({label: o.taskName, id: o.id, value: o.father, server: true}));
      }
      a.push(clone);
    }
  });
  return a;
};

export default model;
