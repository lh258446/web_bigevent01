//入口函数
$(function () {
    //1.获取用户信息
    getuserInof() 
    //2.退出功能
    var layer = layui.layer
    $('#btnLogout').on('click', function () {
        //框架提供的询问框
        layer.confirm('是否确认退出?', {icon: 3, title:'提示'}, function(index){
           //清除本地存储'token'
            localStorage.removeItem('token')
            //跳转页面
            location.href = '/login.html'
            //关闭询问框
            layer.close(index)
          });
    })
})
//获取用户信息(封装到入口函数外面)
//后面函数要调用
function getuserInof() {
    //发送ajax
    $.ajax({
        url: '/my/userinfo',
        // headers: {
        //     //重新登录,因为token过期事件12小时
        //     Authorization:localStorage.getItem('token') || ''
        // },
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
//渲染用户头像
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