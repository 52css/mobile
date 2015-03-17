/**
 * Created by Ivan on 2014/12/4.
 */
define(function () {
  var oHistory = {
      history: [],
      index: -1
    },
    hasInited = false,
    $ = {
      slice: [].slice,
      isJSON: function(text) {
        if (/^[\],:{}\s]*$/.test(text.replace(/\\["\\\/bfnrtu]/g, '@').
            replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
            replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
          return true;
        } else {
          return false;
        }
      },
      makeArray: function(obj) {
        var ret = [];
        if (obj !== null) {
          var i = obj.length;
          if (i == null || obj.split || obj.setInterval || obj.call) {
            ret[0] = obj;
          } else {
            while (i)ret[--i] = obj[i];
          }
        }
        return ret;
      },
      closestByFilter: function(node, filter) {
        var parentNode = node.parentNode;
        while (parentNode) {
          if (parentNode.tagName.toLowerCase() === 'body') {
            return null;
          }
          var temp = filter(parentNode);
          if (temp) {
            return temp;
          }
          parentNode = parentNode.parentNode;
        }
      },
      closest: function(node, tag) {
        return $.closestByFilter(node, function(node) {
          if (tag && node.tagName.toLowerCase() === tag.toLowerCase()) {
            return node;
          }
        });
      },
      siblings: function(node) {
        function getChildren(n, skipMe){
          var r = [];
          for ( ; n; n = n.nextSibling )
            if ( n.nodeType == 1 && n != skipMe)
              r.push( n );
          return r;
        };
        return getChildren(node.parentNode.firstChild, node);
      },
      ajax: function(arr, callback, showMask) {
        function oneAjax(options) {
          var xhr = new XMLHttpRequest(),
            method = (options.method || 'get').toUpperCase(),
            url = options.url || '',
            beforeSend = options.beforeSend || function () {
              },
            success = options.success || function () {
              },
            timeout = options.timeout || 100000,
            dataType = options.dataType || 'text',
            error = options.error || function () {
              },
            data = options.data || null,
            sync = options.sync || true,
            complete = options.complete || function () {
              },
            doError = function (message) {
              options.message = message;
              error.call(options, xhr, xhr.status);
            };

          beforeSend.call(options, xhr);
          xhr.onload = function () {
            var responseText = xhr.responseText;
            if (xhr.status === 200) {
              switch (dataType) {
                case 'json':
                  try {
                    success.call(options, JSON.parse(responseText));
                  } catch (ex) {
                    doError('JSON parse error：' + ex.message);
                  }
                  break;
                case 'text':
                  success.call(options, responseText);
                  break;
              }
            } else {
              doError('The status code exception!');
            }
            complete.call(options, xhr, responseText);
          };
//      xhr.onreadystatechange = function() {
//         if (xhr.readyState == 4 && xhr.status === 200) {
//           success(xhr.responseText);
//         } else {
//           error(xhr, xhr.status);
//         }
//      };
          if (method == 'POST') {
            xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
          }
          xhr.onerror = function (e) {
            doError("Illegal request address or an unexpected network error!");
          };
          xhr.ontimeout = function () {
            doError("The request timeout!");
          };
          xhr.open(method, url, sync);
          xhr.timeout = timeout;
          xhr.send(data);
        }

        var myIndex = 0,
          rtv = {},
          myLen;

        if (!Array.isArray(arr)) {
          arr = [arr];
        }
        myLen = arr.length;
        elMask.style.visibility = 'visible';
        arr.forEach(function (opts) {
          var beforeSuccess = opts.success,
            beforeError = opts.error;
          opts.success = function (data) {
            if (beforeSuccess) {
              beforeSuccess.apply(opts, arguments);
            }
            rtv[opts.url] = data;
          }
          opts.error = function () {
            if (beforeError) {
              beforeError.apply(opts, arguments);
            }
            rtv[opts.url] = {};
          }
          opts.complete = function () {
            myIndex++;
            if (myIndex === myLen) {
              if (callback) {
                callback(rtv);
              }
              if (!showMask) {
                elMask.style.visibility = 'hidden';
              }
            }
          }
          oneAjax(opts);
        })

      },
      getState: function(hash) {
        var rtv = {},
          arr,
          arr1;
        hash = hash || location.hash;

        if (/^#\w+/.test(hash)) {
          rtv.action = 'anchor';
          rtv.anchor = hash.slice(1);
        } else if (/^#!\//.test(hash)) {
          rtv.url = hash;
          rtv.action = 'pageId';
          hash = hash.slice(3);
          arr = hash.split('?');
          rtv.pageId = arr[0];

          if (arr[1]) {
            arr1 = arr[1].split('#');
            /// arr1.replace()
            arr1[0].replace(
              new RegExp("([^?=&]+)(=([^&]*))?", "g"),
              function ($0, $1, $2, $3) {
                rtv.query[$1] = unescape($3);
              }
            );
            if (arr1[1]) {
              rtv.anchor = arr[1];
            }
          }
        } else {
          rtv.action = 'pageUrl';
          rtv.pageUrl = hash;
          arr = hash.split('?');
          rtv.pageName = arr[0];
          if (arr[0]) {
            rtv.pageId = arr[0].split('.').slice(0, -1).join('.');
            rtv.url = '#!/' + rtv.pageId + (arr[1] ? '?' + arr[1] : '');
          }
          if (arr[1]) {
            arr1 = arr[1].split('#');
            /// arr1.replace()
            arr1[0].replace(
              new RegExp("([^?=&]+)(=([^&]*))?", "g"),
              function ($0, $1, $2, $3) {
                rtv.query[$1] = unescape($3);
              }
            );
            if (arr1[1]) {
              rtv.anchor = arr[1];
            }
          }
        }
        //var myHash = hash || location.hash,
        //  arr = myHash.split('?'),
        //  pageId = arr[0].replace(/^#/, '').replace(/\.html$/, ''),
        //  rtv = {
        //    pageId: pageId,
        //    //title: pageId,
        //    href: pageId + '.html' + (arr[1] ? '?' + arr[1] : ''),
        //    url: '#' + pageId + (arr[1] ? '?' + arr[1] : ''),
        //    query: {}
        //  };
        //
        //
        //if (arr[1]) {
        //  arr[1].replace(
        //    new RegExp("([^?=&]+)(=([^&]*))?", "g"),
        //    function ($0, $1, $2, $3) {
        //      rtv.query[$1] = unescape($3);
        //    }
        //  );
        //}
        return rtv;
      },
      replaceState: function(state, title, url) {
        title = title || state.title;
        document.title = title;
        url = url || state.url;
        history.replaceState(state, title, url);
      },
      pushState: function(state, title, url) {
        title = title || state.title;
        document.title = title;
        url = url || state.url;
        history.pushState(state, title, url);
      },
      switchPage: function(state, toPageId, toPageIndex, noPush) {
        state.time = new Date();
        var formPageId = oHistory.history[oHistory.index],
          elFromPage = document.getElementById(formPageId),
          elToPage = document.getElementById(toPageId);

        events.pageOut.forEach(function (n) {
          if (n.pageName === formPageId || n.pageName === void(0) || n.pageName === null) {
            n.callback(elFromPage);
          }
        });

        if (header) {
          header.innerHTML = elToPage.getAttribute('data-title');
        }

        noPush = noPush || false;
        elToPage.style.display = 'block';
        elFromPage.style.display = 'block';

        elFromPage.classList.add('out');

        elFromPage.classList.add(elFromPage.getAttribute('data-classname') || 'slide');
        elFromPage.classList.remove('in');

        elToPage.classList.remove('out');
        elToPage.classList.add('in');
        elToPage.classList.add(elToPage.getAttribute('data-classname') || 'slide');
        state.title = elToPage.getAttribute('data-title');

        var flag = visiter.some(function (n) {
          if (n.pageId === toPageId) {
            return n;
          }
        });
        if (!flag) {
          events.pageFirstInit.forEach(function (n) {
            if (n.pageName === toPageId || n.pageName === void(0) || n.pageName === null) {
              n.callback(elToPage);
            }
          });
        }
        events.pageInit.forEach(function (n) {
          if (n.pageName === toPageId || n.pageName === void(0) || n.pageName === null) {
            n.callback(elToPage);
          }
        });
        if (oHistory.index > toPageIndex) {
          elFromPage.classList.add('reverse');
          elToPage.classList.add('reverse');
        } else {
          elFromPage.classList.remove('reverse');
          elToPage.classList.remove('reverse');
        }
        //state.index = toPageIndex;
        if (!noPush) {
          $.pushState(state);
        }
        oHistory.index = toPageIndex;
        visiter.push(state);
      },
      makeFrag: function(str) {
        var frag = document.createDocumentFragment(),
          div = document.createElement("div");
        div.innerHTML = str;
        while (div.firstChild) {
          frag.appendChild(div.firstChild);
        }
        str = frag;
        return $.makeArray(str);
      },
      append: function(el, str) {
        $.makeFrag(str).forEach(function (n) {
          el.appendChild(n);
        });
      }
    },
    header = document.querySelector('body > header h1'),
    elPages = document.getElementsByClassName('page'),
    hash = location.hash,
    stateByHash = hash && $.getState(hash),
    elMask = (function() {
      var elMask = document.getElementById('mask');
      if (!elMask) {
        $.append(document.body, '<div id="mask" class="mask"><i class="loading"></i></div>');
        elMask = document.getElementById('mask');
      }
      return elMask;
    }()),
    visiter = [],
    animateend = function () {
      var page = this,
        id = page.id,
        pageClassName = page.getAttribute('data-classname');
      page.classList.remove(pageClassName);
      if (!page.classList.contains('in')) {
        page.style.display = 'none';
      } else {
        events.pageAfterAnimate.forEach(function (n) {
          if (n.pageName === id || n.pageName === void(0) || n.pageName === null) {
            n.callback(page);
          }
        });
      }
    },
    animatestart = function () {
      var page = this,
        id = page.id;
      if (page.classList.contains('in')) {
        events.pageBeforeAnimate.forEach(function (n) {
          if (n.pageName === id || n.pageName === void(0) || n.pageName === null) {
            n.callback(page);
          }
        });
      }
    },
    ajaxRender = function (content, callback) {
      callback(content);
    },
    events = {
      ajaxRender: [],
      pageFirstInit: [],
      pageInit: [],
      pageBeforeAnimate: [],
      pageAfterAnimate: [],
      pageOut: []
    },
    app = {
      pageRule: '#!/', // '#!/pageId?id=123&test=test#bbb'
      hashRule: '#',   // '#aaa'
      pageUrlRule: '',    // 'pageUrl?id=123&test=test#aaa'
      pageClassName: 'slide',
      on: function (eventName, pageName, callback) {
        var args = arguments;
        if (args.length === 2) {
          callback = pageName;
          pageName = null;
        }
        var arr = eventName.split('.'),
          eName = arr[0],
          key = arr[1];
        events[eName].push({
          key: key,
          pageName: pageName,
          callback: callback
        });
        return app;
      },
      off: function (eventName) {
        var arr = eventName.split('.'),
          eName = arr[0],
          key = arr[1];
        if (eName) {
          events[eName] = key ? events[eName].map2(function (n) {
            if (n.key === key) {
              return null;
            }
          }) : [];
        } else {
          if (key) {
            for (var e in events) {
              events[e] = events[e].forEach(function (n) {
                if (n.key === key) {
                  return null;
                }
              });
            }
          }
        }
        return app;
      },
      ajax: $.ajax,
      binds: {
        tabs: function() {
          document.addEventListener('click', function (event) {
            var target = event.target;
            if (!target) return;
            if (target.tagName.toLowerCase() != "a" && !(target = $.closest(target, 'a'))) {
              return;
            }
            var
              href = target.getAttribute('href'),
              rel = target.getAttribute('data-rel'),
              state;

            if (href && !/^javascript/.test(href) && rel !== 'external') {
              state = $.getState(href);

              if ( state.action === 'anchor' ) {
                target.classList.add('active');
                $.siblings(target).forEach(function(node) {
                  node.classList.remove('active');
                });
                var $content = document.querySelector(href);
                $content.style.display = 'block';
                $.siblings($content).forEach(function(node) {
                  node.style.display = 'none';
                });

                return event.preventDefault();
              }
            }
          });
        },
        toggleClass: function() {
          document.addEventListener('click', function (event) {
            var target = event.target;
            if (!target) return;

            if ( (target.getAttribute('data-toggle-class') == null || target.getAttribute('data-toggle-class') == '') && !(target = $.closestByFilter(target, function(node) {
                if (node.getAttribute('data-toggle-class') != null && node.getAttribute('data-toggle-class') != '') {
                  return node;
                }
              }))) {
              return;
            }
            var toggleClass = target.getAttribute('data-toggle-class');

            if (toggleClass) {
              if (target.classList.contains(toggleClass)) {
                target.classList.remove(toggleClass);
              } else {
                target.classList.add(toggleClass);
              }
              return event.preventDefault();
            }
          });
        },
        addClass: function() {
          document.addEventListener('click', function (event) {
            var target = event.target;
            if (!target) return;

            if ( (target.getAttribute('data-add-class') == null || target.getAttribute('data-add-class') == '') && !(target = $.closestByFilter(target, function(node) {
                if (node.getAttribute('data-add-class') != null && node.getAttribute('data-add-class') != '') {
                  return node;
                }
              }))) {
              return;
            }
            var addClass = target.getAttribute('data-add-class');

            if (addClass) {
              target.classList.add(addClass);
              return event.preventDefault();
            }
          });
        },
        removeClass: function() {
          document.addEventListener('click', function (event) {
            var target = event.target;
            if (!target) return;

            if ( (target.getAttribute('data-remove-class') == null || target.getAttribute('data-remove-class') == '') && !(target = $.closestByFilter(target, function(node) {
                if (node.getAttribute('data-remove-class') != null && node.getAttribute('data-remove-class') != '') {
                  return node;
                }
              }))) {
              return;
            }
            var removeClass = target.getAttribute('data-remove-class');

            if (removeClass) {
              target.classList.remove(removeClass);
              return event.preventDefault();
            }
          });
        }
      },
      init: function () {
        hasInited = true;
        var self = this,
          initOk = function() {
            $.slice.call(elPages).forEach(function (page, i) {
              var id = page.id;
              if (!page.getAttribute('data-title')) {
                page.setAttribute('data-title',  document.title);
              }
              if (i === oHistory.index) {
                page.classList.remove('out');
                page.classList.add('in');
                events.pageFirstInit.forEach(function (n) {
                  if (n.pageName === id || n.pageName === void(0) || n.pageName === null) {
                    n.callback(page);
                  }
                });
                events.pageInit.forEach(function (n) {
                  if (n.pageName === id || n.pageName === void(0) || n.pageName === null) {
                    n.callback(page);
                  }
                });
              } else {
                page.classList.remove('in');
                page.classList.add('out');
              }
              oHistory.history.push(id);
              page.addEventListener("webkitAnimationEnd", animateend);
              page.addEventListener("webkitAnimationStart", animatestart);
            });
            if (!stateByHash) {
              stateByHash = $.getState('#!/' + oHistory.history[0]);
            }
            stateByHash.time = new Date();
            stateByHash.title = document.title;
            visiter.push(stateByHash);
            $.replaceState(stateByHash);
          };
        Object.keys(self.binds).forEach(function(key) {
          var fn = self.binds[key];
          fn();
        });

        if (stateByHash.action) {
          switch (stateByHash.action) {
            case 'pageId':
              $.slice.call(elPages).forEach(function (page, i) {
                var id = page.id;
                if (id === stateByHash.pageId) {
                  oHistory.index = i;
                  return false;
                }
              });
              initOk();
              break;
            //case 'anchor':
            //  oHistory.index = 0;
            //  initOk();
            //  break;
            case 'pageUrl':
              var toPageId = stateByHash.pageId;
              $.ajax({
                url: stateByHash.href,
                success: function (content) {
                  var doAjaxRender = ajaxRender;
                  events.ajaxRender.forEach(function (n) {
                    if (n.pageName === toPageId) {
                      doAjaxRender = n.callback;
                    } else if (n.pageName === void(0) || n.pageName === null) {
                      n.callback(document.getElementById(toPageId));
                    }
                  });
                  doAjaxRender(content, function (content) {
                    var titleContent = /<title[^>]*?>([\s\S]*?)<\/title>/.exec(content),
                      bodyContent = /<body[^>]*?>([\s\S]*?)<\/body>/.exec(content);

                    if (titleContent) {
                      document.title = titleContent[1];
                    }

                    $.append(document.body, bodyContent ? bodyContent[1] : content );

                    elMask.style.visibility = 'hidden';
                    initOk();
                  });
                }
              }, function () {
              }, true);
              break;
          }
        } else {
          oHistory.index = 0;
          initOk();
        }

        return self;
      }
    };



  Array.prototype.map2 = function (fn) {
    var a = [];
    for (var i = 0; i < this.length; i++) {
      var value = fn(this[i], i);
      if (value == null) {
        continue; //如果函数fn返回null，则从数组中删除该项
      }
      a.push(value);
    }
    return a;
  };

  window.addEventListener('popstate', function (event) {
    var state = event.state,
      toPageId = state.pageId,
      toPageIndex;
    oHistory.history.forEach(function (n, i) {
      if (n === toPageId) {
        toPageIndex = i;
        return false;
      }
    });
    document.title = state.title;
    $.switchPage(state, toPageId, toPageIndex, true);
  });

  document.addEventListener('click', function (event) {
    var target = event.target;
    if (!target) return;
    if (target.tagName.toLowerCase() != "a" && !(target = $.closest(target, 'a'))) {
      return;
    }
    var
      href = target.getAttribute('href'),
      rel = target.getAttribute('data-rel'),
      reload = target.getAttribute('data-reload'),
      state,
      toPageId,
      toPageIndex;

    if (href && !/^javascript/.test(href)) {
      switch (rel) {
        case 'external':
          break;
        default :
          state = $.getState(href);
          if (state.action !== 'anchor') {
            toPageId = state.pageId;
            oHistory.history.forEach(function (n, i) {
              if (n === toPageId) {
                toPageIndex = i;
                return false;
              }
            });
            if (toPageIndex > -1 && (reload == null || reload == "false")) {
              $.switchPage(state, toPageId, toPageIndex);
            } else {
              var node = document.getElementById(toPageId);
              if (node) {
                node.parentNode.removeChild(node);
              }
              $.ajax({
                url: href,
                success: function (content) {
                  var doAjaxRender = ajaxRender;
                  events.ajaxRender.forEach(function (n) {
                    if (n.pageName === toPageId) {
                      doAjaxRender = n.callback;
                    } else if (n.pageName === void(0) || n.pageName === null) {
                      n.callback(document.getElementById(toPageId));
                    }
                  });
                  doAjaxRender(content, function (content) {
                    var titleContent = /<title[^>]*?>([\s\S]*?)<\/title>/.exec(content),
                      bodyContent = /<body[^>]*?>([\s\S]*?)<\/body>/.exec(content);

                    if (bodyContent) {
                      bodyContent = bodyContent[1];
                    } else {
                      bodyContent = content;
                    }
                    $.append(document.body, bodyContent);
                    elMask.style.visibility = 'hidden';
                    oHistory.history.push(toPageId);
                    toPageIndex = oHistory.history.length - 1;
                    var page = document.getElementById(toPageId);
                    if (titleContent) {
                      page.setAttribute('data-title', titleContent[1]);
                    }
                    page.addEventListener("webkitAnimationEnd", animateend);
                    page.addEventListener("webkitAnimationStart", animatestart);
                    $.switchPage(state, toPageId, toPageIndex);
                  });
                }
              }, function () {
              }, true);
            }
          }
          return event.preventDefault();
      }
    }
  });

  $.slice.call(elPages).forEach(function (page) {
    if (!page.getAttribute('data-title')) {
      page.setAttribute('data-title',  document.title);
    }
  });

  window.addEventListener("DOMContentLoaded", function() {
    if (hasInited == false) {
      app.init();
    }
  });

  return app;
});