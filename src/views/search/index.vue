<template>
    <div class="search-container">
        <!-- 顶部搜索栏 -->
        <!-- Tips: 在 van-search 外层增加 form 标签，且 action 不为空，即可在 iOS 输入法中显示搜索按钮。 -->
        <form action="/" class="search-form">
            <!-- show-action显示取消按钮 -->
            <van-search v-model="searchText" background="#3296fa" show-action placeholder="请输入搜索关键词" @search="onSearch"
                @cancel="onCancel" @focus="isResultShow = false" />
        </form>

        <!-- 搜索结果 -->
        <search-result v-if="isResultShow" :search-text="searchText"></search-result>
        <!-- 联想建议 -->
        <!-- search是子组件通过$emit方法传递给父组件的事件 当中携带了text参数 这个search事件调用了onsearch事件 事件中val接收了text参数-->
        <search-suggestion v-else-if="searchText" :search-text="searchText" @search="onSearch"></search-suggestion>
        <!-- 搜索历史记录 -->
        <search-history v-else :search-histories="searchHistories" @isDelete="DeleteItem(arguments)"></search-history>
    </div>
</template>

<script>
import { setItem, getItem } from '@/utils/storage'
import SearchHistory from './components/search-history'
import SearchSuggestion from './components/search-suggestion'
import SearchResult from './components/search-result'
export default {
    name: 'SearchContainer',
    components: {
        SearchHistory,
        SearchSuggestion,
        SearchResult
    },
    data() {
        return {
            searchText: '',
            // 控制搜索结果的展示
            isResultShow: false,
            searchHistories: getItem('search-histories') || []
        }
    },
    computed: {},
    watch: {
        searchHistories(val) {
            setItem('search-histories', val)
        }
    },
    created() { },
    mounted() { },
    methods: {
        // val接收文本框的值
        onSearch(val) {
            // 更新文本框内容
            this.searchText = val
            // 存储搜索历史
            // 要求：不要有重复历史记录 最新的排在最前面
            const index = this.searchHistories.indexOf(val)
            if (index !== -1) {
                this.searchHistories.splice(index, 1)
            }
            this.searchHistories.unshift(val)
            // 渲染搜索结果
            this.isResultShow = true
        },
        onCancel() {
            this.$router.back()
        },
        DeleteItem(argus) {
            if (argus[1] === true) {
                this.searchHistories.splice(argus[0], 1)
            } else {
                this.onSearch(argus[2])
            }
        }
    }
}

</script>

<style lang='less' scoped>
.search-container {
    padding-top: 108px;

    .van-search__action {
        color: #fff
    }

    .search-form {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 1;
    }
}
</style>
