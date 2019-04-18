import AJAX from 'client/utils/ajax';
import ajaxAPI from 'client/services/unionInfo';
import ajaxAPICompany from 'client/services/company';

const model = {

  namespace: 'unionInfo',

  state: {
    company: {}, //单位地址信息
    companyAssociatedDef: {},
    groupAssociatedDef: {},
    group: {}, //工会信息
    companyAssociatedList: [], //下属单位
    isLoad: false, //当前是否正在加载
    isLoadModal: false,
    modalList: [],
    pageIndex: 1,
    pageSize: 10,

    //缓存数据
    _sameAddr: 2,
    _province: '',
    _city: '',
    _area: '',
    _address: '',
  },

  reducers: {
    set(state, {
      payload,
    }) {
      return { ...state,
        ...payload,
      };
    },

    reset(state) {
      return { ...state,
        ...model.state,
      };
    },

    setGroup(state, {
      payload,
    }) {
      return { ...state,
        group: { ...state.group,
          ...payload,
        },
      };
    },

  },

  effects: {
    //页面数据
    * getGroupByIdDetail({ payload, callback }, { call, put }) {
      yield put({
        type: 'set',
        payload: {
          isLoad: true,
        },
      });
      const res = yield call(() => AJAX.send(ajaxAPI.getGroupByIdDetail, { ...payload,
      }));
      if (res.code === 0) {
        res.data.group.province = `${res.data.group.province}`;
        res.data.group.city = `${res.data.group.city}`;
        res.data.group.area = `${res.data.group.area}`;
        res.data.group.companyType = `${res.data.group.companyType}`;
        const {group} = res.data;
        const groupAssociatedDef = {
          id: group.id,
          associatedName: group.companyName,
          creditCode: group.uniformCreditCode,
          userChangeInform: '1',
          statusRegister: '1',
          isDef: true,
        };
        //缓存数据//缓存数据暂时无用
        yield put({
          type: 'set',
          payload: {
            _sameAddr: res.data.group.sameAddr,
            _province: res.data.group.province,
            _city: res.data.group.city,
            _area: res.data.group.area,
            _address: res.data.group.address,
            groupAssociatedDef,
          },
        });
        yield put({
          type: 'set',
          payload: {
            companyAssociatedList: res.data.companyAssociatedList || [],
          },
        }); //下属单位

        yield put({
          type: 'setGroup',
          payload: res.data.group || {},
        });
      }
      callback && callback(res);
      yield put({
        type: 'set',
        payload: {
          isLoad: false,
        },
      });
    },

    * getCompanyByIdDetail({payload}, {call, put}) {
      yield put({type: 'set', payload: {isLoad: true}});
      const res = yield call(() => AJAX.send(ajaxAPICompany.getCompanyByIdDetail, {...payload}));
      if (res.code === 0) {
        const {company} = res.data;

        const companyAssociatedDef = {
          id: company.id,
          associatedName: company.companyName,
          creditCode: company.uniformCreditCode,
          userChangeInform: '1',
          statusRegister: '1',
          isDef: true,
        };
        yield put({
          type: 'set',
          payload: {
            company: {
              province: `${company.province || ''}`,
              city: `${company.city || ''}`,
              area: `${company.area || ''}`,
              address: company.address || '',
            },
            companyAssociatedDef,
          },
        });
      }
      yield put({
        type: 'set',
        payload: {
          isLoad: false,
        },
      });
    },

    * getGroupByIdDetailToCompany({payload}, {call, put}) {
      yield put({type: 'set', payload: {isLoad: true}});
      const res = yield call(() => AJAX.send(ajaxAPI.getGroupByIdDetail, {...payload}));
      if (res.code === 0) {
        const {group} = res.data;

        const groupAssociatedDef = {
          id: group.id,
          associatedName: group.companyName,
          creditCode: group.uniformCreditCode,
          userChangeInform: '1',
          statusRegister: '1',
          isDef: true,
        };
        yield put({
          type: 'set',
          payload: {
            groupAssociatedDef,
          },
        });
      }
      yield put({
        type: 'set',
        payload: {
          isLoad: false,
        },
      });
    },
    //新增
    * insertGroup({payload, callback}, {call, put}) {
      yield put({
        type: 'set',
        payload: {
          isLoad: true,
        },
      });
      const res = yield call(() => AJAX.send(ajaxAPI.insertGroup, { ...payload,
      }));
      if (res.code === 0) {
        callback && callback(res);
      }
      yield put({
        type: 'set',
        payload: {
          isLoad: false,
        },
      });
    },
    //修改
    * updateGroup({payload, callback}, {call, put}) {
      yield put({
        type: 'set',
        payload: {
          isLoad: true,
        },
      });
      const res = yield call(() => AJAX.send(ajaxAPI.updateGroup, { ...payload,
      }));
      if (res.code === 0) {
        callback && callback(res);
      }
      yield put({
        type: 'set',
        payload: {
          isLoad: false,
        },
      });
    },
    //工商名称查询
    * searchCompanyName({payload}, {call, put}) {
      yield put({
        type: 'set',
        payload: {
          isLoadModal: true,
          modalList: [],
        },
      });
      const res = yield call(() => AJAX.send(ajaxAPI.searchCompanyName, { ...payload,
      }));
      if (res.code === 0) {
        let list = [];
        try {
          list = JSON.parse(res.data);
        } catch (e) {
          //empty
        }

        yield put({
          type: 'set',
          payload: {
            modalList: list,
          },
        });
      }
      yield put({
        type: 'set',
        payload: {
          isLoadModal: false,
        },
      });
    },
    //非工商名称查询
    * findCompanyNameList({payload}, {call, put}) {
      yield put({
        type: 'set',
        payload: {
          isLoadModal: true,
        },
      });
      const res = yield call(() => AJAX.send(ajaxAPI.findCompanyNameList, { ...payload,
      }));
      if (res.code === 0) {
        yield put({
          type: 'set',
          payload: {
            modalList: res.data || [],
          },
        });
      }
      yield put({
        type: 'set',
        payload: {
          isLoadModal: false,
        },
      });
    },
    //工会或者单位保存关联单位
    * insertCompanyAssociated({payload, callback}, {call, put}) {
      yield put({
        type: 'set',
        payload: {
          isLoad: true,
        },
      });
      const res = yield call(() => AJAX.send(ajaxAPI.insertCompanyAssociated, { ...payload,
      }));
      callback && callback(res);
      yield put({
        type: 'set',
        payload: {
          isLoad: false,
        },
      });
    },
    //工会或者单位编辑关联单位
    * updateCompanyAssociated({payload, callback}, {call, put}) {
      yield put({
        type: 'set',
        payload: {
          isLoad: true,
        },
      });
      const res = yield call(() => AJAX.send(ajaxAPI.updateCompanyAssociated, { ...payload,
      }));
      callback && callback(res);
      yield put({
        type: 'set',
        payload: {
          isLoad: false,
        },
      });
    },
    //查询下属单位列表
    * getCompanyAssociatedList({payload}, {call, put}) {
      yield put({
        type: 'set',
        payload: {
          isLoad: true,
        },
      });
      const res = yield call(() => AJAX.send(ajaxAPI.getCompanyAssociatedList, { ...payload,
      }));
      if (res.code === 0) {
        yield put({
          type: 'set',
          payload: {
            companyAssociatedList: res.data || [],
          },
        });
      }
      yield put({
        type: 'set',
        payload: {
          isLoad: false,
        },
      });
    },
    //删除关联单位
    * deleteCompanyAssociated({payload}, {call, put, select}) {
      yield put({
        type: 'set',
        payload: {
          isLoad: true,
        },
      });
      const res = yield call(() => AJAX.send(ajaxAPI.deleteCompanyAssociated, {...payload}));
      if (res.code === 0) {
        const {account} = yield select(state => state.global);
        yield put({
          type: 'getCompanyAssociatedList',
          payload: {
            companyGroupId: window.__themeKey === 'org' ? account.companyId :  account.groupId,
          },
        });
      }
      yield put({
        type: 'set',
        payload: {
          isLoad: false,
        },
      });
    },
  },
};

export default model;
