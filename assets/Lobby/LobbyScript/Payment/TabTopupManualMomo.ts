import Configs from "../../../Loading/src/Configs";
import Http from "../../../Loading/src/Http";
import App from "../Script/common/App";
import Utils from "../Script/common/Utils";
import { Global } from "../../../Loading/src/Global";
import SPUtils from "../Script/common/SPUtils";
import MiniGameNetworkClient from "../../LobbyScript/Script/networks/MiniGameNetworkClient";
import cmd from "../../LobbyScript/Lobby.Cmd";
import InPacket from "../../LobbyScript/Script/networks/Network.InPacket";
import UtilsNative from "../../../Loading/src/UtilsNative";
const { ccclass, property } = cc._decorator;

@ccclass
export default class TapTopupManualMomo extends cc.Component {
    @property(cc.Sprite)
    btnChoseBank: cc.Sprite = null;
	@property(cc.Button)
    btnCopystk: cc.Button = null;
	@property(cc.Button)
    btnCopynoidung: cc.Button = null;

    @property(cc.EditBox)
    editName: cc.EditBox = null;

    @property(cc.EditBox)
    editMoney: cc.EditBox = null;

    @property(cc.EditBox)
    editBankNumber: cc.EditBox = null;

    @property(cc.Button)
    btnXacNhan: cc.Button = null;


    @property(cc.Node)
    nodeInput: cc.Node = null;

    @property(cc.Node)
    nodeQR: cc.Node = null;

    @property(cc.Node)
    nodeArrow: cc.Node = null;
    @property(cc.Label)
    lbTransMsg: cc.Label = null;
	@property(cc.Label)
    lbBankAccount: cc.Label = null;
	@property(cc.Label)
    lbBankNumber: cc.Label = null;
	@property(cc.Sprite)
    spriteBank: cc.Sprite = null;
//	@property(cc.Label)
//    lbBank: cc.Label = null;
    @property(cc.Label)
    nameUser: cc.Label = null;
    @property(cc.Label)
    phone: cc.Label = null;

    private providerName = null;
    private data = null;
    // onLoad () {}

    start() {
        var sefl = this;
        MiniGameNetworkClient.getInstance().addListener((data) => {
            let inpacket = new InPacket(data);
            console.log(inpacket.getCmdId());
            switch (inpacket.getCmdId()) {
                case cmd.Code.DEPOSIT_MOMO: {
                    App.instance.showLoading(false);
                    let res = new cmd.ResDepositMomoQR(data);
                    switch (res.error) {
                        case 0:
                            let data = JSON.parse(res.data);
                            sefl.nodeQR.active = true;
                            sefl.btnXacNhan.node.active = false;
                            sefl.nameUser.string = data["phoneName"];
                            sefl.phone.string = data["phoneNum"];
                            sefl.spriteBank.node.active = false;
                            cc.assetManager.loadRemote(data["qr_url"], {ext: ".png"}, function (err, texture) {
                                sefl.spriteBank.spriteFrame = new cc.SpriteFrame(texture);
                                sefl.spriteBank.node.active = true;
                               });
                            sefl.lbTransMsg.string = data["code"];
                            break;
                        default:
                            App.instance.alertDialog.showMsg("Lỗi " + res.error + ". Không xác định.");
                            break;
                    }
                    break;
                }
            
            }
        }, this);

    }
    show(data, providerName) {
        this.providerName = providerName;
        this.data = data;
        this.node.active = true;
        this.btnChoseBank.node.active = false;
        this.nodeQR.active = false;
        this.nodeInput.active = true;
        this.nodeArrow.active = false;
        this.editName.node.active = false;
        this.editMoney.node.active = false;
        this.editBankNumber.node.active = false;
        // this.editName.string = this.editMoney.string = this.editBankNumber.string = "";
        // this.editName.node.opacity = this.editBankNumber.node.opacity = this.editMoney.node.opacity = this.btnXacNhan.node.opacity = 255;
        // this.editName.enabled = true;
        // this.editMoney.enabled = true;
        // this.editBankNumber.enabled = true;
        // this.editBankNumber.placeholder = App.instance.getTextLang('txt_phone_number');
        this.btnXacNhan.node.active = true;
        this.btnXacNhan.interactable = true;
    }
    hide() {
        this.node.active = false;
    }
    onClickConfirm() {
        if (this.node.active) {
            var money = Utils.formatEditBox(this.editMoney.string);
            var bankNumber = this.editBankNumber.string.trim();
            if (this.editMoney.string == "" || bankNumber == "" || this.editName.string.trim() == "") {
                App.instance.ShowAlertDialog(App.instance.getTextLang("txt_input_all"));
                return;
            }
            if (money < 10000) {
                App.instance.ShowAlertDialog(App.instance.getTextLang("txt_cash_in_min") + " 10.000");
                return;
            }
            if (money > 300000000) {
                App.instance.ShowAlertDialog(App.instance.getTextLang("txt_cash_in_max") + " 300.000.000");
                return;
            }
            var self = this;
            App.instance.showLoading(true, -1);
            var request = {
                "c": 2003,
                "fn": encodeURIComponent(this.editName.string.trim()),
                "am": money,
                "pt": 4,
                "nn": Configs.Login.Nickname,
                "at": Configs.Login.AccessToken,
                "pn": this.providerName,
                "bc": "",
                "ds": this.generateTransMsg(),
                "bn": bankNumber
            };
            Http.get(Configs.App.API, { "c": 130 }, (err, res) => {
                let momoConfig = res.momoConfig;
                this._momoConfig = momoConfig;
                    //    this.lbBank.string = listBank[0].bankName;
                        this.lbBankNumber.string = momoConfig.accountNumber;
                        this.lbBankAccount.string = momoConfig.accountName;
						cc.loader.load(momoConfig.image_path, function (err, texture) {
                    var newSpriteFrame = new cc.SpriteFrame(texture);
                    self.spriteBank.spriteFrame = newSpriteFrame;
                });	
            });
			this.lbTransMsg.string =request['ds'];
            Http.get(Configs.App.API, request, (err, res) => {
                App.instance.showLoading(false);
                //  cc.log(res);
                if (res.success == true) {
                    this.nodeInput.active = false;
                    this.nodeQR.active = true;
                }
                else {
                    App.instance.ShowAlertDialog(res.message);
                }
            });
			this.btnCopystk.node.on("click", ()=> {
            if (this.lbBankNumber.string.length > 0) {
                
                    Utils.copy(this.lbBankNumber.string);
					App.instance.alertDialog.showMsg("Đã sao chép số tài khoản.");
                
            } else {
                App.instance.alertDialog.showMsg("Chưa có số tài khoản.");  
            }
        });
		this.btnCopynoidung.node.on("click", ()=> {
            if (this.lbTransMsg.string.length > 0) {
                Utils.copy(this.lbTransMsg.string);
					App.instance.alertDialog.showMsg("Đã sao chép nội dung.");
                
            } else {
                App.instance.alertDialog.showMsg("Chưa có nội dung.");  
            }
        });
        }
    }
    generateTransMsg() {
        return (Configs.Login.Nickname );
    }

    onClickGetQr() {
        App.instance.showLoading(true, -1);
        MiniGameNetworkClient.getInstance().send(new cmd.ReqDepositMomoQR());
    }

    onCopyNoiDung() {
        if (this.lbTransMsg.string.length > 0) {
            Utils.copy(this.lbTransMsg.string);
            App.instance.alertDialog.showMsg("Đã sao chép nội dung.");
            
        } else {
            App.instance.alertDialog.showMsg("Chưa có nội dung.");  
        }
    }

    onCopyPhone() {
        if (this.phone.string.length > 0) {
            Utils.copy(this.phone.string);
            App.instance.alertDialog.showMsg("Đã sao chép số điện thoại.");
            
        } else {
            App.instance.alertDialog.showMsg("Chưa có số điện thoại.");  
        }
    }
	
    // update (dt) {}
}
