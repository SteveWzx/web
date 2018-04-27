# DOCTYPE的作用：文档类型与浏览器模式

**DTD**（document type definition，文档类型定义）是一系列的语法规则， 用来定义XML或(X)HTML的文件类型。浏览器会使用它来判断文档类型， 决定使用何种协议来解析，以及切换浏览器模式。



> 事实上DTD可以定义所有[SGML](https://en.wikipedia.org/wiki/Standard_Generalized_Markup_Language)语族的文档类型，但由于太过繁琐， XML Schema反而更加流行。



多数[HTML](http://harttle.com/tags.html#HTML)编辑器都会为我们添加一行DOCTYPE声明，但DOCTYPE却是我们最容易忽略的部分。 下面我们会看到，DOCTYPE声明**并不是**可有可无的。

```html
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
  "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
```



# DOCTYPE

DOCTYPE是用来声明文档类型和DTD规范的，一个主要的用途便是文件的合法性验证。 如果文件代码不合法，那么浏览器解析时便会出一些差错。 [HTML](http://harttle.com/tags.html#HTML)编辑器通常也会在语法高亮的同时提供合法性验证。

DOCTYPE声明包括标准版本和一个DTD文件的URI。常用的DOCTYPE声明有以下几种：



> 以下代码来自 http://www.w3school.com.cn/tags/tag_doctype.asp



## HTML 5

```html
<!DOCTYPE html>
```



## HTML 4.01 Strict



该 DTD 包含所有 [HTML](http://harttle.com/tags.html#HTML) 元素和属性，但不包括展示性的和弃用的元素（比如 font）。不允许框架集（Framesets）。

```
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">

```

## HTML 4.01 Transitional

该 DTD 包含所有 [HTML](http://harttle.com/tags.html#HTML) 元素和属性，包括展示性的和弃用的元素（比如 font）。不允许框架集（Framesets）。

```
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" 
"http://www.w3.org/TR/html4/loose.dtd">

```

# 浏览器模式

为了能够很好地显示满足标准的页面，又能最大程度兼容不合法的HTML。 浏览器厂商一般会提供两种浏览器模式：

- *标准模式*（standards mode）：浏览器根据标准规约来渲染页面。
- *混杂模式*（quirks mode）：浏览器采用更加宽松的、向后兼容的方式来渲染页面。

混杂模式下，浏览器会模仿旧浏览器的行为，比如IE6，在此基础上兼容新的标准特性。 混杂模式又称兼容模式、怪异模式等。

## DOCTYPE切换

浏览器根据不同的DOCTYPE选择不同的渲染方法就叫做*DOCTYPE切换*。 其实DOCTYPE切换就是用来识别和兼容旧网页的。

以下情况浏览器会采用标准模式渲染：

- 给出了完整的DOCTYPE声明
- DOCTYPE声明了Strict DTD
- DOCTYPE声明了Transitional DTD和URI

以下情况浏览器会采用混杂模式渲染：

- DOCTYPE声明了Transitional DTD但未给出URI
- DOCTYPE声明不合法
- 未给出DOCTYPE声明

如果你是使用最新标准编写的页面但未给出DOCTYPE声明，这时就可能会出现一些怪异的行为。 例如盒模型不正确、窗口的`size`不正确等问题。所以，尽量为你网站的所有页面都给出合法的DOCTYPE声明。





主要参考

[http://harttle.com/2016/01/22/doctype.html](http://harttle.com/2016/01/22/doctype.html)