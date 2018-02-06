//声明变量接收id
var id = null;
var leTao = null;
$(function () {
    //调用截取URL里面的id名方法
    id = getQueryString("id");
    //实例化构造函数对象
    leTao = new LeTao();
    //调用获取产品数据方法
    leTao.getProductDetail();
    //调用添加购物方法
    leTao.addCar();

})

//创建一个构造函数
function LeTao() {

}

//点出原型,给其添加方法
LeTao.prototype = {

    //初始化轮播图
    solidinit: function () {
        //获得slider插件对象 初始化轮播图  最后调用 渲染完后再调用
        var gallery = mui('.mui-slider');
        gallery.slider({
            interval: 1000 //自动轮播周期，若为0则不自动播放，默认为0；
        });
    },
    //动态添加轮播图图片
    //     1. 根据图片数组 pic商品图片数组 生成轮播图的mui-slider-item项 但是这样只能生成对应图片数量的标签
    // 2. 要实现无缝轮播图 还需要复制第一张放到最后一张 复制最后一张到第一张 同时要给复制出来的mui-slider-item添加mui-slider-item-duplicate
    // 3. 给第一个小圆点添加active类名
    // 4. 初始化轮播图插件 自动轮播
    getProductDetail: function () {
        $.ajax({
            url: "/product/queryProductDetail",
            data: {
                "id": id,
            },
            success: function (data) {
                console.log(data);
                var html = template("solidTemp", data);
                $(".mui-slider").html(html);

                //获取第一张图片,赋给给最后一张
                var frist = $(".mui-slider-loop .mui-slider-item:first-of-type").clone().addClass(".mui-slider-item-duplicate");
                //获取最后图片,赋给给第一张
                var last = $(".mui-slider-loop .mui-slider-item:last-of-type").clone().addClass(".mui-slider-item-duplicate");
                console.log(frist);
                console.log(last);
                $(".mui-slider-loop").append(frist);
                $(".mui-slider-loop .mui-slider-item:first-of-type").before(last);
                leTao.solidinit();


                //     实现尺码的动态渲染 details
                // 1. 定义一个尺码数组 （用来装所有尺码）
                // 2. 数组里面存储尺码的每一个数组 例如35-40 存 [35,36,37,38,39,40]
                // 3. 把定义好的的尺码数组重复覆盖尺码的字符串
                // 4. 前端动态循环生成尺码span

                //获取到尺码
                // var size = data.size;

                //截取字符串

                //获取到开始和结束的尺码
                var start = data.size.split("-")[0];
                var end = data.size.split("-")[1];
                // console.log(end);
                // console.log(start);


                //声明一个空数组
                // var size = [];//不能这样直接添加,而是要给data对象添加方法
                data.size = [];
                //循环出这中间的所有数
                for (var i = start; i <= end; i++) {
                    data.size.push(i);
                }
                // 现在data里面有size方法了,所以模板引擎可以拿到了
                // console.log(data);

                // console.log(data.size);

                var numList = template("detailsTemp", data);

                $(".productlist-total").html(numList);
                //动态添加得数字输入框需要手动初始话  传入数字框的父容器
                mui(".mui-numbox").numbox();

                //点击码数高亮
                $(".productlist-total").on("click", "li", function () {
                    $(".productlist-total .product-size ul").children().removeClass("active");
                    $(this).addClass("active");

                })


            }
        })

    },
    //加入购物车
    addCar: function () {
        //点击添加购物按钮
        $("#footer .mui-btn-danger").on("click", function () {
            //点击判断尺寸,数量写了没

            // 找到带有active的标签的内容  尺寸
            var userSize = $(".productlist-total .product-size li.active").html();
            // console.log(userSize);
            var userNum = mui(".mui-numbox").numbox().getValue();
            // console.log(userNum);
            //id之前已经获取到了

            if (userSize == null) {
                //弹出框
                mui.toast('请选择尺码', {
                    duration: 'long',
                    type: 'div'
                })
                return;
            }
            if (userNum == 0) {
                //弹出框
                mui.toast('请选择数量', {
                    duration: 'long',
                    type: 'div'
                })
                return;
            }
            $.ajax({
                type: "post",
                url: "/cart/addCart",
                data: {
                    "productId": id,
                    "num": userNum,
                    "size": userSize,
                },
                success: function (data) {
                    if (data.error) {
                        window.location.href = "login.html";
                    } else {
                        //弹出提示框
                        mui.confirm('确定去结算吗', '温馨提示', ["不去", "去"], function (e) {
                            if (e.index == 0) {
                                //弹出框
                                mui.toast('为什么不买呢', {
                                    duration: 'long',
                                    type: 'div'
                                })
                                return;
                            } else {
                                //跳到购物车页面
                                window.location.href = "buyCar.html"
                            }

                        })
                        return;
                    }



                }
            })


        })
    }




}

function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return decodeURI(r[2]);
    } else {
        return null;
    }
}