window.onload = function () {
//创建实例化对象
var effects = new Slide();
// 调用轮播图方法
effects.slideMethod();
// 调用区域滚动方法
effects.rollMethod();
}

//创建一个构造函数
function Slide() {

}
//点出原型,给其添加方法
Slide.prototype = {
    // 轮播图
    slideMethod: function () {
        //获得slider插件对象
        var gallery = mui('.mui-slider');
        gallery.slider({
            interval: 1000 //自动轮播周期，若为0则不自动播放，默认为0；
        });
    },
    //区域滚动
    rollMethod : function(){
        // 初始化
        mui('.mui-scroll-wrapper').scroll({
            deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
        });
    }
    
}