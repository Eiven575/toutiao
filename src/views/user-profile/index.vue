<template>
    <div class="user-profile">
        <!-- 导航栏 click-left是左侧点击事件 -->
        <van-nav-bar class="page-nav-bar" title="个人信息" left-arrow @click-left="$router.back()"></van-nav-bar>
        <input type="file" hidden ref="file" @change="onFileChange">
        <!-- 个人信息 -->
        <van-cell title="头像" is-link @click="$refs.file.click()">
            <van-image class="avatar" fit="cover" round :src="user.photo" />
        </van-cell>
        <van-cell title="昵称" :value="user.name" is-link @click="isUpdateNameShow = true"></van-cell>
        <van-cell title="性别" :value="user.gender === 0 ? '男' : '女'" is-link
            @click="isUpdateGenderShow = true"></van-cell>
        <van-cell title="生日" :value="user.birthday" is-link @click="isUpdateBirthdayShow = true"></van-cell>
        <!-- 编辑昵称 -->
        <van-popup v-model="isUpdateNameShow" position="bottom">
            <!-- 让组件和弹出层一起显示或者隐藏 隐藏之后内容就不会再保存 -->
            <update-name v-if="isUpdateNameShow" @close="isUpdateNameShow = false" v-model="user.name"></update-name>
        </van-popup>
        <!-- 编辑性别 -->
        <van-popup v-model="isUpdateGenderShow" position="bottom" style="width: 100%;">
            <!-- 让组件和弹出层一起显示或者隐藏 隐藏之后内容就不会再保存 -->
            <update-gender v-if="isUpdateGenderShow" @close="isUpdateGenderShow = false"
                v-model="user.gender"></update-gender>
        </van-popup>
        <!-- 编辑生日 -->
        <van-popup v-model="isUpdateBirthdayShow" position="bottom" style="width: 100%;">
            <!-- 让组件和弹出层一起显示或者隐藏 隐藏之后内容就不会再保存 -->
            <update-birthday v-if="isUpdateBirthdayShow" @close="isUpdateBirthdayShow = false"
                v-model="user.birthday"></update-birthday>
        </van-popup>
        <!-- 编辑头像 -->
        <van-popup v-model="isUpdatePhotoShow" position="bottom" style="height: 100%;">
            <!-- 让组件和弹出层一起显示或者隐藏 隐藏之后内容就不会再保存 -->
            <update-photo v-if="isUpdatePhotoShow" @close="isUpdatePhotoShow = false" :img="img" @update-photo="user.photo=$event"></update-photo>
        </van-popup>
    </div>
</template>

<script>
import UpdateGender from './components/update-gender'
import { getUserProfile } from '../../api/user'
import UpdateName from './components/update-name.vue'
import UpdateBirthday from './components/update-birthday'
import UpdatePhoto from './components/update-photo'
export default {
    name: 'UserProfile',
    components: {
        UpdateName,
        UpdateGender,
        UpdateBirthday,
        UpdatePhoto
    },
    data() {
        return {
            user: {},
            isUpdateNameShow: false,
            isUpdateGenderShow: false,
            isUpdateBirthdayShow: false,
            isUpdatePhotoShow: false,
            img: null // 预览的图片
        }
    },
    computed: {},
    created() {
        this.loadUserProfile()
    },
    mounted() { },
    methods: {
        async loadUserProfile() {
            try {
                const { data } = await getUserProfile()
                this.user = data.data
            } catch (err) {
                this.$toast('获取数据失败')
            }
        },
        onFileChange() {
            // 获取文件对象
            const file = this.$refs.file.files[0]
            // 基于文章对象获取blob数据
            this.img = window.URL.createObjectURL(file)
            this.isUpdatePhotoShow = true
            // 如果选了同一个文件change事件不会触发
            // 解决办法：每次使用完毕清空value
            this.$refs.file.value = ''
        }
    }
}

</script>

<style lang='less' scoped>
.user-profile {
    .avatar {
        width: 60px;
        height: 60px;
    }

    .van-popup {
        background-color: #f5f7f9;
    }
}
</style>
