<template>
    <div class="update-name">
        <!-- 导航栏 click-left是左侧点击事件 -->
        <van-nav-bar left-text="取消" right-text="完成" title="设置昵称" @click-left="$emit('close')"
            @click-right="onConfirm"></van-nav-bar>
        <div class="field-wrap">
            <van-field v-model.trim="localName" rows="2" autosize type="textarea" maxlength="50" placeholder="请输入昵称"
                show-word-limit />
        </div>
    </div>
</template>

<script>
import { editUserProfile } from '@/api/user'
export default {
    name: 'UpdateName',
    props: {
        value: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            localName: this.value
        }
    },
    computed: {},
    created() { },
    mounted() { },
    methods: {
        async onConfirm() {
            this.$toast.loading({
                message: '保存中...',
                forbidClick: true, // 禁止背景点击
                duration: 2000
            })
            try {
                const localName = this.localName
                if (!localName.length) {
                    this.$toast('昵称不能为空')
                    return
                }
                await editUserProfile({
                    name: localName
                })
                // 更新视图
                this.$emit('input', localName)
                // 关闭弹层
                this.$emit('close')
                this.$toast.success('更新成功')
            } catch (err) {
                this.$toast('修改失败，请重试')
            }
        }
    }
}

</script>

<style lang='less' scoped>
.field-wrap {
    padding: 20px;
}
</style>
