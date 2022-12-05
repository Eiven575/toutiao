<template>
    <div class="search-suggestion">
        <van-cell v-for="(suggestion, i) in suggestions" :key="i" icon="search" @click="$emit('search', suggestion)">
            <!-- 为了不修改元素原始数据 采用函数的方法进行处理 不采取遍历suggestions数组的方式进行修改 -->
            <div v-html="highlight(suggestion)" slot="title"></div>
        </van-cell>
    </div>
</template>

<script>
// 按需加载有好处：只会把使用到的成员打包到结果中
import { debounce } from 'lodash'
import { getSearchSuggestions } from '@/api/search'
export default {
    name: 'SearchSuggestion',
    props: {
        searchText: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            // 联想建议数据列表
            suggestions: []
        }
    },
    computed: {},
    watch: {
        // watch用于监听属性 事件等 下面相当于监听searchText这个属性/值
        searchText: {
            // 当searchText发生改变就会调用handler函数
            // 注意：handler函数名称是固定的
            // handler(value) {
            //     this.loadSearchSuggestions(value)
            // }
            // debounce函数 参数一：一个函数 参数二：延迟时间单位是毫秒 返回值：防抖之后的函数
            handler: debounce(function (value) {
                this.loadSearchSuggestions(value)
            }, 200),
            // 该回调会在侦听开始之后立即调用 不设置这个属性则输入一个字母或数字的时候不会触发handler函数
            immediate: true
        }
    },
    created() { },
    mounted() { },
    methods: {
        async loadSearchSuggestions(q) {
            try {
                const { data } = await getSearchSuggestions(q)
                this.suggestions = data.data.options
            } catch (err) {
                this.$toast('数据获取失败')
            }
        },
        highlight(text) {
            const highlishtStr = `<span class="active">${this.searchText}</span>`
            // 正则表达式中的内容是变量的时候 利用new RegExp创建正则对象
            const reg = new RegExp(this.searchText, 'gi')
            // replace不修改text 替换之后返回新的字符串
            return text.replace(reg, highlishtStr)
        }
    }
}

</script>

<style lang='less' scoped>
.search-suggestion {
    /deep/ span.active {
        color: #3296fa;
    }
}
</style>
