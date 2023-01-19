function setButton(posx, posy, bimage, bclickFunc) {
    console.log('setButton');
    
    const btn = createSprite(posx, posy);
    btn.addImage(bimage);
    btn.onMouseReleased = bclickFunc;


    return btn;
}

function setMaku(LorR, state) {
    console.log("setMaku");

    let posx = state == "open" ? (width / 4 * 3) : (width / 4);
    posx = LorR == "R" ? (posx + width / 4 * 2) : (-posx + width / 4 * 2);
    const makuImg = LorR == "R" ? img.maku_right : img.maku_left;
    const maku = createSprite(posx, height - img.maku_left.height / 2, img.maku_right.width, img.maku_left.height);
    maku.addImage(makuImg);

    return maku;
}


function setMakusode() {
    console.log("setMakusode");

    const makusode = createSprite(width / 2, height / 2);
    makusode.addImage(img.makusode);

    return makusode;
}

function setMakusita() {
    console.log("setMakusita");

    const makusita = createSprite(width / 2, height - img.makusita.height / 2 + 20);
    makusita.addImage(img.makusita);

    return makusita;
}

function setTicket(whatNumber) {
    console.log("setTiket : " + whatNumber);

    const theta = Math.PI / (img.ticket.length + 1) * (whatNumber + 1);
    const posx = width / 2 + Math.cos(theta) * 100;
    const posy = height + img.ticket[0].width - Math.sin(theta) * 100;

    const ticket = createSprite(posx, posy);
    ticket.addImage(img.ticket[whatNumber]);
    ticket.rotation = -theta * (180 / Math.PI);
    ticket.setCollider('circle', 0, 0, img.ticket[0].height * 1.5);
    ticket.mouseActive = true;
    //ticket.debug = true;  // 当たり判定を表示

    //console.log(theta * (180 / Math.PI), posx, posy);
    return ticket;
}

function setFrontHand() {
    console.log("set hand");

    const hand = createSprite(width / 2, height + img.ticket[0].width + img.hand_front.height / 10);
    hand.addImage(img.hand_front);
    return hand;
}

function setBehindHand() {
    console.log("set hand");

    const hand = createSprite(width / 2, height + img.ticket[0].width + img.hand_behind.height / 10);
    hand.addImage(img.hand_behind);
    return hand;
}

function setNingyou(skinNumber) {
    console.log("set ningyou");

    const ningyou = createSprite(0 - img.ningyou[skinNumber].width / 2, height / 4 * 3 - 10);
    ningyou.addImage(img.ningyou[skinNumber]);
    ningyou.scale = 0.7;
    return ningyou;
}

function setOtehonn(char) {
    console.log("set otehonn");

    const otehonn = createSprite(width / 2 - 153, height / 2 - 120);
    otehonn.originX = width / 2 - 153;
    otehonn.originY = height / 2 - 120;
    otehonn.scale = 0.95;
    otehonn.char = char;
    otehonn.charType = getCharType(char);
    if(otehonn.charType == 1 || otehonn.charType == 2) otehonn.scale = 0.7;
    otehonn.animationInterval = 15;
    otehonn.charNum = getCharNum(char, otehonn.charType);
    if(otehonn.charNum != -1) {
        if(otehonn.charType == 4 && char != "を")
            otehonn.addAnimation(img.otehonn[json.strData.seionns[otehonn.charNum]]);
        else
            otehonn.addImage(img.otehonn[json.strData.seionns[otehonn.charNum]]);
    }
    otehonn.move = function(){

        const intervalMax = 15;

        switch (this.charType) {
            case 0:
                break;
            case 1:
                if(this.position.x < this.originX - 15) {
                    if(this.animationInterval == 0) {
                        this.position.x = this.originX + 15;
                        this.animationInterval = intervalMax;
                        break;
                    }
                    this.animationInterval--;
                    break;
                }
                this.position.x -= 1.4;
                break;
            case 2:
                if(this.position.y < this.originY - 15) {
                    if(this.animationInterval == 0) {
                        this.position.y = this.originY + 10;
                        this.animationInterval = intervalMax;
                        break;
                    }
                    this.animationInterval--;
                    break;
                }
                this.position.y -= 0.9;
                break;
            case 3:
                if(this.scale < 0.8) {
                    if(this.animationInterval == 0) {
                        this.scale = 0.95;
                        this.animationInterval = intervalMax;
                        break;
                    }
                    this.animationInterval--;
                    break;
                }
                this.scale -= 0.005;
                break;
            case 4:
                if(char == "を") {
                    if(this.scale < 0.8) {
                        if(this.animationInterval == 0) {
                            this.scale = 0.95;
                            this.animationInterval = intervalMax;
                            break;
                        }
                        this.animationInterval--;
                        break;
                    }
                    this.scale -= 0.005;
                    break;
                }
                if(char == "ー") break;

                break;
            default:
                break;
        }
    };

    return otehonn;
}

function setKannbann() {
    console.log("set kannbann");

    const kannbann = createSprite(width / 2, 0 -(img.kannbann.height / 2));
    kannbann.addImage(img.kannbann);
    return kannbann;
}

function setTehonnWaku() {
    console.log("set tehonn waku");

    const waku = createSprite(width / 2 - 153, 70);
    waku.addImage(img.waku);
    return waku;
}

function setCameraWaku() {
    console.log("set camera waku");

    const waku = createSprite(width / 2 + 153, 70);
    waku.addImage(img.waku);
    return waku;
}

function setWordWaku() {
    console.log("set word waku");

    const waku = createSprite(width / 2, height / 2 - 10);
    waku.addImage(img.word_waku);
    return waku;
}

function setTimeWaku() {
    console.log("set time waku");

    const waku = createSprite(width / 2, height / 5);
    waku.addImage(img.time_waku);
    return waku;
}

function setLogo() {
    console.log("set logo");

    const logo = createSprite(width / 2, 0 - img.logo.height);
    logo.addImage(img.logo);
    return logo;
}

function kannbannDown(kannbannSprite) {
    const kannbann_minY = 180;
    if(kannbannSprite.velocity.y == 50 && kannbannSprite.position.y >= kannbann_minY) {
        kannbannSprite.velocity.y = -20;
    }
    if(kannbannSprite.velocity.y == -20 && kannbannSprite.position.y <= kannbann_minY - 15) {
        kannbannSprite.velocity.y = 10;
    } 
    if(kannbannSprite.velocity.y == 10 && kannbannSprite.position.y >= kannbann_minY) {
        kannbannSprite.velocity.y = 0;
    }

    return kannbannSprite.velocity.y == 0;
}

function kannbannUp(kannbannSprite) {
    const kannbann_minY = 180;
    if(kannbannSprite.velocity.y == 5 && kannbannSprite.position.y >= kannbann_minY + 40) {
        kannbannSprite.velocity.y = -50;
    }

    return kannbannSprite.position.y < 0 - (kannbannSprite.height / 2);
}

function setBlack(alpha) {
    console.log("set black");

    const black = createSprite(width / 2, height / 2, width, height);
    black.shapeColor = color(0, alpha);
    return black;
}

function setRuleSheet() {
    console.log("set rule sheet");

    const ruleSheet = createSprite(width / 2, height / 2 - 20);
    ruleSheet.addImage(img.ruleSheet);
    ruleSheet.shapeColor = color(255);
    return ruleSheet;
}

function setAllMojiSheet() {
    console.log("set rule sheet");

    const allMojiSheet = createSprite(width / 2, height / 2 - 20, width * 0.8, height * 0.8);
    //allMojiSheet.addImage();
    allMojiSheet.shapeColor = color('#a9937b');

    return allMojiSheet;
}

function setOtehonnCharset(char) {    // 例:　charが「は」の場合、 「は」「ば」「ぱ」のお手本を生成。
    console.log("set otehonn charset");

    const otehonnSetChars = [];
    const dakuonns = json.strData.dakuonns;
    const hanndakuonns = json.strData.hanndakuonns;
    const youonns = json.strData.youonns;
    let targetChar;

    targetChar = char;   // 静音 （または "ー"）
    otehonnSetChars.push(targetChar);

    targetChar = String.fromCodePoint(char.codePointAt(0) + 1);   // 濁音は文字コード+1 「は」→「ば」
    if(dakuonns.indexOf(targetChar) != -1) otehonnSetChars.push(targetChar);

    targetChar = String.fromCodePoint(char.codePointAt(0) + 2);   // 半濁音は文字コード+2　「は」→「ぱ」
    if(hanndakuonns.indexOf(targetChar) != -1) otehonnSetChars.push(targetChar);

    targetChar = String.fromCodePoint(char.codePointAt(0) - 1);   // 拗音は文字コード-1 「や」→「ゃ」
    if(youonns.indexOf(targetChar) != -1) otehonnSetChars.push(targetChar);

    const otehonnCharSets = [];
    otehonnSetChars.forEach((char, index) => {
        const tehonnWaku = createSprite();
        tehonnWaku.addImage(img.allMojiWaku);
        const otehonn = setOtehonn(char);
        const originX = (width - ((otehonnSetChars.length * (150 + 20)) - 20) + 150) / 2;
        otehonn.position.x = tehonnWaku.position.x = otehonn.originX =  originX + index * (150 + 20);
        otehonn.position.y = tehonnWaku.position.y = otehonn.originY = 140;
        otehonnCharSets.push(otehonn);
        otehonnCharSets.push(tehonnWaku);
    });

    otehonnCharSets.remove = function() {
        this.forEach((charset) => {
            charset.remove();
        });
    }

    otehonnCharSets.move = function() {
        this.forEach((otehonn, index) => {
            // sp.otehonnCharsets[] は 偶数のindexにotehonnが格納されているため仕分ける
            if(index % 2 == 0) otehonn.move();
        });
    }

    return otehonnCharSets;
}

function setSelecter() {
    console.log("set selecter");

    const selecter = createSprite(width / 2, height / 2);
    selecter.addImage(img.selecter);
}