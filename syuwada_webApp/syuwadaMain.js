

const img = new Object();
const json = new Object();
function preload() {

    img.btnStart = loadImage('./assets/btn_start.png');
    img.btnAllmoji = loadImage('./assets/btn_allmoji.png');
    img.btnSettings = loadImage('./assets/btn_settings.png');
    img.btnGoTitle = loadImage('./assets/btn_goTitle.png');
    img.btnRetry = loadImage('./assets/btn_retry.png');

    img.kannbann = loadImage('./assets/kannbann.png');
    img.maku_left = loadImage('./assets/maku_left.png');
    img.maku_right = loadImage('./assets/maku_right.png');
    img.makusita = loadImage('./assets/makusita.png');
    img.makusode = loadImage('./assets/makusode.png');
    img.background = loadImage('./assets/background.png');

    img.hand_front = loadImage('./assets/hand_1.png');
    img.hand_behind = loadImage('./assets/hand_2.png');

    img.ticket = [  loadImage('./assets/mode_1.png'), 
                    loadImage('./assets/mode_2.png'),  
                    loadImage('./assets/mode_3.png') ];

    img.ticketSelectStandby = loadImage('./assets/mode_0_exp.png');
    img.ticket_exp = [  loadImage('./assets/mode_1_exp.png'), 
                        loadImage('./assets/mode_2_exp.png'),  
                        loadImage('./assets/mode_3_exp.png') ];

    img.ningyou = [ loadImage('./assets/ningyou_1.png'), 
                    loadImage('./assets/ningyou_2.png') ];

    json.strData = loadJSON('./assets/strData.json');
}

function setup() {
    let canvas = createCanvas(700, 500);
    canvas.parent('p5canvas');

    img.maku_left.resize(width / 2, 0);
    img.maku_right.resize(width / 2, 0);
    img.makusode.resize(width, height);
    img.makusita.resize(width, 0);
    img.background.resize(width, height);
    frameRate(40);

    //while(mediapipe_results == null){};
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
                 }
function draw() {

    image(img.background, 0, 0, width, height);

    switch (currentScene) {
        case "TITLE":
            titleScreenDraw();
            break;
        case "BTN_START_CLICKED":
            btnStartClickedScreenDraw();
            break;
        case "MODE_SELECTION":
            modeSelectionScreenDraw();
            textSize(20);
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

    textSize(15);
    textAlign(LEFT, TOP);
    text('Scene: ' + currentScene + '\nfps: ' + frameRate(), 30, 10);
    // console.log('fps: ' + frameRate());

}
