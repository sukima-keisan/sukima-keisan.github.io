// 金額の入力欄の下に「＝ 500万円」と読みやすい形を出す（計算には使わない）
(function(){
  function man(v){
    v=Math.round(v); if(!isFinite(v))return '';
    var neg=v<0; v=Math.abs(v);
    var oku=Math.floor(v/1e8), m=Math.floor(v%1e8/1e4), r=v%1e4, s='';
    if(oku)s+=oku.toLocaleString('ja-JP')+'億';
    if(m)s+=m.toLocaleString('ja-JP')+'万';
    if(r||!s)s+=r.toLocaleString('ja-JP');
    return (neg?'−':'')+s+'円';
  }
  function setup(){
    // 横に並んだ入力欄の高さがそろうよう、どの欄にも下に1行分の場所を作る（金額の欄だけ中身を出す）
    document.querySelectorAll('label > input, label > select').forEach(function(inp){
      var l=inp.parentElement; if(l.querySelector('.sk-num')||inp.type==='checkbox'||inp.type==='radio')return;
      var o=document.createElement('span'); o.className='sk-num'; o.setAttribute('aria-hidden','true');
      inp.insertAdjacentElement('afterend',o);
      if(inp.type!=='number'||!/円/.test(l.firstChild&&l.firstChild.textContent||''))return;
      var u=function(){var v=+inp.value;o.textContent=(inp.value===''||Math.abs(v)<10000)?'':'＝ '+man(v)}; u();
      inp.addEventListener('input',u);
    });
  }
  // スマホ: 答えが画面に見えているあいだは、下に固定した答えの帯を隠す（同じ数字が2つ並ばないように）
  function watch(){
    var r=document.querySelector('.out'); if(!r||!('IntersectionObserver' in window))return;
    new IntersectionObserver(function(es){document.body.classList.toggle('sk-ans-visible',es[0].isIntersecting)},{threshold:.15}).observe(r);
  }
  function init(){setup();watch()}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
// 3列以上の表に見出しの名前を付けて、狭い所でカードの並びにできるようにする（表は計算のたびに作り直されるので見張る）
(function () {
  function mark(t) {
    const head = t.querySelector('tr');
    if (!head) return;
    const ths = [...head.children].map(c => c.textContent.trim());
    if (ths.length < 3 || !head.querySelector('th')) { t.classList.remove('sk-cards'); return; }
    t.classList.add('sk-cards');
    t.querySelectorAll('tr').forEach(tr => [...tr.children].forEach((td, i) => { if (td.tagName === 'TD' && ths[i]) td.dataset.label = ths[i]; }));
  }
  function all() { document.querySelectorAll('section.tool table').forEach(mark); }
  const mo = new MutationObserver(() => { mo.disconnect(); all(); obs(); });
  function obs() { document.querySelectorAll('section.tool table').forEach(t => mo.observe(t, { childList: true, subtree: true })); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => { all(); obs(); }); else { all(); obs(); }
})();
/* 2026-11-26 いちばんの答えが長いとき（日付・文など）は字を小さくして、途中で折れないようにする */
(function(){
  function fit(){
    [].forEach.call(document.querySelectorAll('.out > .res:first-child b'),function(b){
      var t=b.cloneNode(true); [].forEach.call(t.querySelectorAll('small'),function(x){x.remove()});
      var n=(t.textContent||'').replace(/\s+/g,'').length;
      b.classList.toggle('sk-long',n>9&&n<=16); b.classList.toggle('sk-xlong',n>16);
    });
    /* 横の答えの表: 長い文のマスだけ折り返す（数字のマスは折らない） */
    [].forEach.call(document.querySelectorAll('.sk-side td, .sk-side th'),function(c){
      var n=(c.textContent||'').replace(/\s+/g,'').length; c.classList.toggle('sk-wrap',n>12);
    });
  }
  function start(){
    fit();
    [].forEach.call(document.querySelectorAll('.out, .sk-side .tbl'),function(o){new MutationObserver(fit).observe(o,{childList:true,subtree:true,characterData:true})});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
/* 2026-11-27 ページの見出し: 最後の（…）は、入りきらないときは丸ごと次の行へ（「（水の／量と」のような折れ方をなくす） */
(function(){
  /* ページの見出しと、トップのカードの題名 */
  [].forEach.call(document.querySelectorAll('section.tool h1, .sk-catbox .card h2'),function(h){
    if(h.querySelector('.sk-paren'))return;
    var html=h.innerHTML, i=html.lastIndexOf('（');
    if(i<=0||!/）\s*$/.test(html.replace(/<[^>]+>/g,'')))return;
    h.innerHTML=html.slice(0,i)+'<span class="sk-paren">'+html.slice(i)+'</span>';
  });
})();
