// 千分位显示 money
function formatMoney(number, bool, ba = 2, type = 'zh-Hans-CN') {
  // console.log("formatMoney");
  if (bool) {
    return new Intl.NumberFormat(type, { currency: 'CNY', minimumFractionDigits: ba, maximumFractionDigits: ba }).format(number);
  } else {
    return `￥${new Intl.NumberFormat(type, { currency: 'CNY', minimumFractionDigits: ba, maximumFractionDigits: ba }).format(number)}`;
  }
}

/**
 * 数字乘法
 * @param {*} arg1 数字1
 * @param {*} arg2 数字2
 */
function accMul(arg1, arg2) {
  let m = 0;
  const s1 = arg1.toString();
  const s2 = arg2.toString();
  const s1Split1 = s1.split('.')[1] || '';
  const s2Split1 = s2.split('.')[1] || '';
  try {
    m += s1Split1.length;
  } catch (e) {
    console.log(e);
  }
  try {
    m += s2Split1.length;
  } catch (e) {
    console.log(e);
  }
  return (
    (Number(s1.replace('.', '')) * Number(s2.replace('.', ''))) /
    Math.pow(10, m)  // eslint-disable-line
  );
}

function dataIsNull(value) {
  return (
    value === undefined ||
    value === null ||
    String(value).toLocaleLowerCase() === 'null' ||
    value === ''
  );
}

export {
  formatMoney,
  accMul,
  dataIsNull,
};
