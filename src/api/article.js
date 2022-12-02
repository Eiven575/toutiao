import request from '@/utils/request'

// 加载文章列表数据
export const getArticles = params => {
    return request({
        method: 'GET',
        url: '/v1_0/articles',
        params
    })
}
