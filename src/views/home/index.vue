<template>
    <div class="home-container">
        <!-- 导航栏 -->
        <van-nav-bar class="page-nav-bar" fixed>
            <van-button class="search-btn" slot="title" type="info" size="small" round icon="search">搜索</van-button>
        </van-nav-bar>
        <!-- 频道列表 -->
        <!-- 通过v-model绑定当前激活标签对应得索引值，默认情况下启用第一个标签 -->
        <!-- 通过 animated 属性可以开启切换标签内容时的转场动画。 -->
        <!-- 通过 swipeable 属性可以开启滑动切换标签页。 -->
        <van-tabs class="channel-tabs" v-model="active" animated swipeable>
            <van-tab :title="channel.name" v-for="channel in channels" :key="channel.id">
                <!-- 将父组件的channel传递给子组件，在子组件中接收 -->
                <article-list :channel="channel"></article-list>
            </van-tab>
            <div slot="nav-right" class="placeholder"></div>
            <div slot="nav-right" class="hamburger-btn" @click="isChannelEditShow = true">
                <i class="toutiao toutiao-gengduo"></i>
            </div>
        </van-tabs>

        <!-- 频道编辑弹出层 -->
        <van-popup v-model="isChannelEditShow" closeable position="bottom" :style="{ height: '100%' }"
            close-icon-position="top-left">
            <channel-edit :my-channels="channels" :active="active" @update-active="onUpdateActive"></channel-edit>
        </van-popup>
    </div>
</template>

<script>
import { getUserChannels } from '@/api/user'
import ArticleList from './components/article-list'
import ChannelEdit from './components/channel-edit'
import { mapState } from 'vuex'
import { getItem } from '@/utils/storage'

export default {
    components: { ArticleList, ChannelEdit },
    name: 'HomeIndex',
    data() {
        return {
            active: 0,
            // 频道数据列表
            channels: [],
            // 控制频道弹出层是否显示
            isChannelEditShow: false
        }
    },
    computed: {
        ...mapState(['user'])
    },
    created() {
        this.loadChannels()
    },
    mounted() { },
    methods: {
        async loadChannels() {
            try {
                let channels = []
                if (this.user) {
                    const { data } = await getUserChannels()
                    channels = data.data.channels
                } else {
                    const localChannels = getItem('TOUTIAO_CHANNEL')
                    if (this.loadChannels) {
                        // 有 直接拿来使用
                        channels = localChannels
                    } else {
                        // 没有 获取默认频道列表
                        const { data } = await getUserChannels()
                        channels = data.data.channels
                    }
                }
                this.channels = channels
            } catch (err) {
                this.$toast('获取频道数据失败')
            }
        },
        onUpdateActive(index, isChannelEditShow = true) {
            this.active = index
            this.isChannelEditShow = isChannelEditShow
        }
    }
}

</script>

<style lang='less' scoped>
.home-container {
    padding-top: 174px;
    padding-bottom: 100px;

    .van-nav-bar__title {
        max-width: unset;
    }

    .search-btn {
        width: 555px;
        height: 64px;
        background-color: #5babfb;
        border: none;
        font-size: 28px;

        .van-icon {
            font-size: 32px;
        }
    }

    // 如果不加/deep/会没有效果 因为scope确定了范围只作用于根组件 不会对子组件起作用
    // 上面有效果 可能是因为插槽的原因 就没有深层元素
    /deep/ .channel-tabs {
        .van-tabs__nav {
            padding: 0
        }

        .van-tabs__wrap {
            height: 82px;
            position: fixed;
            top: 92px;
            z-index: 1;
            // 下面两个属性为了撑开盒子
            left: 0;
            right: 0;
        }

        .van-tab {
            min-width: 200px;
            border-right: 10px solid #edeff3;
            font-size: 30px;
            color: #777777
        }

        .van-tab--active {
            color: #333
        }

        .van-tabs__line {
            width: 31px !important;
            height: 6px;
            background-color: #3296fa;
            bottom: 8px;
        }

        .hamburger-btn {
            position: fixed;
            right: 0;
            width: 66px;
            height: 82px;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: #fff;
            opacity: .902;

            i.toutiao {
                font-size: 33px;
            }

            // &用于找到父元素 也就是hamburger-btn 找到了之后在其之前添加背景图片
            &:before {
                content: "";
                position: absolute;
                left: 0;
                width: 1px;
                height: 100%;
                background-image: url('~@/assets/gradient-gray-line.png');
                background-size: contain;
            }
        }

        .placeholder {
            width: 66px;
            height: 82px;
            // 不让这个盒子参与剩余空间的计算 剩余已经没有空间了
            flex-shrink: 0;
        }
    }
}
</style>
