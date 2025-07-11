!(function () {
  /*

 Copyright (C) 2006 Google Inc.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
*/
  window.PR_SHOULD_USE_CONTINUATION = !0;
  (function () {
    function T(a) {
      function d(e) {
        var b = e.charCodeAt(0);
        if (92 !== b) return b;
        var a = e.charAt(1);
        return (b = w[a])
          ? b
          : '0' <= a && '7' >= a
            ? parseInt(e.substring(1), 8)
            : 'u' === a || 'x' === a
              ? parseInt(e.substring(2), 16)
              : e.charCodeAt(1);
      }
      function f(e) {
        if (32 > e) return (16 > e ? '\\x0' : '\\x') + e.toString(16);
        e = String.fromCharCode(e);
        return '\\' === e || '-' === e || ']' === e || '^' === e ? '\\' + e : e;
      }
      function b(e) {
        var b = e
          .substring(1, e.length - 1)
          .match(
            /\\u[0-9A-Fa-f]{4}|\\x[0-9A-Fa-f]{2}|\\[0-3][0-7]{0,2}|\\[0-7]{1,2}|\\[\s\S]|-|[^-\\]/g,
          );
        e = [];
        var a = '^' === b[0],
          c = ['['];
        a && c.push('^');
        for (var a = a ? 1 : 0, g = b.length; a < g; ++a) {
          var h = b[a];
          if (/\\[bdsw]/i.test(h)) c.push(h);
          else {
            var h = d(h),
              k;
            a + 2 < g && '-' === b[a + 1]
              ? ((k = d(b[a + 2])), (a += 2))
              : (k = h);
            e.push([h, k]);
            65 > k ||
              122 < h ||
              (65 > k ||
                90 < h ||
                e.push([Math.max(65, h) | 32, Math.min(k, 90) | 32]),
              97 > k ||
                122 < h ||
                e.push([Math.max(97, h) & -33, Math.min(k, 122) & -33]));
          }
        }
        e.sort(function (e, a) {
          return e[0] - a[0] || a[1] - e[1];
        });
        b = [];
        g = [];
        for (a = 0; a < e.length; ++a)
          (h = e[a]),
            h[0] <= g[1] + 1 ? (g[1] = Math.max(g[1], h[1])) : b.push((g = h));
        for (a = 0; a < b.length; ++a)
          (h = b[a]),
            c.push(f(h[0])),
            h[1] > h[0] && (h[1] + 1 > h[0] && c.push('-'), c.push(f(h[1])));
        c.push(']');
        return c.join('');
      }
      function v(e) {
        for (
          var a = e.source.match(
              /(?:\[(?:[^\x5C\x5D]|\\[\s\S])*\]|\\u[A-Fa-f0-9]{4}|\\x[A-Fa-f0-9]{2}|\\[0-9]+|\\[^ux0-9]|\(\?[:!=]|[\(\)\^]|[^\x5B\x5C\(\)\^]+)/g,
            ),
            c = a.length,
            d = [],
            g = 0,
            h = 0;
          g < c;
          ++g
        ) {
          var k = a[g];
          '(' === k
            ? ++h
            : '\\' === k.charAt(0) &&
              (k = +k.substring(1)) &&
              (k <= h ? (d[k] = -1) : (a[g] = f(k)));
        }
        for (g = 1; g < d.length; ++g) -1 === d[g] && (d[g] = ++A);
        for (h = g = 0; g < c; ++g)
          (k = a[g]),
            '(' === k
              ? (++h, d[h] || (a[g] = '(?:'))
              : '\\' === k.charAt(0) &&
                (k = +k.substring(1)) &&
                k <= h &&
                (a[g] = '\\' + d[k]);
        for (g = 0; g < c; ++g) '^' === a[g] && '^' !== a[g + 1] && (a[g] = '');
        if (e.ignoreCase && n)
          for (g = 0; g < c; ++g)
            (k = a[g]),
              (e = k.charAt(0)),
              2 <= k.length && '[' === e
                ? (a[g] = b(k))
                : '\\' !== e &&
                  (a[g] = k.replace(/[a-zA-Z]/g, function (a) {
                    a = a.charCodeAt(0);
                    return '[' + String.fromCharCode(a & -33, a | 32) + ']';
                  }));
        return a.join('');
      }
      for (var A = 0, n = !1, l = !1, m = 0, c = a.length; m < c; ++m) {
        var p = a[m];
        if (p.ignoreCase) l = !0;
        else if (
          /[a-z]/i.test(
            p.source.replace(/\\u[0-9a-f]{4}|\\x[0-9a-f]{2}|\\[^ux]/gi, ''),
          )
        ) {
          n = !0;
          l = !1;
          break;
        }
      }
      for (
        var w = { b: 8, t: 9, n: 10, v: 11, f: 12, r: 13 },
          r = [],
          m = 0,
          c = a.length;
        m < c;
        ++m
      ) {
        p = a[m];
        if (p.global || p.multiline) throw Error('' + p);
        r.push('(?:' + v(p) + ')');
      }
      return new RegExp(r.join('|'), l ? 'gi' : 'g');
    }
    function U(a, d) {
      function f(a) {
        var c = a.nodeType;
        if (1 == c) {
          if (!b.test(a.className)) {
            for (c = a.firstChild; c; c = c.nextSibling) f(c);
            c = a.nodeName.toLowerCase();
            if ('br' === c || 'li' === c)
              (v[l] = '\n'), (n[l << 1] = A++), (n[(l++ << 1) | 1] = a);
          }
        } else if (3 == c || 4 == c)
          (c = a.nodeValue),
            c.length &&
              ((c = d
                ? c.replace(/\r\n?/g, '\n')
                : c.replace(/[ \t\r\n]+/g, ' ')),
              (v[l] = c),
              (n[l << 1] = A),
              (A += c.length),
              (n[(l++ << 1) | 1] = a));
      }
      var b = /(?:^|\s)nocode(?:\s|$)/,
        v = [],
        A = 0,
        n = [],
        l = 0;
      f(a);
      return { a: v.join('').replace(/\n$/, ''), c: n };
    }
    function J(a, d, f, b, v) {
      f &&
        ((a = { h: a, l: 1, j: null, m: null, a: f, c: null, i: d, g: null }),
        b(a),
        v.push.apply(v, a.g));
    }
    function V(a) {
      for (var d = void 0, f = a.firstChild; f; f = f.nextSibling)
        var b = f.nodeType,
          d =
            1 === b ? (d ? a : f) : 3 === b ? (W.test(f.nodeValue) ? a : d) : d;
      return d === a ? void 0 : d;
    }
    function G(a, d) {
      function f(a) {
        for (
          var l = a.i,
            m = a.h,
            c = [l, 'pln'],
            p = 0,
            w = a.a.match(v) || [],
            r = {},
            e = 0,
            t = w.length;
          e < t;
          ++e
        ) {
          var z = w[e],
            q = r[z],
            g = void 0,
            h;
          if ('string' === typeof q) h = !1;
          else {
            var k = b[z.charAt(0)];
            if (k) (g = z.match(k[1])), (q = k[0]);
            else {
              for (h = 0; h < A; ++h)
                if (((k = d[h]), (g = z.match(k[1])))) {
                  q = k[0];
                  break;
                }
              g || (q = 'pln');
            }
            !(h = 5 <= q.length && 'lang-' === q.substring(0, 5)) ||
              (g && 'string' === typeof g[1]) ||
              ((h = !1), (q = 'src'));
            h || (r[z] = q);
          }
          k = p;
          p += z.length;
          if (h) {
            h = g[1];
            var B = z.indexOf(h),
              D = B + h.length;
            g[2] && ((D = z.length - g[2].length), (B = D - h.length));
            q = q.substring(5);
            J(m, l + k, z.substring(0, B), f, c);
            J(m, l + k + B, h, K(q, h), c);
            J(m, l + k + D, z.substring(D), f, c);
          } else c.push(l + k, q);
        }
        a.g = c;
      }
      var b = {},
        v;
      (function () {
        for (
          var f = a.concat(d), l = [], m = {}, c = 0, p = f.length;
          c < p;
          ++c
        ) {
          var w = f[c],
            r = w[3];
          if (r) for (var e = r.length; 0 <= --e; ) b[r.charAt(e)] = w;
          w = w[1];
          r = '' + w;
          m.hasOwnProperty(r) || (l.push(w), (m[r] = null));
        }
        l.push(/[\0-\uffff]/);
        v = T(l);
      })();
      var A = d.length;
      return f;
    }
    function y(a) {
      var d = [],
        f = [];
      a.tripleQuotedStrings
        ? d.push([
            'str',
            /^(?:\'\'\'(?:[^\'\\]|\\[\s\S]|\'{1,2}(?=[^\']))*(?:\'\'\'|$)|\"\"\"(?:[^\"\\]|\\[\s\S]|\"{1,2}(?=[^\"]))*(?:\"\"\"|$)|\'(?:[^\\\']|\\[\s\S])*(?:\'|$)|\"(?:[^\\\"]|\\[\s\S])*(?:\"|$))/,
            null,
            '\'"',
          ])
        : a.multiLineStrings
          ? d.push([
              'str',
              /^(?:\'(?:[^\\\']|\\[\s\S])*(?:\'|$)|\"(?:[^\\\"]|\\[\s\S])*(?:\"|$)|\`(?:[^\\\`]|\\[\s\S])*(?:\`|$))/,
              null,
              '\'"`',
            ])
          : d.push([
              'str',
              /^(?:\'(?:[^\\\'\r\n]|\\.)*(?:\'|$)|\"(?:[^\\\"\r\n]|\\.)*(?:\"|$))/,
              null,
              '"\'',
            ]);
      a.verbatimStrings && f.push(['str', /^@\"(?:[^\"]|\"\")*(?:\"|$)/, null]);
      var b = a.hashComments;
      b &&
        (a.cStyleComments
          ? (1 < b
              ? d.push([
                  'com',
                  /^#(?:##(?:[^#]|#(?!##))*(?:###|$)|.*)/,
                  null,
                  '#',
                ])
              : d.push([
                  'com',
                  /^#(?:(?:define|e(?:l|nd)if|else|error|ifn?def|include|line|pragma|undef|warning)\b|[^\r\n]*)/,
                  null,
                  '#',
                ]),
            f.push([
              'str',
              /^<(?:(?:(?:\.\.\/)*|\/?)(?:[\w-]+(?:\/[\w-]+)+)?[\w-]+\.h(?:h|pp|\+\+)?|[a-z]\w*)>/,
              null,
            ]))
          : d.push(['com', /^#[^\r\n]*/, null, '#']));
      a.cStyleComments &&
        (f.push(['com', /^\/\/[^\r\n]*/, null]),
        f.push(['com', /^\/\*[\s\S]*?(?:\*\/|$)/, null]));
      if ((b = a.regexLiterals)) {
        var v = (b = 1 < b ? '' : '\n\r') ? '.' : '[\\S\\s]';
        f.push([
          'lang-regex',
          RegExp(
            '^(?:^^\\.?|[+-]|[!=]=?=?|\\#|%=?|&&?=?|\\(|\\*=?|[+\\-]=|->|\\/=?|::?|<<?=?|>>?>?=?|,|;|\\?|@|\\[|~|{|\\^\\^?=?|\\|\\|?=?|break|case|continue|delete|do|else|finally|instanceof|return|throw|try|typeof)\\s*(' +
              ('/(?=[^/*' +
                b +
                '])(?:[^/\\x5B\\x5C' +
                b +
                ']|\\x5C' +
                v +
                '|\\x5B(?:[^\\x5C\\x5D' +
                b +
                ']|\\x5C' +
                v +
                ')*(?:\\x5D|$))+/') +
              ')',
          ),
        ]);
      }
      (b = a.types) && f.push(['typ', b]);
      b = ('' + a.keywords).replace(/^ | $/g, '');
      b.length &&
        f.push([
          'kwd',
          new RegExp('^(?:' + b.replace(/[\s,]+/g, '|') + ')\\b'),
          null,
        ]);
      d.push(['pln', /^\s+/, null, ' \r\n\t\u00a0']);
      b = '^.[^\\s\\w.$@\'"`/\\\\]*';
      a.regexLiterals && (b += '(?!s*/)');
      f.push(
        ['lit', /^@[a-z_$][a-z_$@0-9]*/i, null],
        ['typ', /^(?:[@_]?[A-Z]+[a-z][A-Za-z_$@0-9]*|\w+_t\b)/, null],
        ['pln', /^[a-z_$][a-z_$@0-9]*/i, null],
        [
          'lit',
          /^(?:0x[a-f0-9]+|(?:\d(?:_\d+)*\d*(?:\.\d*)?|\.\d\+)(?:e[+\-]?\d+)?)[a-z]*/i,
          null,
          '0123456789',
        ],
        ['pln', /^\\[\s\S]?/, null],
        ['pun', new RegExp(b), null],
      );
      return G(d, f);
    }
    function L(a, d, f) {
      function b(a) {
        var c = a.nodeType;
        if (1 == c && !A.test(a.className))
          if ('br' === a.nodeName)
            v(a), a.parentNode && a.parentNode.removeChild(a);
          else for (a = a.firstChild; a; a = a.nextSibling) b(a);
        else if ((3 == c || 4 == c) && f) {
          var d = a.nodeValue,
            q = d.match(n);
          q &&
            ((c = d.substring(0, q.index)),
            (a.nodeValue = c),
            (d = d.substring(q.index + q[0].length)) &&
              a.parentNode.insertBefore(l.createTextNode(d), a.nextSibling),
            v(a),
            c || a.parentNode.removeChild(a));
        }
      }
      function v(a) {
        function b(a, c) {
          var d = c ? a.cloneNode(!1) : a,
            k = a.parentNode;
          if (k) {
            var k = b(k, 1),
              e = a.nextSibling;
            k.appendChild(d);
            for (var f = e; f; f = e) (e = f.nextSibling), k.appendChild(f);
          }
          return d;
        }
        for (; !a.nextSibling; ) if (((a = a.parentNode), !a)) return;
        a = b(a.nextSibling, 0);
        for (var d; (d = a.parentNode) && 1 === d.nodeType; ) a = d;
        c.push(a);
      }
      for (
        var A = /(?:^|\s)nocode(?:\s|$)/,
          n = /\r\n?|\n/,
          l = a.ownerDocument,
          m = l.createElement('li');
        a.firstChild;

      )
        m.appendChild(a.firstChild);
      for (var c = [m], p = 0; p < c.length; ++p) b(c[p]);
      d === (d | 0) && c[0].setAttribute('value', d);
      var w = l.createElement('ol');
      w.className = 'linenums';
      d = Math.max(0, (d - 1) | 0) || 0;
      for (var p = 0, r = c.length; p < r; ++p)
        (m = c[p]),
          (m.className = 'L' + ((p + d) % 10)),
          m.firstChild || m.appendChild(l.createTextNode('\u00a0')),
          w.appendChild(m);
      a.appendChild(w);
    }
    function t(a, d) {
      for (var f = d.length; 0 <= --f; ) {
        var b = d[f];
        I.hasOwnProperty(b)
          ? E.console && console.warn('cannot override language handler %s', b)
          : (I[b] = a);
      }
    }
    function K(a, d) {
      (a && I.hasOwnProperty(a)) ||
        (a = /^\s*</.test(d) ? 'default-markup' : 'default-code');
      return I[a];
    }
    function M(a) {
      var d = a.j;
      try {
        var f = U(a.h, a.l),
          b = f.a;
        a.a = b;
        a.c = f.c;
        a.i = 0;
        K(d, b)(a);
        var v = /\bMSIE\s(\d+)/.exec(navigator.userAgent),
          v = v && 8 >= +v[1],
          d = /\n/g,
          A = a.a,
          n = A.length,
          f = 0,
          l = a.c,
          m = l.length,
          b = 0,
          c = a.g,
          p = c.length,
          w = 0;
        c[p] = n;
        var r, e;
        for (e = r = 0; e < p; )
          c[e] !== c[e + 2] ? ((c[r++] = c[e++]), (c[r++] = c[e++])) : (e += 2);
        p = r;
        for (e = r = 0; e < p; ) {
          for (
            var t = c[e], z = c[e + 1], q = e + 2;
            q + 2 <= p && c[q + 1] === z;

          )
            q += 2;
          c[r++] = t;
          c[r++] = z;
          e = q;
        }
        c.length = r;
        var g = a.h;
        a = '';
        g && ((a = g.style.display), (g.style.display = 'none'));
        try {
          for (; b < m; ) {
            var h = l[b + 2] || n,
              k = c[w + 2] || n,
              q = Math.min(h, k),
              B = l[b + 1],
              D;
            if (1 !== B.nodeType && (D = A.substring(f, q))) {
              v && (D = D.replace(d, '\r'));
              B.nodeValue = D;
              var N = B.ownerDocument,
                u = N.createElement('span');
              u.className = c[w + 1];
              var y = B.parentNode;
              y.replaceChild(u, B);
              u.appendChild(B);
              f < h &&
                ((l[b + 1] = B = N.createTextNode(A.substring(q, h))),
                y.insertBefore(B, u.nextSibling));
            }
            f = q;
            f >= h && (b += 2);
            f >= k && (w += 2);
          }
        } finally {
          g && (g.style.display = a);
        }
      } catch (x) {
        E.console && console.log((x && x.stack) || x);
      }
    }
    var E = window,
      C = ['break,continue,do,else,for,if,return,while'],
      F = [
        [
          C,
          'auto,case,char,const,default,double,enum,extern,float,goto,inline,int,long,register,restrict,short,signed,sizeof,static,struct,switch,typedef,union,unsigned,void,volatile',
        ],
        'catch,class,delete,false,import,new,operator,private,protected,public,this,throw,true,try,typeof',
      ],
      H = [
        F,
        'alignas,alignof,align_union,asm,axiom,bool,concept,concept_map,const_cast,constexpr,decltype,delegate,dynamic_cast,explicit,export,friend,generic,late_check,mutable,namespace,noexcept,noreturn,nullptr,property,reinterpret_cast,static_assert,static_cast,template,typeid,typename,using,virtual,where',
      ],
      O = [
        F,
        'abstract,assert,boolean,byte,extends,finally,final,implements,import,instanceof,interface,null,native,package,strictfp,super,synchronized,throws,transient',
      ],
      P = [
        F,
        'abstract,add,alias,as,ascending,async,await,base,bool,by,byte,checked,decimal,delegate,descending,dynamic,event,finally,fixed,foreach,from,get,global,group,implicit,in,interface,internal,into,is,join,let,lock,null,object,out,override,orderby,params,partial,readonly,ref,remove,sbyte,sealed,select,set,stackalloc,string,select,uint,ulong,unchecked,unsafe,ushort,value,var,virtual,where,yield',
      ],
      F = [
        F,
        'abstract,async,await,constructor,debugger,enum,eval,export,function,get,implements,instanceof,interface,let,null,set,undefined,var,with,yield,Infinity,NaN',
      ],
      Q = [
        C,
        'and,as,assert,class,def,del,elif,except,exec,finally,from,global,import,in,is,lambda,nonlocal,not,or,pass,print,raise,try,with,yield,False,True,None',
      ],
      R = [
        C,
        'alias,and,begin,case,class,def,defined,elsif,end,ensure,false,in,module,next,nil,not,or,redo,rescue,retry,self,super,then,true,undef,unless,until,when,yield,BEGIN,END',
      ],
      C = [C, 'case,done,elif,esac,eval,fi,function,in,local,set,then,until'],
      S =
        /^(DIR|FILE|array|vector|(de|priority_)?queue|(forward_)?list|stack|(const_)?(reverse_)?iterator|(unordered_)?(multi)?(set|map)|bitset|u?(int|float)\d*)\b/,
      W = /\S/,
      X = y({
        keywords: [
          H,
          P,
          O,
          F,
          'caller,delete,die,do,dump,elsif,eval,exit,foreach,for,goto,if,import,last,local,my,next,no,our,print,package,redo,require,sub,undef,unless,until,use,wantarray,while,BEGIN,END',
          Q,
          R,
          C,
        ],
        hashComments: !0,
        cStyleComments: !0,
        multiLineStrings: !0,
        regexLiterals: !0,
      }),
      I = {};
    t(X, ['default-code']);
    t(
      G(
        [],
        [
          ['pln', /^[^<?]+/],
          ['dec', /^<!\w[^>]*(?:>|$)/],
          ['com', /^<\!--[\s\S]*?(?:-\->|$)/],
          ['lang-', /^<\?([\s\S]+?)(?:\?>|$)/],
          ['lang-', /^<%([\s\S]+?)(?:%>|$)/],
          ['pun', /^(?:<[%?]|[%?]>)/],
          ['lang-', /^<xmp\b[^>]*>([\s\S]+?)<\/xmp\b[^>]*>/i],
          ['lang-js', /^<script\b[^>]*>([\s\S]*?)(<\/script\b[^>]*>)/i],
          ['lang-css', /^<style\b[^>]*>([\s\S]*?)(<\/style\b[^>]*>)/i],
          ['lang-in.tag', /^(<\/?[a-z][^<>]*>)/i],
        ],
      ),
      'default-markup htm html mxml xhtml xml xsl'.split(' '),
    );
    t(
      G(
        [
          ['pln', /^[\s]+/, null, ' \t\r\n'],
          ['atv', /^(?:\"[^\"]*\"?|\'[^\']*\'?)/, null, '"\''],
        ],
        [
          ['tag', /^^<\/?[a-z](?:[\w.:-]*\w)?|\/?>$/i],
          ['atn', /^(?!style[\s=]|on)[a-z](?:[\w:-]*\w)?/i],
          ['lang-uq.val', /^=\s*([^>\'\"\s]*(?:[^>\'\"\s\/]|\/(?=\s)))/],
          ['pun', /^[=<>\/]+/],
          ['lang-js', /^on\w+\s*=\s*\"([^\"]+)\"/i],
          ['lang-js', /^on\w+\s*=\s*\'([^\']+)\'/i],
          ['lang-js', /^on\w+\s*=\s*([^\"\'>\s]+)/i],
          ['lang-css', /^style\s*=\s*\"([^\"]+)\"/i],
          ['lang-css', /^style\s*=\s*\'([^\']+)\'/i],
          ['lang-css', /^style\s*=\s*([^\"\'>\s]+)/i],
        ],
      ),
      ['in.tag'],
    );
    t(G([], [['atv', /^[\s\S]+/]]), ['uq.val']);
    t(
      y({ keywords: H, hashComments: !0, cStyleComments: !0, types: S }),
      'c cc cpp cxx cyc m'.split(' '),
    );
    t(y({ keywords: 'null,true,false' }), ['json']);
    t(
      y({
        keywords: P,
        hashComments: !0,
        cStyleComments: !0,
        verbatimStrings: !0,
        types: S,
      }),
      ['cs'],
    );
    t(y({ keywords: O, cStyleComments: !0 }), ['java']);
    t(y({ keywords: C, hashComments: !0, multiLineStrings: !0 }), [
      'bash',
      'bsh',
      'csh',
      'sh',
    ]);
    t(
      y({
        keywords: Q,
        hashComments: !0,
        multiLineStrings: !0,
        tripleQuotedStrings: !0,
      }),
      ['cv', 'py', 'python'],
    );
    t(
      y({
        keywords:
          'caller,delete,die,do,dump,elsif,eval,exit,foreach,for,goto,if,import,last,local,my,next,no,our,print,package,redo,require,sub,undef,unless,until,use,wantarray,while,BEGIN,END',
        hashComments: !0,
        multiLineStrings: !0,
        regexLiterals: 2,
      }),
      ['perl', 'pl', 'pm'],
    );
    t(
      y({
        keywords: R,
        hashComments: !0,
        multiLineStrings: !0,
        regexLiterals: !0,
      }),
      ['rb', 'ruby'],
    );
    t(y({ keywords: F, cStyleComments: !0, regexLiterals: !0 }), [
      'javascript',
      'js',
      'ts',
      'typescript',
    ]);
    t(
      y({
        keywords:
          'all,and,by,catch,class,else,extends,false,finally,for,if,in,is,isnt,loop,new,no,not,null,of,off,on,or,return,super,then,throw,true,try,unless,until,when,while,yes',
        hashComments: 3,
        cStyleComments: !0,
        multilineStrings: !0,
        tripleQuotedStrings: !0,
        regexLiterals: !0,
      }),
      ['coffee'],
    );
    t(G([], [['str', /^[\s\S]+/]]), ['regex']);
    var Y = (E.PR = {
        createSimpleLexer: G,
        registerLangHandler: t,
        sourceDecorator: y,
        PR_ATTRIB_NAME: 'atn',
        PR_ATTRIB_VALUE: 'atv',
        PR_COMMENT: 'com',
        PR_DECLARATION: 'dec',
        PR_KEYWORD: 'kwd',
        PR_LITERAL: 'lit',
        PR_NOCODE: 'nocode',
        PR_PLAIN: 'pln',
        PR_PUNCTUATION: 'pun',
        PR_SOURCE: 'src',
        PR_STRING: 'str',
        PR_TAG: 'tag',
        PR_TYPE: 'typ',
        prettyPrintOne: (E.prettyPrintOne = function (a, d, f) {
          f = f || !1;
          d = d || null;
          var b = document.createElement('div');
          b.innerHTML = '<pre>' + a + '</pre>';
          b = b.firstChild;
          f && L(b, f, !0);
          M({ j: d, m: f, h: b, l: 1, a: null, i: null, c: null, g: null });
          return b.innerHTML;
        }),
        prettyPrint: (E.prettyPrint = function (a, d) {
          function f() {
            for (
              var b = E.PR_SHOULD_USE_CONTINUATION ? c.now() + 250 : Infinity;
              p < t.length && c.now() < b;
              p++
            ) {
              for (var d = t[p], l = g, m = d; (m = m.previousSibling); ) {
                var n = m.nodeType,
                  u = (7 === n || 8 === n) && m.nodeValue;
                if (
                  u
                    ? !/^\??prettify\b/.test(u)
                    : 3 !== n || /\S/.test(m.nodeValue)
                )
                  break;
                if (u) {
                  l = {};
                  u.replace(/\b(\w+)=([\w:.%+-]+)/g, function (a, b, c) {
                    l[b] = c;
                  });
                  break;
                }
              }
              m = d.className;
              if ((l !== g || r.test(m)) && !e.test(m)) {
                n = !1;
                for (u = d.parentNode; u; u = u.parentNode)
                  if (q.test(u.tagName) && u.className && r.test(u.className)) {
                    n = !0;
                    break;
                  }
                if (!n) {
                  d.className += ' prettyprinted';
                  n = l.lang;
                  if (!n) {
                    var n = m.match(w),
                      C;
                    !n &&
                      (C = V(d)) &&
                      z.test(C.tagName) &&
                      (n = C.className.match(w));
                    n && (n = n[1]);
                  }
                  if (y.test(d.tagName)) u = 1;
                  else
                    var u = d.currentStyle,
                      x = v.defaultView,
                      u =
                        (u = u
                          ? u.whiteSpace
                          : x && x.getComputedStyle
                            ? x
                                .getComputedStyle(d, null)
                                .getPropertyValue('white-space')
                            : 0) && 'pre' === u.substring(0, 3);
                  x = l.linenums;
                  (x = 'true' === x || +x) ||
                    (x = (x = m.match(/\blinenums\b(?::(\d+))?/))
                      ? x[1] && x[1].length
                        ? +x[1]
                        : !0
                      : !1);
                  x && L(d, x, u);
                  M({
                    j: n,
                    h: d,
                    m: x,
                    l: u,
                    a: null,
                    i: null,
                    c: null,
                    g: null,
                  });
                }
              }
            }
            p < t.length
              ? E.setTimeout(f, 250)
              : 'function' === typeof a && a();
          }
          for (
            var b = d || document.body,
              v = b.ownerDocument || document,
              b = [
                b.getElementsByTagName('pre'),
                b.getElementsByTagName('code'),
                b.getElementsByTagName('xmp'),
              ],
              t = [],
              n = 0;
            n < b.length;
            ++n
          )
            for (var l = 0, m = b[n].length; l < m; ++l) t.push(b[n][l]);
          var b = null,
            c = Date;
          c.now ||
            (c = {
              now: function () {
                return +new Date();
              },
            });
          var p = 0,
            w = /\blang(?:uage)?-([\w.]+)(?!\S)/,
            r = /\bprettyprint\b/,
            e = /\bprettyprinted\b/,
            y = /pre|xmp/i,
            z = /^code$/i,
            q = /^(?:pre|code|xmp)$/i,
            g = {};
          f();
        }),
      }),
      H = E.define;
    'function' === typeof H &&
      H.amd &&
      H('google-code-prettify', [], function () {
        return Y;
      });
  })();
})();
