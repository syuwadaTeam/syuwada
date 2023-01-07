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
    sprites.logo = setLogo();
    
    // スタートボタンがクリックされたときの関数
    const btnStartClicked = () => {
        console.log('btnStart clicked');
        if(currentScene != "TITLE")  return;
        sceneChange("BTN_START_CLICKED");
    }
    sprites.btnStart = setButton(width / 2, 0 - (sprites.kannbann.height / 4), img.btnStart, btnStartClicked);

    // 文字一覧ボタンがクリックされたときの関数
    const btnAllmojiClicked = () => {
        console.log('btnAllmoji clicked');
        if(currentScene != "TITLE")  return;
        sceneChange("BTN_ALLMOJI_CLICKED");
    }
    sprites.btnAllmoji = setButton(width / 2, 0 - (sprites.kannbann.height / 4), img.btnAllmoji, btnAllmojiClicked);

    // ルールボタンがクリックされたときの関数
    const btnRuleClicked = () => {
        console.log('btnRule clicked');
        if(currentScene != "TITLE")  return;
        sceneChange("BTN_RULE_CLICKED");
    }
    sprites.btnRule = setButton(width / 2, 0 - (sprites.kannbann.height / 4), img.btnRule, btnRuleClicked);

    // 設定がクリックされたときの関数
    const btnSettingsClicked = () => {
        console.log('btnSettings clicked');
        if(currentScene != "TITLE")  return;
        sceneChange("BTN_SETTINGS_CLICKED");
    }
    sprites.btnSettings = setButton(width / 2 + 180, 0 - (sprites.kannbann.height / 4), img.btnSettings, btnSettingsClicked);

    sprites.makusode = setMakusode();

    return sprites;
}

// scene: BTN_ALLMOJI_CLICKED, BTN_SETTINGS_CLICKED, BTN_RULE_CLICKED
function setBlackOutScreen() {
    
    console.log('set blackOut screen :' + allSprites.length);

    const sprites = setTitleScreen();
    sprites.kannbann.position.y = 185;
    sprites.kannbann.velocity.y = 0;
    sprites.btnStart.position.y = sprites.kannbann.position.y + 40;
    sprites.btnAllmoji.position.y = sprites.kannbann.position.y + 80;
    sprites.btnRule.position.y = sprites.kannbann.position.y + 120;
    sprites.btnSettings.position.y = sprites.kannbann.position.y + 120;
    sprites.logo.position.y = sprites.kannbann.position.y - 30;

    sprites.black = setBlack(0);

    //sprites.allMojiSheet = setAllMojiSheet();

    // タイトルへ戻るボタンがクリックされたときの関数
    const btnGoTitleClicked = () => {
        console.log('btnGoitle clicked');
        sceneChange("BLACK_IN");
    }
    sprites.btnGoTitle = setButton(600,  470, img.btnGoTitle, btnGoTitleClicked);

    return sprites;
}

// scene: BLACK_IN
function setBlackInScreen() {

    console.log('set allmoji screen :' + allSprites.length);

    const sprites = setBlackOutScreen();
    sprites.black.shapeColor.setAlpha(130);
    sprites.btnGoTitle.remove();
    //sprites.allMojiSheet.remove();

    return sprites;
}

// scene: ALLMOJI
function setAllMojiScreen() {
    
    console.log('set allmoji screen :' + allSprites.length);

    const sprites = setBlackOutScreen();
    sprites.black.shapeColor.setAlpha(130);

    sprites.allMojiSheet = setAllMojiSheet();
    sprites.allMojiSheet.selectMojiBrightness = 0;
    sprites.allMojiSheet.selectedChar = "あ";
    sprites.otehonnCharsets = setOtehonnCharset(sprites.allMojiSheet.selectedChar);
    sprites.slecter = setSelecter();

    return sprites;
}

// scene: RULE
function setRuleScreen() {
    
    console.log('set rule screen :' + allSprites.length);

    const sprites = setBlackOutScreen();
    sprites.black.shapeColor.setAlpha(130);

    sprites.ruleSheet = setRuleSheet();

    return sprites;
}

// scene: SETTINGS
function setSettingsScreen() {
    
    console.log('set settings screen :' + allSprites.length);

    const sprites = setBlackOutScreen();
    sprites.black.shapeColor.setAlpha(130);
    
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

    img.videoImage = createGraphics(videoElement.offsetWidth, videoElement.offsetHeight);

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
            //gameData.wordList = ["ぎ"];
            gameData.time = 60;
            break;
        case 1:
            gameData.wordList = wordListData.words.filter(word => word.length <= 5); // 長さ5文字以下の単語のみ
            gameData.time = 90;
            break;
        case 2:
            gameData.wordList = wordListData.words.filter(word => word.length >= 3 && word.length <= 10)  // 長さ3以上、10以下の単語のみ
            gameData.time = 120;
            break;
        default:
            console.error("正しいモードが選択されていない");
            sceneChange("MODE_SELECTION");
            break;
    }
    console.log(gameData);
    gameData.currentScore = 0;
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
    kannbannDown(sp.kannbann);
    sp.btnStart.position.y = sp.kannbann.position.y + 40;
    sp.btnAllmoji.position.y = sp.kannbann.position.y + 80;
    sp.btnRule.position.y = sp.kannbann.position.y + 120;
    sp.btnSettings.position.y = sp.kannbann.position.y + 120;
    sp.logo.position.y = sp.kannbann.position.y - 30;
       
    drawSprites();
}

// scene: ALLMOJI
// 文字一覧表の描画
function allMojiScreenDraw() {

    const sp = currentSprites;

    sp.otehonnCharsets.move();

    drawSprites();

    textAlign(CENTER, CENTER);
    textFont(font.mpHeavy);
    textSize(23);
    sp.otehonnCharsets.forEach((otehonn, index) => {
        if(index % 2 == 0) {
            const posx = sp.otehonnCharsets[index + 1].position.x;
            const posy = sp.otehonnCharsets[index + 1].position.y + 45;
            text(otehonn.char, posx, posy);
            if(otehonn.charType == 3) {  // 拗音なら"（小）"をつける
                textSize(13);
                text("（小）", posx + 25, posy + 5);
            }
        }
    });

    const allMoji = ["あいうえお", 
                     "かきくけこ", 
                     "さしすせそ", 
                     "たちつてと", 
                     "なにぬねの", 
                     "はひふへほ", 
                     "まみむめも", 
                     "や_ゆ_よ", 
                     "らりるれろ", 
                     "わをん_ー"];

    textAlign(LEFT, TOP);
    textSize(24);
    let mojiBrightness = sp.allMojiSheet.selectMojiBrightness;
    // ひらがな配置とマウスクリック判定
    allMoji.forEach((columnStr, row) => {
        [...columnStr].forEach((char, index) => {
            if(char != "_") {
                const xpos = 560 - (row * (24 + 25));
                const ypos = 240 + (index * (24 + 10));
                if(sp.allMojiSheet.selectedChar == char) {
                    fill(color(`hsb(0, 100%, ${mojiBrightness}%)`));
                }
                text(char, xpos, ypos);
                fill(color('hsb(0, 100%, 0%)'));

                const isMouseTouch = xpos - 3 < mouseX && mouseX < xpos + 24 + 3 && ypos - 3 < mouseY && mouseY < ypos + 24 + 3;
                if(mouseIsPressed && isMouseTouch && sp.allMojiSheet.selectedChar != char) {
                    sp.allMojiSheet.selectedChar = char;
                    mojiBrightness = 100;
                    sp.otehonnCharsets.remove();
                    sp.otehonnCharsets = setOtehonnCharset(sp.allMojiSheet.selectedChar);
                }
            }
        });
    });
    sp.allMojiSheet.selectMojiBrightness = mojiBrightness > 0 ? mojiBrightness - 5 : 0;
}

// scene: RULE
// ルール画面の描画
function ruleScreenDraw() {
       
    drawSprites();
}

// scene: SETTINGS
// 設定画面の描画
function settingsScreenDraw() {
    
    drawSprites();
}

// scene: BTN_ALLMOJI_CLICKED, BTN_SETTINGS_CLICKED, BTN_RULE_CLICKED
// ブラックアウト(画面が暗くなる)
function blackOutScreenDraw() {
    
    drawSprites();

    const blackColor = currentSprites.black.shapeColor;
    const blackAlphaInt = parseInt(blackColor.toString("#rrggbbaa").substring(7, 9), 16);   // 16進数のalpha値をintに変換  
    const maxAlpha = 130;
    if(blackAlphaInt < maxAlpha) {
        const remaining = maxAlpha - blackAlphaInt;
        const nextAlpha = remaining < 30 ? blackAlphaInt + remaining : blackAlphaInt + 30;
        currentSprites.black.shapeColor.setAlpha(nextAlpha);
    }else {
        switch (currentScene) {
            case "BTN_ALLMOJI_CLICKED":
                sceneChange("ALLMOJI");
                break;
            case "BTN_RULE_CLICKED":
                sceneChange("RULE");
                break;
            case "BTN_SETTINGS_CLICKED":
                sceneChange("SETTINGS");
                break;
            default:
                break;
        }
        return;
    }
}

// scene: BLACK_IN
// ブラックイン(画面が明るくなる)
function blackInScreenDraw() {

    drawSprites();

    const blackColor = currentSprites.black.shapeColor;
    const blackAlphaInt = parseInt(blackColor.toString("#rrggbbaa").substring(7, 9), 16);   // 16進数のalpha値をintに変換  
    const minAlpha = 0;
    if(blackAlphaInt > minAlpha) {
        currentSprites.black.shapeColor.setAlpha(blackAlphaInt - 30);
    }else {
        sceneChange("TITLE_NOSET");
        return;
    }
}

// scene: BTN_START_CLICKED
// スタートボタンが押されてから看板が上がるまでの描画
function btnStartClickedScreenDraw() {

    const sp = currentSprites;
    const isKannbannUp = kannbannUp(sp.kannbann);
    sp.btnStart.position.y = sp.kannbann.position.y + 40;
    sp.btnAllmoji.position.y = sp.kannbann.position.y + 80;
    sp.btnRule.position.y = sp.kannbann.position.y + 120;
    sp.btnSettings.position.y = sp.kannbann.position.y + 120;
    sp.logo.position.y = sp.kannbann.position.y - 30;
        
    drawSprites();

    if(isKannbannUp) {
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
    if(selectTicketNumber == null){ // チケット未選択時
        //image(img.ticketSelectStandby, width / 2 - img.ticketSelectStandby.width / 2, 30);
    }else{
        image(img.ticket_exp, width / 2 - img.ticket_exp.width / 2, 30);
        textAlign(LEFT, TOP);
        textSize(20);
        textFont("Sawarabi Mincho");
        fill(color("#834544")); //文字色茶色

        switch (selectTicketNumber) {
            case 0:
                text("初級編", 90, 38);
                textSize(15);
                text("難易度: ★★☆☆☆", 100, 70);
                text("制限時間: 60秒", 100, 90);
                text("すべて一文字で出題されます。小さい文字、濁音、半濁音あり。\n一文字ずつ覚えるのに最適です。", 100, 110);
                break;
            case 1:
                text("中級編", 90, 38);
                textSize(15);
                text("難易度: ★★★☆☆", 100, 70);
                text("制限時間: 90秒", 100, 90);
                text("5文字以下の単語が出題されます。", 100, 110);
                break;
            case 2:
                text("上級編", 90, 38);
                textSize(15);
                text("難易度: ★★★★☆", 100, 70);
                text("制限時間: 120秒", 100, 90);
                text("3～10文字の単語が出題されます。", 100, 110);
                break;
            default:
                break;
        }

        fill(0);
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

    sound.titleBgm.vol -= 0.05;
    sound.titleBgm.vol = sound.titleBgm.vol < 0 ? 0 : sound.titleBgm.vol;
    sound.titleBgm.amp(sound.titleBgm.vol);
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
    textFont(font.mpHeavy);
    textAlign(CENTER, TOP);
    text("手を映すとスタートします", width / 2, height / 3);

    if(mediapipe_results.multiHandLandmarks.length != 0) {
        sceneChange("GAME_START");
        return;
    }

    sound.titleBgm.vol -= 0.02;
    sound.titleBgm.vol = sound.titleBgm.vol < 0 ? 0 : sound.titleBgm.vol;
    sound.titleBgm.amp(sound.titleBgm.vol);
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
        if(gd.currentChar != undefined)
                sp.otehonn.remove();
        gd.charCount = -1;
    }

    if(gd.intervalCount > 0) gd.intervalCount--;

    if(gd.charCount >= 0 && gd.charCount < gd.currentWord.length && gd.intervalCount <= 0) {

        sp.otehonn.move();

        // 指文字が正しかったら次の文字へ
        if(isYubimojiCorrect(gd.currentChar)){
            console.log("correct - " + gd.currentChar);
            gd.charCount++;
            current_handData.status = "INIT";
            gd.currentChar = gd.currentWord[gd.charCount];
            sp.otehonn.remove();
            if(gd.currentChar != undefined)
                sp.otehonn = setOtehonn(gd.currentChar);
            gd.intervalCount = 5;
            gd.currentScore++;
        }
    }

    drawSprites();

    textFont(font.mpHeavy);
    textAlign(CENTER, CENTER);
    textSize(20);
    [...gd.currentWord].forEach((char, index, word) => {
        const textX = width / 2 - ((textSize() + 5) * word.length - 5) / 2 + index * (textSize() + 5);
        index < gd.charCount? fill(128) : fill(0);
        text(char, textX, sp.wordWaku.position.y - 4);
    });
    fill(0);

    textSize(10);
    text("残り時間", width / 2, sp.timeWaku.position.y + 8);
    textSize(30);
    text(gd.time, width / 2, sp.timeWaku.position.y + 30);
    textSize(10);
    text("秒", width / 2, sp.timeWaku.position.y + 57);

    if(gd.currentChar != undefined) {
        
        textSize(23);
        text(gd.currentChar, sp.tehonnWaku.position.x, sp.tehonnWaku.position.y + 105);

        if(getCharType(gd.currentChar) == 3) {  // 拗音なら"（小）"をつける
            textSize(13);
            text("（小）", sp.tehonnWaku.position.x + 25, sp.tehonnWaku.position.y + 110);
        }
    }

    // カメラ画像描画 （変数参照対策で別スコープ）
    {
        img.videoImage.drawingContext.drawImage(videoElement, 0, 0);
        const wakuMaxWidth = 132;
        const wakuOriginx = sp.cameraWaku.position.x - 66;
        const wakuOriginy = sp.cameraWaku.position.y - 7;
        const sizeRato = img.videoImage.height / img.videoImage.width;
        const camImg_width = (sizeRato < 1)? wakuMaxWidth : (1 - sizeRato) * wakuMaxWidth;
        const camImg_height = (sizeRato > 1)? wakuMaxWidth : sizeRato * wakuMaxWidth;
        const camImg_x = (camImg_width == wakuMaxWidth)? wakuOriginx : wakuOriginx + wakuMaxWidth / 2 - camImg_width / 2;
        const camImg_y = (camImg_height == wakuMaxWidth)? wakuOriginy : wakuOriginy + wakuMaxWidth / 2 - camImg_height / 2;
        image(img.videoImage, camImg_x, camImg_y, camImg_width, camImg_height);
    }

    image(img.makusode, 0, 0, width, height);
    
    textFont("Monospace");
    textAlign(LEFT, TOP);
    textSize(20);
    const str =  "残り時間: " + gd.time + "\n"
               + "ワード: " + gd.currentWord + "\n"
               + "文字: " + gd.currentChar + "\n"
               + "文字数: " + gd.charCount + "\n"
               + "スコア: " + gd.currentScore;
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

    sound.gameBgm.vol -= 0.05;
    sound.gameBgm.vol = sound.gameBgm.vol < 0 ? 0 : sound.gameBgm.vol;
    sound.gameBgm.amp(sound.gameBgm.vol);
}

// scene: RESULT
// 看板が下がり、リザルト画面の描画
function resultScreenDraw() {
    const sp = currentSprites;
    kannbannDown(sp.kannbann);
    sp.btnGoTitle.position.y = sp.kannbann.position.y + 120;
    sp.btnRetry.position.y = sp.kannbann.position.y + 120;
    drawSprites();
    textFont(font.mpHeavy);
    textAlign(CENTER, CENTER);
    textSize(40);
    text("リザルト", width / 2, sp.kannbann.position.y - 20);
    textSize(25);
    textAlign(CENTER, CENTER);
    text(`スコア: ${gameData.currentScore}`, width / 2, sp.kannbann.position.y + 50);
}

// scene: RESULT_TO_TITLE
// リザルトのタイトルへ戻るボタンが押されたとき看板を上げるまでの描画
function result_to_title_ScreenDraw() {
    const sp = currentSprites;
    const isKannbannUp = kannbannUp(sp.kannbann);
    sp.btnGoTitle.position.y = sp.kannbann.position.y + 120;
    sp.btnRetry.position.y = sp.kannbann.position.y + 120;
    
    drawSprites();
    textFont(font.mpHeavy);
    textAlign(CENTER, CENTER);
    textSize(40);
    text("リザルト", width / 2, sp.kannbann.position.y - 20);
    textSize(25);
    textAlign(CENTER, CENTER);
    text(`スコア: ${gameData.currentScore}`, width / 2, sp.kannbann.position.y + 50);

    if(sp.kannbann.position.y < 0 - (sp.kannbann.height / 2)) {
        sceneChange("TITLE");
        return;
    }

    sound.titleBgm.vol -= 0.05;
    sound.titleBgm.vol = sound.titleBgm.vol < 0 ? 0 : sound.titleBgm.vol;
    sound.titleBgm.amp(sound.titleBgm.vol);
}

// scene: RESULT_TO_STANDBY_FOR_HAND
// リザルトのリトライボタンが押されたとき看板を上げるまでの描画
function result_to_standByForHand_ScreenDraw() {
    const sp = currentSprites;
    const isKannbannUp = kannbannUp(sp.kannbann);
    sp.btnGoTitle.position.y = sp.kannbann.position.y + 120;
    sp.btnRetry.position.y = sp.kannbann.position.y + 120;

    drawSprites();
    textFont(font.mpHeavy);
    textAlign(CENTER, CENTER);
    textSize(40);
    text("リザルト", width / 2, sp.kannbann.position.y - 20);
    textSize(25);
    textAlign(CENTER, CENTER);
    text(`スコア: ${gameData.currentScore}`, width / 2, sp.kannbann.position.y + 50);

    if(isKannbannUp) {
        sceneChange("STANDBY_FOR_HAND");
        return;
    }

    sound.titleBgm.vol -= 0.02;
    sound.titleBgm.vol = sound.titleBgm.vol < 0 ? 0 : sound.titleBgm.vol;
    sound.titleBgm.amp(sound.titleBgm.vol);
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
            sound.titleBgm.stop();
            sound.gameBgm.stop();
            sound.titleBgm.loop();
            sound.titleBgm.vol = settingsData.sounds_bgm_amp;
            sound.titleBgm.amp(sound.titleBgm.vol);
            break;
        case "TITLE_NOSET":
            currentScene = "TITLE";
            break;
        case "BLACK_IN":
            removeAllSprites();
            currentSprites = setBlackInScreen();
            break;
        case "BTN_START_CLICKED":
            currentSprites.kannbann.velocity.y = 5;
            break;
        case "BTN_ALLMOJI_CLICKED":
            removeAllSprites();
            currentSprites = setBlackOutScreen();
            break;
        case "BTN_RULE_CLICKED":
            removeAllSprites();
            currentSprites = setBlackOutScreen();
            break;
        case "BTN_SETTINGS_CLICKED":
            removeAllSprites();
            currentSprites = setBlackOutScreen();
            break;
        case "ALLMOJI":
            removeAllSprites();
            currentSprites = setAllMojiScreen();
            break;
        case "RULE":
            removeAllSprites();
            currentSprites = setRuleScreen();
            break;
        case "SETTINGS":
            removeAllSprites();
            currentSprites = setSettingsScreen();
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
            break;
        case "GAME_START":
            sound.titleBgm.stop();
            sound.gameBgm.stop();
            sound.gameBgm.loop();
            sound.gameBgm.vol = settingsData.sounds_bgm_amp;
            sound.gameBgm.amp(sound.gameBgm.vol);
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
            sound.titleBgm.stop();
            sound.gameBgm.stop();
            sound.titleBgm.loop();
            sound.titleBgm.vol = settingsData.sounds_bgm_amp;
            sound.titleBgm.amp(sound.titleBgm.vol);
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