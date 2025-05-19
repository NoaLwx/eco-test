window.addEventListener("DOMContentLoaded", async () => {
        const stream = await navigator.mediaDevices.getUserMedia ({
     
           audio: false,
           video: true,
           facingMode: `user`,
        })
        
        const video = document.createElement (`video`);
        const videoTracks = await stream.getVideoTracks ()
        video.srcObject = stream
        await video.play ()
             
        
        const cnv = document.createElement(`canvas`)
        cnv.width  = 1200;
        cnv.height = cnv.width * video.videoHeight / video.videoWidth
        document.body.appendChild(cnv)  

     
        const ctx = cnv.getContext (`2d`)
        const div = document.getElementById (`camera`)
     
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const audioElement = document.getElementById('sound');
const track = audioCtx.createMediaElementSource(audioElement);
const gainNode = audioCtx.createGain();

const filterNode = audioCtx.createBiquadFilter();
filterNode.type = "lowpass";
 
let audio_check = false;
document.body.addEventListener("click", () => {
  // checkAudio();
  audioCtx.resume();
  audioElement.play();
});

  
  
//   function checkAudio(){
//   if(audio_check == false){
//     audio_check = true;
//     audioCtx.resume();
//     audioElement.play();
//   }
// if(audio_check == true){
// audio_check = false;
//   audioElement.pause();}
// };

track.connect(filterNode).connect(gainNode).connect(audioCtx.destination);

        const draw_frame = async () => {
     
           ctx.save ()
           // flip horizontally
           ctx.scale (-1, 1)
           // draw image from video onto wrong side
           ctx.drawImage (video, -cnv.width, 0, cnv.width, cnv.height)
           //flip it back
           ctx.restore ()
     
         // get pixel data
          //  const pixels =  ctx.getImageData (0, 0, cnv.width, cnv.height).data
          const imageData = ctx.getImageData(0, 0, cnv.width, cnv.height);
        const pixels = imageData.data;

          let total_brightness = 0;
          let count = 0;

     
         // getting data to transform into the ascii
         // skipping each second line becuz characters are taller than a pixel
          //  for (let y = 0; y < cnv.height; y += 2) {
          //     for (let x = 0; x < cnv.width; x++) {
                   // get pixel position
                //  const i = (y * cnv.width + x) * 4 // each pixel has 4 position (rgba)
       for (let i = 0; i < pixels.length; i += 4) {

                   // get rgb value
                 const r = pixels[i]
                 const g = pixels[i + 1]
                 const b = pixels[i + 2]
     
                   // calculate brightness
                  const brightness = (r + g + b) / 3;
                  total_brightness += brightness / 255;
                  count++;

//https://www.youtube.com/watch?v=JSP63VUwmAM
// black and white threshold

                  const threshold = 128; 
  const bw = brightness < threshold ? 0 : 255;

  pixels[i] = pixels[i + 1] = pixels[i + 2] = bw;
    // Set grayscale value
    // pixels[i] = pixels[i + 1] = pixels[i + 2] = brightness;
                 
              }
              ctx.putImageData(imageData, 0, 0);

                
           const avg_brightness = total_brightness / count;
const volume = 0.01 + avg_brightness ;
gainNode.gain.setTargetAtTime(volume, audioCtx.currentTime, 0.05);
        //  div.innerText = ascii_img
     
           requestAnimationFrame (draw_frame)
        }
     
        draw_frame ()

          })