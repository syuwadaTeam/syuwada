

let isPressSpace = false;   //スペースキーが押されたか？
let canvasElement;          //canvas
let canvasCtx;              //ctx
let landmarksList = [];
const gain = 0.1;
let charNum = 0;  //"あ"
let lastCharNum = [];

//データをとる文字
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
let syuwaImg;
let listBox;


//初期化
window.onload = function() {

  //リストボックス要素を取得
  listBox = document.getElementById('listBox');
  //img要素の取得
  syuwaImg = document.getElementById("syuwaImg");
  //githubからイラストを取得""
  syuwaImg.src = "https://raw.githubusercontent.com/syuwadaTeam/syuwada/main/createCSVdata_program/Assets/" + allMoji[charNum] + ".png";
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


//スペースキーが押されたとき
document.addEventListener('keypress', (event) => {
  if (event.code === "Space" && isPressSpace == false){
    isPressSpace = true;
  }
});

//downloadボタンが押されたとき
function downloadCSV() {

  //#listBox要素を全消し
  const clone = listBox.cloneNode( false );
  listBox.parentNode.replaceChild( clone , listBox );
  listBox = clone;

  //lastCharNumを全部削除
  lastCharNum.length = 0;


  //以下、.CSVをダウンロードするプログラム

  const blob = new Blob([landmarksList.join('\n')], { type: "text/csv" });

  //BlobからオブジェクトURLを作成する
  const url = (window.URL || window.webkitURL).createObjectURL(blob);
  //ダウンロード用にリンクを作成する
  const download = document.createElement("a");
  //リンク先に上記で生成したURLを指定する
  download.href = url;
  //download属性にファイル名を指定する
  download.download = "pointData.csv";
  //作成したリンクをクリックしてダウンロードを実行する
  download.click();
  //createObjectURLで作成したオブジェクトURLを開放する
  (window.URL || window.webkitURL).revokeObjectURL(url);


  //landmarksListを全部削除
  landmarksList.length = 0;

  pushToLog(".csvファイルをダウンロードしました...");

}

//undoボタンが押されたとき
function undo() {

  if(lastCharNum.length == 0)  return;

  //charNumを前のcharNumにする。(pop()関数 )
  charNum = lastCharNum.pop();
  syuwaImg.src = "https://raw.githubusercontent.com/syuwadaTeam/syuwada/main/指文字イラスト/" + allMoji[charNum] + ".png";

  //landmarksListの最後番目を削除
  landmarksList.pop();

  //<p>要素の最後番目を取得
  const lastP = listBox.lastElementChild;
  //最後の<p>要素を削除
  lastP.remove();


}

//ログに書き込む
function pushToLog(logStr){
  listBox.insertAdjacentHTML('beforeend', "<p>" + logStr + "</p>");
  listBox.scrollTo(0, listBox.scrollHeight);
}


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

      //スペースキーが押されたら...
      if(isPressSpace == true){

        const normalizedPoint = saveResults(landmarks, gain, results.image, canvasElement);
        landmarksList.push(charNum + ',' + normalizedPoint);

        //関節データをリストに追加
        pushToLog( allMoji[charNum] + ' = ' + normalizedPoint );  //EX : あ = ..., ..., ..., .....

        //次の文字にする。
        lastCharNum.push(charNum);
        charNum = Math.floor( Math.random() * allMoji.length )  //文字はランダム
        syuwaImg.src = "https://raw.githubusercontent.com/syuwadaTeam/syuwada/main/createCSVdata_program/Assets/" + allMoji[charNum] + ".png";
      }
    }
  }

  isPressSpace = false;
  canvasCtx.restore();
}

//主に結果の整理や保存をする関数
function saveResults(landmarks, gain, resultImg, beforeTrimImg){

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

  // console.log(len_whithMargin);
  // console.table(normalizedPoint);


  //以下で画像をトリミング

  const trimImg = document.createElement('canvas');
  const trimImg_ctx = trimImg.getContext('2d');
  trimImg.width = len_whithMargin;
  trimImg.height = len_whithMargin;

  const sizeRateX = beforeTrimImg.width / width;
  const sizeRateY = beforeTrimImg.height / height;

  trimImg_ctx.drawImage(beforeTrimImg,
                        offset.x * sizeRateX,
                        offset.y * sizeRateY,
                        len_whithMargin * sizeRateX,
                        len_whithMargin * sizeRateY,
                        0, 0, len_whithMargin, len_whithMargin);


  //以下でトリミングした画像をダウンロードする

  var a = document.createElement('a');
  //canvasをJPEG変換し、そのBase64文字列をhrefへセット
  a.href = trimImg.toDataURL('image/jpeg', 0.85);
  //ダウンロード時のファイル名を指定
  a.download =  allMoji[charNum] + ' - .jpg';
  //クリックイベントを発生させる
  a.click();

  return normalizedPoint;   //csv用のデータを返す。

}
