// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Configs from "../../Loading/src/Configs";
import App from "../../Lobby/LobbyScript/Script/common/App";
import Utils from "../../Lobby/LobbyScript/Script/common/Utils";
import cmd from "./XocDia.Cmd";
import XocDiaNetworkClient from "./XocDia.XocDiaNetworkClient";

const {ccclass, property} = cc._decorator;

@ccclass
export default class XocDiaRoom extends cc.Component {

    @property(cc.Label)
    lblBet: cc.Label = null;

    @property(cc.Label)
    lblMin: cc.Label = null;
    @property(cc.Label)
    lblPlayers: cc.Label = null;
    @property(cc.Sprite)
    sprPlayers: cc.Sprite = null;

    // LIFE-CYCLE CALLBACKS:
    private itemData = null;
    init(itemData){
       // cc.warn (itemData)
        if(itemData.id == 1){
            itemData["userCount"] = itemData["userCount"] + 400;
        } else  if(itemData.id == 2){
            itemData["userCount"] = itemData["userCount"] + 80;
        } else  if(itemData.id == 3){
            itemData["userCount"] = itemData["userCount"] + 80;
        } else  if(itemData.id == 4){
            itemData["userCount"] = itemData["userCount"] + 70;
        }
        this.itemData = itemData;
        this.lblBet.string = Utils.formatNumber(itemData["id"]);
        this.lblMin.string = Utils.formatNumber(itemData["requiredMoney"]);
       // this.lblPlayers.string = itemData["userCount"] + "/" + itemData["maxUserPerRoom"];
       this.lblPlayers.string = itemData["userCount"];
        this.sprPlayers.fillRange = itemData["userCount"] / itemData["maxUserPerRoom"];
    }

    onBtnClick(){
        if (Configs.Login.Coin >= this.itemData["requiredMoney"]) {
            App.instance.showLoading(true);
            XocDiaNetworkClient.getInstance().send(new cmd.SendJoinRoomById(this.itemData["id"]));
        } else {
            App.instance.showToast("Số dư của bạn không đủ! Vui lòng nạp thêm.")
        }
    }

    onCommingSoon() {
        App.instance.showToast("Phòng đã đủ người. Vui lòng chọn phòng Hoàng Kim Long.");
    }
}
