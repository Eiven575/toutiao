// postcss配置文件
module.exports = {
    // 配置要使用的postcss插件
    plugins: {
        // 配置使用的autoprefixer插件
        // 作用：自动还说呢工程浏览器css样式规则前缀
        // 'autoprefixer': {
        //     // 配置兼容到的环境信息
        //     // VueCLI内部已经配置了
        //     // 这里又配置了一次 所以产生冲突了 运行时会弹出警告
        //     browsers: ['Android >= 4.0', 'iOS >= 8']
        // },
        // 配置使用postcss-pxtorem插件
        'postcss-pxtorem': {
            // lib-flexible的rem适配方案 将一行分为十份
            // vant是基于375来设置的 所以是37.5
            // 所以rootvalue就为设计稿宽度的1/10==75 需要除以2
            // 有没有更好的办法
            // 我如果是vant样式 按照37.5转换
            // 如果是自己的样式 按照75转换
            rootValue({ file }) {
                return file.indexOf('vant') !== -1 ? 37.5 : 75
            },
            // 配置要转换的css属性
            // *表示所有
            propList: ['*'],
            // 排除不需要转换rem的样式资源
            exclude: 'github-markdown'
        }
    }
}
