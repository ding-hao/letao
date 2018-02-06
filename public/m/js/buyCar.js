var leTao;
$(function () {
    //实例化
    leTao = new LeTao();
    //调用方法
    leTao.getCarData();
    //获取总价格
    leTao.getTotalPrice();
    //删除商品
    leTao.removeProduct();
    //编辑购物车
    leTao.redactCar();

})

// 创建构造函数
function LeTao() {

}

//点出原型,添加方法
LeTao.prototype = {
    // 刷新,渲染页面
    getCarData: function () {
        $.ajax({
            url: "/cart/queryCart",
            success: function (data) {
                console.log(data);

                //反转数组
                data = data.reverse();
                if (data.error) {
                    window.location.href = "login.html";
                } else {
                    //把数据包装成一个对象
                    var html = template("getCarDataTemp", {
                        "rows": data
                    });
                    $("#main").html(html);
                }

            }
        })

    },
    // 点击复选框获取总价格
    getTotalPrice: function () {


        // var price;
        // var num;
        // 动态生成的,要用委托事件
        $("#main").on("change", ".size input", function () {
            //拿到被勾选的input  获取到数组 所以遍历
            var checkbox = $("#main .size input:checked");
            //和
            var sum = 0;
            for (var i = 0; i < checkbox.length; i++) {
                //获取到价格              
                var price = $(checkbox[i]).data("price");
                var num = $(checkbox[i]).data("num");
                var count = price * num;
                sum += count;

            }
            //取出来的值有很多小数,可以乘以十在除以十
            sum = parseInt(sum * 100) / 100;
            console.log(sum);
            //把渲染到页面
            $(".indent .mon").html(sum);

        })
    },

    //点击删除按钮删除商品
    removeProduct: function () {
        //动态生成  委托事件
        $("#main").on("click", "a.mui-btn-yellow", function () {
            var that = $(this);

            mui.confirm('确定删除该商品?', "温馨提示", ["是", "否"], function (e) {
                if (e.index == 0) {
                    var id = that.data("id");

                    $.ajax({
                        url: "/cart/deleteCart",
                        data: {
                            id: id,
                        },
                        success: function (data) {
                            console.log(data);
                            if (data.success) {
                                //重新刷新页面
                                leTao.getCarData();
                            }

                        }
                    })

                }
            })

        })

    },

    //点击编辑按钮编辑商品
    redactCar: function () {
        //动态生成 事件委托
        $("#main").on("click", ".mui-btn-red", function () {
            var that = $(this);
            var productsize = that.data("productsize");
            var productnum = that.data("productnum");
            var id = that.data("id");
            var nownum = that.data("nownum");
            var num = that.data("num")
            // console.log(productsize);
            //声明一个对象保存需要的数据,然后在使用模板引擎渲染过去,为什么要用对象,因为模板传入的数据必须是要对象
            var wantData = {
                "nownum": nownum,
                "productnum": productnum,
                "id": id,
                "num":num
            }
            wantData.productsize = [];
            //把字符串截取
            var start = productsize.split("-")[0];
            // console.log(start);
            var end = productsize.split("-")[1];
            // console.log(end);

            for (var i = start; i <= end; i++) {
                wantData.productsize.push(parseInt(i));
            }
            console.log(wantData.productsize);
            console.log(wantData);
            var html = template("redactCarTemp", wantData);
            console.log(html);
            // 去空格,不然会很丑
            html = html.replace(/(\r)?\n/g, "");


            mui.confirm(html, "编辑", ["是", "否"], function (e) {

                if (e.index == 0) {

                    //获取当前选中的码数
                    var newSize = $(".product-size li.active").html();
                    // console.log(newSize);
                    //获取到修改的数量
                    var newNum = mui(".product-num").numbox().getValue();
                    // console.log(newNum);
                    $.ajax({
                        type: "post",
                        url: "/cart/updateCart",
                        data: {
                            "id": id,
                            "size": newSize,
                            "num": newNum
                        },
                        success: function (data) {
                            console.log(data);
                            if(data.success){
                                //重新加载页面
                                leTao.getCarData();
                            }
  

                        }
                    })









                } else {

                    console.log("放弃");

                }
            })
            //初始化 数字框  要延时 登数字框渲染出来
            setTimeout(function () {
                mui(".mui-numbox").numbox();
                console.log("aaa");
            }, 100);


            //点击码数,高亮
            $("body").on("click", ".product-size li", function () {

                //删除所有active
                $(".product-size li").removeClass("active");
                $(this).addClass("active");
            })


        })

    }
}