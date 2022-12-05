<template>
    <van-button v-if="value" round size="small" @click="onFollow" :loading="loading">已关注</van-button>
    <van-button v-else type="info" color="#3296fa" round size="small" icon="plus" @click="onFollow"
        :loading="loading">关注</van-button>
</template>

<script>

import { addFollow, deleteFollow } from '@/api/user'
export default {
    name: 'FollowUser',
    props: {
        // v-model传递过来的值叫做value
        value: {
            type: Boolean,
            required: true
        },
        userId: {
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
        async onFollow() {
            this.loading = true
            try {
                if (this.value) {
                    await deleteFollow(this.userId)
                } else {
                    await addFollow(this.userId)
                }
                // 视图状态要在父组件当中更改 不要直接修改props中的数据
                // this.article.is_followed = !this.article.is_followed
                // this.$emit('update-is_followed', !this.value)
                // v-model传递过来的值通过默认事件input修改
                // this.$emit('input', !this.value)
            } catch (err) {
                let message = '操作失败，请重试'
                if (err.response && err.response.status === 400) {
                    message = '你不能关注你自己'
                }
                this.$toast(message)
            }
            // 无论成功或失败 都得关闭按钮加载事件
            this.loading = false
        }
    }
}
</script>

<style lang='stylus' scoped>

</style>
