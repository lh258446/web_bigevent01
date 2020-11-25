//入口函数
$(function () {
    //1.获取用户信息
    getuserInof() 
})
//获取用户信息(封装到入口函数外面)
//后面函数要调用
function getuserInof() {
    //发送ajax
    $.ajax({
        url: '/my/userinfo',
        headers: {
            //重新登录,因为token过期事件12小时
            Authorization:localStorage.getItem('token') || ''
        },
        success: function (res) {
            console.log(res);
            //判断状态码
            if (res.status !== 0) {
                return layui.layer.msg(res.message)
            }
            //请求成功,渲染用户头像
            renderAvatar(res.data)
        }
    })
}
//
function renderAvatar(user) {
    //1.用户名(昵称优先,没有用username)
    var name = user.nickname || user.username
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name)
    //用户头像
    if (user.user_pic !== null) {
        //有头像
        $('.layui-nav-img').show().attr('src', user.user_pic)
        $('.user-avatar').hide()
    } else {
        //没有头像
        $('.layui-nav-img').hide()
        var text = name[0].toUpperCase()
        $('.text-avatar').show().html(text)
    }
}