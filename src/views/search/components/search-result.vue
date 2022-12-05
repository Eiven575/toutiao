<template>
    <div class="search-result">
        <van-list v-model="loading" :finished="finished" finished-text="没有更多了" :error.sync="error"
            error-text="加载失败，请点击重试" @load="onLoad">
            <van-cell v-for="(item, i) in list" :key="i" :title="item.title" />
        </van-list>
    </div>
</template>

<script>
import { getSearchResult } from '@/api/search'
export default {
    name: 'SearchResult',
    props: {
        searchText: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            list: [],
            loading: false,
            finished: false,
            page: 1,
            per_page: 20,
            error: false
        }
    },
    computed: {},
    created() { },
    mounted() { },
    methods: {
        async onLoad() {
            try {
                const { data } = await getSearchResult({
                    page: this.page,
                    per_page: this.per_page,
                    q: this.searchText
                })
                const { results } = data.data
                this.list.push(...results)
                this.loading = false
                if (results.length) {
                    this.page++
                } else {
                    this.finished = true
                }
            } catch (err) {
                this.error = true
                this.loading = true
            }
        }
    }
}

</script>

<style lang='stylus' scoped>

</style>
