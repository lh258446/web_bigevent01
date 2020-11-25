$(function () {
    // 1.点击去注册账号,隐藏登录区域,显示注册区域
    $('#link_reg').on('click', function () {
        $('.login-box').hide()
        $('.reg-box').show()
    })
    // 2.点击去登录,显示登录区域,隐藏注册区域
    $('#link_login').on('click', function () {
        $('.login-box').show()
        $('.reg-box').hide()
    })

    //3.验证规则
    //从layui中获取form对象
    var form = layui.form
    //通过 form.verify() 函数自定义校验规则
    form.verify({
        //自定义了一个  pwd 的校验规则
        pwd: [
            /^[\S]{6,12}$/,
            "密码必须6-12位,且不能输入空格"
        ],
        //确认密码规则
        repwd: function (value) {
            //选择器必须带空格 选择的是后代的input ,name属性值为password的那一个标签
            var pwd = $('.reg-box [name=password]').val()
            //比较
            if (pwd !== value) {
                return '两次密码不一致'
            }
        }
    })

    //4.注册功能
    var layer=layui.layer
    $('#form_reg').on('submit', function (e) {
        //阻止表单提交
        e.preventDefault();
        //发送ajax
        $.ajax({
            method: 'post',
            url: '/api/login',
            data: {
                username:$('.reg-box [name=username]').val(),
                password:$('.reg-box [name=password]').val()
            },
            success: function (res) {
                 //返回状态判断
                if (res.status !== 0) {
                    return layer.msg(res.message); 
                }
                //提交成功后处理代码
                layer.msg('注册成功,请登录')
                //跳转页面
                $('#link_login').click()
                //清空表单
                $('#form_reg')[0].reset()
            }
        })
    })


    //5.登录功能
    $('#form_login').submit(function (e) {
        e.preventDefault()
        $.ajax({
            method: 'post',
            url: '/api/login',
            data: $(this). serialize(),
            success: function (res) {
                if (res.status !== 0) {
                   return layer.msg(res.message)
                }
                layer.msg('恭喜你,登录成功')
                //存储到本地
                localStorage.setItem('token', res.token)
                //跳转页面
                location.href='/index.html'
            }
        })
    })
})