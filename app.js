const questions = [
"如果妈妈变成大恐龙，你想她带你做什么？",
"跳舞时你像什么动物？",
"如果给妈妈画画，她有几条腿？",
"你最想演什么角色？",
"如果星星能吃是什么味道？"
];

let index = 0;
const questionText = document.getElementById("questionText");

questionText.innerText = questions[index];

document.getElementById("nextBtn").onclick = ()=>{
  index = (index + 1) % questions.length;
  questionText.innerText = questions[index];
};

/* ===== 打开摄像头 ===== */

async function initCamera(){
  try{
    const stream = await navigator.mediaDevices.getUserMedia({
      video:{facingMode:"environment"},
      audio:false
    });

    document.getElementById("camera").srcObject = stream;
  }catch(e){
    alert("摄像头打开失败，请允许权限");
  }
}

initCamera();

/* ===== 拍照 ===== */

document.getElementById("photoBtn").onclick = ()=>{

  const video = document.getElementById("camera");

  const canvas = document.createElement("canvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  canvas.getContext("2d")
        .drawImage(video,0,0);

  const photo = canvas.toDataURL("image/jpeg");

  drawPoster("posterCanvas",{
      avatar:photo,
      title:questionText.innerText,
      logo:"logo.png",
      qr:"qr.png"
  },(poster)=>{
      const img=document.getElementById("posterImage");
      img.src=poster;
      img.style.display="block";
  });
};