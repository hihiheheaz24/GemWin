
import Dialog from "../../Lobby/LobbyScript/Script/common/Dialog";
import Tween from "../../Lobby/LobbyScript/Script/common/Tween";
import Slot6Controller from "./Slot6.Slot6Controller";

const { ccclass, property } = cc._decorator;

@ccclass
export class PopupBonus extends Dialog {
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
    private factor = 1;
    private left = 0;
    private betValue = 0;
    private onFinished: () => void = null;
    private onSpecialFinished: () => void = null;
    private dataBonus: Array<number> = [];
    private dataSpecial: number = -1;
    private heso:number = 0;
    private win : number = 0;
    private controller:Slot6Controller = null;
    start() {
        
        for (let i = 0; i < this.items.childrenCount; i++) {
            let node = this.items.children[i];
            node["btn"] = node.getChildByName("btn").getComponent(cc.Button);
            node["label"] = node.getChildByName("win").getComponentInChildren(cc.Label);
            node["miss"] = node.getChildByName("miss");
            node["btn"].node.active = true;
            node["miss"].active = false;
            node["label"].node.parent.active = false;
            node["btn"].node.on("click", () => {
                this.controller.onBtnSoundTouchBonus();
                var value = this.dataBonus[this.dataBonus.length - this.left];
                if(node["is_open"] == false && this.left > 0){
                    node["is_open"] = true;
                    switch (value) {
                        case 0:
                            this.factor++;
                            this.lblFactor.string = this.factor+"";
                            node["btn"].node.active = false;
                            node["miss"].active = true;
                            break;
                        case 1:
                            node["miss"].active = false;
                            node["btn"].node.active = false;
                            node["label"].node.parent.active = true;
                            node["label"].string = "0";
                            Tween.numberTo(node["label"], 4*this.betValue , 0.3);
                            this.win += 4* this.betValue;
                            Tween.numberTo(this.lblWin,this.win, 0.3);
                            break;
                       
                        case 2:
                            node["miss"].active = false;
                            node["btn"].node.active = false;
                            node["label"].node.parent.active = true;
                            node["label"].string = "0";
                            Tween.numberTo(node["label"],10* this.betValue * this.factor, 0.3);
                            this.win += 10* this.betValue * this.factor;
                            Tween.numberTo(this.lblWin,this.win, 0.3);
                            break;
                        case 3:
                            node["miss"].active = false;
                            node["btn"].node.active = false;
                            node["label"].node.parent.active = true;
                            node["label"].string = "0";
                            Tween.numberTo(node["label"],15* this.betValue * this.factor, 0.3);
                            this.win += 15* this.betValue * this.factor;
                            Tween.numberTo(this.lblWin,this.win, 0.3);
                            break;
                        case 4:
                            node["miss"].active = false;
                            node["btn"].node.active = false;
                            node["label"].node.parent.active = true;
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
        Tween.numberTo(this.lblWin,this.win, 0.3);
        for (let i = 0; i < this.items.childrenCount; i++) {
            let node = this.items.children[i];
            node["btn"] = node.getChildByName("btn").getComponent(cc.Button);
            node["label"] = node.getChildByName("win").getComponentInChildren(cc.Label);
            node["miss"] = node.getChildByName("miss");
           
            node["btn"].node.active = true;
            node["label"].node.parent.active = true;
            node["miss"].active = false;
            node["is_open"] = false;
        }
        for (let i = 0; i < this.items.childrenCount; i++) {
            let node = this.items.children[i];
            let btn = node.getChildByName("btn").getComponent(cc.Button);
            btn.node.active = true;
            btn.interactable = true;
            node.getChildByName("win").active = false;
        }
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

    
    hidden() {
        this.scheduleOnce(() => {
            this.dismiss();
            this.onFinished();
        }, 3);
        this.controller.onBtnSoundSumary();
        Tween.showPopup(this.nodeBoxNotify,this.nodeBoxNotify.parent);
        Tween.numberTo(this.txtNotify,this.win, 0.3);
        
    }

    onBtnExit(){
        Tween.hidePopup(this.nodeBoxNotify,this.nodeBoxNotify.parent,false);
        this.scheduleOnce(() => {
            this.dismiss();
            this.onFinished();
        }, 3);
    }
}
export default PopupBonus;