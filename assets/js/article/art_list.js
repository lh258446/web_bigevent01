$(function () {
    //定义时间过滤器
    template.defaults.imports.dateFormat = function (dtstr) {
        var dt = new Date(dtstr)
        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())
        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())
        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    };
    //在各位数左侧补0
    function padZero(n) {
        return n > 9 ? n : '0' + n
    };
    //1.定义提交参数
    var q = {
        pagenum: 1,//页码值,默认请求第一页的数据
        pagesize: 2,//显示多少条数据 默认显示两条
        cate_id: '',//文章分类的Id
        state: ''  //文章的状态,可选值有:已发布,草稿
    };
    var layer = layui.layer
    //2.初始化文章列表
    initTable()
    function initTable() {
        $.ajax({
            method: 'get',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                var str = template('tpl-table', res)
                $('tbody').html(str)
                //分页
                renderPage(res.total)
            }
        })
    }

    //3.初始化分类
    var form = layui.form
    initCate()
    function initCate() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success: function (res) {
                //校验
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                //赋值
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                form.render()
            }
        })
    }

    //4.筛选功能
    $('#form-search').on('submit', function (e) {
        e.preventDefault()
        //获取
        var state = $('[name=state]').val()
        var cate_id = $('[name=cate_id]').val()
        //赋值
        q.state = state
        q.cate_id = cate_id
        // 初始化文章列表
        initTable()
    })

    //5.分页
    var laypage = layui.laypage
    function renderPage(total) {
        //执行一个laypage实例
        laypage.render({
            elem: 'pageBox',
            count: total,//数据总数,从服务端得到
            limit: q.pagesize,//每页几条
            curr: q.pagenum,//默认选中第几页

            //分页模块设置,显示哪些子模块
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10], //每页显示多少条数据的选择器

            //触发jump,分页初始化的时候,页码改变的时候
            jump: function (obj, first) {
                // obj :所有参数所在的对象,first:是否是第一次初始化分页
                //改变当前页
                q.pagenum = obj.curr
                q.pagesize = obj.limit
                // 不是第一次初始化分页,才能重新调用初始化文章列表
                if (!first) {
                    // 初始化文章列表
                    initTable()
                }
            }
        })
    }

    //6.删除
    var layer = layui.layer
    $('tbody').on('click', '.btn-delete', function () {
        //获取id
        var Id = $(this).attr('data-id')
        layer.confirm('是否确认删除?', { icon: 3, title: '提示' },
            function (index) {
                $.ajax({
                    method: 'get',
                    url: '/my/article/delete/' + Id,
                    success: function (res) {
                        if (res.status !== 0) {
                            return layer.msg(res.message)
                        }
                        layer.msg('恭喜你,文章删除成功!')
                        //页面汇总删除按钮个数等于1,页码大于1
                        if ($('.btn-delete').length == 1 && q.pagenum > 1) q.pagenum--
                        // 重新渲染页面
                        initTable()
                    }
                })
                layer.close(index)
            })
    })
})