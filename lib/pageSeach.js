/*
 * GET home page.
 */
var blog = require('./nedb/blog');

var config = require("./config.js").config;
var tool = require('./tool');

exports.baidu = function (req, res) {
    res.send('EEvgRtjofr');
}
exports.index = function (req, res) {
    var listli = '';
    var b = {};
    b.title = config.title;
    b.description = config.description;


    var xuanzhong = config.menu;
    var classname = '';

    var cSize = req.query.pageSize;
    var word=req.query.word ;


    if (!cSize) {
        cSize = 100;
    }

    var page = parseInt(req.params.page) || 1;

    classname = classname + '<ul class="nav pull-right navbar-nav">';
    classname = classname + '<li class="active" ><a href="/">首页</a></li>';
    for (var i = 0; i < xuanzhong.length; i++) {


        classname = classname + '<li><a href="' + xuanzhong[i].url + '">' + xuanzhong[i].name + '</a></li>';

    }
    classname = classname + '</ul>';
    blog.newlist().then(function ( v) {

            listli = listli + '<ul class="grove-list">';
            for (var i = 0; i < v.length; i++) {
                // log.warn('11111','<a href="/blog/' + v[i]._id + '.html">') ;
                listli = listli + '<li><h5 class=\"media-heading\">';
                listli = listli + '<a href="/blog/' + v[i]._id + '.html">';
                listli = listli + '' + v[i].title + '';
                listli = listli + '</a>';
                listli = listli + '</li>';
                if (i == 10) {
                    break;
                }
            }
            listli = listli + '</ul">';
            var toplist = [];
            if(word) {
                blog.seach(word).then(function (list) {
                    if (list) {
                        for (var i = 0; i < list.length; i++) {
                            var top = list[i];
                            if (list[i].content) {
                                top.content = tool.delHtmlTag(list[i].content);
                            }
                            toplist.push(top);
                        }
                    }

                    list.sort(tool.sortJSONArry('created', true, Date.parse));

                    var ret = {
                        page: page,
                        perPage: cSize,
                        total: list.length,
                        items: tool.getPageData(toplist, cSize, page),
                        pages: tool.getPageInfo(list.length, cSize).pageCount

                    }


                    //  res.send(ret);
                    if(ret) {
                        res.render('search', {blog: b, listli: listli, classname: classname, paginate: ret});
                    }
                    else
                    {
                        res.render('search', {blog: b, listli: listli, classname: classname, paginate:''});
                    }
                })


            }
            else
            {
                res.render('search', {blog: b, listli: listli, classname: classname, paginate:''});
            }



        }
    )

};

