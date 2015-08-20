1、background-size 必须设置在background之后才能生效
2、定位的span可以设置宽高
3、initial可以作为所有属性的值，表示默认的样式
4、降级（功能衰减）意味着往回看；而渐进增强则意味着朝前看，同时保证其根基处于安全地带。
5、可以用到渐进增强的css3属性为：圆角、阴影、动画
6、如果要媒体插叙起效果，媒体查询必须放在后面。若媒体查询放前面，则字体大小还是17px。
    .about-top p{
	  font-size:17px;
	}
	@media (max-width: 640px){
		.about-top p.about-p {
	  		font-size:14px;
		}
	}

8.IE678不支持addEventListener方法，不支持DOMContentLoaded事件。

7、IE的浏览器模式和文档模式研究
  
   浏览器模式
    
   a、若浏览器模式是IE9           UA:Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Trident/5.0)

   b、若浏览器模式是IE8           UA:Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.1; Trident/4.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; .NET4.0C; .NET4.0E)
   
   c、若浏览器模式是IE7           UA:Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.1; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; .NET4.0C; .NET4.0E)

   b、若浏览器模式是IE9兼容性视图 UA:Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.1; Trident/5.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; .NET4.0C; .NET4.0E)

   简而言之，浏览器模式是IE用来告诉服务器，我是什么浏览器（虽然有时候不是这样的），因为服务器有可能根据不同的UA来做不同的事情


   网络摘抄：用于切换IE针对该网页的默认文档模式、对不同版本浏览器的条件备注解析、发送给网站服务器的用户代理（User-Agent）字符串的值。网站可以根据浏览器返回的不同用户代理字符串判断浏览器的版本和安装的功能，这样就可以向不同的浏览器返回不同的页面内容。

   默认情况下，IE8的浏览器模式为IE8。用户可以通过单击地址栏旁边的兼容性视图按钮（ ）来手动切换到不同的浏览器模式。在IE8中，IE8兼容性视图会以IE7文档模式来显示网页，同时会向服务器发送IE7的用户代理字符串。

   
   文档模式不决定UA串，但是他决定了再本地浏览器上用什么文档类型来解析网页，这个更厉害，是用来决定网页最终显示方式的

   如果IE浏览器模式是IE678，但是文档模式是IE9的话，那么还是按照IE9来解析。


   网络摘抄：用于指定IE的页面排版引擎（Trident）以哪个版本的方式来解析并渲染网页代码。切换文档模式会导致网页被刷新，但不会更改用户代理字符串中的版本号，也不会从服务器重新下载网页。切换浏览器模式的同时，浏览器也会自动切换到相应的文档模式。

   总结：可以概括一句话：流主外，文主内。
   注意：普通用户调整的“兼容性视图”，是调整的“浏览器模式”，所以调整完，不一定能改变网页的显示及js的执行方式

   文档模式决定了页面的布局及js的执行方式。当文档模式为混杂模式时 !-[1,] 返回true。。
   他存在的意义在于，一些老的网站的布局及js的执行，在新浏览器下不至于乱掉或错误。


 8、在IE下，决定文档最终的呈现方式的有两种

   a、<!DOCTYPE html> 他决定了浏览器用什么文档类型来解析

       常见的7中，HTML4.01的3中（严格、过渡、宽松）
                  XHTML1.0的3中（严格、过渡、宽松）
                  HTML5的一种  <!DOCTYPE html>

   b、<meta content="IE=edge,chrome=1" http-equiv=X-UA-Compatible>

       此meta标签告诉IE，用他的最高的文档模型来解析渲染网页
       IE=8，告诉浏览器，用IE8来解析渲染网页

   c、两者都有听meta的。两者都没有就用混杂文档模式。

 9、快速判断IE678，!-[1,]


 10、页面可视区的高度

     var clientHeight = document.documentElement.clientHeight || document.body.clientHeight;

     必须这样写顺序也不能变。第二个是为了兼容没有Doctype的chrome。
 
 11、可能css3为了鼓励使用translate来位移，所以把按照top和left的位移变的很生硬（transition）

 12、在编程时，发现transition和transform不能一起设置cssText

 13、

@keyframes 规定动画。
animation 所有动画属性的简写属性，除了 animation-play-state 属性。
animation-name  规定 @keyframes 动画的名称。
animation-duration  规定动画完成一个周期所花费的秒或毫秒。默认是 0。 
animation-timing-function 规定动画的速度曲线。默认是 "ease"。
animation-delay 规定动画何时开始。默认是 0。

animation-iteration-count 规定动画被播放的次数。默认是 1。常用infinite来无限循环动画。
n 定义动画播放次数的数值。
infinite  规定动画应该无限次播放。

animation-direction 规定动画是否在下一周期逆向地播放。默认是 "normal"。
normal  默认值。动画应该正常播放。此属性决定了我能不能实现CD效果。默认就是CD效果
alternate 动画应该轮流反向播放。

animation-play-state  规定动画是否正在运行或暂停。默认是 "running"。
paused  规定动画已暂停。
running 规定动画正在播放。


animation-fill-mode 规定对象动画时间之外的状态。此属性决定了能不能用animation实现跟move.js相同的效果

none  不改变默认行为。
forwards  当动画完成后，保持最后一个属性值（在最后一个关键帧中定义）。
backwards 在 animation-delay 所指定的一段时间内，在动画显示之前，应用开始属性值（在第一个关键帧中定义）。
both  向前和向后填充模式都被应用。

14、

以下的都是可以被继承的，除了这些之外，其他的都不可被继承：

文本相关属性：font-family, font-size, font-style,font-variant, font-weight, font, letter-spacing,
line-height，text-align, text-indent, text-transform,word-spacing
列表相关属性：
list-style-image, list-style-position,list-style-type, list-style
还有一个属性比较重要，color属性。



    


   


