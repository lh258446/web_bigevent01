$(function () {
    //1.初始化分类
    var form = layui.form
    var layer = layui.layer
    initCate()
    function initCate() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                //一定要调用form.render函数
                form.render()
            }
        })
    }
    //2.初始化富文本编辑器
    initEditor()


    //3.封面
    //3.1 初始化图片裁剪器
    var $image = $('#image')

    // 3.2 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3.3 初始化裁剪区域
    $image.cropper(options)

    //4.点击按钮,选择图片
    $('#btnChooseImage').on('click', function () {
        $('#coverFile').click()
    })

    //5.设置图片
    $('#coverFile').change(function (e) {
        var file = e.target.files[0]
        //非空校验 URL.createObjectURL() 参数不能为undefined
        if (file == undefined) {
            return
        }
        // 根据选择的文件,创建一个对应的URL地址
        var newImgURL = URL.createObjectURL(file)
        //先销毁旧的裁剪区域,再重新设置图片路径,之后再去创建新的裁剪区域
        $image
            .cropper('destroy')  //销毁旧的裁剪区域
            .attr('src', newImgURL) //重新设置图片路径
            .cropper(options)  //重新初始化裁剪区域
    })

    //6.设置状态
    var state = '已发布'
    $('#btnSave2').on('click', function () {
        state = '草稿'
    })

    //7.添加文章
    $('#form-pub').on('submit', function (e) {
        e.preventDefault()
        //收集数据
        var fd = new FormData(this)
        //放入状态
        fd.append('state', state)
        // 4. 将封面裁剪过后的图片，输出为一个文件对象
        $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 5. 将文件对象，存储到 fd 中
                fd.append('cover_img', blob)
                // 6. 发起 ajax 数据请求
                publishArticle(fd)
            })
    })

    //封装 添加文章的方法
    function publishArticle(fd) {
        $.ajax({
            method: 'post',
            url: '/my/article/add',
            data: fd,
            contentType: false,
            processData: false,
            success: function (res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg('恭喜你,已经文章成功')
                // location.href='/article/art_list.html'
                setTimeout(function () {
                    window.parent.document.getElementById('art_list').click()
                },1500)
            }
        })
    }
})