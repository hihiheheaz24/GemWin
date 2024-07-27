import Configs from "../../../Loading/src/Configs";
import Http from "../../../Loading/src/Http";
import App from "../Script/common/App";
import Utils from "../Script/common/Utils";
import MiniGameNetworkClient from "../../LobbyScript/Script/networks/MiniGameNetworkClient";
import cmd from "../../LobbyScript/Lobby.Cmd";
import InPacket from "../../LobbyScript/Script/networks/Network.InPacket";
import BroadcastReceiver from "../Script/common/BroadcastReceiver";

const {ccclass, property} = cc._decorator;
const OTPType = {
    TELE_SAFE : "App OTP",
    SMS: "SMS"
}

@ccclass
export default class TabSecurityBox extends cc.Component {

    @property(cc.Label)
    availableBalance: cc.Label = null;
    @property(cc.Label)
    freezeBalance: cc.Label = null;
    @property(cc.EditBox)
    editBoxFreezeValue: cc.EditBox = null;
    @property(cc.EditBox)
    editBoxOpenValue: cc.EditBox = null;
    @property(cc.EditBox)
    editBoxOTP: cc.EditBox = null;
    @property(cc.Button)
    btnGetOTPs: Array<cc.Button> = new Array<cc.Button>();
    @property(cc.Label)
    lbBtnGetOTPs: cc.Label = null;
    @property(cc.Node)
    nodeTeleSafes: Array<cc.Node> = new Array<cc.Node>();
    @property(cc.Animation)
    animationMenuOTP: cc.Animation = null;
    @property(cc.Label)
    lbOTPType: cc.Label = null;
    private otpType = OTPType.TELE_SAFE; //default

    hide(){
        this.node.active = false;
    }
    show(){
        this.node.active = true;
        var sefl = this;
        sefl.availableBalance.string = Utils.formatNumber(Configs.Login.Coin);
        sefl.freezeBalance.string = Utils.formatNumber(Configs.Login.SAFE);

        MiniGameNetworkClient.getInstance().addListener((data) => {
            let inpacket = new InPacket(data);
            console.log(inpacket.getCmdId());
            switch (inpacket.getCmdId()) {
                case cmd.Code.GET_OTP: {
                    App.instance.showLoading(false);
                    let res = new cmd.ResValidateOtp(data);
                    switch (res.error) {
                        case 0:
                            App.instance.alertDialog.showMsg("Đã gửi OTP thành công.");
                            break;
                        default:
                            App.instance.alertDialog.showMsg("Có lỗi khi gửi OTP.");
                            break;
                    }
                    break;
                }
                 case cmd.Code.SAFES: {
                        App.instance.showLoading(false);
                        let res = new cmd.ResSafes(data);
                        switch (res.error) {
                            case 0:
                                App.instance.alertDialog.showMsg(res.type === 1 ? "Đóng băng nổ thành công." : "Mở băng nổ thành công.");
                                Configs.Login.SAFE = res.safe;
                                Configs.Login.Coin = res.moneyUse;
                                sefl.availableBalance.string = Utils.formatNumber(Configs.Login.Coin);
                                sefl.freezeBalance.string = Utils.formatNumber(Configs.Login.SAFE);
                                sefl.editBoxFreezeValue.string = "";
                                sefl.editBoxOpenValue.string = "";
                                BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);
                                break;
                            default:
                                App.instance.alertDialog.showMsg("Có lỗi khi gửi đóng băng nổ.");
                                break;
                        }
                        break;
                    }
            }
        }, this);
    }

    openMenuOTPClicked () {
        this.animationMenuOTP.play('showDropdownMenu');
    }

    hideMenuOTPClicked () {
        this.animationMenuOTP.play('hideDropdownMenu');
    }

    getOTPClicked () {
        App.instance.showLoading(true, -1);
        MiniGameNetworkClient.getInstance().send(new cmd.ReqGetOTP(this.otpType === OTPType.TELE_SAFE ? 1 : 0));
    }

    freezeClicked () {
        let amount = this.editBoxFreezeValue.string
        if (amount === '') {
            App.instance.alertDialog.showMsg("Vui lòng nhập số nổ.");
            return;
        }
        let coin = Utils.stringToInt(amount);
        App.instance.showLoading(true);
        MiniGameNetworkClient.getInstance().send(new cmd.ReqSafes(coin, 1, ""));
    }
    
    openClicked () {
        let amount = this.editBoxOpenValue.string;
        let otp = this.editBoxOTP.string;

        if (amount === '') {
            App.instance.alertDialog.showMsg("Vui lòng nhập số nổ.");
            return;
        }

        if (otp === '') {
            App.instance.alertDialog.showMsg("Vui lòng nhập mã OTP.");
            return;
        }
        let coin = Utils.stringToInt(amount);

        App.instance.showLoading(true);
        MiniGameNetworkClient.getInstance().send(new cmd.ReqSafes(coin, 0, otp));
    }

    selectOTPEvent (event, data) {
        this.otpType = data.toString() === 'App OTP' ? OTPType.TELE_SAFE : OTPType.SMS;
        this.lbOTPType.string = data.toString();
        this.animationMenuOTP.play('hideDropdownMenu');
    }

    edbFreezeChanged() {
        var temp = Utils.ToInt(this.editBoxFreezeValue.string.trim());
        temp = Math.abs(temp);
        this.editBoxFreezeValue.string = Utils.ToVND(temp);

        if (cc.sys.isBrowser) {
            this.editBoxFreezeValue.focus();
        }
        
        // const free = temp * 0.02;
        // const money = temp * 0.8;

        // this.lbFree.string = Utils.formatNumber(Math.floor(free));
        // this.lbChipReceive.string = Utils.formatNumber(Math.floor(money));
    }

    edbOpenFreezeChanged() {
        var temp = Utils.ToInt(this.editBoxOpenValue.string.trim());
        temp = Math.abs(temp);
        this.editBoxOpenValue.string = Utils.ToVND(temp);

        if (cc.sys.isBrowser) {
            this.editBoxOpenValue.focus();
        }
        
        // const free = temp * 0.02;
        // const money = temp * 0.8;

        // this.lbFree.string = Utils.formatNumber(Math.floor(free));
        // this.lbChipReceive.string = Utils.formatNumber(Math.floor(money));
    }
}
