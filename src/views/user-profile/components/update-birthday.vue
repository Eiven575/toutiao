<template>
    <div class="update-birthday">
        <van-datetime-picker v-model="currentDate" type="date" title="选择年月日" :min-date="minDate" :max-date="maxDate"
            @cancel="$emit('close')" @confirm="onConfirm" />
    </div>
</template>

<script>
import { editUserProfile } from '../../../api/user'
import dayjs from 'dayjs'
export default {
    name: 'UpdateBirthday',
    props: {
        value: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            minDate: new Date(1970, 0, 1),
            maxDate: new Date(),
            currentDate: new Date(this.value)
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
                const currentDate = dayjs(this.currentDate).format('YYYY-MM-DD')
                await editUserProfile({
                    birthday: currentDate
                })
                // 更新视图
                this.$emit('input', currentDate)
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

</style>
