var baseURL = 'http://ajax.frontend.itheima.net'
$.ajaxPrefilter(function (params) {
    //1.拼接对应环境的服务器地址
    params.url = baseURL + params.url
    //2.身份认证
    //对需要权限的接口配制头信息
    //必须以my开头
    if (params.url.indexOf('/my/') !== -1) {
        params.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }

    //3.登录拦截
    params.complete = function (res) {
        var obj = res.responseJSON
        if (obj.status == 1 && obj.message == '身份认证失败！') {
            //清空本地存储
            localStorage.removeItem('token')
            //跳转页面
            location.href='/login.html'
        }
    }


})