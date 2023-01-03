
const img = new Object();
const json = new Object();
const font = new Object();

function preload() {

    const assetsUrlStr = 'https://raw.githubusercontent.com/syuwadaTeam/syuwada/main/syuwada_webApp/assets';

    img.btnStart = loadImage(`${assetsUrlStr}/btn_start.png`);
    img.btnAllmoji = loadImage(`${assetsUrlStr}/btn_allmoji.png`);
    img.btnSettings = loadImage(`${assetsUrlStr}/btn_settings.png`);
    img.btnRule = loadImage(`${assetsUrlStr}/btn_rule.png`);
    img.btnGoTitle = loadImage(`${assetsUrlStr}/btn_goTitle.png`);
    img.btnRetry = loadImage(`${assetsUrlStr}/btn_retry.png`);

    img.kannbann = loadImage(`${assetsUrlStr}/kannbann.png`);
    img.maku_left = loadImage(`${assetsUrlStr}/maku_left.png`);
    img.maku_right = loadImage(`${assetsUrlStr}/maku_right.png`);
    img.makusita = loadImage(`${assetsUrlStr}/makusita.png`);
    img.makusode = loadImage(`${assetsUrlStr}/makusode.png`);
    img.background = loadImage(`${assetsUrlStr}/background.png`);
    img.waku = loadImage(`${assetsUrlStr}/waku.png`);
    img.word_waku = loadImage(`${assetsUrlStr}/word_waku.png`);
    img.time_waku = loadImage(`${assetsUrlStr}/time_waku.png`);
    img.hand_front = loadImage(`${assetsUrlStr}/hand_1.png`);
    img.hand_behind = loadImage(`${assetsUrlStr}/hand_2.png`);
    img.logo = loadImage(`${assetsUrlStr}/logo.png`);
    img.selecter = loadImage(`${assetsUrlStr}/selecter.png`);
    img.allMojiWaku = loadImage(`${assetsUrlStr}/allmoji_waku.png`);

    img.ticket = [  loadImage(`${assetsUrlStr}/mode_1.png`), 
                    loadImage(`${assetsUrlStr}/mode_2.png`),  
                    loadImage(`${assetsUrlStr}/mode_3.png`) ];

    img.ticketSelectStandby = loadImage(`${assetsUrlStr}/mode_standby.png`);
    img.ticket_exp = loadImage(`${assetsUrlStr}/mode_exp.png`);

    img.ningyou = [ loadImage(`${assetsUrlStr}/ningyou_1.png`),
                    loadImage(`${assetsUrlStr}/ningyou_2.png`), 
                    loadImage(`${assetsUrlStr}/ningyou_3.png`) ];

    json.strData = loadJSON(`${assetsUrlStr}/strData.json`);

    img.otehonn = new Object();
    for(const char of "あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをん") {
        img.otehonn[char] = loadImage(`${assetsUrlStr}/otehonn/${char}.png`);
    }

    font.mpHeavy = loadFont(`${assetsUrlStr}/fonts/mplus-2c-heavy.ttf`);
}

function setup() {
    let canvas = createCanvas(700, 500);
    canvas.parent('p5canvas');

    // 後で不必要な行を削除する。
    img.maku_left.resize(width / 2, 0);
    img.maku_right.resize(width / 2, 0);
    img.makusode.resize(width, height);
    img.makusita.resize(width, 0);
    img.background.resize(width, height);
    img.btnGoTitle.resize(img.btnGoTitle.width * 0.8, 0);
    for(const char in img.otehonn) {
        img.otehonn[char].resize(img.waku.width - 20, 0);
    }
    frameRate(40);

    sceneChange("TITLE");

}

let currentSprites = new Object();
let currentScene = 'none';
const gameData = {
                    nextTime : -1,
                    mode : -1,
                    time : -1,
                    wordList : [],
                    currentWord : "",
                    charCount : -1,
                    currentChar : '',
                    currentScore : -1,
                    ningyouSpeed : -1,
                    intervalCount : -1
                 };

const settingsData = {
                        useHand : "RIGHT", // RIGHT or LEFT
                        sounds_bgm : true,
                        sounds_effect : true,
                        cameraMode : "CAMERA" // CAMERA or BONE or NONE
                     };

function draw() {

    image(img.background, 0, 0, width, height);

    switch (currentScene) {
        case "TITLE":
            titleScreenDraw();
            break;
        case "BTN_START_CLICKED":
            btnStartClickedScreenDraw();
            break;
        case "BTN_ALLMOJI_CLICKED":
            blackOutScreenDraw();
            break;
        case "BTN_RULE_CLICKED":
            blackOutScreenDraw();
            break;
        case "BTN_SETTINGS_CLICKED":
            blackOutScreenDraw();
            break;
        case "BLACK_IN":
            blackInScreenDraw();
            break;
        case "ALLMOJI":
            allMojiScreenDraw();
            break;
        case "RULE":
            ruleScreenDraw();
            break;
        case "SETTINGS":
            settingsScreenDraw();
            break;
        case "MODE_SELECTION":
            modeSelectionScreenDraw();
            break;
        case "MODE_SELECTION_COMPLETE":
            modeSelectionCompleteScreenDraw();
            break;
        case "MODE_SELECTION_TO_TITLE":
            modeSelection_to_title_ScreenDraw();
            break;
        case "STANDBY_FOR_HAND":
            standbyForHandScreenDraw();
            break;
        case "GAME_START":
            gameStartScreenDraw();
            break;
        case "GAME":
            gameScreenDraw();
            break;
        case "GAME_FINISH":
            gameFinishScreenDraw();
            break;
        case "RESULT":
            resultScreenDraw();
            break;
        case "RESULT_TO_TITLE":
            result_to_title_ScreenDraw();
            break;
        case "RESULT_TO_STANDBY_FOR_HAND":
            result_to_standByForHand_ScreenDraw();
            break;
        default:
            drawSprites();
            break;
    }

    textFont("Monospace");
    textAlign(LEFT, TOP);
    textSize(15);
    text('Scene: ' + currentScene + '\nfps: ' + frameRate(), 30, 10);
    // console.log('fps: ' + frameRate());

}
