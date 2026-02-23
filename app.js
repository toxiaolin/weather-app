/* ===== 三个问题随机 ===== */

const questions = [
"如果妈妈有魔法，第一件事想带你做什么?",
"给妈妈画一张像，你会给她画几条腿?",
"如果星星可以吃，你觉得是什么味道?"
];

const question =
questions[Math.floor(Math.random()*questions.length)];

document.getElementById("questionBox").innerText = question;


/* ===== 摄像头 ===== */

async function initCamera(){
  const stream = await navigator.mediaDevices.getUserMedia({
    video:{ facingMode:"environment" }
  });
  camera.srcObject = stream;
}
initCamera();


/* ===== 拍照 ===== */

photoBtn.onclick = ()=>{

  const video = camera;
  const c = document.createElement("canvas");
  c.width = video.videoWidth;
  c.height = video.videoHeight;

  c.getContext("2d").drawImage(video,0,0);

  const photo = c.toDataURL("image/jpeg");

  drawPoster("posterCanvas",{
    avatar:photo,
    title:question
  },(img)=>{

    posterImage.src = img;

    cameraPage.classList.add("hidden");
    posterPage.classList.remove("hidden");

  });
};


/* ===== 已转发 ===== */

sharedBtn.onclick = ()=>{
  posterPage.classList.add("hidden");
  formPage.classList.remove("hidden");
};


/* ===== 提交判断年龄 ===== */

submitBtn.onclick = ()=>{

  const age = parseInt(ageInput.value);

  if(age>=3 && age<=7){
    result.innerHTML =
    "感谢参与 ❤️<br>为您升级礼包：<b>Labubu挂机一个</b>";
  }else{
    result.innerHTML =
    "感谢参与 ❤️<br>为您升级礼包：<b>免费作文诊断一次</b>";
  }
};