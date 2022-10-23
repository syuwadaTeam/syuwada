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

    const ningyou = createSprite(0 - img.ningyou[skinNumber].width / 2, height / 4 * 3);
    ningyou.addImage(img.ningyou[skinNumber]);
    return ningyou;
}

function setOtehonn(char) {
    console.log("set otehonn");

    const otehonn = createSprite();
    return otehonn;
}

function setKannbann() {
    console.log("set kannbann");

    const kannbann = createSprite(width / 2, 0 -(img.kannbann.height / 2));
    kannbann.addImage(img.kannbann);
    return kannbann;
}