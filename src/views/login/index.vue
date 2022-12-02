<template>
    <div class="login-container">
        <!-- 导航栏 -->
        <van-nav-bar class="page-nav-bar" title="登录">
            <van-icon slot="left" name="cross" @click="$router.back()">
            </van-icon>
        </van-nav-bar>
        <!-- 登陆表单 -->
        <van-form @submit="onSubmit" ref="loginForm">
            <van-field v-model="user.mobile" name="mobile" placeholder="请输入手机号" :rules="userFormRules.mobile"
                type="number" maxlength="11">
                <i slot="left-icon" class="toutiao toutiao-shouji"></i>
            </van-field>
            <van-field v-model="user.code" name="code" placeholder="请输入验证码" :rules="userFormRules.code" maxlength="6">
                <i slot="left-icon" class="toutiao toutiao-yanzhengma"></i>
                <template #button>
                    <!-- time是倒计时时间 -->
                    <van-count-down :time="1000 * 60" format="ss s" v-if="(isCountDownShow === true)"
                        @finish="isCountDownShow = false" />
                    <van-button native-type="button" class="send-sms-btn" round size="small" type="default"
                        @click="onSendSms" v-else>发送验证码</van-button>
                </template>
            </van-field>
            <div class="login-btn-wrap">
                <van-button class="login-btn" block type="info" native-type="submit">登录</van-button>
            </div>
        </van-form>
    </div>
</template>

<script>
import { login, sendSms } from '@/api/user'
export default {
    name: 'LoginIndex',
    data() {
        return {
            user: {
                mobile: '',
                code: ''
            },
            userFormRules: {
                mobile: [{
                    required: true,
                    message: '手机号不能为空',
                    trigger: 'onBlur'
                },
                {
                    pattern: /^1[3|5|7|8]\d{9}$/,
                    message: '手机号格式错误'
                }],
                code: [{
                    required: true,
                    message: '验证码不能为空',
                    trigger: 'onBlur'
                },
                {
                    pattern: /^\d{6}$/,
                    message: '验证码格式错误'
                }]
            },
            isCountDownShow: false
        }
    },
    computed: {},
    created() { },
    mounted() { },
    methods: {
        async onSubmit() {
            this.$toast.loading({
                message: '登录中...',
                forbidClick: true,
                duration: 2000 // 如果为0则持续展示
            })
            try {
                const user = this.user
                const { data } = await login(user)
                this.$store.commit('setUser', data.data)
                this.$toast.success('登陆成功')
                // back的方式不严谨
                this.$router.back()
            } catch (err) {
                if (err.response.status === 400) {
                    this.$toast.fail('手机号或验证码错误')
                } else {
                    this.$toast.fail('登陆失败,请重试')
                }
            }
        },
        async onSendSms() {
            // 1.校验手机号
            // 接收name属性中的值
            try {
                await this.$refs.loginForm.validate('mobile')
                console.log('验证通过')
            } catch (err) {
                return console.log('验证失败', err)
            }
            // 2.验证通过显示倒计时
            this.isCountDownShow = true
            // 3.请求发送验证码
            try {
                await sendSms(this.user.mobile)
                this.$toast('发送成功')
            } catch (err) {
                this.isCountDownShow = false
                if (err.response.status === 429) {
                    this.$toast('发送太频繁了,请稍后重试')
                } else {
                    this.$toast('发送失败,请稍后重试')
                }
            }
        }
    }
}
</script>

<style lang="less" scoped>
.login-container {
    .toutiao {
        font-size: 37px;
    }

    .send-sms-btn {
        background-color: #ededed;
        height: 46px;
        width: 160px;
        line-height: 46px;
        color: #666;
    }

    .login-btn-wrap {
        margin: 53px 33px;

        .login-btn {
            background-color: #6db4fb;
            border: none;
        }
    }
}
</style>
