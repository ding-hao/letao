var leTao;
window.onload = function () {
    leTao = new LeTao();
    //调用添加
    leTao.addSearch();
    //调用渲染
    leTao.searchHistory();
    //调用删除
    leTao.deleteHistory();
    //调用清空所有
    leTao.clearHistory();
}

//创建构造函数
function LeTao() {

}
LeTao.prototype = {
    //添加搜索记录
    addSearch: function () {
        //点击搜索按钮
        $("#main button").on("click", function () {
            //获取到输入框的值  localStorage
            var search = $("#main form input").val();




            //一点击就要先获取下看有没有值,有的话就取没有的话就给他个空要把它存入localStorage 就要给他转换成json格式的字符串
            var historyData = JSON.parse(localStorage.getItem("historyData") || "[]");


            //判断输入框里面有没有,没有的话就提示他输入
            if (!search) {
                alert("请输入相应商品");
                //结束本次函数
                return false;
            }
            //因为后续还要点击x就删除它,所以要给他设置一个id
            //把这个对象给push就去   historyData是一个数组
            // id具有唯一性,所以当即使前面的元素被删除了,也不能使用以前前面的id
            var id;
            if(historyData.length == 0){
                id = 1;
            }else{
                id = historyData[historyData.length-1].id+1;
            }
            var obj = {
                "search": search,"id":id
            }
            console.log(id);
            
            historyData.push(obj);
            //设置localStorage 
            localStorage.setItem("historyData", JSON.stringify(historyData));
            //调用渲染
            leTao.searchHistory();
             //跳到商品列表页
             window.location.href = "productlist.html?search="+search;


        })

    },



    // 2. 查询搜索历史记录：
    //    查询搜索历史记录渲染到列表里面
    //    1. 获取本地存储的历史记录 （转成数组）
    //    2. 使用数组渲染页面
    // 根据本地存储的键获取值  当获取的时候把字符串 要转成数组 JSON.parse
    searchHistory: function () {
        var historyData = JSON.parse(localStorage.getItem("historyData") || "[]");
        //翻转数组 因为你最后一次输入的要第一个渲染
        historyData = historyData.reverse();

        //使用模板引擎进行渲染   模板引擎传入的数据只能传入一个对象,所以要把它包装成一个对象
        var html = template("searchTemp", {
            "rows": historyData
        });
        console.log({
            "rows": historyData
        });
        
        //把他添加到list里面
        $(".list").html(html);



    },



    // 删除搜索历史记录
    deleteHistory:function(){
        // 3. 删除搜索历史记录 
        // 点击x的时候要删除当前行的搜索历史记录
        // 1. 要给所有x添加点击事件
        // 2. 拿到当前点击的x对应的搜索历史的id
        // 3. 从所有的数组里面查找这个id 把当前的值删除掉
        // 4. 重新把删除后的数组保存到本地存储里面
        // 5. 删完之后重新渲染页面（要重新查询一次）
        //要获取到id才可以,所以在添加历史记录哪里添加数据进historyData的时候就要添加个id进去
        
        //添加点击事件 因为是动态生成的所以用事件委托
        $(".list").on("click",".fa-close",function(){
            //获取到点击的id
        var id = $(this).data("id");
        
        
        //获取到所有的数组
        var historyData = JSON.parse(localStorage.getItem("historyData") ||"[]");
        console.log(historyData);
        //循环遍历所有数组
        for(var i =0;i<historyData.length;i++){
            if(historyData[i].id == id){
                historyData.splice(i, 1);
            }
        }
        //转成字符串
        console.log(historyData);
        
        //把修改完的数组从新赋值给localStorage
        localStorage.setItem('historyData', JSON.stringify(historyData));
        //调用渲染
        leTao.searchHistory();
        
        
            
        })

    },


    //清空历史记录
    clearHistory:function(){
        //点击清空按钮,清空所有历史记录
        $(".searchHistory .fa-trash").on("click",function(){
            //设置localStorage等于空数组就可以了
            // localStorage.setItem("historyData","[]");

            //或者这样也可以
            localStorage.removeItem('historyData');
            //调用渲染
        leTao.searchHistory();
        })
    }


}