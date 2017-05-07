$(function(){
    $(".table .table-cell .awesome i").each(function(index){
        $(this).mouseenter(function(){
            $(this).attr("style", "background: #ff8c00;")
        }).mouseleave(function(){
            $(this).removeAttr("style");
        });
        var wechatTimeout;
        switch (index) {
            case 0 :
                $(this).click(function(){
                    location.href = "/archives.html";
                });
                break;
            case 1 :
                $(this).click(function(){
                    location.href = "/tags.html";
                });
                break;
            case 2 :
                $(this).click(function(){
                    location.href = "https://github.com/xichaocn";
                });
                break;
            case 3 :
                $(this).click(function(){
                    if(wechatTimeout) {
                        clearTimeout(wechatTimeout);
                    }
                    $(".wechat").toggle("slow");
                    wechatTimeout = setTimeout(function(){
                        $(".wechat").hide("slow");
                    }, 5000);
                });
                break;
            default :
                break;
        }
    });
    var rotateInterval;
    var angle = 0;
    $(".headImg").mouseenter(function(){
        $(this).addClass("shadow");
    }).mouseleave(function(){
        $(this).removeClass("shadow");
    }).click(function () {
        if(rotateInterval) {
            $("#wymusic").attr("src","");
            clearInterval(rotateInterval);
            rotateInterval = null;
        }else {
            var $that = $(this);
            rotateInterval = setInterval(function(){
                angle -= 1;
                $that.rotate(angle);
            },50);
            $("#wymusic").attr("src", "//music.163.com/outchain/player?type=2&id=411988502&auto=1&height=66");
        }
    });
});