<template>
    <div class="update-photo">
        <img :src="img" class="img" ref="img">
        <div class="toolbar">
            <div class="cancel" @click="$emit('close')">取消</div>
            <div class="confirm" @click="onConfirm">完成</div>
        </div>
    </div>
</template>

<script>
import { editUserPhoto } from '@/api/user'
import 'cropperjs/dist/cropper.css'
import Cropper from 'cropperjs'
export default {
    name: 'UpdatePhoto',
    props: {
        img: {
            type: [String, Object],
            required: true
        }
    },
    data() {
        return {
            cropper: null
        }
    },
    computed: {},
    created() { },
    mounted() {
        const image = this.$refs.img
        this.cropper = new Cropper(image, {
            viewMode: 1, // 裁剪框只能在图片范围内移动
            dragMode: 'move', // 后面的图片可以拖动
            aspectRatio: 1, // 比例
            autoCropArea: 1,
            cropBoxMovable: false, // 裁剪框不能移动
            cropBoxResizable: false, // 裁剪框不能缩放
            background: false,
            movable: true
        })
    },
    methods: {
        onConfirm() {
            this.$toast.loading({
                message: '保存中...',
                forbidClick: true, // 禁止背景点击
                duration: 2000
            })
            // 基于服务端的裁切使用getData方法获取裁切参数
            // 纯客户端裁切使用getCroppedCanvas方法获取裁切的文件对象
            this.cropper.getCroppedCanvas().toBlob(async (blob) => {
                try {
                    // 错误传递方法
                    // editUserPhoto({
                    //     photo:blob
                    // })
                    // 如果接口要求Content-Type是multipart/form-data
                    // 则必须传递FormData对象
                    const formData = new FormData()
                    formData.append('photo', blob)
                    const { data } = await editUserPhoto(formData)
                    this.$emit('close')
                    this.$emit('update-photo', data.data.photo)
                    this.$toast.success('保存成功')
                } catch (err) {
                    this.$toast.error('保存失败')
                }
            })
        }
    }
}

</script>

<style lang='less' scoped>
.update-photo {
    background-color: #000;
    height: 100%;

    .img {
        max-width: 100%;
        display: block;
    }

    .toolbar {
        position: fixed;
        left: 0;
        right: 0;
        bottom: 0;
        display: flex;
        justify-content: space-between;

        .cancel,
        .confirm {
            width: 90px;
            height: 90px;
            font-size: 30px;
            display: flex;
            // 水平居中和垂直居中
            justify-content: center;
            align-items: center;
            color: #fff;
        }
    }
}
</style>
