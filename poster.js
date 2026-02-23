function drawPoster(id,opt,cb){

const canvas=document.getElementById(id);
const ctx=canvas.getContext("2d");

/* 背景 */
ctx.fillStyle="#FFE7C2";
ctx.fillRect(0,0,800,1000);

/* 标题 */
ctx.fillStyle="#ff7f00";
ctx.font="bold 42px sans-serif";
ctx.fillText("萌娃灵魂提问",220,80);

/* 相片 */
let img=new Image();
img.onload=function(){

ctx.drawImage(img,100,150,600,600);

/* 对话气泡 */
ctx.fillStyle="#fff";
ctx.fillRect(80,780,640,120);

ctx.fillStyle="#333";
ctx.font="28px sans-serif";
wrapText(ctx,opt.title,110,830,580,34);

/* 引导 */
ctx.font="24px sans-serif";
ctx.fillText("橘子艺术 · 成长记录",230,940);

cb(canvas.toDataURL("image/jpeg",0.9));
}
img.src=opt.avatar;
}

function wrapText(ctx,text,x,y,maxWidth,lineHeight){
let line="";
for(let n=0;n<text.length;n++){
let test=line+text[n];
if(ctx.measureText(test).width>maxWidth){
ctx.fillText(line,x,y);
line=text[n];
y+=lineHeight;
}else line=test;
}
ctx.fillText(line,x,y);
}