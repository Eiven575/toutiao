<template>
    <div class="my-container">
        <!-- 已登录头部区域 -->
        <div v-if="user" class="header user-info">
            <div class="base-info">
                <div class="left">
                    <van-image round fit="cover" class="avatar" :src="userInfo.photo" />
                    <span class="text">{{ userInfo.name }}</span>
                </div>
                <div class="right">
                    <van-button round class="edit-btn" type="default" to="/user/profile">编辑资料</van-button>
                </div>
            </div>
            <div class="data-stats">
                <div class="data-item">
                    <span class="count">{{ userInfo.art_count }}</span>
                    <span class="text">头条</span>
                </div>
                <div class="data-item">
                    <span class="count">{{ userInfo.follow_count }}</span>
                    <span class="text">关注</span>
                </div>
                <div class="data-item">
                    <span class="count">{{ userInfo.fans_count }}</span>
                    <span class="text">粉丝</span>
                </div>
                <div class="data-item">
                    <span class="count">{{ userInfo.like_count }}</span>
                    <span class="text">获赞</span>
                </div>
            </div>
        </div>

        <!-- 未登录头部区域 -->
        <div v-else class="header not-login">
            <div class="login-btn" @click="$router.push('/login')">
                <img class="mobile-img" src="~@/assets/mobile.png" alt="">
                <span class="text">登录 / 注册</span>
            </div>
        </div>

        <!-- 导航 -->
        <!-- clickable是点击反馈 类似于点击背景颜色变化的效果 -->
        <van-grid :column-num="2" class="grid-nav" clickable>
            <van-grid-item class="grid-item">
                <i slot="icon" class="toutiao toutiao-shoucang"></i>
                <span slot="text" class="text">收藏</span>
            </van-grid-item>
            <van-grid-item class="grid-item">
                <i slot="icon" class="toutiao toutiao-lishi"></i>
                <span slot="text" class="text">历史</span>
            </van-grid-item>
        </van-grid>

        <van-cell title="消息通知" is-link></van-cell>
        <van-cell title="小智同学" is-link></van-cell>
        <van-cell v-if="user" class="logout-cell" title="退出登录" @click="logout" clickable></van-cell>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import { getUserInfo } from '@/api/user'
export default {
    name: 'MyIndex',
    data() {
        return {
            // 用户信息
            userInfo: {}
        }
    },
    computed: {
        ...mapState(['user'])
    },
    created() {
        // 如果用户登陆了 则请求加载数据
        if (this.user) {
            this.loadUserInfo()
        }
    },
    mounted() { },
    methods: {
        logout() {
            // 在组件中需要使用this.$dialog来使用弹框组件
            this.$dialog.confirm({
                title: '确认退出吗'
            }).then(() => {
                this.$store.commit('setUser', null)
            }).catch(() => {
                // on cancel
            })
        },
        async loadUserInfo() {
            try {
                const { data } = await getUserInfo()
                this.userInfo = data.data
            } catch (err) {
                this.$toast('获取数据失败，请稍后重试')
            }
        }

    }
}

</script>

<style lang='less' scoped>
.my-container {
    .header {
        height: 361px;
        // css中使用@需要加~ @代表src根目录
        background: url("~@/assets/banner.png");
        background-size: cover;
    }

    .not-login {
        display: flex;
        justify-content: center;
        align-items: center;

        .login-btn {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;

            .mobile-img {
                height: 132px;
                width: 132px;
                margin-bottom: 15px
            }

            .text {
                font-size: 28px;
                color: #fff
            }
        }
    }

    .user-info {
        .base-info {
            height: 231px;
            padding: 76px 32px 23px;
            box-sizing: border-box;
            display: flex;
            justify-content: space-between;
            align-items: center;

            .left {
                display: flex;
                align-items: center;

                .avatar {
                    width: 132px;
                    height: 132px;
                    border: 4px solid #fff;
                }

                .text {
                    padding-left: 23px;
                    font-size: 30px;
                    color: #fff;
                }
            }

            .right {
                .edit-btn {
                    width: 176px;
                    height: 50px;
                    line-height: 50px;
                }
            }
        }

        .data-stats {
            display: flex;

            .data-item {
                height: 130px;
                flex: 1;
                display: flex;
                justify-content: center;
                // align-items需要和flex绑定使用 且必须要有高度
                align-items: center;
                flex-direction: column;
                color: #fff;

                .count {
                    font-size: 36px;
                }

                .text {
                    font-size: 23px;
                }
            }
        }
    }

    .grid-item {
        height: 141px;
        margin-bottom: 10px;

        i.toutiao {
            font-size: 45px;
        }

        .toutiao-shoucang {
            color: #eb5253
        }

        .toutiao-lishi {
            color: #ff9d1d
        }

        span.text {
            font-size: 28px;
        }
    }

    .logout-cell {
        margin-top: 10px;
        text-align: center;
        color: #eb5253;
    }
}
</style>
