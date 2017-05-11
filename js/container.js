SyntaxHighlighter.config.bloggerMode = true;
SyntaxHighlighter.defaults['toolbar'] = false;
SyntaxHighlighter.all();

$(function(){
    var lastIdx;//上一次标题索引，如H2.1.1
    var thisIdx;//本次标题索引
    var allIdxArr = new Array(0,0,0,0,0,0);//用于标识是否存在H1至H6
    //按链表结构存储标题对象，属性有：
    // tid标题ID、pre上一个标题对象、next下一个标题对象、diffGap与上一个标题差异代数
    // 另外根节点还会多一个size总标题数
    var rootTitle = new TitleNode(1, null, null, 0);//根标题对象
    rootTitle.setSize(0);
    var lastTitle = rootTitle;//上一个标题对象
    var thisTitle = rootTitle;//本次标题对象
    $(".autoHead").each(function(){
        var tagName = $(this).prop("tagName");
        allIdxArr[parseInt(tagName.charAt(1)) - 1] = 1;
        if(null == lastIdx) {
            thisIdx = tagName + "." + 1;
            rootTitle.setSize(1);
        } else {
            var lastArr = lastIdx.split(".");
            //根据标签名判断是否同级标签
            if(tagName == lastArr[0]){//本次和上次是兄弟标签
                thisIdx = lastIdx.substring(0, lastIdx.lastIndexOf(".") + 1)
                    + (parseInt(lastArr[lastArr.length - 1]) + 1);
                thisTitle = new TitleNode(thisIdx.substring(3), lastTitle, null, 0);
            } else if(tagName > lastArr[0]) {//本次是上次的子标签
                thisIdx = lastIdx.replace(/H\d{1}/, tagName) + "." + 1;
                thisTitle = new TitleNode(thisIdx.substring(3), lastTitle, null, 1);
            } else {//本次是上次的父亲（或更高）的兄弟标签
                //判断本次和上次差几代
                var gapCnt = 0;
                thisIdx = lastIdx;
                for(var i=parseInt(tagName.charAt(1)) - 1;i<parseInt(lastIdx.substr(1,2)) - 1;i++) {
                    if(0 == allIdxArr[i]) {
                        //若该位为0，则表示该级别的标题尚未存在
                        continue;
                    }
                    thisIdx = thisIdx.substring(0, thisIdx.lastIndexOf("."));
                    gapCnt++;
                }
                thisIdx = tagName
                    + thisIdx.substring(2, thisIdx.lastIndexOf(".") + 1)
                    + (parseInt(lastArr[lastArr.length - gapCnt - 1]) + 1);
                thisTitle = new TitleNode(thisIdx.substring(3), lastTitle, null, -gapCnt);
            }
        }
        lastIdx = thisIdx;

        //console.log(thisIdx);
        var txt = $(this).text();
        txt = thisIdx.substring(3) + "." + txt;
        $(this).attr("id", thisIdx.substring(3));
        $(this).text(txt);

        thisTitle.title = txt;
        lastTitle.next = thisTitle;
        lastTitle = thisTitle;
        rootTitle.setSize(rootTitle.size + 1);
    });
    //生成左侧文章目录
    generateCatalog(rootTitle);
});
/**
 * 标题对象，按链表结构存储
 * @param _tId 标题ID
 * @param _pre 上一个标题对象
 * @param _next 下一个标题对象
 * @param _diffGap 与上一个标题差异代数
 * @constructor
 */
function TitleNode(_tId, _pre, _next, _diffGap) {
    this.tId = _tId;
    this.pre = _pre;
    this.next = _next;
    this.diffGap = _diffGap;
}
TitleNode.prototype.setSize = function(_size) {
    this.size = _size;
};
TitleNode.prototype.toString = function() {
    console.log("tId=" + this.tId + ", diffGap=" + this.diffGap + ", size=" + this.size + ", title=" + this.title);
};

/**
 * 生成左侧文章目录
 * @param rootTitle 根标题
 */
function generateCatalog(rootTitle) {
    if(rootTitle.size <= 1 || isFromMobile()) {
        return;
    }
    var str = "<div id=\"catalog\" style=\"position: fixed;left: 0;margin-top: 50px;margin-left: -300px;\">";
    // str += "<div id=\"catalogBtn\" style=\"position: fixed;left: 0;margin-top: -30px;margin-left: 50px;cursor: pointer\">";
    // str += "关闭目录</div>";
    str += "<ul style=\"list-style: none;\">";

    var tmpTitle = rootTitle;
    while(null != tmpTitle.next) {
        str = appendCatalog(tmpTitle, str);

        // tmpTitle.toString();
        tmpTitle = tmpTitle.next;
    }
    str = appendCatalog(tmpTitle, str);

    str += "</ul></div>";

    $("#middleCon").prepend(str);
    $("#catalog").animate({
        marginLeft : "0"
    }, 500);
}
/**
 * 拼接左侧目录结构
 * @param tmpTitle
 * @param str
 */
function appendCatalog(tmpTitle, str) {
    if(tmpTitle.diffGap == 0) {
        str = str
            + "<li>"
            + "<a class=\"catalog\" href=\"#" + tmpTitle.tId + "\">" + tmpTitle.title + "</a>"
            + "</li>";
    } else if (tmpTitle.diffGap > 0) {
        str = str
            + "<ul style=\"list-style: none;margin-left: -25px;\">"
            + "<li>"
            + "<a class=\"catalog\" href=\"#" + tmpTitle.tId + "\">" + tmpTitle.title + "</a>"
            + "</li>";
    } else {
        str = str
            + "</ul>"
            + "<li>"
            + "<a class=\"catalog\" href=\"#" + tmpTitle.tId + "\">" + tmpTitle.title + "</a>"
            + "</li>";
    }
    return str;
}
/**
 * 判断是否从手机端访问
 */
function isFromMobile() {
    return /AppleWebKit.*Mobile/i.test(navigator.userAgent)
        || /MIDP|SymbianOS|NOKIA|SAMSUNG|LG|NEC|TCL|Alcatel|BIRD|DBTEL|Dopod|PHILIPS|HAIER|LENOVO|MOT-|Nokia|SonyEricsson|SIE-|Amoi|ZTE/.test(navigator.userAgent)
        || document.body.clientWidth <= 768;
}

$(function(){
    $("code").css("border","none");

    var goToTopButton = "<div id='goToTop' class='backtop'><a href='#'><img src='/images/back-top.png' alt='回到顶部'/></a></div>";  //定义按钮标签
    $("body").append(goToTopButton); //在container的div最后面加上按钮标签
    var showInstance = 600;
    var $goToTop = $("#goToTop");
    if ($(window).scrollTop() < showInstance) {
        $goToTop.hide();  //滚动条距离顶端的距离小于showDistance是隐藏goToTop按钮
    }
    var scroll_timer;
    var displayed = false;
    var $window = $(window);
    var showBackTop = function () {
        window.clearTimeout(scroll_timer);
        scroll_timer = window.setTimeout(function () {
            if ($window.scrollTop() <= showInstance) {
                displayed = false;
                $goToTop.fadeOut(400);
            } else if (displayed == false) { //show if scrolling down
                displayed = true;
                $goToTop.stop(true, true).show().click(function () {
                    $goToTop.fadeOut(300);
                });
            }
        }, 500);
    };
    showBackTop();
    $window.scroll(showBackTop);
});

/**
 * 处理页面滚动
 * 包括点击左侧导航、点击回到顶部按钮、刷新页面的滚动
 * @param hash
 */
function handleScroll(hash){
    var target = document.getElementById(hash.slice(1));
    var targetOffset = 0;
    if (target) {
        targetOffset = $(target).offset().top-60;
    }
    $("html,body").animate({
        scrollTop: targetOffset
    }, 500);
}
$(function(){
    // if(location.hash){
    //     setTimeout(function(){
    //         handleScroll(location.hash)
    //     },100);
    // }
    $("a[href^='#']").click(function(){
        handleScroll(this.hash);
    });
});
