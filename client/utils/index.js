/**
 *判断值是否为空
 * @param {*} value 要验证的值
 */
function dataIsNull(value) {
  return (
    value === undefined ||
    value === null ||
    String(value).toLocaleLowerCase() === 'null' ||
    value === ''
  );
}

export {
  dataIsNull,
};
