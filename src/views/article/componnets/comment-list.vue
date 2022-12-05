<template>
    <div class="comment-list">
        <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad" :error.sync="error"
            error-text="加载失败，点击重试">
            <comment-item v-for="(item, i) in list" :key="i" :comment="item"
                @update="item.is_liking = $event"></comment-item>
        </van-list>
    </div>
</template>

<script>
import { getComments } from '@/api/comment'
import CommentItem from './comment-item'
export default {
    name: 'CommentList',
    components: {
        CommentItem
    },
    props: {
        source: {
            type: [Number, String],
            required: true
        },
        list: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            // list: [],
            loading: false,
            finished: false,
            offset: null, // 读取下一页数据的标记
            limit: 10,
            error: false
        }
    },
    computed: {},
    created() {
        // 使得评论总数在评论列表创建的时候就显示 不然得滑动到评论区域才会显示
        this.onLoad()
    },
    mounted() { },
    methods: {
        async onLoad() {
            try {
                const { data } = await getComments({
                    type: 'a', // 评论类型，a-对文章(article)的评论，c-对评论(comment)的回复
                    source: this.source, // 源id，文章id或评论id
                    offset: this.offset, // 获取评论数据的偏移量，值为评论id，表示从此id的数据向后取，不传表示从第一页开始读取数据
                    limit: this.limit // 获取的评论数据个数，不传表示采用后端服务设定的默认每页数据量
                })
                const { results } = data.data
                this.list.push(...results)
                this.loading = false
                if (results.length) {
                    this.offset = data.data.last_id
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

<style lang='less' scoped>

</style>
