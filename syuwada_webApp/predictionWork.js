const current_handData = {
                            width: -1,
                            center: {x: null, y: null},
                            vector: {x: 0, y: 0, z: 0},
                            status: ""
                         }

function isYubimojiCorrect(char) {

    // 名前短縮
    const hd = current_handData;
    const results = mediapipe_results;

    // 手が映ってなかったら手の座標を初期化してfalse返す
    if(results.multiHandLandmarks.length == 0) {
        hd.vector.x = hd.vector.y = hd.vector.z = 0;
        hd.center.x = hd.center.y = hd.width = null;
        return false;
    }

    // ポーズがあっているか判断する関数を定義
    const isPoseCorrect = (predictedArr, charNum) => {

        if(predictedArr.charOrder.length == 0) return false;

        const matchRate = predictedArr.charOrder[charNum];
        const numFromTop = predictedArr.ratioOrder.indexOf(matchRate);
        console.log("char: " + json.strData.seionns[charNum]);
        console.log("matchRate: " + matchRate);
        console.log("numFromTop: " + numFromTop);
        return matchRate >= 0.3 && numFromTop < 3; // 一致率30%以上かつ一致率トップ3以内に入ってるか？
    }

    // 正規化された関節座標を取得
    const gain = 0.1;
    const normalized_landmarksObj = get_normalized_landmarksObj(mediapipe_results.multiHandLandmarks[0], mediapipe_results.image, gain);

    // charTypeを取得
    // 0: 静的文字 1: 濁音文字 2: 半濁音文字 3: 拗音文字（「っ」も含まれる） 4: 特殊動的文字
    const charType = getCharType(char);
    console.log("Type = " + charType);
    console.log("char = " + char);
    console.log("status = " + hd.status);

    // charNumを取得
    const charNum = getCharNum(char, charType);

    // 静的文字の処理
    if(charType == 0) {
        if(hd.status == "INIT") {
            predictedArr.charOrder = [];
            predictedArr.ratioOrder = [];
            hd.status = "HAND_POSE";
        }
        if(hd.status == "HAND_POSE") {
            updatePredictYubimojiArry(normalized_landmarksObj.landmarks);
            if(isPoseCorrect(predictedArr, charNum)) return true;
        }
    }

    // 動的文字の処理
    else if(charType <= 3) {
        if(hd.status == "INIT") {
            hd.vector.x = hd.vector.y = hd.vector.z = 0;
            hd.center.x = hd.center.y = hd.width = null;
            predictedArr.charOrder = [];
            predictedArr.ratioOrder = [];
            hd.status = "HAND_POSE_FIRST";
        }
        if(hd.status == "HAND_POSE_FIRST") {
            console.log("ENTER: POSE: ");
            updatePredictYubimojiArry(normalized_landmarksObj.landmarks); // 指文字予測を更新（非同期）
            // 最初に手の形が合格か判断
            if(isPoseCorrect(predictedArr, charNum)) {
                hd.vector.x = hd.vector.y = hd.vector.z = 0;
                hd.center.x = hd.center.y = hd.width = null;
                hd.status = "HAND_MOVEMENT";
                console.log("ENTER: GO_MOVE: " + hd.vector.x);
            }
        }
        if(hd.status == "HAND_MOVEMENT") {
            console.log("ENTER: MOVE: " + hd.vector.y);

            // charTypeによって手の動きが合っているか判断する関数を定義
            const isMovementCorrect = (char_type) => {
                console.log("width = " + hd.width);
                if(char_type == 1) return hd.vector.x <= hd.width * -0.4;
                if(char_type == 2) return hd.vector.y <= hd.width * -0.4;
                if(char_type == 3) return hd.vector.z <= hd.width * -0.07;
            }

            updateHandMovement(normalized_landmarksObj, hd); // 手の動きを更新
            if(isMovementCorrect(charType)) hd.status = "HAND_POSE_LAST";
        }
        if(hd.status == "HAND_POSE_LAST") {
            console.log("ENTER: LAST: ");
            updatePredictYubimojiArry(normalized_landmarksObj.landmarks);
            // 最後に手の形が合格か判断
            if(isPoseCorrect(predictedArr, charNum)) return true;
        }
    }

    // 特殊動的文字の処理
    else {
        return true;
    }

    return false;
}

function updateHandMovement(normalized_landmarksObj, lastHandData) {

    const handWidth = normalized_landmarksObj.width;
    const handHeight = normalized_landmarksObj.width;
    const corner_x = normalized_landmarksObj.corner.x;
    const corner_y = normalized_landmarksObj.corner.y;
    const center_x = corner_x + handWidth / 2;
    const center_y = corner_y + handHeight / 2;
    const last_center = lastHandData.center;
    const last_width = lastHandData.width;
    const hand_vector = lastHandData.vector;


    // 始めの1回のみ実行される
    if(last_center.x == null){
        last_center.x = center_x;
        last_center.y = center_y;
        lastHandData.width = handWidth; // const last_widthに再代入できない
    }

    const move_x = center_x - last_center.x;
    const move_y = center_y - last_center.y;
    const move_z = handWidth - last_width;
    last_center.x = center_x;
    last_center.y = center_y;
    lastHandData.width = handWidth; // const last_widthに再代入できない

    // 逆方向に動いたらベクトルを0に初期化
    if((move_x * hand_vector.x) < 0)  hand_vector.x = 0;
    if((move_y * hand_vector.y) < 0)  hand_vector.y = 0;
    if((move_y * hand_vector.z) < 0)  hand_vector.z = 0;
    hand_vector.x += move_x;
    hand_vector.y += move_y;
    hand_vector.z += move_z;
}

//未加工のデータを正規化する
function get_normalized_landmarksObj(landmarks, resultImg, gain){

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

const predictedArr =  {
                        charOrder : [],
                        ratioOrder : []
                      }
async function updatePredictYubimojiArry(normalized_landmarks) {
    const model = await tf.loadLayersModel("https://raw.githubusercontent.com/syuwadaTeam/syuwada/main/yubimojiPrediction_program/Assets/model.json");
    const y_pred = await model.predict( tf.tensor2d(normalized_landmarks.flat(), [1, 63]) );
    //Arrayに変換用
    const values = await y_pred.data();
    // console.log(values);
    const arr =  Array.from(values);
    const sortArr = Array.from(values).sort((a, b) => b - a); // 降順ソート

    predictedArr.charOrder = arr;
    predictedArr.ratioOrder = sortArr;
}

function getCharType(char){
    const strData = json.strData;
    if(strData.dakuonns.indexOf(char) != -1)
        return 1;
    else if(strData.hanndakuonns.indexOf(char) != -1)
        return 2;
    else if(strData.youonns.indexOf(char) != -1)
        return 3;
    else if(strData.tokusyus.indexOf(char) != -1)
        return 4;
    else 
        return 0;
}

function getCharNum(char, charType){
    const allMoji = json.strData.seionns;
    // !!!! 長音のデータを取ってなかったので、長音と「ひ」が似ているので代用する（雑対応）。「ー」→「ひ」
    if(char == "ー") return allMoji.indexOf("ひ");
    switch (charType) {
        case 1: return allMoji.indexOf(String.fromCodePoint(char.codePointAt(0) - 1));   // 濁音は文字コード-1 「ば」→「は」
        case 2: return allMoji.indexOf(String.fromCodePoint(char.codePointAt(0) - 2));   // 半濁音は文字コード-2　「ぱ」→「は」
        case 3: return allMoji.indexOf(String.fromCodePoint(char.codePointAt(0) + 1));   // 拗音は文字コード+1 「ゃ」→「や」
        default: return allMoji.indexOf(char);   // 静音はそのまま
    }
}