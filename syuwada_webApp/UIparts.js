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
    ticket.debug = true;

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
    return ningyou;
}

function setOtehonn(char) {
    console.log("set otehonn");

    const otehonn = createSprite(width / 2 - 153, height / 2 - 120);
    otehonn.charType = getCharType(char);
    otehonn.charNum = getCharNum(char, otehonn.charType);
    if(otehonn.charNum != -1)
        otehonn.addImage(img.otehonn[json.strData.seionns[otehonn.charNum]]);
    otehonn.move = function(){
        switch (this.charType) {
            case 0:
                break;
            case 1:
                if(this.position.x > width / 2 - 120)
                    this.position.x = width / 2 - 180;
                else
                    this.position.x += 2;
                break;
            case 2:
                if(this.position.y < height / 2 - 140)
                    this.position.y = height / 2 - 100;
                else
                    this.position.y -= 2;
                break;
            case 3:
                if(this.width < 20)
                    this.width = 50;
                else
                    this.width -= 2;
                break;
            case 4:
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