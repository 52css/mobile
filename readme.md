# Mobile.js

### 主要作用
  + 解决手机上页面切换

### 使用方法
```html
  <!-- html结构 -->
  <div id="pageHome" class="page out" data-title="首页">
    <ul>
      <li><a href="#!/page1?id=1">页面1</a></li>
      <li><a href="#!/page2?id=2">页面2</a></li>
      <li><a href="#!/page3?id=3">页面3</a></li>
      <li><a href="ajax.html" data-reload="true">ajax</a></li>
      <li><a href="ajax1.html">ajax1</a></li>
      <li><a href="ajax2.html">ajax2</a></li>
    </ul>
  </div>
  <div id="page1" class="page out" data-title="page1">
    <a href="#!/pageHome" data-rel="back">&laquo;返回1</a>
  </div>
  <!-- 引用script -->
  <script src="js/lib/moblie.js"></script>
```

### api-页面切换
  + 页面前进(后退)-链接到本页 `<a href="#!/page1?id=1">页面1</a>`
  + 页面前进(后退)-链接到ajax页面 `<a href="ajax1.html">ajax1</a>`
  + -页面前进(后退)-通过js来链接到本页 `mobile.go("#!/page1?id=1")`
  + -页面前进(后退)-通过js到ajax页面  `mobile.go("ajax1.html")`
  + -页面前进-前n页 `moblie.go(n)`
  + -页面后退-后n页 `mobile.go(-n)`

### api-js页面初始化绑定事件
  + pageFirstInit 页面第一次载入
  + pageInit 每次页面载入
  + pageBeforeAnimate 页面进入动作之前
  + pageAfterAnimate 页面进入动作之后
  + pageOut 页面离开

```js
  // 每个页面都调用
  mobile.on('pageFirstInit', function(page) {
    console.log(page.id);
  });
  // 单独一个页面调用
  mobile.on('pageFirstInit', 'page1', function(page) {
    console.log(page.id);
  });
```

### api-插件-tab切换
  + tab切换 `<a href="#tabId">tabId</a>`相当于

```js
    $(document).on('click', this, function() {
      $(this).addClass('active').siblings().removeClass('active');
      $(this.href).show().siblings().hide();
      return false;
    });
```

### api-插件-toggle-class切换样式
  + data-toggle-class切换  `<dl data-toggle-class="open"></dl>` 相当于

```js
  $(document).on('click', this, function() {
    $(this).toggleClass('open');
    return false;
  });
```

### api-插件-add-class切换样式
  + data-add-class切换  `<dl data-add-class="open"></dl>` 相当于

```js
  $(document).on('click', this, function() {
    $(this).addClass('open');
    return false;
  });
```

### api-插件-remove-class切换样式
  + data-remove-class切换  `<dl data-remove-class="open"></dl>` 相当于

```js
  $(document).on('click', this, function() {
    $(this).removeClass('open');
    return false;
  });
```

### 兼容
ie10+ ff webkit（chrome opera safari）

### 许可
MIT许可


