import Utils from "../../Lobby/LobbyScript/Script/common/Utils";


const { ccclass, property } = cc._decorator;

@ccclass
export default class BtnPayBet extends cc.Component {

    @property(cc.Label)
    lblTotalBet: cc.Label = null;
    @property(cc.Label)
    lblMyBet: cc.Label = null;
    @property(cc.Node)
    active: cc.Node = null;
    private totalBet = 0;

    public reset() {
        this.lblTotalBet.string = "";
        this.lblMyBet.string = "";
        this.totalBet = 0;
        this.active.active = false;
    }

    public setTotalBet(coin: number) {
        this.lblTotalBet.string = coin > 0 ? Utils.formatMoney(coin) : "";
    }

    public setMyBet(coin: number) {
        this.totalBet = this.totalBet + coin;
        this.lblMyBet.string = this.totalBet > 0 ? Utils.formatMoney(this.totalBet, true) : "";
    }
}
