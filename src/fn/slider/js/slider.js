/**
 * Created by Ivan on 2014/12/16.
 */
define(function() {
  var slider = function(opts) {
      return new fn.init(opts);
    },
    supportsTouch = 'ontouchstart' in window,
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
      go: function(num) {
        var idx = this.idx,
          lis = this.ul.getElementsByTagName('li'),
          winWidth = this.winWidth,
          len = lis.length,
          cidx = idx + (num || 0);

        if (cidx > len-1) {
          cidx = len - 1;
        } else if (cidx < 0) {
          cidx = 0;
        }

        this.idx = cidx;

        var i = this.idx - 1,
          m = i + 3;
        for (i; i < m; i ++ ) {
          if (lis[i]) {
            lis[i].style.webkitTransition = '-webkit-transform 0.2s ease-out';
            lis[i].style.webkitTransform = 'translate3d(' + (i - this.idx) * winWidth + 'px, 0, 0)';
          }
        }
      },
      bindEvent: function() {
        var self = this,
          winWidth = self.winWidth,
          ul = self.ul,
          handlerTouchStart = function(event, method) {
            self.startTime = new Date() * 1;
            var oneTouch;
            switch (method) {
              case 'touch':
                oneTouch = event.touches[0];
                break;
              case 'mouse':
                oneTouch = event;
                break;
            }
            self.startX = oneTouch.pageX;
            self.offsetX = 0;
            self.isStart = true;
          },
          handlerTouchMove = function(event, method) {
            if (!self.isStart) {
              return false;
            }
            event.preventDefault();
            var oneTouch;
            switch (method) {
              case 'touch':
                oneTouch = event.touches[0];
                break;
              case 'mouse':
                oneTouch = event;
                break;
            }
            self.offsetX = oneTouch.pageX - self.startX;
            var lis = ul.getElementsByTagName('li'),
              i = self.idx - 1,
              m = i + 3;
            for (i; i < m; i ++ ) {
              if (lis[i]) {
                lis[i].style.webkitTransition = '-webkit-transform 0s ease-out';
                lis[i].style.webkitTransform = 'translate3d(' + ((i - self.idx) * winWidth + self.offsetX) + 'px, 0, 0)';
              }
            }
          },
          handlerTouchEnd = function (event, method) {
            if (!self.isStart) {
              return false;
            }
            event.preventDefault();
            var endTime = new Date() * 1,
              doGo = function(boundary) {
                if (self.offsetX >= boundary) {
                  self.go(-1);
                } else if (self.offsetX < -boundary) {
                  self.go(1);
                } else {
                  self.go(0);
                }
                self.isStart = false;
              };

            if (endTime - self.startTime > 300) {
              doGo(winWidth / 6);
            } else {
              doGo(50);
            }
          };
        if (supportsTouch) {
          ul.addEventListener('touchstart', function(event) {
            handlerTouchStart(event, 'touch');
          });
          ul.addEventListener('touchmove', function(event) {
            handlerTouchMove(event, 'touch');
          });
          ul.addEventListener('touchend', function(event) {
            handlerTouchEnd(event, 'touch');
          });
        } else {
          ul.addEventListener('mousedown', function(event) {
            handlerTouchStart(event, 'mouse');
          });
          document.addEventListener('mousemove', function(event) {
            handlerTouchMove(event, 'mouse');
          });
          document.addEventListener('mouseup', function(event) {
            handlerTouchEnd(event, 'mouse');
          });
          //ul.addEventListener('mouseout', function(event) {
          //  handlerTouchEnd(event, 'mouse');
          //});
        }
      }
    };
  fn.init.prototype = fn;
  return slider;
});