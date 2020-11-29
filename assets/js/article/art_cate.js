$(function () {
    var layer = layui.layer
    //1.初始化文章类别列表展示
    initArtCateList()
    // 封装函数
    function initArtCateList() {
        $.ajax({
            url: '/my/article/cates',
            success: function (res) {
                // console.log(res);
                var str = template('tpl-art-cate', res)
                $('tbody').html(str)
            }
        })
    }
    //2.显示添加文章分类列表
    $('#btnAdd').on('click', function () {
        //框架弹出层
        indexAll = layer.open({
            type: 1,
            title: '添加文章分类',
            area: ['500px', '250px'],
            content: $('#dialog-add').html()
        })
    })

    //3.文章添加(事件委托)
    var indexAll = null
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'post',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                //重新渲染页面
                initArtCateList()
                layer.msg('恭喜你,文章类别添加成功!')
                layer.close(indexAll)
            }
        })
    })
    //4.修改展示表单
    //3.文章添加(事件委托)  通过代理形式绑定事件
    var indexEdit = null
    var form = layui.form
    $('tbody').on('click', '.btn-edit', function (e) {
        //4.1显示提示添加文章类别区域
        indexEdit = layer.open({
            type: 1,
            title: '修改文章分类',
            area: ['500px', '250px'],
            content: $('#dialog-edit').html()
        })
        //4.2获取Id,发送ajax获取数据,渲染到页面
        var Id = $(this).attr('data-id')
        $.ajax({
            method: 'get',
            url: '/my/article/cates/' + Id,
            success: function (res) {
                form.val('form-edit', res.data)
            }
        })

    })
    //4.修改提交  通过代理形式绑定事件
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg('文章类别更新成功！')
                // 关闭弹出层
                layer.close(indexEdit)
                // 重新渲染页面
                initArtCateList()
            }
        })
    })
    //5.删除
    $('tbody').on('click', '.btn-delete', function () {
        // 4.1获取Id  this的指向改变
        var Id = $(this).attr('data-Id')
        // 4.1显示对话框
        layer.confirm('是否确认删除?', { icon: 3, title: '提示' },
            function (index) {
                $.ajax({
                    method: 'get',
                    url: '/my/article/deletecate/' + Id,
                    success: function (res) {
                        if (res.status !== 0) {
                            return layer.msg(res.message)
                        }
                        layer.msg('恭喜你,文章类别删除成功')
                        // 重新渲染页面
                        initArtCateList()
                        layer.close(index)
                    }
                })
            })
    })
})