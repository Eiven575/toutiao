<template>
    <div class="article-list">
        <!-- 下拉刷新需要将需要刷新的内容包住 -->
        <van-pull-refresh v-model="isLoading" @refresh="onRefresh" :success-text="refreshSuccessText"
            :success-duration="1500">
            <!-- load事件：如果一次请求加载的数据条数较少，导致列表内容无法铺满当前屏幕，List会继续触发load事件，知道内容铺满屏幕或者数据全部加载完毕 -->
            <!--  loading属性：非加载中 loading为false 加载中loading为true -->
            <van-list v-model="loading" :finished="finished" finished-text="没有更多了" error-text="请求失败，点击重新加载"
                :error.sync="error" @load="onLoad">
                <article-item v-for="(article, index) in list" :key="index" :article="article"></article-item>
                <!-- <van-cell v-for="(article, index) in list" :key="index" :title="article.title" /> -->
            </van-list>
        </van-pull-refresh>
    </div>
</template>

<script>
import { getArticles } from '@/api/article'
import ArticleItem from '@/components/article-item'
export default {
    name: 'ArticleList',
    components: { ArticleItem },
    props: {
        channel: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            list: [], // 存储列表数据的数组
            loading: false, // 控制加载中loading的状态
            finished: false, // 控制数据加载结束的状态 结束之后会为true 显示没有更多数据了
            timestamp: null,
            error: false,
            isLoading: false, // 控制下拉刷新的loading状态
            refreshSuccessText: '' // 下拉刷新成功提示
        }
    },
    computed: {},
    created() { },
    mounted() { },
    methods: {
        // 初始化或滚动到底部的时候会调用onLoad
        async onLoad() {
            try {
                const { data } = await getArticles({
                    channel_id: this.channel.id,
                    // 简单理解 就是请求数据的页码
                    // 请求第一页数据：当前最新时间戳
                    // 用于请求之后数据的时间戳会在当前请求的结果中返回给你pre_timestamp
                    timestamp: this.timestamp || Date.now()
                })
                const { results } = data.data
                // 数组的展开符相当于把数组元素一个一个拿出来push
                this.list.push(...results)
                this.loading = false
                if (results.length) {
                    // 更新获取下一页数据的时间戳 不更新的话永远在请求第一页数据
                    this.timestamp = data.data.pre_timestamp
                } else {
                    // 没有数据了 不再加载了
                    this.finished = true
                }
            } catch (err) {
                this.error = true
                this.loading = false
            }
        },
        // 当下拉刷新的时候会触发调用该函数
        async onRefresh() {
            try {
                const { data } = await getArticles({
                    channel_id: this.channel.id,
                    // 下拉刷新每次获取最新数据 因此传最新时间戳就行
                    timestamp: Date.now()
                })
                const { results } = data.data
                this.list.unshift(...results)
                this.isLoading = false
                this.refreshSuccessText = `刷新成功，更新了${results.length}条数据`
            } catch (err) {
                // 不更改为false 将一直处于刷新状态 一直为true  无法再次刷新
                this.isLoading = false
                this.refreshSuccessText = '刷新失败'
            }
        }
        // onLoad() {
        //     // 异步更新数据
        //     // setTimeout 仅做示例，真实场景中一般为 ajax 请求
        //     setTimeout(() => {
        //         for (let i = 0; i < 10; i++) {
        //             this.list.push(this.list.length + 1)
        //         }

        //         // 本次数据加载结束之后 要把加载状态设置为结束 加载状态结束 加载完了loading就为true了
        //         // loading关闭以后才能触发下一次的加载中 false才能加载
        //         this.loading = false

        //         // 数据全部加载完成
        //         if (this.list.length >= 40) {
        //             this.finished = true
        //         }
        //     }, 1000)
        // }
    }
}

</script>

<style lang='less' scoped>
.article-list {
    // 视口单位
    height: 79vh;
    overflow-y: auto;
}
</style>
