import Vue from 'vue'
import dayjs from 'dayjs'

// dayjs默认语言是英文 我们这里配置为中文
import 'dayjs/locale/zh-cn'

// 配置使用处理相对时间的插件
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)

dayjs.locale('zh-ch') // 全局使用
// 定义一个全局过滤器 然后就可以在任何组件的模板中使用了
// 其实过滤器就相当于一个全局可用的方法（仅供模板使用）
// 参数一：过滤器名称 参数二： 过滤器函数
Vue.filter('relativeTime', value => {
    return dayjs().to(dayjs(value))
})
// dayjs() 获取当前最新时间
// dayjs().format('YYYY-MM-DD')
