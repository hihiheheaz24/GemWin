import Dialog from "./Script/common/Dialog";
import Configs from "../../Loading/src/Configs";
import Http from "../../Loading/src/Http";
import { Global } from "../../Loading/src/Global";
import App from "./Script/common/App";
import ScrollViewControl from "./Script/common/ScrollViewControl";
import Utils from "./Script/common/Utils";
const { ccclass, property } = cc._decorator;
@ccclass
export default class PopupTopEvent extends Dialog {
   
    listAgency = [];
    @property(ScrollViewControl)
    scrAgency: ScrollViewControl = null;
    @property([cc.Font])
    fonts: cc.Font[] = [];
    @property(cc.Node)
    itemTemplate: cc.Node = null;
    @property(cc.Label)
    lblVip: cc.Label = null;
    @property(cc.Label)
    lblLevel: cc.Label = null;
    @property(cc.SpriteFrame)
    spriteCards: cc.SpriteFrame[] = [];
    @property(cc.ToggleContainer)
    tabs: cc.ToggleContainer = null;
    @property(cc.Node)
    tabRule: cc.Node = null;
    @property(cc.Node)
    tabVinhDanh: cc.Node = null;
    @property(cc.Label)
    lblMessage: cc.Label = null;
    @property(cc.Node)
    listVinhDanh: cc.Node = null;
    // @property(cc.Label)
    // lblTime: cc.Label = null;


    private tabSelectedIdx = 0;
    private items = new Array<cc.Node>();

    show() {
        super.show();
        this.lblVip.string = "0";
        this.lblLevel.string = "> 50";
        this.loadData();
    }

    start() {
        for (let i = 0; i < this.tabs.toggleItems.length; i++) {
            this.tabs.toggleItems[i].node.on("toggle", () => {
                this.tabSelectedIdx = i;
                if (i == 1) {
                    this.loadData();
                }
                this.tabRule.active = true ;//this.tabSelectedIdx == 0 ? true : false;
                // this.tabVinhDanh.active = this.tabSelectedIdx == 0 ? false : true;
            });
        }
    }

    onEnable() {
        this.tabSelectedIdx = 1;
        this.tabs.toggleItems[1].isChecked = true;
    }

    loadData() {
        return;
        App.instance.showLoading(true);
        this.listAgency = [];
        Http.get(Configs.App.API, { "c": 144, "nn": Configs.Login.Nickname }, (err, res) => {
            App.instance.showLoading(false);
            if (err != null) return;
            if (res["success"] && res['topVp'] != null) {
                // this.lblTime.string = res['date'];
                this.listVinhDanh.active = true;
                this.tabRule.active = false;
                this.lblMessage.node.active = false;
                 cc.log(res);
                 this.lblVip.string = res['vp'];
                 if (this.items.length == 0) {
                    for (var i = 0; i < res['topVp'].length; i++) {
                        let item = cc.instantiate(this.itemTemplate);
                        item.parent = this.itemTemplate.parent;
                        this.items.push(item);
                    }
                    this.itemTemplate.destroy();
                    this.itemTemplate = null;
                }
                
                var hangUser = "";
                for(var i = 0; i < res['topVp'].length; i++) {
                    let item = this.items[i];
                    var data = res['topVp'][i];
                    if (hangUser === "") {
                        if (Configs.Login.Nickname.toLowerCase() === data['username'].toLowerCase()) {
                            hangUser = "" + (i + 1);
                        }
                    }
                    item.getChildByName('img').active = false;
                    item.getChildByName('imgSh').active = false;
                    item.getChildByName('lbStt').getComponent(cc.Label).string = "" + (i + 1);
                    item.getChildByName('lbName').getComponent(cc.Label).string = data['username'];
                    item.getChildByName('lbNickname').getComponent(cc.Label).string = Utils.formatNumber(data['vippoint']); //#E55EFF tím, #42E8FF, #FFBB0B
                    item.getChildByName('lbName').getComponent(cc.Label).font = this.fonts[0];
                    item.getChildByName('lbName').color = new cc.Color().fromHEX("#FFFFFF");
                    item.getChildByName('lbNickname').color = new cc.Color().fromHEX("#FFFFFF");
                    if (i + 1 == 1) {
                        item.getChildByName('img').active = true;
                        item.getChildByName('img').getComponent(cc.Sprite).spriteFrame = this.spriteCards[0];
                        item.getChildByName('imgSh').active = true;
                        item.getChildByName('imgSh').getComponent(cc.Sprite).spriteFrame = this.spriteCards[3];
                        item.getChildByName('lbNickname').getComponent(cc.Label).string = "******";
                        item.getChildByName('lbSdt').getComponent(cc.Label).string = Utils.formatNumber(Configs.Login.TopDayVipPointsMoneyEvent[0]);
                        item.getChildByName('lbName').getComponent(cc.Label).font = this.fonts[1];
                        item.getChildByName('lbName').color = new cc.Color().fromHEX("#E55EFF");
                        item.getChildByName('lbNickname').color = new cc.Color().fromHEX("#E55EFF");
                    } else if (i + 1 == 2) {
                        item.getChildByName('img').active = true;
                        item.getChildByName('img').getComponent(cc.Sprite).spriteFrame = this.spriteCards[1];
                        item.getChildByName('imgSh').active = true;
                        item.getChildByName('imgSh').getComponent(cc.Sprite).spriteFrame = this.spriteCards[4];
                        item.getChildByName('lbNickname').getComponent(cc.Label).string = "******";
                        item.getChildByName('lbSdt').getComponent(cc.Label).string = Utils.formatNumber(Configs.Login.TopDayVipPointsMoneyEvent[1]);
                        item.getChildByName('lbName').getComponent(cc.Label).font = this.fonts[1];
                        item.getChildByName('lbName').color = new cc.Color().fromHEX("#42E8FF");
                        item.getChildByName('lbNickname').color = new cc.Color().fromHEX("#42E8FF");
                    } else if (i + 1 == 3) {
                        item.getChildByName('img').active = true;
                        item.getChildByName('img').getComponent(cc.Sprite).spriteFrame = this.spriteCards[2];
                        item.getChildByName('imgSh').active = true;
                        item.getChildByName('imgSh').getComponent(cc.Sprite).spriteFrame = this.spriteCards[5];
                        item.getChildByName('lbNickname').getComponent(cc.Label).string = "******";
                        item.getChildByName('lbSdt').getComponent(cc.Label).string = Utils.formatNumber(Configs.Login.TopDayVipPointsMoneyEvent[2]);
                        item.getChildByName('lbName').getComponent(cc.Label).font = this.fonts[1];
                        item.getChildByName('lbName').color = new cc.Color().fromHEX("#FFBB0B");
                        item.getChildByName('lbNickname').color = new cc.Color().fromHEX("#FFBB0B");
                    } else if (i + 1 == 4) {
                        item.getChildByName('lbSdt').getComponent(cc.Label).string = Utils.formatNumber(Configs.Login.TopDayVipPointsMoneyEvent[3]);
                    } else {
                        item.getChildByName('lbSdt').getComponent(cc.Label).string = Utils.formatNumber(Configs.Login.TopDayVipPointsMoneyEvent[4]);
                    }
                    item.active = true;
                }

                if (hangUser !== "") {
                    this.lblLevel.string = hangUser;
                }
            } else {
                this.listVinhDanh.active = false;
                this.lblMessage.node.active = true;
                this.lblMessage.string = res["message"];
            }
            //this.scrAgency.setDataList(this.setDataItem, this.listAgency);
             cc.log("list Agency=", res['topVp']);
        });
    }

    setDataItem(item, data) {
        item.getChildByName('lbStt').getComponent(cc.Label).string = item['itemID'] + 1;
        item.getChildByName('lbName').getComponent(cc.Label).string = data['username'];
        item.getChildByName('lbNickname').getComponent(cc.Label).string = data['vippoint']; //#E55EFF tím, #42E8FF, #FFBB0B
        item.getChildByName('lbName').getComponent(cc.Label).font = this.fonts[0];
        item.getChildByName('lbName').getComponent(cc.Label).color = new cc.Color().fromHEX("#FFFFFF");
        item.getChildByName('lbNickname').getComponent(cc.Label).color = new cc.Color().fromHEX("#FFFFFF");
        if (item["itemID"] + 1 == 1) {
            item.getChildByName('lbNickname').getComponent(cc.Label).string = "******";
            item.getChildByName('lbSdt').getComponent(cc.Label).string = Utils.formatMoney(Configs.Login.TopDayVipPointsMoney[0]);
            //item.getChildByName('lbName').getComponent(cc.Label).font = this.fonts[1];
            item.getChildByName('lbName').getComponent(cc.Label).color = new cc.Color().fromHEX("#E55EFF");
            item.getChildByName('lbNickname').getComponent(cc.Label).color = new cc.Color().fromHEX("#E55EFF");
        } else if (item["itemID"] + 1 == 2) {
            item.getChildByName('lbNickname').getComponent(cc.Label).string = "******";
            item.getChildByName('lbSdt').getComponent(cc.Label).string = Utils.formatMoney(Configs.Login.TopDayVipPointsMoney[1]);
            //item.getChildByName('lbName').getComponent(cc.Label).font = this.fonts[1];
            item.getChildByName('lbName').getComponent(cc.Label).color = new cc.Color().fromHEX("#42E8FF");
            item.getChildByName('lbNickname').getComponent(cc.Label).color = new cc.Color().fromHEX("#42E8FF");
        } else if (item["itemID"] + 1 == 3) {
            item.getChildByName('lbNickname').getComponent(cc.Label).string = "******";
            item.getChildByName('lbSdt').getComponent(cc.Label).string = Utils.formatMoney(Configs.Login.TopDayVipPointsMoney[2]);
            //item.getChildByName('lbName').getComponent(cc.Label).font = this.fonts[1];
            item.getChildByName('lbName').getComponent(cc.Label).color = new cc.Color().fromHEX("#FFBB0B");
            item.getChildByName('lbNickname').getComponent(cc.Label).color = new cc.Color().fromHEX("#FFBB0B");
        } else if (item["itemID"] + 1 == 4) {
            item.getChildByName('lbSdt').getComponent(cc.Label).string = Utils.formatMoney(Configs.Login.TopDayVipPointsMoney[3]);
        } else if (item["itemID"] + 1 > 4 && item["itemID"] + 1 < 11) {
            item.getChildByName('lbSdt').getComponent(cc.Label).string = Utils.formatMoney(Configs.Login.TopDayVipPointsMoney[4]);
        } else if (item["itemID"] + 1 > 10 && item["itemID"] + 1 < 31) {
            item.getChildByName('lbSdt').getComponent(cc.Label).string = Utils.formatMoney(Configs.Login.TopDayVipPointsMoney[5]);
        } else {
            item.getChildByName('lbSdt').getComponent(cc.Label).string = Utils.formatMoney(Configs.Login.TopDayVipPointsMoney[6]);
        }
        item['data'] = data;
        item.active = true;
    }
   
}
