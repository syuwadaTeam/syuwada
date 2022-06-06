
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

let hand_vector = new Object();
let last_center = new Object();
let last_width;

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

      const normalized_landmarks = return_normalized_landmarks(landmarks, results.image, gain);

      const sizeRateX = canvasElement.width / results.image.width;
      const sizeRateY = canvasElement.height / results.image.height;
      const width = normalized_landmarks.width * sizeRateX;
      const height = normalized_landmarks.width * sizeRateY;
      const corner_x = normalized_landmarks.corner.x * sizeRateX;
      const corner_y = normalized_landmarks.corner.y * sizeRateY;
      const center_x = corner_x + width / 2;
      const center_y = corner_y + height / 2;

      // 手を検出した最初の一回の時のみ実行される。
      if(last_center.x == null){
        last_center.x = center_x;
        last_center.y = center_y;
        last_width = width;
      }

      const move_x = center_x - last_center.x;
      const move_y = center_y - last_center.y;
      const move_z = width - last_width;
      last_center.x = center_x;
      last_center.y = center_y;
      last_width = width;
      // 逆方向に動いたらベクトルを0に初期化
      if((move_x * hand_vector.x) < 0)  hand_vector.x = 0;
      if((move_y * hand_vector.y) < 0)  hand_vector.y = 0;
      if((move_y * hand_vector.z) < 0)  hand_vector.z = 0;
      hand_vector.x += move_x;
      hand_vector.y += move_y;
      hand_vector.z += move_z;
      console.log(hand_vector.z);

      canvasCtx.strokeStyle = '#00f';
      canvasCtx.fillStyle = '#00f';
      canvasCtx.lineWidth = 5;
      canvasCtx.beginPath();
      canvasCtx.arc(center_x, center_y, 3, 0, 360 * (Math.PI/180), 0);  //中心点
      canvasCtx.fill();
      canvasCtx.lineWidth = 2;
      const vector_range =  Math.sqrt( Math.pow( hand_vector.x, 2 ) + Math.pow( hand_vector.y, 2 ) );
      //手の幅の半分以上動いたら、線を赤にする
      if(width * 0.5 <= vector_range) canvasCtx.strokeStyle = '#f00'; else canvasCtx.strokeStyle = '#00f';
      canvasCtx.moveTo(center_x, center_y);
      canvasCtx.lineTo(center_x - hand_vector.x, center_y - hand_vector.y);
      canvasCtx.stroke();
      //横幅が小さくなったら手前に引いたと判断し、線を赤にする
      if(hand_vector.z <= -60.0) canvasCtx.strokeStyle = '#f00'; else canvasCtx.strokeStyle = '#00f';
      canvasCtx.strokeRect(corner_x, corner_y, width, height);

      predict_yubimoji(normalized_landmarks.landmarks.flat())
      .then(ret => {

        showResult(ret);


      });



    }
  }else{  //手が無かったら...

    //手の座標の初期化
    hand_vector.x = hand_vector.y = hand_vector.z = 0;
    last_center.x = last_center.y = last_width = null;

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
    return  {
              landmarks : normalizedPoint,
              corner : offset,
              width : len_whithMargin
            };

}

//正規化データを与えると、指文字を予測して表示する
async function predict_yubimoji(normalized_landmarks){

    const model = await tf.loadLayersModel('https://raw.githubusercontent.com/syuwadaTeam/syuwada/main/yubimojiPrediction_program/Assets/model.json');

    const y_pred = await model.predict( tf.tensor2d(normalized_landmarks, [1, 63]) );

    //Arrayに変換用
    const values = await y_pred.data();
    // console.log(values);
    const arr =  Array.from(values);
    // console.table(arr);

    const charProbability = Math.max(...arr);
    const predict_num = arr.indexOf(charProbability);
    const predict_char = allMoji[predict_num];

    //デバック用
    //console.log(charProbability + " の確率で\"" + predict_char + "\"");

    return [predict_char, charProbability];


}

function showResult(predictData){

  const predictCharElement = document.getElementById("predictChar");
  predictCharElement.innerHTML = predictData[0];

  const probabilityElement = document.getElementById("probability");
  probabilityElement.innerHTML = "一致率 = " + predictData[1];

  console.log("\"" + predictData[0] + "\" \n( 一致率 = " + predictData[1] + " )");
}
