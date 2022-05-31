const gain = 0.1;

//すべての文字
const allMoji = "あいうえお"
               +"かきくけこ"
               +"さしすせそ"
               +"たちつてと"
               +"なにぬねの"
               +"はひふへほ"
               +"まみむめも"
               +"やゆよ"
               +"らりるれろ"
               +"わをん";


window.onload = function() {


    //ビデオ要素の取得
    let videoElement = document.getElementById('input_video');
    //表示用のCanvasを取得
    canvasElement = document.getElementById('output_canvas');
    //Canvas描画に関する情報にアクセス
    canvasCtx = canvasElement.getContext('2d');
    //HandTrackingを使用するための関連ファイルの取得と初期化
    const hands = new Hands({locateFile: (file) => {
      return `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1646424915/${file}`;
    }});
    //手の認識に関するオプション
    hands.setOptions({
      selfieMode:false,  //画像を左右反転
      maxNumHands: 1, //認識可能な手の最大数
      modelComplexity: 1,//精度に関する設定(0~1)
      minDetectionConfidence: 0.5,//手検出の信頼度
      minTrackingConfidence: 0.5,//手追跡の信頼度
      useCpuInference: false, //M1 MacのSafariの場合はtrue
    });
     //結果を処理する関数を登録
    hands.onResults(recvResults);
    //カメラの初期化
    const camera = new Camera(videoElement, {
      onFrame: async () => {
        //カメラの画像を用いて手の検出を実行
        await hands.send({image: videoElement});
      },
      width: 1280, height: 720
    });
    //カメラの動作開始
    camera.start();

};

//手の検出結果を利用する
function recvResults(results) {

  const winWidth = window.outerWidth * 0.75;
  const winHeight = window.outerHeight * 0.75;

  //canvasの大きさをウィンドウサイズに合わせる。
  canvasElement.width = winWidth;
  canvasElement.height = winHeight;


  //以下、canvasへの描画に関する記述
  canvasCtx.save();
  //画像を表示
  canvasCtx.drawImage(results.image, 0, 0, winWidth, winHeight);
  // console.log(results.image);

  //手を検出したならばtrue
  if (results.multiHandLandmarks.length != 0) {

    //見つけた手の数だけ処理を繰り返す
    for (const landmarks of results.multiHandLandmarks) {
      //骨格を描画
      drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS,{color: '#00FF00', lineWidth: 2});
      //関節を描画
      drawLandmarks(canvasCtx, landmarks, {color: '#FF0000', lineWidth: 1,radius:2});

      let normalized_landmarks = return_normalized_landmarks(landmarks, results.image, gain);
      predict_yubimoji(normalized_landmarks);

    }
  }else{

    const predictCharElement = document.getElementById("predictChar");
    predictCharElement.innerHTML = "？";

    const probabilityElement = document.getElementById("probability");
    probabilityElement.innerHTML = "手を映してください...";
  }

  canvasCtx.restore();
}


//未加工のデータを正規化する
function return_normalized_landmarks(landmarks, resultImg, gain){

    let point = new Object(),
        len = new Object(), 
        offset = new Object(),
        len_whithMargin,
        normalizedPoint;

    const width = resultImg.width;
    const height = resultImg.height;
    const xarray = landmarks.map(p => p.x * width); //landmarksから、x座標のみの配列を作成
    const yarray = landmarks.map(p => p.y * height); //landmarksから、y座標のみの配列を作成

    point.x1 = Math.min(...xarray);  //xの最小値を求める。
    point.x2 = Math.max(...xarray);  //xの最大値を求める。
    point.y1 = Math.min(...yarray);  //yの最小値を求める。
    point.y2 = Math.max(...yarray);  //yの最大値を求める。

    len.x = point.x2 - point.x1;
    len.y = point.y2 - point.y1;

    len_whithMargin = Math.max(len.x, len.y) * (gain + 1);

    offset.x = point.x1 - ((len_whithMargin - len.x) / 2);
    offset.y = point.y1 - ((len_whithMargin - len.y) / 2);



    normalizedPoint = landmarks.map(p => [(p.x * width - offset.x) / len_whithMargin,
                                          (p.y * height - offset.y) / len_whithMargin,
                                          p.z]);
    //デバック用
    //console.table(normalizedPoint.flat());

    //flatで1次元配列へ変換
    return normalizedPoint.flat();
}

//正規化データを与えると、指文字を予測して表示する
async function predict_yubimoji(normalized_landmarks){

    const model = await tf.loadLayersModel('https://raw.githubusercontent.com/syuwadaTeam/syuwada/main/tensorFlow/modelData/model.json');

    const y_pred = await model.predict( tf.tensor2d(normalized_landmarks, [1, 63]) );

    //Arrayに変換用
    const values = await y_pred.data();
    // console.log(values);
    const arr = await Array.from(values);
    // console.table(arr);

    const charProbability = Math.max(...arr);
    const predict_num = arr.indexOf(charProbability);
    const predict_char = allMoji[predict_num];

    const predictCharElement = document.getElementById("predictChar");
    predictCharElement.innerHTML = predict_char;

    const probabilityElement = document.getElementById("probability");
    probabilityElement.innerHTML = "確率 = " + charProbability;

    //デバック用
    console.log(charProbability + " の確率で\"" + predict_char + "\"");

}


