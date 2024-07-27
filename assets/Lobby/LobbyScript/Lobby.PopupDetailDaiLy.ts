import Dialog from "./Script/common/Dialog";
import Configs from "../../Loading/src/Configs";
import Http from "../../Loading/src/Http";
import { Global } from "../../Loading/src/Global";
import App from "./Script/common/App";
import ScrollViewControl from "./Script/common/ScrollViewControl";
const { ccclass, property } = cc._decorator;
@ccclass
export default class PopupDetailDaiLy extends Dialog {
   
    listAgency = [];
    @property(ScrollViewControl)
    scrAgency: ScrollViewControl = null;

    show() {
        super.show();
        this.loadData();
    }
    loadData() {
        App.instance.showLoading(true);
        this.listAgency = [];
        Http.get(Configs.App.API, { "c": 2034, "nn": Configs.Login.Nickname }, (err, res) => {
            App.instance.showLoading(false);
            if (err != null) return;
            if (res["success"] && res['data'] != null) {
                 cc.log(res);
                 for(var i = 0; i < res['data'].length; i++) {
                    var item = res['data'][i];
                    if (item['active'] === 1) {
                        this.listAgency.push(item);
                    }
                 }
            }
            this.scrAgency.setDataList(this.setDataItem, this.listAgency);
             cc.log("list Agency=", this.listAgency);
        });
    }

    setDataItem(item, data) {
        item.opacity = data['rank'] >= 1 ? 255 : 255;
        item.getComponent(cc.Sprite).enabled = item['itemID'] % 2 ? true : false;
        item.getChildByName('lbStt').getComponent(cc.Label).string = item['itemID'] + 1;
        item.getChildByName('lbName').getComponent(cc.Label).string = data['nameagent'];
        item.getChildByName('lbNickname').getComponent(cc.Label).string = data['nickname'];
        // item.getChildByName('lbRegion').getComponent(cc.Label).string = data['address'];
        item.getChildByName('lbSdt').getComponent(cc.Label).string = data['phone'];
        item['data'] = data;
        item.active = true;
    }

    onClickFacebook(event) {
        let dataDaiLy = event.target.parent['data'];
        cc.sys.openURL(dataDaiLy['facebook']);
    }

    onClickZalo(event) {
        let dataDaiLy = event.target.parent['data'];
        cc.sys.openURL(dataDaiLy['zalo']);
    }

    onClickTele(event) {
        let dataDaiLy = event.target.parent['data'];
        cc.sys.openURL(dataDaiLy['telegram']);
    }

    onClickChuyenKhoan(event) {
        let dataDaiLy = event.target.parent['data'];
        Global.LobbyController.actAddCoin(null, dataDaiLy);
        this.dismiss();
    }

   
}
