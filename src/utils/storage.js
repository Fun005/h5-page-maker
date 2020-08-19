/**
 * 设置 storage
 * @param {*} key
 * @param {*} value
 */
export const setStorage = (key, value) => {
  return window.sessionStorage.setItem(key, value);
};

/**
 * 获取 storage
 * @param {*} key
 */
export const getStorage = key => {
  return window.sessionStorage.getItem(key);
};

/**
 * 获取 storage
 * @param {*} key
 */
export const removeStorage = key => {
  return window.sessionStorage.removeItem(key);
};

/**
 * 清除 storage
 * @param {*} key
 */
export const clearStorage = key => {
  return window.sessionStorage.clear();
};
