<template>
    <div class="channel-edit">
        <!-- 我的频道 -->
        <van-cell :border="false">
            <div slot="title" class="title-text">我的频道</div>
            <!-- plain没有填充颜色 -->
            <van-button class="edit-btn" type="danger" round size="mini" plain @click="isEdit = !isEdit">{{ isEdit ?
                    '完成' : '编辑'
            }}</van-button>
        </van-cell>
        <van-grid :gutter="10" class="my-grid">
            <van-grid-item class="grid-item" v-for="(channel, i) in MyChannels" :key="i"
                @click="onMyChannelClick(channel, i)">
                <van-icon slot="icon" name="clear" v-show="(isEdit && !fixChannels.includes(channel.id))"></van-icon>
                <span slot="text" class="text" :class="{ active: i === active }">{{ channel.name }}</span>
            </van-grid-item>
        </van-grid>
        <!-- 频道推荐 -->
        <van-cell :border="false">
            <div slot="title" class="title-text">频道推荐</div>
        </van-cell>
        <van-grid :gutter="10" class="recommend-grid">
            <van-grid-item class="grid-item" icon="plus" v-for="(recommendchannel, i) in recommendChannels" :key="i"
                :text="recommendchannel.name" @click="onAddChannel(recommendchannel)" />
        </van-grid>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import { getAllChannels, addUserChannel, deleteUserChannel } from '@/api/channel'
import { setItem } from '@/utils/storage'

export default {
    name: 'ChannelEdit',
    // 子组件不能修改props数据
    props: {
        MyChannels: {
            type: Array,
            required: true
        },
        active: {
            type: Number,
            required: true
        }
    },
    data() {
        return {
            allChannels: [],
            isEdit: false,
            fixChannels: [0] // 固定频道 不允许删除
        }
    },
    computed: {
        ...mapState(['user']),
        // 计算属性会观测内部以来数据的变化
        // 如果依赖的数据发生变化，则计算属性会重新执行
        recommendChannels() {
            // filter方法遍历数组 把符合条件的元素存储到新数组中
            return this.allChannels.filter(channel => {
                return !this.MyChannels.find(MyChannel => {
                    return MyChannel.id === channel.id
                })
            })
            // const channels = []
            // this.allChannels.forEach(channel => {
            //     const res = this.MyChannels.find(MyChannel => {
            //         return MyChannel.id === channel.id
            //     })
            //     // 如果我的频道中不包括该频道项 则收集到推荐频道中
            //     if (!res) {
            //         channels.push(channel)
            //     }
            // })
            // return channels
        }
    },
    created() {
        this.loadAllChannels()
    },
    mounted() { },
    methods: {
        async loadAllChannels() {
            try {
                const { data } = await getAllChannels()
                this.allChannels = data.data.channels
            } catch (err) {
                this.$toast('数据获取失败')
            }
        },
        async onAddChannel(channel) {
            this.MyChannels.push(channel)
            if (this.user) {
                // 已登录，把数据请求接口放到线上
                try {
                    await addUserChannel({
                        id: channel.id,
                        seq: this.MyChannels.length
                    })
                } catch (err) {
                    this.$toast('保存失败')
                }
            } else {
                // 未登录，把数据存储到本地
                setItem('TOUTIAO_CHANNELS', this.MyChannels)
            }
        },
        onMyChannelClick(channel, index) {
            // 编辑状态 执行删除频道
            if (this.isEdit) {
                // 如果是固定频道 则不删除
                if (this.fixChannels.includes(channel.id)) return
                // 删除频道项
                this.MyChannels.splice(index, 1)
                // 更新激活的频道项
                if (index <= this.active) {
                    // 让激活频道的索引-1
                    this.$emit('update-active', this.active - 1, true)
                }
                // 更新后台数据
                this.deleteChannel(channel)
            } else {
                // 非编辑状态 执行切换频道
                this.$emit('update-active', index, false)
            }
        },
        async deleteChannel(channel) {
            if (this.user) {
                // 已登录，则将数据更新到线上
                try {
                    await deleteUserChannel(channel.id)
                } catch (err) {
                    this.$toast('操作失败')
                }
            } else {
                // 未登录，将数据更新到本地
                setItem('TOUTIAO_CHANNELS', this.MyChannels)
            }
        }
    }
}

</script>

<style lang='less' scoped>
.channel-edit {
    padding: 85px 0;

    .title-text {
        font-size: 32px;
        color: #333333
    }

    .edit-btn {
        width: 104px;
        height: 48px;
        font-size: 26px;
        color: #f85959;
        border: 1px solid #f85959;
    }

    .grid-item {
        width: 160px;
        height: 86px;

        /deep/ .van-grid-item__content {
            background-color: #f4f5f6;
            white-space: nowrap;

            .van-grid-item__text,
            .text {
                font-size: 28px;
                color: #222;
                margin-top: 0;
            }

            .active {
                color: red;
            }

            .van-grid-item__icon-wrapper {
                position: unset;
            }
        }

    }

    .recommend-grid {
        /deep/ .van-grid-item__content {
            flex-direction: row;

            .van-icon-plus {
                font-size: 28px;
                margin-right: 6px;
            }
        }
    }

    /deep/ .my-grid {
        .van-icon-clear {
            position: absolute;
            right: -10px;
            top: -10px;
            color: #cacaca;
            font-size: 30px;
            z-index: 2;
        }
    }
}
</style>
