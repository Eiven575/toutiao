<template>
    <div class="update-genser">
        <van-picker title="标题" show-toolbar :columns="columns" @confirm="onConfirm" @cancel="onCancel"
            @change="onChange" :default-index="value" />
    </div>
</template>

<script>
import { editUserProfile } from '@/api/user'
export default {
    name: 'UpdateGender',
    props: {
        value: {
            type: Number,
            required: true
        }
    },
    data() {
        return {
            columns: ['男', '女'],
            localGender: this.value
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
                const localGender = this.localGender
                await editUserProfile({
                    gender: localGender
                })
                // 更新视图
                this.$emit('input', localGender)
                // 关闭弹层
                this.$emit('close')
                this.$toast.success('更新成功')
            } catch (err) {
                this.$toast('修改失败，请重试')
            }
        },
        onCancel() {
            this.$emit('close')
        },
        onChange(picker, value, index) {
            this.localGender = index
        }
    }
}

</script>

<style lang='less' scoped>

</style>
