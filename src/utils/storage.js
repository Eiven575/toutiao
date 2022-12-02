// 封装本地存储操作模块
// 存储数据
export const setItem = (key, value) => {
    if (typeof value === 'object') {
        // 将对象/数组转换为json格式的字符串进行存储
        value = JSON.stringify(value)
    }
    window.localStorage.setItem(key, value)
}
// 获取数据
export const getItem = (key, value) => {
    // json格式的字符串还原
    const data = window.localStorage.getItem(key)
    // 无法判断json格式字符串
    try {
        return JSON.parse(data)
    } catch (err) {
        return data
    }
}
// 删除数据
export const removeItem = key => window.localStorage.removeItem(key)
