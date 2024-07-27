import Configs from "../../../Loading/src/Configs";
import Http from "../../../Loading/src/Http";
import App from "../../../Lobby/LobbyScript/Script/common/App";
import Dialog from "../../../Lobby/LobbyScript/Script/common/Dialog";
import ScrollViewControl from "../../../Lobby/LobbyScript/Script/common/ScrollViewControl";
import Utils from "../../../Lobby/LobbyScript/Script/common/Utils";

const { ccclass, property } = cc._decorator;

namespace taixiumini {
    @ccclass
    export class PopupHonors extends Dialog {
        @property(cc.Node)
        itemTemplate: cc.Node = null;
        @property([cc.SpriteFrame])
        sprRank: cc.SpriteFrame[] = [];

        private items = new Array<cc.Node>();

        show() {
            super.show();

            for (let i = 0; i < this.items.length; i++) {
                this.items[i].active = false;
            }
            if (this.itemTemplate != null) this.itemTemplate.active = false;


        }

        dismiss() {
            super.dismiss();
            for (let i = 0; i < this.items.length; i++) {
                this.items[i].active = false;
            }
        }

        _onShowed() {
            super._onShowed();
            this.loadData();
        }

        private loadData() {
            App.instance.showLoading(true);
            const configColor = {
                "0" : new cc.Color().fromHEX("#D40AD5"),
                "1" : new cc.Color().fromHEX("#00FFFF"),
                "2" : new cc.Color().fromHEX("#F5D160"),
                "default" : new cc.Color().fromHEX("#F5D160"),
                "defaultUserName" : new cc.Color().fromHEX("#FFFFFF"),
            }
            Http.get(Configs.App.API, { "c": 101, "mt": Configs.App.MONEY_TYPE, "txType": 1 }, (err, res) => {
                App.instance.showLoading(false);
                if (err != null) return;
                if (res["success"]) {

                    if (this.items.length == 0) {
                        for (var i = 0; i < 10; i++) {
                            let item = cc.instantiate(this.itemTemplate);
                            item.parent = this.itemTemplate.parent;
                            this.items.push(item);
                        }
                        this.itemTemplate.destroy();
                        this.itemTemplate = null;
                    }

                    for (let i = 0; i < this.items.length; i++) {
                        let item = this.items[i];
                        if (i < res["topTX"].length) {
                            let itemData = res["topTX"][i];
                            item.getChildByName("bg").opacity = i % 2 == 0 ? 10 : 0;
                            item.getChildByName("lblRank").getComponent(cc.Label).string = (i + 1).toString();
                            item.getChildByName("lblAccount").getComponent(cc.Label).string = itemData["username"];
                            item.getChildByName("lblWin").getComponent(cc.Label).string = Utils.formatNumber(itemData["money"]);

                            if (i  < 3) {
                                item.getChildByName("lblWin").color = configColor[i];
                                item.getChildByName("lblAccount").color = configColor[i];
                                item.getChildByName("lblWin").getComponent(cc.Label).enableBold = true;
                                item.getChildByName("lblAccount").getComponent(cc.Label).enableBold = true;
                              
                                item.getChildByName("ic_rank").active = true;
                                item.getChildByName("lblRank").active = false;
                                item.getChildByName("ic_rank").getComponent(cc.Sprite).spriteFrame = this.sprRank[i];
                            } else {
                                item.getChildByName("ic_rank").active = false;
                                item.getChildByName("lblRank").active = true;
                                item.getChildByName("lblWin").color = configColor["default"];
                                item.getChildByName("lblAccount").color = configColor["defaultUserName"];
                                item.getChildByName("lblWin").getComponent(cc.Label).enableBold = false;
                                item.getChildByName("lblAccount").getComponent(cc.Label).enableBold = false;
                            }

                            item.active = true;
                        } else {
                            item.active = false;
                        }
                    }
                }
            });
        }
    }

}

export default taixiumini.PopupHonors;