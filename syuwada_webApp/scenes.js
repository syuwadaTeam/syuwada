//*
//* シーンチェンジの時に1回のみ実行される関数
//*

// scene: TITLE
function setTitleScreen() {

    console.log('set title screen :' + allSprites.length);

    const sprites = new Object();

    sprites.maku_right = setMaku("R", "close");
    sprites.maku_left = setMaku("L", "close");
    sprites.kannbann = setKannbann();
    sprites.kannbann.velocity.y = 50;
    
    // スタートボタンがクリックされたときの関数
    const btnStartClicked = () => {
        console.log('btnStart clicked');
        if(currentScene != "TITLE")  return;
        sceneChange("BTN_START_CLICKED");
    }
    sprites.btnStart = setButton(width / 2, 0 - (sprites.kannbann.height / 4), img.btnStart, btnStartClicked);

    sprites.makusode = setMakusode();

    return sprites;
}



// scene: MODE_SELECTION
function setModeSelectionScreen() {
    console.log('set Mode Selection screen :' + allSprites.length);

    const sprites = new Object;

    sprites.maku_right = setMaku("R", "close");
    sprites.maku_left = setMaku("L", "close");

    // タイトルへ戻るボタンがクリックされたときの関数
    const btnGoTitleClicked = () => {
        console.log('btnGoitle clicked');
        sceneChange("MODE_SELECTION_TO_TITLE");
    }
    sprites.btnGoTitle = setButton(600, 470, img.btnGoTitle, btnGoTitleClicked);

    sprites.hand_behind = setBehindHand();

    for(let ticketCount = 0; ticketCount < img.ticket.length; ticketCount++) {
        sprites["ticket_" + ticketCount] = setTicket(ticketCount);
    }
    
    sprites.hand_front = setFrontHand();
    sprites.makusode = setMakusode();

    return sprites;
}

// scene: STANDBY_FOR_HAND
function setStandbyForHandScreen() {
    console.log('set standby for hand screen');

    const sprites = new Object;

    sprites.tehonnWaku = setTehonnWaku();
    sprites.cameraWaku = setCameraWaku();
    sprites.wordWaku = setWordWaku();
    sprites.timeWaku = setTimeWaku();
    sprites.makusita = setMakusita();
    sprites.maku_right = setMaku("R", "close");
    sprites.maku_left = setMaku("L", "close");
    sprites.makusode = setMakusode();

    // タイトルへ戻るボタンがクリックされたときの関数
    const btnGoTitleClicked = () => {
        console.log('btnGoitle clicked');
        sceneChange("TITLE");
    }
    sprites.btnGoTitle = setButton(600, 470, img.btnGoTitle, btnGoTitleClicked);
    
    return sprites;
}

// scene: GAME
function InitGameData() {
    console.log('init gameData');

    const wordListData = json.strData;
    switch (gameData.mode) {
        case 0:
            gameData.wordList = [...wordListData.hiraganas]; // ひらがな文字列を配列に
            gameData.time = 90;
            break;
        case 1:
            gameData.wordList = wordListData.words.filter(word => word.length <= 5); // 長さ5文字以下の単語のみ
            gameData.time = 120;
            break;
        case 2:
            gameData.wordList = wordListData.words.filter(word => word.length >= 3 && word.length <= 10)  // 長さ3以上、10以下の単語のみ
            gameData.time = 190;
            break;
        default:
            console.error("正しいモードが選択されていない");
            sceneChange("MODE_SELECTION");
            break;
    }
    console.log(gameData);
    gameData.charCount = -1;
    gameData.ningyouSpeed = 2;
    gameData.nextTime = millis();
}

// scene: RESULT
function setResultScreen() {
    console.log('set result screen');

    const sprites = new Object();

    sprites.maku_right = setMaku("R", "close");
    sprites.maku_left = setMaku("L", "close");
    sprites.kannbann = setKannbann();
    sprites.kannbann.velocity.y = 50;

    // タイトルへ戻るボタンがクリックされたときの関数
    const btnGoTitleClicked = () => {
        console.log('btnGoitle clicked');
        if(currentScene != "RESULT") return;
        sceneChange("RESULT_TO_TITLE");
    }
    sprites.btnGoTitle = setButton(250,  0 - (sprites.kannbann.height / 4), img.btnGoTitle, btnGoTitleClicked);

    // リトライボタンがクリックされたときの関数
    const btnRetryClicked = () => {
        console.log('btnGoitle clicked');
        if(currentScene != "RESULT") return;
        sceneChange("RESULT_TO_STANDBY_FOR_HAND");
    }
    sprites.btnRetry = setButton(450,  0 - (sprites.kannbann.height / 4), img.btnRetry, btnRetryClicked); // TODO: imgをリトライに変える

    sprites.makusode = setMakusode();

    return sprites;
}


//*
//* シーンごとのスクリーン描画関数
//*

// scene: TITLE
// 看板が下がり、タイトル画面の描画
function titleScreenDraw() {
    const sp = currentSprites;
    const kannbann_minY = 180;
    if(sp.kannbann.velocity.y == 50 && sp.kannbann.position.y >= kannbann_minY) {
        sp.kannbann.velocity.y = -20;
    }
    if(sp.kannbann.velocity.y == -20 && sp.kannbann.position.y <= kannbann_minY - 15) {
        sp.kannbann.velocity.y = 10;
    } 
    if(sp.kannbann.velocity.y == 10 && sp.kannbann.position.y >= kannbann_minY) {
        sp.kannbann.velocity.y = 0;
    }
    sp.btnStart.position.y = sp.kannbann.position.y + 120;
       
    drawSprites();
}

// scene: BTN_START_CLICKED
// スタートボタンが押されてから看板が上がるまでの描画
function btnStartClickedScreenDraw() {

    const sp = currentSprites;
    const kannbann_minY = 180;
    if(sp.kannbann.velocity.y == 5 && sp.kannbann.position.y >= kannbann_minY + 40) {
        sp.kannbann.velocity.y = -50;
    }
    sp.btnStart.position.y = sp.kannbann.position.y + 120;
        
    drawSprites();

    if(sp.kannbann.position.y < 0 - (sp.kannbann.height / 2)) {
        sceneChange("MODE_SELECTION");
        return;
    }
}

// scene: MODE_SELECTION
// 手とチケットをしたから出し、選択&クリックされるまでの描画
function modeSelectionScreenDraw() {

    // 手とチケットを下から出す
    if(currentSprites.hand_front.position.y >= height * 0.8){
        const yv = (currentSprites.hand_front.position.y - height * 0.8 + 10) / 5;
        for(let ticketCount = 0; ticketCount < img.ticket.length; ticketCount++) {
            currentSprites["ticket_" + ticketCount].position.y -= yv;
        }
        currentSprites.hand_front.position.y -= yv;
        currentSprites.hand_behind.position.y = currentSprites.hand_front.position.y;
        drawSprites();
        return;
    }


    // マウスが触れたときに、上に動かす
    let selectTicketNumber = null;
    for(let ticketCount = 0; ticketCount < img.ticket.length; ticketCount++) {

        const sprite = currentSprites["ticket_" + ticketCount];
        let target_x;
        let target_y;

        if(sprite.mouseIsOver && selectTicketNumber == null) {
            selectTicketNumber = ticketCount;
            target_x = currentSprites.hand_front.position.x + Math.cos(-sprite.rotation * (Math.PI / 180)) * 130;
            target_y = currentSprites.hand_front.position.y - Math.sin(-sprite.rotation * (Math.PI / 180)) * 130 - img.hand_front.height / 10;
        }else{
            target_x = currentSprites.hand_front.position.x + Math.cos(-sprite.rotation * (Math.PI / 180)) * 100;
            target_y = currentSprites.hand_front.position.y - Math.sin(-sprite.rotation * (Math.PI / 180)) * 100 - img.hand_front.height / 10;
        }
        const xv = (sprite.position.x - target_x) / 4;
        const yv = (sprite.position.y - target_y) / 4;
        sprite.position.x -= xv;
        sprite.position.y -= yv;
    }
    drawSprites();

    // チケットの説明画像を表示
    if(selectTicketNumber == null){
        //image(img.ticketSelectStandby, width / 2 - img.ticketSelectStandby.width / 2, 30);
    }else{
        image(img.ticket_exp[selectTicketNumber], width / 2 - img.ticket_exp[selectTicketNumber].width / 2, 30);
    }

    // チケットが選択&クリックされたとき
    if(selectTicketNumber != null && mouseIsPressed) {
        gameData.mode = selectTicketNumber; // 難易度設定
        sceneChange("MODE_SELECTION_COMPLETE");
        return;
    }

}

// scene: MODE_SELECTION_COMPLETE
// 手とチケットを下に隠すまでの描画
function modeSelectionCompleteScreenDraw() {

    // 手とチケットを下に隠す
    const target_y = height + img.ticket[0].width + img.hand_front.height / 10 + 40;
    if(currentSprites.hand_front.position.y <= target_y){
        const yv = (currentSprites.hand_front.position.y - target_y - 10) / 5;
        for(let ticketCount = 0; ticketCount < img.ticket.length; ticketCount++) {
            currentSprites["ticket_" + ticketCount].position.y -= yv;
        }
        currentSprites.hand_front.position.y -= yv;
        currentSprites.hand_behind.position.y = currentSprites.hand_front.position.y
        drawSprites();
        return;
    }
    drawSprites();
    sceneChange("STANDBY_FOR_HAND");
}

// scene: MODE_SELECTION_TO_TITLE
// 手とチケットを下に隠すまでの描画
function modeSelection_to_title_ScreenDraw() {
    // 手とチケットを下に隠す
    const target_y = height + img.ticket[0].width + img.hand_front.height / 10 + 40;
    if(currentSprites.hand_front.position.y <= target_y){
        const yv = (currentSprites.hand_front.position.y - target_y - 10) / 5;
        for(let ticketCount = 0; ticketCount < img.ticket.length; ticketCount++) {
            currentSprites["ticket_" + ticketCount].position.y -= yv;
        }
        currentSprites.hand_front.position.y -= yv;
        currentSprites.hand_behind.position.y = currentSprites.hand_front.position.y
        drawSprites();
        return;
    }
    drawSprites();
    sceneChange("TITLE");
}

// scene: STANDBY_FOR_HAND
// 手が映るまで待機する描画
function standbyForHandScreenDraw() {
    drawSprites();
    textSize(40);
    textAlign(CENTER, TOP);
    text("手を映すとスタートします", width / 2, height / 3);

    if(mediapipe_results.multiHandLandmarks.length != 0) {
        sceneChange("GAME_START");
        return;
    }
}

// scene: GAME_START
// ゲーム開始前の幕が開くまでの描画
function gameStartScreenDraw() {
    const xv = (currentSprites.maku_right.position.x - width/ 4 * 5) / 3 - 2;
    currentSprites.maku_right.position.x -= xv;
    currentSprites.maku_left.position.x += xv;
    drawSprites();

    if(currentSprites.maku_right.position.x > width/ 4 * 5){
        sceneChange("GAME");
        return;
    }
}

// scene: GAME
// ゲーム中の描画
function gameScreenDraw() {

    // 名前が長いので簡略化
    const gd = gameData;
    const sp = currentSprites;

    // 新しいワードのとき、人形やワードを設定する
    if(gd.charCount == -1) {
        const ningyouSkin_randomNumber = Math.floor(Math.random() * img.ningyou.length);
        const word_randomNumber = Math.floor(Math.random() * gd.wordList.length);
        sp.ningyou = setNingyou(ningyouSkin_randomNumber);
        gd.currentWord = gd.wordList[word_randomNumber];
        gd.charCount = 0;
        current_handData.status = "INIT";
        gd.currentChar = gd.currentWord[gd.charCount];
        sp.otehonn = setOtehonn(gd.currentChar);
    }

    // ワードの最後まで終わったら人形を高速で端に動かす、でなければ等速で動かす
    if(gd.charCount >= gd.currentWord.length) {
        const xv = (sp.ningyou.position.x - (width + sp.ningyou.width / 2)) / 5 - 2;
        sp.ningyou.position.x -= xv;
    }else{
        sp.ningyou.position.x += gameData.ningyouSpeed;
    }

    // 人形が端まで行ったら強制的に次のワードへ
    if(sp.ningyou.position.x > width + sp.ningyou.width / 2) {
        sp.ningyou.remove();
        sp.otehonn.remove();
        gd.charCount = -1;
    }

    if(gd.intervalCount > 0) gd.intervalCount--;

    // 指文字が正しかったら次の文字へ
    if(gd.charCount >= 0 && gd.charCount < gd.currentWord.length && gd.intervalCount <= 0) {
        if(isYubimojiCorrect(gd.currentChar)){
            console.log("correct - " + gd.currentChar);
            gd.charCount++;
            current_handData.status = "INIT";
            gd.currentChar = gd.currentWord[gd.charCount];
            sp.otehonn.remove();
            sp.otehonn = setOtehonn(gd.currentChar);
            gd.intervalCount = 5;
        }
    }

    drawSprites();
    
    image(img.makusode, 0, 0, width, height);

    textAlign(LEFT, TOP);
    textSize(20);
    const str =  "残り時間: " + gd.time + "\n"
               + "ワード: " + gd.currentWord + "\n"
               + "文字: " + gd.currentChar + "\n"
               + "文字数: " + gd.charCount;
    text(str, 20, 100);

    // 残り時間が0以下なら、ゲーム終了
    if(gd.time <= 0) {
        sceneChange("GAME_FINISH");
        return;
    }

    // 一秒たったら、残り時間を-1
    if(gd.nextTime <= millis()) {
        gd.nextTime += 1000;
        gd.time -= 1;
    }
}

// scene: GAME_FINISH
// ゲーム終わりに幕を閉じるまでの描画
function gameFinishScreenDraw() {
    const xv = (width/ 4 * 3 - currentSprites.maku_right.position.x) / 3 - 2;
    currentSprites.maku_right.position.x += xv;
    currentSprites.maku_left.position.x -= xv;
    drawSprites();

    if(currentSprites.maku_right.position.x < width/ 4 * 3){
        sceneChange("RESULT");
        return;
    }
}

// scene: RESULT
// 看板が下がり、リザルト画面の描画
function resultScreenDraw() {
    const sp = currentSprites;
    const kannbann_minY = 180;
    if(sp.kannbann.velocity.y == 50 && sp.kannbann.position.y >= kannbann_minY) {
        sp.kannbann.velocity.y = -20;
    }
    if(sp.kannbann.velocity.y == -20 && sp.kannbann.position.y <= kannbann_minY - 15) {
        sp.kannbann.velocity.y = 10;
    } 
    if(sp.kannbann.velocity.y == 10 && sp.kannbann.position.y >= kannbann_minY) {
        sp.kannbann.velocity.y = 0;
    }
    sp.btnGoTitle.position.y = sp.kannbann.position.y + 120;
    sp.btnRetry.position.y = sp.kannbann.position.y + 120;
       
    drawSprites();
}

// scene: RESULT_TO_TITLE
// リザルトのタイトルへ戻るボタンが押されたとき看板を上げるまでの描画
function result_to_title_ScreenDraw() {
    const sp = currentSprites;
    const kannbann_minY = 180;
    if(sp.kannbann.velocity.y == 5 && sp.kannbann.position.y >= kannbann_minY + 40) {
        sp.kannbann.velocity.y = -50;
    }
    sp.btnGoTitle.position.y = sp.kannbann.position.y + 120;
    sp.btnRetry.position.y = sp.kannbann.position.y + 120;
        
    drawSprites();

    if(sp.kannbann.position.y < 0 - (sp.kannbann.height / 2)) {
        sceneChange("TITLE");
        return;
    } 
}

// scene: RESULT_TO_STANDBY_FOR_HAND
// リザルトのリトライボタンが押されたとき看板を上げるまでの描画
function result_to_standByForHand_ScreenDraw() {
    const sp = currentSprites;
    const kannbann_minY = 180;
    if(sp.kannbann.velocity.y == 5 && sp.kannbann.position.y >= kannbann_minY + 40) {
        sp.kannbann.velocity.y = -50;
    }
    sp.btnGoTitle.position.y = sp.kannbann.position.y + 120;
    sp.btnRetry.position.y = sp.kannbann.position.y + 120;

    drawSprites();

    if(sp.kannbann.position.y < 0 - (sp.kannbann.height / 2)) {
        sceneChange("STANDBY_FOR_HAND");
        return;
    } 
}
//
// シーンチェンジをする関数
//
function sceneChange(scene) {
    console.log("scene changed : scene= " + scene);
    currentScene = scene;
    switch (scene) {
        case "TITLE":
            removeAllSprites();
            currentSprites = setTitleScreen();
            break;
        case "BTN_START_CLICKED":
            currentSprites.kannbann.velocity.y = 5;
            break;
        case "MODE_SELECTION":
            removeAllSprites();
            currentSprites = setModeSelectionScreen();
        case "MODE_SELECTION_COMPLETE":
            break;
        case "MODE_SELECTION_TO_TITLE":
            break;
        case "STANDBY_FOR_HAND":
            removeAllSprites();
            currentSprites = setStandbyForHandScreen();
        case "GAME_START":
            break;
        case "GAME":
            InitGameData();
            break;
        case "GAME_FINISH":
            currentSprites.maku_left.remove();
            currentSprites.maku_right.remove();
            currentSprites.makusode.remove();
            currentSprites.maku_left = setMaku("L", "open");
            currentSprites.maku_right = setMaku("R", "open");
            currentSprites.makusode = setMakusode();
            break;
        case "RESULT":
            removeAllSprites();
            currentSprites = setResultScreen();
            break;
        case "RESULT_TO_TITLE":
            currentSprites.kannbann.velocity.y = 5;
            break;
        case "RESULT_TO_STANDBY_FOR_HAND":
            currentSprites.kannbann.velocity.y = 5;
            break;
        default:
            break;
    }
}

//
// すべてのスプライトを削除する関数
//
function removeAllSprites() {
    console.log("remove all sprites : ");
    while (allSprites.length > 0) {
        allSprites[0].remove();
    }
}

//
// otehonnとningyouのスプライトをすべて削除する関数 (未使用)
//
function removeSpriteExcept() {
    console.log("remove sprites except maku: ");
    for (const spName in currentSprites) {
        if(spName == "otehonn" || spName == "ningyou"){
            currentSprites[spName].remove();
            console.log(spName + " is remeved");
        }
    }
}

// イベントリスナー追加（廃止している）
function addEventListeners() {
    document.addEventListener('gotoTitle', gotoTitleScreen);
    document.addEventListener('gotoGame', gotoGameScreen);
}