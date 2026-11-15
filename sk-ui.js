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
