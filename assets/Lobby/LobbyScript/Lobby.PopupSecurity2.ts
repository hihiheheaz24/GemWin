import App from "./Script/common/App";
import MiniGameNetworkClient from "../LobbyScript/Script/networks/MiniGameNetworkClient";
import cmd from "../LobbyScript/Lobby.Cmd";
import Dialog from "./Script/common/Dialog";
import TabSecurityLogin from "./Profile/TabSecurityLogin";
import TabSecurityBox from "./Profile/TabSecurityBox";
import TabProfileSecurity from "./Profile/TabProfileSecurity";
import InPacket from "../LobbyScript/Script/networks/Network.InPacket";
import Configs from "../../Loading/src/Configs";

const { ccclass, property } = cc._decorator;
@ccclass
export default class PopupSecurity2 extends Dialog {
    @property(cc.ToggleContainer)
    tabs: cc.ToggleContainer = null;
    @property(cc.Node)
    tabContents: cc.Node = null;
    private tabSelectedIdx = 0;
    @property(TabSecurityLogin)
    tabSecurityLogin: TabSecurityLogin = null;
    @property(cc.Node)
    tabSecurityBox: cc.Node = null;
    start() {
        for (let i = 0; i < this.tabs.toggleItems.length; i++) {
            this.tabs.toggleItems[i].node.on("toggle", () => {
                if (this.tabSelectedIdx != i) {
                    this.tabSelectedIdx = i;
                    this.onTabChanged();
                }
            });
        } 
    }
    show() {
        super.show();
        this.tabSelectedIdx = 1;
        this.tabs.toggleItems[this.tabSelectedIdx].isChecked = true;
        this.onTabChanged();
        App.instance.showLoading(true);
        MiniGameNetworkClient.getInstance().send(new cmd.ReqGetSecurityInfo());
    }

    private onTabChanged() {
        for (let i = 0; i < this.tabContents.childrenCount; i++) {
            this.tabContents.children[i].active = i == this.tabSelectedIdx;
        }
        switch (this.tabSelectedIdx) {
            case 0:
                this.tabSecurityBox.active = true;
                break;
            case 1:     
                this.tabSecurityLogin.show();
                break;
        }
    }

    showTab(tab) {
        this.tabSelectedIdx = tab;
        this.tabs.toggleItems[this.tabSelectedIdx].isChecked = true;
        for (let i = 0; i < this.tabContents.childrenCount; i++) {
            this.tabContents.children[i].active = i == this.tabSelectedIdx;
        }
        switch (this.tabSelectedIdx) {
            case 0:
                this.tabSecurityBox.active = true;
                break;
            case 1:       
                this.tabSecurityLogin.show();
                break;
        }
    }

     
    onClickGanKetOtp() {
        App.instance.openTelegram(Configs.App.getLinkTelegram());
    }


}
