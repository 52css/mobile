/**
 * Created by Ivan on 2015/3/19.
 */
define(function() {
  var slider = function(opts) {
      return new fn.init(opts);
    },
    supportsTouch = 'ontouchstart' in window,
    fnTouch = function(dom, onMove, onGo) {
      var
        startTime,
        oneTouch,
        startX,
        offsetX,
        startY,
        offsetY,
        isStart,
        handlerTouchStart = function(event, method) {
          startTime = new Date() * 1;
          switch (method) {
            case 'touch':
              oneTouch = event.touches[0];
              break;
            case 'mouse':
              oneTouch = event;
              break;
          }
          startX = oneTouch.pageX;
          offsetX = 0;
          startY = oneTouch.pageY;
          offsetY = 0;
          isStart = true;
        },
        handlerTouchMove = function(event, method) {
          if (!isStart) {
            return false;
          }
          event.preventDefault();
          switch (method) {
            case 'touch':
              oneTouch = event.touches[0];
              break;
            case 'mouse':
              oneTouch = event;
              break;
          }
          offsetX = oneTouch.pageX - startX;
          offsetY = oneTouch.pageY - startY;

          onMove.call(dom, offsetX, offsetY);

        },
        handlerTouchEnd = function (event, method) {
          if (!isStart) {
            return false;
          }
          event.preventDefault();
          var endTime = new Date() * 1,
            doGo = function(widthBoundary, heightBoundary) {
              var x = 0, y = 0;
              if (offsetX >= widthBoundary) {
                x = -1;
              } else if (offsetX < -widthBoundary) {
                x = 1;
              } else {
                x = 0;
              }

              if (offsetY >= heightBoundary) {
                y = -1;
              } else if (offsetY < -heightBoundary) {
                y = 1;
              } else {
                y = 0;
              }

              onGo.call(dom, x, y);

              isStart = false;
            };

          if (endTime - startTime > 300) {
            doGo(dom.clientWidth / 6, dom.clientHeight / 6);
          } else {
            doGo(50, 50);
          }
        };
      if (supportsTouch) {
        dom.addEventListener('touchstart', function(event) {
          handlerTouchStart(event, 'touch');
        });
        dom.addEventListener('touchmove', function(event) {
          handlerTouchMove(event, 'touch');
        });
        dom.addEventListener('touchend', function(event) {
          handlerTouchEnd(event, 'touch');
        });
      } else {
        dom.addEventListener('mousedown', function(event) {
          handlerTouchStart(event, 'mouse');
        });
        document.addEventListener('mousemove', function(event) {
          handlerTouchMove(event, 'mouse');
        });
        document.addEventListener('mouseup', function(event) {
          handlerTouchEnd(event, 'mouse');
        });
        //dom.addEventListener('mouseout', function(event) {
        //  handlerTouchEnd(event, 'mouse');
        //});
      }
    },
    fn = slider.prototype = {
      init: function(opts) {
        var winWidth = window.innerWidth,
          winHeight = window.innerHeight;

        // this.radio = winHeight / winWidth;
        this.winWidth = winWidth;
        this.winHeight = winHeight;
        this.idx = 0;
        this.dom = opts.dom;
        this.list = opts.list;
        this.direction = opts.direction || 'horizontal'; // 'vertical'

        this.createHtml();
        this.bindEvent();
        return this;
      },
      createHtml: function() {
        var ul = document.createElement('ul'),
          winWidth = this.winWidth,
          winHeight = this.winHeight;

        this.list.forEach(function(n, i) {
          //debugger;
          var li = document.createElement('li');
          //li.style.width = winWidth + 'px';
          li.style.webkitTransform = 'translate3d(' + (i * winWidth) + 'px, 0, 0)';

          if (n) {
            li.innerHTML = '<img src="'+n.img+'" />';
            //if (n.height / n.width > winHeight / winWidth) {
            //  li.innerHTML = '<img height="' + winHeight + '" src="' + n.img + '" />';
            //} else {
            //  li.innerHTML = '<img width="' + winWidth + '" src="' + n.img + '" />';
            //}
          }
          ul.appendChild(li);
        });
        //ul.style.width = winWidth + 'px';
        this.ul = ul;
        //this.dom.style.height = winHeight + 'px';
        this.dom.appendChild(ul);
      },
      bindEvent: function() {
        var self = this,
          dom = self.ul,
          idx = 0;

        fnTouch(dom, function(offsetX, offsetY) {
          //console.log(offsetX, offsetY);
          var
            dom = this,
            lis = dom.getElementsByTagName('li'),
            i = idx - 1,
            m = i + 3;
          for (i; i < m; i ++ ) {
            if (lis[i]) {
              lis[i].style.webkitTransition = '-webkit-transform 0s ease-out';
              lis[i].style.webkitTransform = 'translate3d(' + ((i - idx) * dom.clientWidth + offsetX) + 'px, 0, 0)';
            }
          }
        }, function(x, y) {
          //console.log('x = ' + x, 'y = ' + y);
          var
            dom = this,
            lis = dom.getElementsByTagName('li'),
            len = lis.length,
            cidx = idx + (x || 0);

          if (cidx > len-1) {
            cidx = len - 1;
          } else if (cidx < 0) {
            cidx = 0;
          }

          idx = cidx;

          var i = idx - 1,
            m = i + 3;
          for (i; i < m; i ++ ) {
            if (lis[i]) {
              lis[i].style.webkitTransition = '-webkit-transform 0.2s ease-out';
              lis[i].style.webkitTransform = 'translate3d(' + (i - idx) * dom.clientWidth + 'px, 0, 0)';
            }
          }
        });
      }
    };
  fn.init.prototype = fn;
  return slider;
});