import AJAX from 'client/utils/ajax';
import ajaxMap from 'client/services/goodSoGood';
import {message} from 'antd';
import RH from 'client/routeHelper';

const model = {
  namespace: 'login',

  state: {
    from: {
      loginPhone: '',
      password: '',
    },
    isLoad: false, //当前是否正在加载
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
  },

  effects: {
    * login({payload, cbType2}, {call, put, select}) { //eslint-disable-line
      yield put({type: 'set', payload: {isLoad: true}});
      const res = yield call(() => AJAX.send(ajaxMap.login, {...payload}, false));
      console.log(res);
      if (res.code === 0) {
        const {data} = res;
        if (data.type === 1) {
          //单个用户正常登录
          yield put({
            type: 'global/setCompanies',
            payload: {
              companies: [],
            },
          });
          yield put({
            type: 'global/setLogin',
            payload: {
              account: data.dataLogin.account || {},
            },
          });

          const menuArray = data.dataLogin.menuArray || []; //临时菜单列表

          yield put({
            type: 'global/menuList',
            payload: {
              menuArray,
            },
            callback: () => {
              RH(null, window.__themeKey, `/${window.__themeKey}/dashboard`);
            },
          });
        } else if (data.type === 2) {
          yield put({
            type: 'global/setCompanies',
            payload: {
              companies: data.dataLogin || [],
            },
          });
          cbType2 && cbType2(data.dataLogin);
        }
      } else if (res.code === -2 && res.data && res.data.type === 3) {
        //type = 3 的老用户
        yield put({type: 'register/setOldUser', payload: res.data.dataLogin || {}});
        message.warn('需要进行完善资料');
        RH(null, 'register', '/register');
      } else {
        message.error(res.message);
      }
      yield put({type: 'set', payload: {isLoad: false}});
    },

    * loginChoose({payload, callback}, {call, put}) {
      yield put({type: 'set', payload: {isLoad: true}});

      const un = message.loading(payload.loadingMsg || '登录中...', 15);
      delete payload.loadingMsg;
      const res = yield call(() => AJAX.send(ajaxMap.loginChoose, {...payload}));
      if (res.code === 0) {
        const {data} = res;
        const account = data.dataLogin.account || {};
        account.permission = res.data.permission;
        yield put({
          type: 'global/setLogin',
          payload: {
            account: account || {},
          },
        });

        const menuArray = data.dataLogin.menuArray || []; //临时菜单列表
        yield put({
          type: 'global/menuList',
          payload: {
            menuArray,
          },
          callback: () => {
            un();
            if (callback) {
              callback(res);
            } else {
              window.__themeKey = window.__themeKey || 'org';
              RH(null, window.__themeKey, `/${window.__themeKey}/dashboard`);
            }
          },
        });
      } else {
        un();
        callback && callback(res);
      }
      yield put({type: 'set', payload: {isLoad: false}});
    },
  },
};

export default model;
