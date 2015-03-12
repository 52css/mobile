# Mobile.js

### 主要作用
  + 解决手机上页面切换

### 使用方法
```html
  <!-- html结构 -->
  <div id="pageHome" class="page out" data-title="首页">
    <ul>
      <li><a href="#page1?id=1">页面1</a></li>
      <li><a href="#page2?id=2">页面2</a></li>
      <li><a href="#page3?id=3">页面3</a></li>
      <li><a href="ajax.html" data-reload="true">ajax</a></li>
      <li><a href="ajax1.html">ajax1</a></li>
      <li><a href="ajax2.html">ajax2</a></li>
    </ul>
  </div>
  <div id="page1" class="page out" data-title="page1">
    <a href="#pageHome" data-rel="back">&laquo;返回1</a>
    <!--<ul>-->
      <!--<li><a href="#page2">页面2</a></li>-->
      <!--<li><a href="#page3">页面3</a></li>-->
    <!--</ul>-->
  </div>
  <!-- 引用script -->
  <script src="js/lib/moblie.js"></script>
```

### api
  + 页面前进(后退)-链接到本页 `<a href="#page1?id=1">页面1</a>`
  + 页面前进(后退)-链接到ajax页面 `<a href="ajax1.html">ajax1</a>`
  + -页面前进(后退)-通过js来链接到本页 `mobile.go("#page1?id=1")`
  + -页面前进(后退)-通过js到ajax页面  `mobile.go("ajax1.html")`
  + -页面前进-前n页 `moblie.go(n)`
  + -页面后退-后n页 `mobile.go(-n)`

### 兼容
ie10+ ff webkit（chrome opera safari）

### 许可
MIT许可


