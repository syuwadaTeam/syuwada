
let mediapipe_results = null;

const videoElement = document.getElementById("input_video");
// videoElement.style.display = "none";

const hands = new Hands({
locateFile: (file) => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
},
});

function recvResults(results) {
    mediapipe_results = results;
}

hands.setOptions({
    selfieMode: false,  //画像を左右反転
    maxNumHands: 1, //認識可能な手の最大数
    modelComplexity: 1,//精度に関する設定(0~1)
    minDetectionConfidence: 0.5,//手検出の信頼度
    minTrackingConfidence: 0.5,//手追跡の信頼度
    useCpuInference: false, //M1 MacのSafariの場合はtrue
});
hands.onResults(recvResults);

const webCamera = new Camera(videoElement, {
    onFrame: async () => {
        await hands.send({ image: videoElement });
    }, 
        width: 1280,
        height: 720,
    });
webCamera.start();
