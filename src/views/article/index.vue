<template>
    <div class="article-container">
        <!-- 导航栏 -->
        <van-nav-bar class="page-nav-bar" left-arrow title="黑马头条" @click-left="onClickLeft"></van-nav-bar>
        <!-- /导航栏 -->

        <div class="main-wrap">
            <!-- 加载中 -->
            <div class="loading-wrap" v-if="loading">
                <van-loading color="#3296fa" vertical>加载中</van-loading>
            </div>
            <!-- /加载中 -->

            <!-- 加载完成-文章详情 -->
            <div class="article-detail" v-else-if="article.title">
                <!-- 文章标题 -->
                <h1 class="article-title">{{ article.title }}</h1>
                <!-- /文章标题 -->

                <!-- 用户信息 -->
                <van-cell class="user-info" center :border="false">
                    <van-image class="avatar" slot="icon" round fit="cover" :src="article.aut_photo"></van-image>
                    <div slot="title" class="user-name">{{ article.aut_name }}</div>
                    <div slot="label" class="publish-date">{{ article.pubdate | relativeTime }}</div>
                    <!-- <van-button v-if="article.is_followed" class="follow-btn" round size="small" @click="onFollow"
                        :loading="followLoading">已关注</van-button>
                    <van-button v-else class="follow-btn" type="info" color="#3296fa" round size="small" icon="plus"
                        @click="onFollow" :loading="followLoading">关注</van-button> -->
                    <!--
                        模板中的$event就是子组件传过来的事件参数
                        当传递给子组件的数据集要使用还要修改
                            传递：props  :is-followed="article.is_followed"
                            修改：自定义事件  @update-is_followed="article.is_followed = $event"
                        简写方式 在组件上使用v-model="article.is_followed"相当于一次性写了下面两条语句
                            :value="article.is_followed"
                            @input="article.is_followed=$event"
                        如果有多个属性想想通过v-model绑定 使用.sync修饰符
                    -->
                    <follow-user class="follow-btn" :user-id="article.aut_id"
                        v-model="article.is_followed"></follow-user>
                </van-cell>
                <!-- /用户信息 -->

                <!-- 文章内容 -->
                <div class="article-content markdown-body" v-html="article.content" ref="article-content"></div>
                <van-divider>正文结束</van-divider>

                <!-- 文章评论部分 -->
                <comment-list :source="article.art_id" :list="commentList"></comment-list>

                <!-- 文章内容请求完毕以后才渲染底部区域 -->
                <!-- 底部区域 -->
                <div class="article-bottom">
                    <van-button class="comment-btn" type="default" round size="small"
                        @click="isPostShow = true">写评论</van-button>
                    <van-icon class="comment-icon" name="comment-o" :info="totalCommentCount = commentList.length" />
                    <!-- <van-button icon="star-o" /> -->
                    <!-- 收藏按钮 -->
                    <!-- v-model可以不写子组件自定义事件 @input="article.is_collected=$event" -->
                    <collect-article class="btn-item" v-model="article.is_collected"
                        :article-id="article.art_id"></collect-article>
                    <like-article class="btn-item" v-model="article.attitude"
                        :article-id="article.art_id"></like-article>
                    <van-icon name="share" color="#777777"></van-icon>
                </div>
                <!-- /底部区域 -->

                <!-- 发布评论弹出层 -->
                <van-popup v-model="isPostShow" position="bottom">
                    <post-comment :target="article.art_id" @post-success="onPostSuccess"></post-comment>
                </van-popup>
            </div>
            <!-- /加载完成-文章详情 -->

            <!-- 加载失败：404 -->
            <div class="error-wrap" v-else-if="errStatus === 404">
                <van-icon name="failure" />
                <p class="text">该资源不存在或已删除！</p>
            </div>
            <!-- /加载失败：404 -->

            <!-- 加载失败：其它未知错误（例如网络原因或服务端异常） -->
            <div class="error-wrap" v-else>
                <van-icon name="failure" />
                <p class="text">内容加载失败！</p>
                <van-button class="retry-btn" @click="loadArticle">点击重试</van-button>
            </div>
            <!-- /加载失败：其它未知错误（例如网络原因或服务端异常） -->
        </div>
    </div>
</template>

<script>
import PostComment from './componnets/comment-post'
import CommentList from './componnets/comment-list'
import LikeArticle from '@/components/like-article'
import FollowUser from '@/components/follow-user'
import CollectArticle from '@/components/collect-article'
import { getArticleById } from '@/api/article'
export default {
    name: 'ArticleIndex',
    components: {
        FollowUser,
        CollectArticle,
        LikeArticle,
        CommentList,
        PostComment
    },
    props: {
        articleId: {
            type: [Number, String],
            required: true
        }
    },
    data() {
        return {
            article: {},
            loading: true, // 加载中的loading状态
            errStatus: 0,
            followLoading: false,
            totalCommentCount: 0,
            isPostShow: false, // 评论弹出层是否显示
            commentList: [] // 评论列表
        }
    },
    computed: {},
    created() {
        this.loadArticle()
    },
    mounted() { },
    methods: {
        async loadArticle() {
            this.loading = true
            try {
                const { data } = await getArticleById(this.articleId)
                // 数据驱动视图这件事不是立即的
                this.article = data.data
                // 获取图片路径 因此这里获取不到
                // console.log(this.$refs['article-content'])
                // setTimeout(() => {
                //     this.previewImage()
                // }, 0)
            } catch (err) {
                if (err.response && err.response.status === 404) {
                    this.errStatus = 404
                }
            }
            // 无论成功或失败 都得关闭loading
            this.loading = false
        },
        onClickLeft() {
            this.$router.back()
        },
        // previewImage() {
        //     const articleContent = this.$refs['article-content']
        //     const imgs = articleContent.querySelectorAll('img')
        //     const images = []
        //     imgs.forEach((element, index) => {
        //         images.push(element.src)
        //         element.onclick = () => {
        //             ImagePreview({
        //                 // 预览图片地址数组
        //                 images,
        //                 // 起始位置
        //                 startPosition: index
        //             })
        //         }
        //     })
        // },
        onPostSuccess(data) {
            this.isPostShow = false
            this.commentList.unshift(data.new_obj)
        }
    }
}

</script>

<style lang='less' scoped>
@import "./github-markdown.css";

.article-container {
    .main-wrap {
        position: fixed;
        left: 0;
        right: 0;
        top: 92px;
        bottom: 88px;
        overflow-y: scroll;
        background-color: #fff;
    }

    .article-detail {
        .article-title {
            font-size: 40px;
            padding: 50px 32px;
            margin: 0;
            color: #3a3a3a;
        }

        .user-info {
            padding: 0 32px;

            .avatar {
                width: 70px;
                height: 70px;
                margin-right: 17px;
            }

            .van-cell__label {
                margin-top: 0;
            }

            .user-name {
                font-size: 24px;
                color: #3a3a3a;
            }

            .publish-date {
                font-size: 23px;
                color: #b7b7b7;
            }

            .follow-btn {
                width: 170px;
                height: 58px;
            }
        }

        .article-content {
            padding: 55px 32px;

            /deep/ p {
                // 可以使文本的两端都对齐 ，在两端对齐文本中，文本行的左右两端都放在父元素的内边界上，然后，调整单词和字母的间隔，使各行的长度恰好相等。 如果内容很少被拉开的距离太长，可以使用letter-spacing收缩一下字符间的距离。
                text-align: justify;
            }
        }
    }

    .loading-wrap {
        padding: 200px 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #fff;
    }

    .error-wrap {
        padding: 200px 32px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background-color: #fff;

        .van-icon {
            font-size: 122px;
            color: #b4b4b4;
        }

        .text {
            font-size: 30px;
            color: #666666;
            margin: 33px 0 46px;
        }

        .retry-btn {
            width: 280px;
            height: 70px;
            line-height: 70px;
            border: 1px solid #c3c3c3;
            font-size: 30px;
            color: #666666;
        }
    }

    .article-bottom {
        position: fixed;
        left: 0;
        right: 0;
        bottom: 0;
        display: flex;
        justify-content: space-around;
        align-items: center;
        box-sizing: border-box;
        height: 88px;
        border-top: 1px solid #d8d8d8;
        background-color: #fff;

        .comment-btn {
            width: 282px;
            height: 46px;
            border: 2px solid #eeeeee;
            font-size: 30px;
            line-height: 46px;
            color: #a7a7a7;
        }

        .btn-item {
            border: none;
            padding: 0;
            height: 40px;
            line-height: 40px;
            color: #777777;
        }

        /deep/ .van-icon {
            // 添加子组件后，子组件中有icon 所以需要使用/deep/来作用到icon
            font-size: 40px;
        }

        .comment-icon {
            top: 2px;
            color: #777;

            .van-info {
                font-size: 16px;
                background-color: #e22829;
            }
        }
    }
}
</style>
