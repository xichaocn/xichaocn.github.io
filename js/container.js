SyntaxHighlighter.config.bloggerMode = true;
SyntaxHighlighter.defaults['toolbar'] = false;
SyntaxHighlighter.all();

$(function(){
    var lastIdx;//上一次标题
    var thisIdx;//本次标题
    var allIdxArr = new Array(0,0,0,0,0,0);//用于标识是否存在H1至H6
    $(".autoHead").each(function(){
        var tagName = $(this).prop("tagName");
        allIdxArr[parseInt(tagName.charAt(1)) - 1] = 1;
        if(null == lastIdx) {
            thisIdx = tagName + "." + 1;
            lastIdx = thisIdx;
        } else {
            var lastArr = lastIdx.split(".");
            //根据标签名判断是否同级标签
            if(tagName == lastArr[0]){//本次和上次是兄弟标签
                thisIdx = lastIdx.substring(0, lastIdx.lastIndexOf(".") + 1)
                    + (parseInt(lastArr[lastArr.length - 1]) + 1);
            } else if(tagName > lastArr[0]) {//本次是上次的子标签
                thisIdx = lastIdx.replace(/H\d{1}/, tagName) + "." + 1;
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
            }
            lastIdx = thisIdx;
        }

        console.log(thisIdx);
        var txt = $(this).text();
        $(this).text(thisIdx.substring(3) + "." + txt);
    });
});

$(function(){
    //$("pre").css("border","1px #bbb solid");
    $("code").css("border","none");

    var topPosition = "<div id='top'></div>"; //定义顶部锚点的标签
    var goToTopButton = "<div id='goToTop' class='backtop'><a href='#'><img src='/images/backTop.png' alt='回到顶部'/></a></div>";  //定义按钮标签
    $("body").prepend(topPosition); //在container的div最前面加上锚点标签
    $("body").append(goToTopButton); //在container的div最后面加上按钮标签
    if ($(window).scrollTop() < 1) {
        $("#goToTop").hide();  //滚动条距离顶端的距离小于showDistance是隐藏goToTop按钮
    }
    var scroll_timer;
    var displayed = false;
    var $window = $(window);
    var top = $("#top").position().top + 600;

    var showBackTop = function () {
        window.clearTimeout(scroll_timer);
        scroll_timer = window.setTimeout(function () {
            if ($window.scrollTop() <= top) {
                displayed = false;
                $("#goToTop").fadeOut(400);
            } else if (displayed == false) { //show if scrolling down
                displayed = true;
                $("#goToTop").stop(true, true).show().click(function () {
                    $("#goToTop").fadeOut(300);
                });
            }
        }, 500);
    };
    showBackTop();
    $window.scroll(showBackTop);
});