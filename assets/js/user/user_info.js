$(function () {
    //1.自定义验证规则
    var form = layui.form
    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return '昵称长度为1~6位之间!'
            }
        }
    })
    //2.用户信息获取/赋值
    initUserInfo()
    var layer = layui.layer
    //封装
    function initUserInfo() {
        $.ajax({
            method: 'get',
            url: '/my/userinfo',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                //成功后渲染
                form.val('formUserInfo',res.data)
            }
        })
    }

    //3.重置表单数据
    //绑定事件
    $('#btnReset').on('click',function (e) {
        //阻止重置
        e.preventDefault()
        //重新渲染
        initUserInfo()
    })


    //4.修改用户信息
    $('.layui-form').on('submit', function (e) {
        //阻止默认行为
        e.preventDefault()
        //发送ajax,修改用户行为
        $.ajax({
            method: 'post',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success:function(res){
                if (res.status !== 0) {
                    return layer.msg('用户信息更改失败!')
                }
                layer.msg('用户信息更改成功!')
                //调用父页面的更新用户信息和头像的方法
                window.parent.getuserInof()
            }
        })
    })


    
})
