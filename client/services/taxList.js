export default {
  queryPersonInfo: {
    url: '/gsPersonalBankAccount/getPersonnelManagement',
    method: 'post',
  },
  uploadPersonInfo: {
    url: '/api/gsPersonalBankAccount/batchSetBankCard',
    method: 'post',
  },
  downloadPersonInfo: {
    url: '/gsPersonalBankAccount/downloadCompanyInfo',
    method: 'post',
  },
  bindBankNo: {
    url: '/gsPersonalBankAccount/setBankCard',
    method: 'post',
  },
  addUserCustomTask: {
    url: '/gsUserCustomTask/addUserCustomTask',
    method: 'post',
  },
};
