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
            console.log("ENTER: MOVE: " + hd.vector.x);

            // charTypeによって手の動きが合っているか判断する関数を定義
            const isMovementCorrect = (char_type) => {
                console.log("width = " + hd.width);
                if(char_type == 1) return hd.vector.x <= hd.width * -0.13;   // 変更前 -0.4
                if(char_type == 2) return hd.vector.y <= hd.width * -0.1;   // 変更前 -0.4
                if(char_type == 3) return hd.vector.z <= hd.width * -0.04;  // 変更前 0.05
            }

            updateHandMovement(normalized_landmarksObj, hd); // 手の動きを更新
            //console.log(charTy);
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

        // fingerNumは https://mediapipe.dev/images/mobile/hand_landmarks.png 参照
        // XorY は Xなら0, Yなら1
        const getFingerPos = (fingerNum, XorY) => normalized_landmarksObj.corner[XorY==0? "x":"y"] + normalized_landmarksObj.landmarks[fingerNum][XorY] * normalized_landmarksObj.width;

        if(hd.status == "INIT") {
            hd.vector.x = hd.vector.y = hd.vector.z = 0;
            hd.center.x = hd.center.y = hd.width = null;
            predictedArr.charOrder = [];
            predictedArr.ratioOrder = [];
            hd.status = "HAND_POSE";
        }
        switch (char) {

            case "の":

                if(hd.status == "HAND_POSE") {
                    console.log("ENTER: POSE: ");
                    updatePredictYubimojiArry(normalized_landmarksObj.landmarks); // 指文字予測を更新（非同期）
                    // 最初に手の形が合格か判断
                    if(isPoseCorrect(predictedArr, charNum)) {
                        hd.yubi = {
                                    indexFingerTip_x : { vec: 0, pos: null},
                                    indexFingerTip_y : { vec: 0, pos: null},
                                  }
                        hd.vector.x = hd.vector.y = hd.vector.z =  0;
                        hd.center.x = hd.center.y = hd.width = null;
                        hd.status = "HAND_MOVEMENT";
                        console.log("ENTER: GO_MOVE: " + hd.vector.x);
                    }
                }
                if(hd.status == "HAND_MOVEMENT") {
                    updateHandMovement(normalized_landmarksObj, hd); // 手の動きを更新
                    hd.yubi.indexFingerTip_x = getMovementData(getFingerPos(8, 0), hd.yubi.indexFingerTip_x);
                    hd.yubi.indexFingerTip_y = getMovementData(getFingerPos(8, 1), hd.yubi.indexFingerTip_y);

                    if(hd.yubi.indexFingerTip_x.vec >= hd.width * 0.6 && hd.yubi.indexFingerTip_y.vec >= hd.width * 0.1) {
                        delete hd.yubi;
                        return true;
                    }
                }
                break;

            case "も":

                if(hd.status == "HAND_POSE") {
                    console.log("ENTER: POSE: ");
                    updatePredictYubimojiArry(normalized_landmarksObj.landmarks); // 指文字予測を更新（非同期）
                    // 最初に手の形が合格か判断
                    if(isPoseCorrect(predictedArr, charNum)) {
                        hd.yubi = {
                                    thumbTip_x : { vec: 0, pos: null},
                                    indexFingerTip_x : { vec: 0, pos: null},
                                  }
                        hd.vector.x = hd.vector.y = hd.vector.z =  0;
                        hd.center.x = hd.center.y = hd.width = null;
                        hd.status = "HAND_MOVEMENT";
                        console.log("ENTER: GO_MOVE: " + hd.vector.x);
                    }
                }
                if(hd.status == "HAND_MOVEMENT") {
                    updateHandMovement(normalized_landmarksObj, hd); // 手の動きを更新
                    hd.yubi.thumbTip_x = getMovementData(getFingerPos(4, 0), hd.yubi.thumbTip_x);
                    hd.yubi.indexFingerTip_x = getMovementData(getFingerPos(8, 0), hd.yubi.indexFingerTip_x);
                    
                    if(hd.yubi.thumbTip_x.vec >= hd.width * 0.15 && hd.yubi.indexFingerTip_x.vec <= hd.width * -0.15) {
                        delete hd.yubi;
                        return true;
                    }
                }
                break;

            case "り":

                if(hd.status == "HAND_POSE") {
                    console.log("ENTER: POSE: ");
                    updatePredictYubimojiArry(normalized_landmarksObj.landmarks); // 指文字予測を更新（非同期）
                    // 最初に手の形が合格か判断
                    if(isPoseCorrect(predictedArr, charNum)) {
                        hd.yubi = {
                                    indexFingerTip_x : { vec: 0, pos: null},
                                    indexFingerTip_y : { vec: 0, pos: null},
                                    middleFingerTip_x : { vec: 0, pos: null},
                                    middleFingerTip_y : { vec: 0, pos: null},
                                  }
                        hd.vector.x = hd.vector.y = hd.vector.z =  0;
                        hd.center.x = hd.center.y = hd.width = null;
                        hd.status = "HAND_MOVEMENT";
                        console.log("ENTER: GO_MOVE: " + hd.vector.x);
                    }
                }
                if(hd.status == "HAND_MOVEMENT") {
                    updateHandMovement(normalized_landmarksObj, hd); // 手の動きを更新
                    hd.yubi.indexFingerTip_x = getMovementData(getFingerPos(8, 0), hd.yubi.indexFingerTip_x);
                    hd.yubi.indexFingerTip_y = getMovementData(getFingerPos(8, 1), hd.yubi.indexFingerTip_y);
                    hd.yubi.middleFingerTip_x = getMovementData(getFingerPos(12, 0), hd.yubi.middleFingerTip_x);
                    hd.yubi.middleFingerTip_y = getMovementData(getFingerPos(12, 1), hd.yubi.middleFingerTip_y);

                    const isindexFingerVecOK = hd.yubi.indexFingerTip_x.vec >= hd.width * 0.5;
                    const ismiddleFingerVecOK = hd.yubi.middleFingerTip_x.vec >= hd.width * 0.6 && hd.yubi.middleFingerTip_y.vec >= hd.width * 0.1;
                    const isFingerOrderOK = hd.yubi.indexFingerTip_y.pos < hd.yubi.middleFingerTip_y.pos;
                    if(isindexFingerVecOK && ismiddleFingerVecOK && isFingerOrderOK) {
                        delete hd.yubi;
                        return true;
                    }
                }
                break;

            case "ー":

                if(hd.status == "HAND_POSE") {
                    console.log("ENTER: POSE: ");
                    updatePredictYubimojiArry(normalized_landmarksObj.landmarks); // 指文字予測を更新（非同期）
                    // 最初に手の形が合格か判断
                    if(isPoseCorrect(predictedArr, charNum)) {
                        hd.yubi = {
                            indexFingerTip_y : { vec: 0, pos: null},
                          }
                        hd.vector.x = hd.vector.y = hd.vector.z =  0;
                        hd.center.x = hd.center.y = hd.width = null;
                        hd.status = "HAND_MOVEMENT";
                        console.log("ENTER: GO_MOVE: " + hd.vector.x);
                    }
                }
                if(hd.status == "HAND_MOVEMENT") {
                    updateHandMovement(normalized_landmarksObj, hd); // 手の動きを更新
                    hd.yubi.indexFingerTip_y = getMovementData(getFingerPos(8, 1), hd.yubi.indexFingerTip_y);

                    if(hd.yubi.indexFingerTip_y.vec >= hd.width * 0.7) {
                        delete hd.yubi;
                        return true;
                    }
                }
                break;

            case "を":

                if(hd.status == "HAND_POSE") {
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
                    updateHandMovement(normalized_landmarksObj, hd); // 手の動きを更新
                    return hd.vector.z <= hd.width * -0.04;
                }
                break;

            case "ん":

                if(hd.status == "HAND_POSE") {
                    console.log("ENTER: POSE: ");
                    updatePredictYubimojiArry(normalized_landmarksObj.landmarks); // 指文字予測を更新（非同期）
                    // 最初に手の形が合格か判断
                    if(isPoseCorrect(predictedArr, charNum)) {
                        hd.yubi = {
                                    indexFingerTip_x : { vec: 0, pos: null},
                                    indexFingerTip_y : { vec: 0, pos: null},
                                  }
                        hd.vector.x = hd.vector.y = hd.vector.z =  0;
                        hd.center.x = hd.center.y = hd.width = null;
                        hd.status = "HAND_MOVEMENT_FIRST";
                        console.log("ENTER: GO_MOVE: " + hd.vector.x);
                    }
                }
                if(hd.status == "HAND_MOVEMENT_FIRST") {
                    updateHandMovement(normalized_landmarksObj, hd); // 手の動きを更新
                    hd.yubi.indexFingerTip_x = getMovementData(getFingerPos(8, 0), hd.yubi.indexFingerTip_x);
                    hd.yubi.indexFingerTip_y = getMovementData(getFingerPos(8, 1), hd.yubi.indexFingerTip_y);

                    if(hd.yubi.indexFingerTip_x.vec <= hd.width * -0.2 && hd.yubi.indexFingerTip_y.vec >= hd.width * 0.08) {
                        hd.status = "HAND_MOVEMENT_SECOND";
                    }
                }
                if(hd.status == "HAND_MOVEMENT_SECOND") {
                    updateHandMovement(normalized_landmarksObj, hd); // 手の動きを更新
                    hd.yubi.indexFingerTip_x = getMovementData(getFingerPos(8, 0), hd.yubi.indexFingerTip_x);
                    hd.yubi.indexFingerTip_y = getMovementData(getFingerPos(8, 1), hd.yubi.indexFingerTip_y);

                    if(hd.yubi.indexFingerTip_x.vec <= hd.width * -0.3 && hd.yubi.indexFingerTip_y.vec <= hd.width * -0.08) {
                        delete hd.yubi;
                        return true;
                    }
                }
                break;

            default:
                break;
        }
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

    const newDataX = getMovementData(center_x, {pos: lastHandData.center.x, vec: lastHandData.vector.x});
    const newDataY = getMovementData(center_y, {pos: lastHandData.center.y, vec: lastHandData.vector.y});
    const newDataZ = getMovementData(handWidth, {pos: lastHandData.width, vec: lastHandData.vector.z});

    lastHandData.center = {x: newDataX.pos, y: newDataY.pos};
    lastHandData.width = newDataZ.pos;
    lastHandData.vector = {x: newDataX.vec, y: newDataY.vec, z: newDataZ.vec};
}

function getMovementData(currentPos, lastData) {

    const newData = { pos: 0, vec: 0 };

    const move = currentPos - (lastData.pos == null ? currentPos : lastData.pos);
    newData.pos = currentPos;

    newData.vec = ((move * lastData.vec) > 0) * lastData.vec + move;

    return newData;
}

//未加工のデータを正規化する
function get_normalized_landmarksObj(landmarks, resultImg, gain) {

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
    const model = await tf.loadLayersModel("https://raw.githubusercontent.com/syuwadaTeam/syuwada/main/syuwada_webApp/assets/model/model_v2.json");
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
    const seionns = json.strData.seionns;
    // !!!! 長音のデータを取ってなかったので、長音と「ひ」が似ているので代用する（雑対応）。「ー」→「ひ」
    if(char == "ー") return seionns.indexOf("ひ");
    switch (charType) {
        case 1: return seionns.indexOf(String.fromCodePoint(char.codePointAt(0) - 1));   // 濁音は文字コード-1 「ば」→「は」
        case 2: return seionns.indexOf(String.fromCodePoint(char.codePointAt(0) - 2));   // 半濁音は文字コード-2　「ぱ」→「は」
        case 3: return seionns.indexOf(String.fromCodePoint(char.codePointAt(0) + 1));   // 拗音は文字コード+1 「ゃ」→「や」
        default: return seionns.indexOf(char);   // 静音はそのまま
    }
}