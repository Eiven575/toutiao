<template>
    <!-- 当value为true的时候才会将collected类名添加上 -->
    <van-button :loading="loading" :icon="value ? 'star' : 'star-o'" :class="{ collected: value }" @click="onCollect" />
</template>

<script>
import { addCollect, deleteCollect } from '@/api/article'
export default {
    name: 'CollectArticle',
    props: {
        value: {
            type: Boolean,
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
        async onCollect() {
            this.loading = true
            try {
                if (this.value) {
                    await deleteCollect(this.articleId)
                } else {
                    await addCollect(this.articleId)
                }
                // 自定义事件修改数据并不是立即的
                this.$emit('input', !this.value)
                // 因此这里用!this.value
                this.$toast.success(!this.value ? '收藏成功' : '取消收藏')
            } catch (err) {
                this.$toast.fail('操作失败，请重试')
            }
            this.loading = false
        }
    }
}
</script>

<style lang='less' scoped>
.collected {
    .van-icon {
        color: #ffa500;
    }
}
</style>
