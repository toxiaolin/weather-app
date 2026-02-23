(function(global){

function drawPoster(canvasId,opt,callback){

const canvas=document.getElementById(canvasId);
const ctx=canvas.getContext("2d");

ctx.fillStyle="#ffffff";
ctx.fillRect(0,0,600,800);

loadImages(opt).then(imgs=>{

// ===== 头像圆形 =====
ctx.save();
ctx.beginPath();
ctx.arc(300,220,100,0,Math.PI*2);
ctx.clip();
ctx.drawImage(imgs.avatar,200,120,200,200);
ctx.restore();

// ===== 标题 =====
ctx.fillStyle="#ff7f00";
ctx.font="bold 32px sans-serif";
wrapText(ctx,opt.title,60,420,480,40);

// ===== 底部背景 =====
ctx.fillStyle="#fff3e6";
ctx.fillRect(0,600,600,200);

// ===== logo =====
if(imgs.logo)
ctx.drawImage(imgs.logo,40,650,120,70);

// ===== 二维码 =====
if(imgs.qr)
ctx.drawImage(imgs.qr,420,640,140,140);

const url=canvas.toDataURL("image/png");
callback && callback(url);

});

}

function loadImages(opt){
const tasks={};

["avatar","logo","qr"].forEach(k=>{
 if(opt[k]){
   tasks[k]=load(opt[k]);
 }
});

return Promise.all(
Object.entries(tasks).map(([k,p])=>
p.then(img=>[k,img])
)).then(arr=>{
 const obj={};
 arr.forEach(([k,v])=>obj[k]=v);
 return obj;
});
}

function load(src){
return new Promise((res,rej)=>{
 const img=new Image();
 img.crossOrigin="anonymous";
 img.onload=()=>res(img);
 img.onerror=rej;
 img.src=src;
});
}

function wrapText(ctx,text,x,y,maxWidth,lineHeight){
let line="";
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