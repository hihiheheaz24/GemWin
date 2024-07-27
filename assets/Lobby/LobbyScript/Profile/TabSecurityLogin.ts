import App from "../Script/common/App";
import Utils from "../Script/common/Utils";
import MiniGameNetworkClient from "../../LobbyScript/Script/networks/MiniGameNetworkClient";
import cmd from "../../LobbyScript/Lobby.Cmd";
import InPacket from "../../LobbyScript/Script/networks/Network.InPacket";

const {ccclass, property} = cc._decorator;

const OTPType = {
    TELE_SAFE : "App OTP",
    SMS: "SMS"
}

@ccclass
export default class TabSecurityLogin extends cc.Component {

    @property(cc.Label)
    lbOTPTypeNoPhone: cc.Label = null;
    @property(cc.EditBox)
    editBoxPhoneNumber: cc.EditBox = null;
    @property(cc.EditBox)
    editBoxOTP: cc.EditBox = null;
    @property(cc.Animation)
    animationMenuOTPNoPhone: cc.Animation = null;
    private otpType = OTPType.TELE_SAFE; //default


    start() {
        MiniGameNetworkClient.getInstance().addListener((data) => {
            let inpacket = new InPacket(data);
            console.log(inpacket.getCmdId());
            switch (inpacket.getCmdId()) {
                case cmd.Code.ACTIVE_PHONE: {
                    App.instance.showLoading(false);
                    let res = new cmd.ResActivePhone(data);
                    switch (res.error) {
                        case 0:
                            App.instance.alertDialog.showMsg("Đã gửi OTP thành công.");
                            break;
                        case 3:
                            App.instance.alertDialog.showMsg("User không tồn tại.");
                            break;
                        case 31:
                            App.instance.alertDialog.showMsg("Không gửi được sms. Vui lòng liên hệ support.");
                            break;
                        case 32:
                            App.instance.alertDialog.showMsg("Không đủ tiền.");
                        break;
                        case 33:
                            App.instance.alertDialog.showMsg("Bạn không được gửi SMS liên tiếp.");
                            break;
                        default:
                            App.instance.alertDialog.showMsg("Lỗi " + res.error + ". Không xác định.");
                            break;
                    }
                    break;
                }
                case cmd.Code.VALIDATE_OTP_PHONE: {
                    App.instance.showLoading(false);
                    let res = new cmd.ResValidateOtp(data);
                    switch (res.error) {
                        case 0:
                            App.instance.alertDialog.showMsg("Cập nhật số điện thoại thành công.");
                            break;
                        default:
                            App.instance.alertDialog.showMsg("OTP sai hoặc hết hạn.");
                            break;
                    }
                    break;
                }
            
            }
        }, this);
    }

    resetData(){
        this.otpType = OTPType.TELE_SAFE;
        this.lbOTPTypeNoPhone.string = OTPType.TELE_SAFE;
        this.editBoxOTP.string = '';
        this.editBoxPhoneNumber.string = '';
    }
    show(){
        this.node.active = true;
        this.resetData();
    }

    openMenuOTPNoPhoneClicked () {
        this.animationMenuOTPNoPhone.play('showDropdownMenu');
    }

    updatePhoneNumberClicked () {
        let otp = this.editBoxOTP.string;
        let phoneNumber = this.editBoxPhoneNumber.string;
        if (phoneNumber === '') {
            App.instance.alertDialog.showMsg("Vui lòng nhập số điện thoại.");
            return;
        }

        if (otp === '') {
            App.instance.alertDialog.showMsg("Vui lòng nhập mã OTP.");
            return;
        }
        App.instance.showLoading(true, -1);
        MiniGameNetworkClient.getInstance().send(new cmd.ReqValidateOtp(phoneNumber, otp));
    }

    getOTPClicked () {
        let phoneNumber = this.editBoxPhoneNumber.string;
        if (phoneNumber === '') {
            App.instance.alertDialog.showMsg("Vui lòng nhập số điện thoại.");
            return;
        }
        App.instance.showLoading(true, -1);
        MiniGameNetworkClient.getInstance().send(new cmd.ReqActivePhone(phoneNumber));
    }

    selectOTPEvent (event, data) {
        this.otpType = data.toString() === 'App OTP' ? OTPType.TELE_SAFE : OTPType.SMS;
        this.lbOTPTypeNoPhone.string = data.toString();
        this.animationMenuOTPNoPhone.play('hideDropdownMenu');
    }



}
