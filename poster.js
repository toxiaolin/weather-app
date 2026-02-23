(function(global){

function drawPoster(canvasId,opt,callback){

const canvas=document.getElementById(canvasId);
const ctx=canvas.getContext("2d");

const W=canvas.width;
const H=canvas.height;

const bg=new Image();
bg.src=opt.avatar;

bg.onload=function(){

/* 背景照片 */
ctx.drawImage(bg,0,0,W,H);

/* 半透明遮罩 */
ctx.fillStyle="rgba(0,0,0,0.35)";
ctx.fillRect(0,0,W,H);

/* 标题卡片 */
ctx.fillStyle="#ffffff";
roundRect(ctx,60,80,W-120,200,30,true);

/* 标题文字 */
ctx.fillStyle="#ff7a00";
ctx.font="bold 36px sans-serif";
wrapText(ctx,opt.title,100,150,W-200,46);

/* 底部品牌 */
ctx.fillStyle="#fff";
ctx.font="28px sans-serif";
ctx.fillText("橘子艺术认证 · 小小创意家",120,H-160);

/* 二维码 */
if(opt.qr){
 const qr=new Image();
 qr.src=opt.qr;
 qr.onload=()=>{
   ctx.drawImage(qr,W-220,H-220,160,160);
   finish();
 };
}else{
 finish();
}

};

function finish(){
const url=canvas.toDataURL("image/png");
callback && callback(url);
}

}

/* 圆角矩形 */
function roundRect(ctx,x,y,w,h,r,fill){
ctx.beginPath();
ctx.moveTo(x+r,y);
ctx.arcTo(x+w,y,x+w,y+h,r);
ctx.arcTo(x+w,y+h,x,y+h,r);
ctx.arcTo(x,y+h,x,y,r);
ctx.arcTo(x,y,x+w,y,r);
ctx.closePath();
if(fill) ctx.fill();
}

/* 自动换行 */
function wrapText(ctx,text,x,y,maxWidth,lineHeight){
let line='';
for(let i=0;i<text.length;i++){
const test=line+text[i];
if(ctx.measureText(test).width>maxWidth){
ctx.fillText(line,x,y);
line=text[i];
y+=lineHeight;
}else{
line=test;
}
}
ctx.fillText(line,x,y);
}

global.drawPoster=drawPoster;

})(window);