import App from "./../Script/common/App";
import Configs from "../../../Loading/src/Configs";
import { Global } from "../../../Loading/src/Global";
const {ccclass, property} = cc._decorator;

@ccclass
export default class TabProfileSecurity extends cc.Component {

    @property(cc.Label)
    lbNickName: cc.Label = null;
    @property(cc.Label)
    lbPhone: cc.Label = null;
    @property(cc.Node)
    buttonAddPhone: cc.Node = null;

    show(){
        this.node.active = true;
        this.lbNickName.string = Configs.Login.Nickname;
        this.lbPhone.string = Configs.Login.PhoneNumner;
        if (Configs.Login.PhoneNumner === App.instance.getTextLang("txt_not_config")) {
            this.lbPhone.node.active = false;
            this.buttonAddPhone.active = true;
        } else {
            this.lbPhone.node.active = true;
            this.buttonAddPhone.active = false;
        }
      
    }

    updateInfo() {
        this.lbNickName.string = Configs.Login.Nickname;
        this.lbPhone.string = Configs.Login.PhoneNumner;
        if (Configs.Login.PhoneNumner === App.instance.getTextLang("txt_not_config")) {
            this.lbPhone.node.active = false;
            this.buttonAddPhone.active = true;
        } else {
            this.lbPhone.node.active = true;
            this.buttonAddPhone.active = false;
        }
    }

    onClickAddUpdatePhone() {
        Global.LobbyController.popupSecurity2.showTab(1);
    }
}
