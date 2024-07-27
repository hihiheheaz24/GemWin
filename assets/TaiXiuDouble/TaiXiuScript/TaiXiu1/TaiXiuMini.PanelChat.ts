import cmd from "./TaiXiuMini.Cmd";
import TaiXiuMiniController from "./TaiXiuMini.TaiXiuMiniController";
import Configs from "../../../Loading/src/Configs";
import MiniGameNetworkClient from "../../../Lobby/LobbyScript/Script/networks/MiniGameNetworkClient";

const { ccclass, property } = cc._decorator;

namespace taixiumini {
    @ccclass
    export class PanelChat extends cc.Component {

        @property(cc.Node)
        itemChatTemplate: cc.Node = null;
        @property(cc.ScrollView)
        scrMessage: cc.ScrollView = null;
        @property(cc.EditBox)
        edbMessage: cc.EditBox = null;

        start() {
            this.itemChatTemplate.active = false;
            this.edbMessage.node.on("editing-return", ()=>{
                this.sendChat();
            });
            // this.edbMessage.node.on("editing-did-ended", ()=>{
            //     this.sendChat();
            // });
        }

        show(isShow: boolean) {
            this.node.active = isShow;
            if (isShow) {
                // for (var i = 0; i < this.scrMessage.content.childrenCount; i++) {
                //     let node = this.scrMessage.content.children[i];
                //     node.active = false;
                // }
                MiniGameNetworkClient.getInstance().send(new cmd.SendScribeChat());
            } else {
                MiniGameNetworkClient.getInstance().send(new cmd.SendUnScribeChat());
            }
        }

        addMessage(nickname: string, message: string, level: string) {
            let item: cc.Node = null;
            for (var i = 0; i < this.scrMessage.content.childrenCount; i++) {
                let node = this.scrMessage.content.children[i];
                if (!node.active) {
                    item = node;
                    break;
                }
            }
            if (item == null) {
                if (this.scrMessage.content.childrenCount >= 50) {
                    item = this.scrMessage.content.children[0];
                } else {
                    item = cc.instantiate(this.itemChatTemplate);
                }
            }
            var zIndex = 0;
            for (var i = 0; i < this.scrMessage.content.childrenCount; i++) {
                let node = this.scrMessage.content.children[i];
                if (node != item) {
                    node.zIndex = zIndex++;
                }
            }
            item.parent = this.scrMessage.content;
            let lblNickname: cc.RichText = item.getChildByName("lblNickname").getComponent(cc.RichText);
            var nickString = `<color=#FCD933>${nickname}</color><color=#FCD933>:</color>`;
            var messageText = `<color=#FCD933>${nickname}</color><color=#FCD933>:</color> ${message}`;
            if (level !== "1") {
                if (nickname == Configs.Login.Nickname) {
                    nickString = `<color=#3bff49>${nickname}</color><color=#FD3D0D><b> {${Configs.Login.getVipChat()}}</b></color><color=#3bff49>:</color>`;
                    messageText = `<color=#3bff49>${nickname}</color><color=#FD3D0D><b> {${Configs.Login.getVipChat()}}</b></color><color=#3bff49>:</color> ${message}`;
                } else {
                    nickString = `<color=#FCD933>${nickname}</color><color=#FD3D0D><b> {V${level}}</b></color><color=#FCD933>:</color>`;
                    messageText = `<color=#FCD933>${nickname}</color><color=#FD3D0D><b> {V${level}}</b></color><color=#FCD933>:</color> ${message}`;
                }
            }
            lblNickname.string = nickString;
            item.getComponent(cc.RichText).string = messageText;
            item.active = true;
            item.zIndex = zIndex++;
            this.scrollToBottom();
        }

        sendChat() {
            let msg = this.edbMessage.string.trim();
            if (msg.length == 0) {
                return;
            }
            this.edbMessage.string = "";
            TaiXiuMiniController.instance.sendChat(msg);
        }

        scrollToBottom() {
            this.scrMessage.scrollToBottom(0.2);
        }
    }
}
export default taixiumini.PanelChat;
