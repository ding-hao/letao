var leTao;
var page = 1;
window.onload = function(){
    //实例化对象
    leTao = new LeTao();
    //调用下拉刷新方法
    leTao.pullRefresh();
    //搜索商品
    leTao.searchProduct();
    //搜索页面,跳转过来
    search = getQueryString("search");

    //调用排序方法
    leTao.sortProductList();

    //调用跳转到详情页面的方法
    leTao.buyProduct();

    
}
var search = '';
//创建一个构造函数
function LeTao(){

}

//给他原型添加方法
LeTao.prototype = {
    //下拉刷新
    pullRefresh : function(){
        
        mui.init({
            pullRefresh: {　　
                container: ".mui-scroll-wrapper", //下拉刷新父容器容器标识
                //down表示控制下拉刷新
                down: {
                    //自动下拉刷新一次
                    auto: true,
                    //callback表示下拉刷新时的回调函数 可以发生ajax请求来刷新页面
                    callback: downCallback
                },
                //up表示控制上拉加载更多
                　　up: {　
                    　　　
                    contentrefresh: '正在加载...',
                    
                    　　　contentnomore: '没有更多数据了',
                    //上拉加载更多的回调函数 可以发送ajax请求来加载更多数据
                    　　　callback: upCallback
                }　　
            }
        });
         //下拉刷新页面  本来是写在初始化代码里面的down里面的,但是为了美观,规范就把他封装成函数提到外面来了,又因为是下拉的时候才要获取数据,所以 获取商品列表的这个方法,要在这里面调用
        function downCallback(){
            //调用获取列表商品方法,因为这里ajax请求需要多个数据,所以传个对象过去
            // 又因为你要获取到ajax请求回来的数据,所以还要传一个回调函数进去
            leTao.getProductlistData({
                //默认显示第一页,显示两条数据
                proName:search,
                pageSize:2,
                page:1
                // 这里的参数是形参  接收到请求的数据,去渲染页面
            },function(data){
                setTimeout(function(){
                    // console.log(data);
                //调用模板
                var html = template("productlistTemp",data);
                //渲染
                $(".product-exercise-area").html(html);
                
               
                //渲染出来后 要结束下拉
                // mui('.mui-scroll-wrapper').pullRefresh().endPullupToRefresh(true);
                mui('.mui-scroll-wrapper').pullRefresh().endPulldownToRefresh();
                 // 重置上拉加载更多
                 mui('.mui-scroll-wrapper').pullRefresh().refresh(true);
                },1000)
          
            });
        }

        //上拉加载页面
        function upCallback(){
            page++;
            //调用getProductlistData
            leTao.getProductlistData({
                proName:search,
                pageSize:2,
                page:page
            },function(data){
               setTimeout(function(){
                console.log(data);
                // console.log(data.data.length);
                
                var html = template("productlistTemp",data);
                // console.log(html);
                if(data.data.length<=0){
                    console.log("进来了");
                    
                    page = 1;
                    console.log(page);
                    
             // 结束上拉加载更多并且提示没有更多数据了
      mui('.mui-scroll-wrapper').pullRefresh().endPullupToRefresh(true);
      return;
                }
                //渲染
                // 上拉加载更多往后面的追加
                $('.product-exercise-area').append(html);
                //当数据刷新完毕结束上拉加载
                mui('.mui-scroll-wrapper').pullRefresh().endPullupToRefresh();
               },1000);
            })
        }
      
        
    },
    


    //创建一个公共的方法,调用ajax请求,获取商品列表
    getProductlistData:function(options,callback){
        //如果不传入页码数 默认为1
        options.page = options.page || 1;
        //如果不传入页码容量就默认为2
        options.pageSize = options.pageSize || 2;
        $.ajax({
            url:'/product/queryProduct',
            // 因为参数比较多,所以用对象的形式传参数进来
            data:options,
            success:function(data){
                // console.log(data);
                // 如果callback存在的话就调用类似于
                // if(callback){
                //     callback(data);
                // }
                callback && callback(data);
            }
        })
    },

//     当前商品列表页实现搜索功能
// 1. 给搜索按钮添加点击事件
// 2. 获取文本框搜索的内容
// 3. 根据当前输入框的内容来作为查询商品列表的条件
// 4. 调用获取商品列表数据的方法的时候
    searchProduct:function(){
        $(".mui-scroll button").on("click",function(){
            //获取用户输入的内容
             search = $(".mui-scroll input").val();
            
            leTao.getProductlistData({
                proName:search,
                page:1,
                pageSize:5
            },function(data){
                // console.log(data);
                
                var html = template('productlistTemp', data);
                $('.product-exercise-area').html(html);
            })
            
            
        })
        
    },

    //商品列表排序
//     价格排序
// 1. 给所有的排序标签删除active类名
// 2. 给当前点击的排序标签添加active类名
// 3. 在页面的商品列表的标题分别给4个排序标签绑定排序的方式
// 4. 点击某个排序的时候获取当前要排序的类型 进行排序
// 5. 如果type==price 价格排序
// 6. 把参数的price属性改成1或者2  如果是1就改成2 如果是2就改成1
sortProductList:function(){
$(".productlist-title .mui-content a").on("tap",function(){
    
    
  //删除所有active
  $(".productlist-title .mui-content .mui-col-xs-3").removeClass("active");
  $(this).parent().parent().addClass("active");
   var sort = $(this).data("sort");
   if(sort == 1){
       sort = 2;
       console.log(1);
       
       //先还原所有的i为向下
       $(".productlist-title .mui-col-xs-3 i").removeClass().addClass("fa fa-angle-down");
       $(this).find('i').removeClass("fa fa-angle-down").addClass("fa fa-angle-up");
      
       
   }else{
       sort = 1;
       console.log(2);
       
       //先还原所有的i为向下
       $(".productlist-title .mui-col-xs-3 i").removeClass().addClass("fa fa-angle-down");
    $(this).find('i').removeClass("fa-angle-up").addClass("fa-angle-down");
   
    
   }
// ---------------点击销量的箭头有时候要点两下才可以------------
   //把修改后的自定义属性重新赋值
   $(this).data("sort",sort);


   //自定义一个属性,原理跟上面类似
    //找到当前的自定义属性
    var sortType = $(this).data('sort-type');  
    if(sortType == "price"){
        //调用getProductlistData公共方法
        leTao.getProductlistData({
            page:1,
            pageSize:5,
            price:sort,
            proName: search,

        },function(data){
            console.log(data);
            //获取到符合的数据并渲染到页面
            var html = template("productlistTemp",data);
            $('.product-exercise-area').html(html);

            
        })
    }else if(sortType == "num"){
        //调用getProductlistData公共方法
        leTao.getProductlistData({
            page:1,
            pageSize:5,
            num:sort,
            proName: search,

        },function(data){
            console.log(data);
            //获取到符合的数据并渲染到页面
            var html = template("productlistTemp",data);
            $('.product-exercise-area').html(html);

            
        })
    }
    
})

    

},


//点击立即购买跳详情页面
buyProduct:function(){
   $("body").on("tap",".buy-btn",function(){
       window.location.href = "detail.html?id="+$(this).data("id");
       
   })


}




}
//     从搜索页面搜索商品跳转到商品列表页
// 1. 搜索页面点击搜索按钮的时候 跳转到商品列表页面 （同时要当前搜索内容搜索出来）
// 2. 在点击搜索的时候跳转到商品列表页面 同时把搜索的内容作为url的参数传递
// 3. 在商品列表页 获取url中的参数的值
// 4. 根据这个获取的参数值 请求获取商品列表数据的方法
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return decodeURI(r[2]);
    } else {
        return null;
    }
}
