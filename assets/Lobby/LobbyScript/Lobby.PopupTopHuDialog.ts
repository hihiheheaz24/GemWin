import { Global } from "../../Loading/src/Global";
import { Tophudata } from "./Lobby.ItemTopHu";
import App from "./Script/common/App";
import Tween from "./Script/common/Tween";
import Configs from "../../Loading/src/Configs";
import Dialog from "./Script/common/Dialog";
var TW = cc.tween
const { ccclass, property } = cc._decorator;

@ccclass
export default class TopHuDialog extends Dialog {
    @property(cc.ScrollView)
    scrList: cc.ScrollView = null;
    @property([cc.SpriteFrame])
    sprIconGame: cc.SpriteFrame[] = [];
    @property([cc.SpriteFrame])
    sprXHu: cc.SpriteFrame[] = [];
    @property(cc.ToggleContainer)
    toggleContainer: cc.ToggleContainer = null;
    private _choiceIndex = 0;
    selectedJpValue = 100;
    currentList = [];
    dataHu = null;
    index: number = 0;
    listData100: Array<Tophudata> = new Array<Tophudata>();
    listData1000: Array<Tophudata> = new Array<Tophudata>();
    listData10000: Array<Tophudata> = new Array<Tophudata>();

    show() {
       
        this.node.setSiblingIndex(this.node.parent.childrenCount);
        this.node.active = true;
        this.isAnimated = false;
        this.bg.stopAllActions();
        this.bg.opacity = 0;
        this.bg.setContentSize(cc.winSize);
        cc.Tween.stopAllByTarget(this.container);
        TW(this.container)
            .set({ opacity: 0})
            .to(0.3, { opacity: 255 }, { easing: cc.easing.backOut })
            .call(() => {
                this._onShowed();
            })
            .start();
        this.node.zIndex = cc.macro.MAX_ZINDEX - 10;
        this._choiceIndex = 0;
        this.selectedJpValue = 100;
        this.toggleContainer.toggleItems[this._choiceIndex].isChecked = true;
    }

    dismiss() {
        this.isAnimated = false;
        this.bg.stopAllActions();
        this.bg.opacity = 0;
        this.container.stopAllActions();
        this.container.opacity = 255;
        TW(this.container).to(0.3, { opacity: 150 }, { easing: cc.easing.backIn })
            .call(() => {
                this._onDismissed();
            })
            .start();
    }

   
    setInfo() {
        this.dataHu = !Configs.Login.IsLogin ? App.instance.fakeTopHuData : App.instance.topHuData;
        this.currentList = [];
        if (!Configs.Login.IsLogin) {
            for (var key in this.dataHu) {
                if (key != "caothap"  && key !="spartan" && key !="chiemtinh" && key != "TAI_XIU") {
                    let dataHu = this.dataHu[key];
                    let gameName = App.instance.getGameName(key);
                    if (gameName != key) {
                        if (key == "TAI_XIU") {
                            let topHu100 = new Tophudata(key, gameName, dataHu['j100'], dataHu['j1000']);
                            this.currentList.push(topHu100);
                        } else {
                            let topHu100 = new Tophudata(key, gameName, dataHu['j100'], dataHu['j1000'], dataHu['j10000'], dataHu['j100'], dataHu['j1000'], dataHu['j10000']);
                            this.currentList.push(topHu100);
                        }
                    }
                }
            }
        } else {
            for (var key in this.dataHu) {
                if (key != "caothap"  && key !="spartan" && key !="chiemtinh" && key != "TAI_XIU") {
                    let dataHu = this.dataHu[key];
                    let gameName = App.instance.getGameName(key);
                    if (gameName != key) {
                        if (key == "TAI_XIU") {
                            let topHu100 = new Tophudata(key, gameName, dataHu["1"]["pt"], dataHu["0"]["px"]);
                            this.currentList.push(topHu100);
                        } else {
                            let topHu100 = new Tophudata(key, gameName, dataHu["100"]["p"], dataHu["1000"]["p"], dataHu["10000"]["p"], dataHu["100"]["x2"], dataHu['1000']['x2'], dataHu['10000']['x2']);
                            this.currentList.push(topHu100);
                        }
                    }
                }
            }
        }
        if (this.selectedJpValue == 100) {
            this.currentList = this.currentList.sort((x, y) => {
                return x.value100 > y.value100 ? -1 : 1;
            });
        } else if (this.selectedJpValue == 1000) {
            this.currentList = this.currentList.sort((x, y) => {
                return x.value1000 > y.value1000 ? -1 : 1;
            });
        } else if (this.selectedJpValue == 10000) {
            this.currentList = this.currentList.sort((x, y) => {
                return x.value10000 > y.value10000 ? -1 : 1;
            });
        }
        cc.log("check list hu : ", this.currentList)
        let index = 0;
        for (let i = 0; i < this.currentList.length; i++) {
            let data = this.currentList[i];
            if(this.getSprIcon(data['gamename']) == null){
                cc.log("chay vao ko add item : ",data['gamename'] )
                continue;
            } 
            cc.log("chay vao add item : ",data['gamename'] )
            let item = this.scrList.content.children[index];
            if (!item) {
                item = cc.instantiate(this.scrList.content.children[0]);
                item.parent = this.scrList.content;
            }
            item['data'] = data;  
            item.active = true;
            item.getChildByName('sprIcon').getComponent(cc.Sprite).spriteFrame = this.getSprIcon(data['gamename']);
            item.getChildByName("lbGameName").getComponent(cc.Label).string = data['gamename'];
            item.getComponent(cc.Button).clickEvents[0].customEventData = data['gamename'];
            Tween.numberTo(item.getChildByName('lbJp100').getComponent(cc.Label), data['value100'], 1.0);
            Tween.numberTo(item.getChildByName('lbJp1K').getComponent(cc.Label), data['value1000'], 1.0);
            Tween.numberTo(item.getChildByName('lbJp10K').getComponent(cc.Label), data['value10000'], 1.0);
            index++
        }
    }

    getSprIcon(gameName): cc.SpriteFrame {
        let sprIcon = null;
        switch (gameName) {
            case 'Vampire':
                sprIcon = this.sprIconGame[0];
                break;

            case 'Zeus':
                sprIcon = this.sprIconGame[1];
                break;

            case 'Sinbad':
                sprIcon = this.sprIconGame[2];
                break;

            case 'Thần Tài':
                sprIcon = this.sprIconGame[3];
                break;

            case 'Athur':
                sprIcon = this.sprIconGame[4];
                break;

            case 'CanDy':
                sprIcon = this.sprIconGame[5];
                break;


            case 'Mini Poker':
                sprIcon = this.sprIconGame[6];
                break;
        }
        return sprIcon
    }

    actChangeAmount(event, data) {
        this.selectedJpValue = parseInt(data);
        this.setInfo();
    }

    actGoToGame(event, data) {
        let TabMenuGame = cc.find('Center/Tabs', Global.LobbyController.node.parent).getComponent("TabMenuGame");
        switch (data) {
            case 'Tarzan':
                Global.LobbyController.actGoToSlot1();
                TabMenuGame.onBtnTabSlot();
                break;
            case 'Thần Tài':
                Global.LobbyController.actGoToSlot3();
                TabMenuGame.onBtnTabSlot();
                break;
            case 'Aztec Gems':
                Global.LobbyController.actGameSlot3x3();
                TabMenuGame.onBtnTabMini();
                break;
            case 'ICE':
                Global.LobbyController.actGoToSlot7();
                TabMenuGame.onBtnTabSlot();
                break;
            case 'Vampire':
                Global.LobbyController.actGoToSlot10();
                TabMenuGame.onBtnTabSlot();
                break;
            case 'Sinbad':
                Global.LobbyController.actGoToSlot4();
                TabMenuGame.onBtnTabSlot();
                break;
            case 'Chiêm Tinh':
                Global.LobbyController.actGoToSlot6();
                TabMenuGame.onBtnTabSlot();
                break;
            case 'Kim Cương':
                Global.LobbyController.actGoToSlot11();
                TabMenuGame.onBtnTabSlot();
                break;
            case 'Mini Poker':
                Global.LobbyController.actGameMiniPoker();
                TabMenuGame.onBtnTabMini();
                break;
            case 'Cao Thấp':
                Global.LobbyController.actGameCaoThap();
                TabMenuGame.onBtnTabMini();
                break;
            case 'Zeus':
                Global.LobbyController.actGoToSlot8();
                TabMenuGame.onBtnTabSlot();
                break;
            case 'CanDy':
                Global.LobbyController.actGameSlot3x3Gem();
                TabMenuGame.onBtnTabMini();
                break;
            case 'Tài Xỉu':
                Global.LobbyController.actGameTaiXiu();
                TabMenuGame.onBtnTabMini();
                break;
        }
    }


    onChangeTab(event, data) {
        const tabId = parseInt(data);
        if(this._choiceIndex === tabId) {
            return;
        }
        this._choiceIndex = tabId;
        switch(tabId) {
            case 0:
                this.selectedJpValue = 100;
                this.setInfo();
                break;
            case 1:
                this.selectedJpValue = 1000;
                this.setInfo();
                break;
            case 2:
                this.selectedJpValue = 10000;
                this.setInfo();
                break;
        }

        this.scrList.scrollToTop(0.2);
    }
}
