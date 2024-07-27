import Utils from "../../Lobby/LobbyScript/Script/common/Utils";
import cmd from "./Loto.Cmd";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {

    }

    initItem(data) {
        // <color=#ffcc00>-:</c><color=#ffffff>-</c>
        cc.log("check data item : ", data)
        this.node.getComponent(cc.RichText).string =
            "<color=#FCC100>" + data.nickname + "</c>" + " Đặt cược " + " <color=#FCC100>" + Utils.formatNumber(data.bet)
            + " Đ </c>"
            +  " <color=#39FFEC>" + cmd.Code.LOTO_GAME_MODE_NAME[data.mode]
            + " (" + data.nums + ")" + " </c>";
    }

    // update (dt) {}
}
