<template>
    <div class="search-history">
        <van-cell title="历史记录">
            <template v-if="isDeleteShow">
                <span @click="deleteAll">全部删除</span>
                &nbsp;&nbsp;
                <span @click="isDeleteShow = false">完成</span>
            </template>
            <van-icon v-else name="delete" slot="default" @click="isDeleteShow = true"></van-icon>
        </van-cell>
        <van-cell :title="item" v-for="(item, i) in searchHistories" :key="i" @click="isDelete(i, item)">
            <van-icon name="close" v-show="isDeleteShow"></van-icon>
        </van-cell>
    </div>
</template>

<script>
import { setItem } from '@/utils/storage'
export default {
    name: 'SearchHistory',
    props: {
        searchHistories: {
            type: Array,
            required: true
        }
    },
    data() {
        return {
            isDeleteShow: false
        }
    },
    computed: {},
    created() { },
    mounted() { },
    methods: {
        deleteAll() {
            this.searchHistories = []
            setItem('search-histories', [])
        },
        isDelete(i, item) {
            this.$emit('isDelete', i, this.isDeleteShow, item)
        }
    }
}

</script>

<style lang='less' scoped>

</style>
