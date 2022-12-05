<template>
    <van-button :loading="loading" :icon="value === 1 ? 'good-job' : 'good-job-o'" :class="{ liked: value === 1 }"
        @click="onLike" />
</template>

<script>
import { addLike, deleteLike } from '@/api/article'
export default {
    name: 'LikeArticle',
    props: {
        value: {
            type: Number,
            required: true
        },
        articleId: {
            type: [Number, String],
            required: true
        }
    },
    data() {
        return {
            loading: false
        }
    },
    computed: {},
    created() { },
    mounted() { },
    methods: {
        async onLike() {
            this.loading = true
            try {
                let status = -1
                if (this.value === 1) {
                    await deleteLike(this.articleId)
                } else {
                    await addLike(this.articleId)
                    status = 1
                }
                // 自定义事件修改数据并不是立即的
                this.$emit('input', status)
                // 因此这里用!this.value
                this.$toast.success(status === 1 ? '点赞成功' : '取消点赞')
            } catch (err) {
                this.$toast.fail('操作失败，请重试')
            }
            this.loading = false
        }
    }
}

</script>

<style lang='less' scoped>
.liked {
    .van-icon {
        color: #e5645f;
    }
}
</style>
