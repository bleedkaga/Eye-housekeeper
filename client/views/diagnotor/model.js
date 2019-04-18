import AJAX from 'client/utils/ajax';
import ajaxMap from 'client/services/public';

const model = {

  namespace: 'diagnotor',

  state: {
    from: {
      areaAddress: '',
      accountType: '',
      allcost: '',
      nonwagecost: '',
      staffmembers: '',
    },
    isLoad: false, //当前是否正在加载

    health: 0, //健康度
    saveScale: 0, //节省成本百分比
    newHumancost: 0, //计算后的人力成本
    costPercapita: 0, //计算后的人均成本
  },

  reducers: {
    set(state, {payload}) {
      return {...state, ...payload};
    },

    reset(state) {
      return {...state, ...model.state};
    },

    setFrom(state, {payload}) {
      return {
        ...state,
        from: {
          ...state.from,
          ...payload,
        },
      };
    },

    compute(state) {
      const {from} = state;

      const humancost = from.allcost - from.nonwagecost;
      //健康度
      const health = Math.floor(31 * Math.random()) + 40; //70-40之间包含40 70所以是31，用floor  0-30

      //节省成本百分比
      const saveScale = parseFloat((Math.floor(11 * Math.random()) / 100 + 0.1).toFixed(2)); //0.1-0.2之间包含0.1 0.2所以是11，用floor  0-10

      //计算后的人力成本
      const newHumancost = parseFloat((humancost * (1 - saveScale)).toFixed(2));

      //计算后的人均成本
      const costPercapita = parseFloat((newHumancost / from.staffmembers).toFixed(2));

      return {...state, humancost, health, saveScale, newHumancost, costPercapita};
    },
  },

  effects: {
  },
};

const formatPCAS = (item, str, isLeaf = true) => {
  let arr = [];
  if (typeof str === 'string') {
    const temp = str.split(';');
    temp.forEach((o) => {
      const d = o.split(',');
      arr.push({
        label: d[0],
        value: d[1],
        isLeaf: !isLeaf,
      });
    });
  } else if (Array.isArray(str) && str[0] && str[0].areaName) {
    str.forEach((d) => {
      arr.push({
        label: d.areaName,
        value: d.adcode,
        isLeaf: !isLeaf,
      });
    });
  } else {
    arr = str;
  }
  if (item) {
    item.loading = false;
    item.children = arr;
  }
  return arr || [];
};

const formatValList = (item, temp, isLeaf = true) => {
  const arr = [];
  if (Array.isArray(temp)) {
    temp.forEach((o) => {
      arr.push({
        label: o.dicname,
        value: o.dicval,
        isLeaf: !isLeaf,
      });
    });
  }
  if (item) {
    item.loading = false;
    item.children = arr;
  }
  return arr;
};
export default model;
