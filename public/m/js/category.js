window.onload = function(){
//实例化对象
var leTao = new LeTao();
//调用方法
leTao.leftMethod();
//调用滚动的方法
leTao.rollMethod();
}

//创建一个构造函数
function LeTao(){

}
//点出原型,给其添加方法
LeTao.prototype = {
    //滚动右侧列表滚动
    rollMethod:function(){
        mui('.mui-scroll-wrapper').scroll({
            deceleration: 0.0005, //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
            indicators: false, //是否显示滚动条
        });
    },
    leftMethod : function(){
        //利用ajax获取数据动态添加到页面
        $.ajax({
            url:'/category/queryTopCategory',
            success:function(data){
                // console.log(data);
                //模板引擎填坑
                var leftTemp = template("leftTemp",data);
                $("#main ul").html(leftTemp);
                //给第一个li加active
                $("#main .left ul li").eq(0).addClass("active");
                
            }
        })
        // var id = $(".left");
        // var id = document.querySelector("#main>.left a");
        
        
        //点击获取相应的数据
        $(".left").on("click","li a",function(){
            $(".left ul li").removeClass("active")
           $(this).parent().addClass("active");
           var id = $(this).data("id");
           
            
           //调用ajax函数获取数据
           list(id);
            
        })

        //第一次的时候 页面一刷新就要默认请求数据,并且是第一个的
        list(1);
        function list(id){
            $.ajax({
               
                url:"/category/querySecondCategory",
                data:{
                    id:id
                },
                success:function(back){
                 // console.log(back);
                 var html = template("rightTemp",back);
                 console.log($(".wrapper"));
                 
                 $(".wrapper .list").html(html);
                }
            })
        }
        
        
    }
}