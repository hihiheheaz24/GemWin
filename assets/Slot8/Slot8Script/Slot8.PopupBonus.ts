
import Dialog from "../../Lobby/LobbyScript/Script/common/Dialog";
import Tween from "../../Lobby/LobbyScript/Script/common/Tween";
import Slot4Controller from "./Slot8Controller";

const { ccclass, property } = cc._decorator;

@ccclass
export class PopupBonus extends Dialog {
    @property([cc.SpriteFrame])
    sfMiss:cc.SpriteFrame[] = [];
    @property([cc.SpriteFrame])
    sfWin:cc.SpriteFrame[] = [];
    @property(cc.Node)
    items: cc.Node = null;
    @property(cc.Node)
    nodeBoxNotify: cc.Node = null;
    @property(cc.Label)
    txtNotify: cc.Label = null;
    @property(cc.Label)
    lblLeft: cc.Label = null;
    @property(cc.Label)
    lblFactor: cc.Label = null;
    @property(cc.Label)
    lblHeso: cc.Label = null;
    @property(cc.Label)
    lblWin: cc.Label = null;

    @property(cc.Label)
    lblCountDown: cc.Label = null;
    
    private factor = 1;
    private left = 0;
    private betValue = 0;
    private onFinished: () => void = null;
    private onSpecialFinished: () => void = null;
    private dataBonus: Array<number> = [];
    private dataSpecial: number = -1;
    private heso:number = 0;
    private win : number = 0;
    private controller:Slot4Controller = null;
    func: () => void;
    start() {
        
        for (let i = 0; i < this.items.childrenCount; i++) {
            let node = this.items.children[i];
            node["btn"] = node.getChildByName("btn").getComponent(cc.Button);
            node["labai"] = node["btn"].node.getChildByName("labai");
            node["miss"] = node["btn"].node.getChildByName("miss");
            node["win"] = node["btn"].node.getChildByName("win");
            node["label"] = node["win"].getComponentInChildren(cc.Label);
            node["chat"] = node["btn"].node.getChildByName("chat").getComponent(cc.Sprite);

            node["btn"].node.on("click", () => {
                this.controller.onBtnSoundTouchBonus();
                var value = this.dataBonus[this.dataBonus.length - this.left];
                //  cc.log("click:"+value+" : "+node["is_open"]);
                if(node["is_open"] == false && this.left > 0){
                    node["is_open"] = true;
                    switch (value) {
                        case 0:
                            //lat bai bi misss
                            this.factor++;
                            this.lblFactor.string = this.factor+"";
                            node["labai"].active = false;
                            node["miss"].active = true;
                            node["win"].active = false;
                            // node["chat"].node.active = true;
                            // node["chat"].spriteFrame = this.sfMiss[parseInt(Math.random()*this.sfMiss.length+"")];
                            break;
                        case 1:
                            node["labai"].active = true;
                            node["miss"].active = false;
                            node["win"].active = true;
                            // node["chat"].node.active = true;
                            // node["chat"].spriteFrame = this.sfWin[parseInt(Math.random()*this.sfWin.length+"")];
                            node["label"].node.active = true;
                            node["label"].string = "0";
                            Tween.numberTo(node["label"], 4*this.betValue , 0.3);
                            this.win += 4* this.betValue;
                            Tween.numberTo(this.lblWin,this.win, 0.3);
                            break;
                       
                        case 2:
                            node["labai"].active = true;
                            node["miss"].active = false;
                            node["win"].active = true;
                            // node["chat"].node.active = true;
                            // node["chat"].spriteFrame = this.sfWin[parseInt(Math.random()*this.sfWin.length+"")];
                            node["label"].node.active = true;
                            node["label"].string = "0";
                            Tween.numberTo(node["label"],10* this.betValue * this.factor, 0.3);
                            this.win += 10* this.betValue * this.factor;
                            Tween.numberTo(this.lblWin,this.win, 0.3);
                            break;
                        case 3:
                            node["labai"].active = true;
                            node["miss"].active = false;
                            node["win"].active = true;
                            // node["chat"].node.active = true;
                            // node["chat"].spriteFrame = this.sfWin[parseInt(Math.random()*this.sfWin.length+"")];
                            node["label"].node.active = true;
                            node["label"].string = "0";
                            Tween.numberTo(node["label"],15* this.betValue * this.factor, 0.3);
                            this.win += 15* this.betValue * this.factor;
                            Tween.numberTo(this.lblWin,this.win, 0.3);
                            break;
                        case 4:
                            node["labai"].active = true;
                            node["miss"].active = false;
                            node["win"].active = true;
                            // node["chat"].node.active = true;
                            // node["chat"].spriteFrame = this.sfWin[parseInt(Math.random()*this.sfWin.length+"") ];
                            node["label"].node.active = true;
                            node["label"].string = "0";
                            this.win += 20* this.betValue * this.factor;
                            Tween.numberTo(node["label"],20* this.betValue * this.factor, 0.3);
                            Tween.numberTo(this.lblWin,this.win, 0.3);
                            break;
                        

                    }
                    this.left--;
                    this.lblLeft.string = "" + this.left;
                    if (this.left <= 0) {
                        this.hidden();
                    }
                }
            });
        }

       
    }

    showBonus(betValue: number, bonus: string,controller, onFinished: () => void) {
        super.show();
        this.controller = controller;
        this.win = 0;
        for (let i = 0; i < this.items.childrenCount; i++) {
            let node = this.items.children[i];
            node["btn"] = node.getChildByName("btn").getComponent(cc.Button);
            node["labai"] = node["btn"].node.getChildByName("labai");
            node["miss"] = node["btn"].node.getChildByName("miss");
            node["win"] = node["btn"].node.getChildByName("win");
            node["label"] = node["win"].getComponentInChildren(cc.Label);
            node["chat"] = node["btn"].node.getChildByName("chat").getComponent(cc.Sprite);
            node["is_open"] = false;
        }
        for (let i = 0; i < this.items.childrenCount; i++) {
            let node = this.items.children[i];
            let btn = node.getChildByName("btn").getComponent(cc.Button);
            btn.node.active = true;
            btn.interactable = true;
            node["labai"].active = true;
            node["miss"].active = false;
            node["win"].active = false;
            node["chat"].node.active = false;
        }
        let time = 15;
        this.lblCountDown.string = this.formatTimeBySec(time);
        this.schedule(this.func = ()=>{
            time--;
            this.lblCountDown.string = this.formatTimeBySec(time);
            if(time === 0) this.unschedule(this.func);        
        }, 1)

        this.betValue = betValue;
        this.onFinished = onFinished;
        let arrBonus = bonus.split(",");
        this.dataBonus = [];
        for (let i = 0; i < arrBonus.length; i++) {
            this.dataBonus.push(Number(arrBonus[i]));
        }
        this.left = this.dataBonus.length - 1;
        this.factor = 1;
        this.lblLeft.string = "" + this.left;
        this.lblFactor.string =  this.factor+"";
        this.heso = this.dataBonus[0];
        this.lblHeso.string = "x"+this.heso;
    }

    formatTimeBySec(time: number , houre : boolean = true) {
        // time = parseInt(time);
        if (time <= 0) return "00:00";
            let hourse = time / (60 * 60);
            if (hourse > 0) time -= hourse * (60 * 60);
            let min = (time / 60).toString();
            if (parseInt(min) > 0) time -= parseInt(min) * 60;
            let sec = (time % 60).toString();
            if (parseInt(min) < 10) min = "0" + min;
            if (parseInt(sec) < 10) sec = "0" + sec;
            return `${min}:${sec}`;
    }

    
    hidden() {
        this.controller.onBtnSoundSumary();
        Tween.showPopup(this.nodeBoxNotify,this.nodeBoxNotify.parent);
        Tween.numberTo(this.txtNotify,this.win, 0.3);
    }

    onBtnExit(){
        Tween.hidePopup(this.nodeBoxNotify,this.nodeBoxNotify.parent,false);
        this.scheduleOnce(() => {
            this.dismiss();
            this.onFinished();
        }, 1.5);
    }
}
export default PopupBonus;