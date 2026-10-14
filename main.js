(function(){
  var cv=document.getElementById('c');if(!cv)return;
  var ctx=cv.getContext('2d'),A=-3,B=3,Q={x:-1.2,y:-Math.sqrt(4.872)},px=1.6,sg=1;
  function f(x){return x*x*x+A*x+B}
  function col(n){return getComputedStyle(document.documentElement).getPropertyValue(n).trim()}
  function add(P,Q){
    var l;
    if(Math.abs(P.x-Q.x)<1e-3){if(P.y*Q.y<=0)return null;l=(3*P.x*P.x+A)/(2*P.y)}
    else l=(Q.y-P.y)/(Q.x-P.x);
    var xr=l*l-P.x-Q.x,yr=l*(P.x-xr)-P.y;
    return{R:{x:xr,y:yr},T:{x:xr,y:-yr},l:l};
  }
  function draw(){
    var r=cv.getBoundingClientRect(),d=window.devicePixelRatio||1,w=r.width,h=r.height,s=w/7;
    cv.width=w*d;cv.height=h*d;ctx.setTransform(d,0,0,d,0,0);
    var X=function(x){return(x+2.8)*s},Y=function(y){return h/2-y*s};
    var line=col('--line'),ink=col('--ink'),acc=col('--acc'),hi=col('--hi'),mute=col('--mute');
    ctx.strokeStyle=line;ctx.lineWidth=1;
    for(var gx=-2;gx<=4;gx++){ctx.beginPath();ctx.moveTo(X(gx),0);ctx.lineTo(X(gx),h);ctx.stroke()}
    for(var gy=-3;gy<=3;gy++){ctx.beginPath();ctx.moveTo(0,Y(gy));ctx.lineTo(w,Y(gy));ctx.stroke()}
    ctx.strokeStyle=ink;ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(X(-2.8),Y(0));ctx.lineTo(X(4.2),Y(0));ctx.stroke();
    ctx.strokeStyle=acc;ctx.lineWidth=3;
    [1,-1].forEach(function(k){
      ctx.beginPath();
      for(var x=-2.1037,i=0;x<=4.2;x+=.02,i++){var y=k*Math.sqrt(Math.max(f(x),0));i?ctx.lineTo(X(x),Y(y)):ctx.moveTo(X(x),Y(y))}
      ctx.stroke();
    });
    var P={x:px,y:sg*Math.sqrt(f(px))},S=add(P,Q);
    ctx.font='500 14px "IBM Plex Sans",sans-serif';
    function dot(p,c,t,hollow){
      ctx.beginPath();ctx.arc(X(p.x),Y(p.y),7,0,7);
      if(hollow){ctx.strokeStyle=c;ctx.lineWidth=2.5;ctx.stroke()}else{ctx.fillStyle=c;ctx.fill()}
      if(t){ctx.fillStyle=ink;ctx.fillText(t,X(p.x)+11,Y(p.y)-11)}
    }
    if(S){
      ctx.strokeStyle=mute;ctx.lineWidth=1.5;ctx.setLineDash([6,5]);ctx.beginPath();
      if(Math.abs(P.x-Q.x)<1e-3){ctx.moveTo(X(P.x),0);ctx.lineTo(X(P.x),h)}
      else{ctx.moveTo(X(-2.8),Y(P.y+S.l*(-2.8-P.x)));ctx.lineTo(X(4.2),Y(P.y+S.l*(4.2-P.x)))}
      ctx.stroke();
      ctx.beginPath();ctx.moveTo(X(S.T.x),Y(S.T.y));ctx.lineTo(X(S.R.x),Y(S.R.y));ctx.stroke();
      ctx.setLineDash([]);dot(S.T,mute,'',true);dot(S.R,hi,'P + Q');
    }
    dot(Q,ink,'Q');dot(P,acc,'P');
  }
  cv.addEventListener('pointermove',function(e){
    var r=cv.getBoundingClientRect();
    px=Math.min(3.9,Math.max(-2.05,(e.clientX-r.left)/r.width*7-2.8));
    sg=(e.clientY-r.top)<r.height/2?1:-1;draw();
  });
  window.addEventListener('resize',draw);
  if(document.fonts&&document.fonts.ready)document.fonts.ready.then(draw);
  draw();
})();
