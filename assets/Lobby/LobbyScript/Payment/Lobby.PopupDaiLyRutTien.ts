import Dialog from "../Script/common/Dialog";
import Configs from "../../../Loading/src/Configs";
import Http from "../../../Loading/src/Http";
import App from "../Script/common/App";
import ScrollViewControl from "../Script/common/ScrollViewControl";
import Utils from "../Script/common/Utils";
import BundleControl from "../../../Loading/src/BundleControl";
import cmd from "../Lobby.Cmd";
import InPacket from "../Script/networks/Network.InPacket";
import MiniGameNetworkClient from "../Script/networks/MiniGameNetworkClient";
import BroadcastReceiver from "../Script/common/BroadcastReceiver";

const { ccclass, property } = cc._decorator;
@ccclass
export default class PopupDaiLyRutTien extends Dialog {
    @property(ScrollViewControl)
    scrAgency: ScrollViewControl = null;
    @property(cc.Label)
    lbChipReceive: cc.Label = null;
    @property(cc.Label)
    lbFree: cc.Label = null;
    @property(cc.EditBox)
    edbMoney: cc.EditBox = null;
    @property(cc.EditBox)
    edbDetail: cc.EditBox = null;
    @property(cc.EditBox)
    edbOTP: cc.EditBox = null;
    @property(cc.Node)
    nodeMain: cc.Node = null;
    @property(cc.Node)
    nodeConfirm: cc.Node = null;
    

    @property(cc.ToggleContainer)
    toggleGroupOTP: cc.ToggleContainer = null;
    private groupOTPSelectedIdx = 0;

    @property(cc.Toggle)
    toogleOtpTele: cc.Toggle = null;
    @property(cc.Toggle)
    toogleOtpSms: cc.Toggle = null;
    @property(cc.EditBox)
    edbNickName: cc.EditBox = null;
    @property(cc.Node)
    nodeIsAgency: cc.Node = null;


    listAgency = [];
    currentDataDaily = null;
    currentDataUser = null;
    dataCashOut = null;
    receiverAgent: boolean= false;
    feeTransfer = 0;

    start(){
        for (let i = 0; i < this.toggleGroupOTP.toggleItems.length; i++) {
            this.toggleGroupOTP.toggleItems[i].node.on("toggle", () => {
                this.groupOTPSelectedIdx = i;
            });
        }

        MiniGameNetworkClient.getInstance().addListener((data) => {
            let inpacket = new InPacket(data);
            console.log(inpacket.getCmdId());
            switch (inpacket.getCmdId()) {
                case cmd.Code.CHECK_NICKNAME_TRANSFER: {
                    App.instance.showLoading(false);
                    let res = new cmd.ResCheckNicknameTransfer(data);
                    // console.log(res);
                    if (res.error == 0) {
                        this.edbNickName.string = "";
                        App.instance.alertDialog.showMsg("Tài khoản không tồn tại.");
                        break;
                    }
                    this.receiverAgent = res.type == 1 || res.type == 2;
                    this.nodeIsAgency.active = this.receiverAgent;
                    // if (this.receiverAgent) {
                      
                    // } else {
                    //     this.feeTransfer = 0.02;
                    // }
                    this.feeTransfer = res.fee;
                    this.edbChanged();
                    // this.tabTransfer.lblFee.string = res.fee + "%";
                    // this.tabTransfer.ratioTransfer = (100 - res.fee) / 100;
                    break;
                }
                case cmd.Code.TRANSFER_COIN: {
                    App.instance.showLoading(false);
                    let res = new cmd.ResTransferCoin(data);
                     console.log(res);
                    switch (res.error) {
                        case 0:
                            //this.tabTransfer.panelContent.active = true;
                         //   this.tabTransfer.panelContinue.active = true;
                            this.edbOTP.string = "";
                            Configs.Login.Coin = res.moneyUse;
                            BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);
                            App.instance.alertDialog.showMsg("Chuyển khoản thành công");
                            this.resetPopup();
                            break;
                        case 2:
                            App.instance.alertDialog.showMsg("Số tiền tối thiểu là 200.000.");
                            break;
                        case 3:
                            App.instance.alertDialog.showMsg("Chức năng chỉ dành cho những tài khoản đăng ký bảo mật SMS PLUS.");
                            break;
                        case 4:
                            App.instance.alertDialog.showMsg("Số dư không đủ.");
                            break;
                        case 5:
                            App.instance.alertDialog.showMsg("Tài khoản bị cấm chuyển tiền.");
                            break;
                        case 6:
                            App.instance.alertDialog.showMsg("Nickname nhận không tồn tại.");
                            break;
                        case 10:
                            App.instance.alertDialog.showMsg("Chức năng bảo mật sẽ tự động kích hoạt sau 24h kể từ thời điểm đăng ký thành công!");
                            break;
                        case 11:
                            App.instance.alertDialog.showMsg("Bạn chỉ được chuyển cho Đại lý tổng trong khoảng tiền quy định!");
                            break;
                        case 22:
                            App.instance.alertDialog.showMsg("Tài khoản chưa đủ điều kiện để chuyển tiền.");
                            break;
                        default:
                            App.instance.alertDialog.showMsg("Lỗi " + res.error + ". vui lòng thử lại sau.");
                            break;
                    }
                    break;
                }
                case cmd.Code.GET_OTP: {
                    if (!this.node.active) return;
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
                case cmd.Code.SEND_OTP: {
                    let res = new cmd.ResSendOTP(data);
                    // console.log(res);
                    if (res.error != 0) {
                        App.instance.showLoading(false);
                        switch (res.error) {
                            case 1:
                            case 2:
                                App.instance.alertDialog.showMsg("Giao dịch thất bại!");
                                break;
                            case 3:
                                App.instance.alertDialog.showMsg("Mã xác thực không chính xác, vui lòng thử lại!");
                                break;
                            case 4:
                                App.instance.alertDialog.showMsg("Mã OTP đã hết hạn!");
                                break;
                            default:
                                App.instance.alertDialog.showMsg("Lỗi " + res.error + ". Không xác định.");
                                break;
                        }
                        return;
                    }
                    App.instance.showLoading(true);
                    break;
                }
                case cmd.Code.RESULT_TRANSFER_COIN: {
                    if (!this.node.active) return;
                    App.instance.showLoading(false);
                    let res = new cmd.ResResultTransferCoin(data);
                    // console.log(res);
                    switch (res.error) {
                        case 0:
                            Configs.Login.Coin = res.currentMoney;
                            BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);
                            App.instance.alertDialog.showMsg("Giao dịch chuyển khoản thành công!");
                            break;
                        default:
                            App.instance.alertDialog.showMsg("Lỗi " + res.error + ". vui lòng thử lại sau.");
                            break;
                    }
                    this.resetPopup();
                    break;
                }     }
            }, this);

            this.edbNickName.node.on("editing-did-ended", () => {
                let nickname = this.edbNickName.string.trim();
                if (nickname != "") {
                   App.instance.showLoading(true);
                   MiniGameNetworkClient.getInstance().send(new cmd.ReqCheckNicknameTransfer(nickname));
                }
            });
    }

    resetPopup(){
        this.nodeMain.active = true;
        this.nodeConfirm.active = false;
        this.edbNickName.string = "";
        this.lbFree.string = "0";
        this.lbChipReceive.string = "0";
        this.edbMoney.string = "";
        this.edbOTP.string = "";
        this.edbDetail.string = "";
        this.edbDetail.placeholder = "Nội dung"
        this.groupOTPSelectedIdx = 0;
        this.toggleGroupOTP.toggleItems[this.groupOTPSelectedIdx].isChecked = true;
    }
    showPopup(dataDaiLy = null) { 
        this.resetPopup();  
        if(dataDaiLy != null){
            let dataAgency = dataDaiLy;
            this.currentDataDaily = dataAgency;
            this.nodeIsAgency.active = true;
            this.edbNickName.string = dataAgency['nickname'];
        }
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
                this.listAgency = res['data'];
            }
            this.scrAgency.setDataList(this.setDataItem, this.listAgency);
             cc.log("list Agency=", this.listAgency);
        });
    }

    setDataItem(item, data) {
        item.opacity = data['rank'] >= 1 ? 255 : 255;
        item.getChildByName('bg').active = item['itemID'] % 2 === 0 ? false : true;
        item.getChildByName('lbStt').getComponent(cc.Label).string = item['itemID'] + 1;
        item.getChildByName('lbName').getComponent(cc.Label).string = data['nameagent'];
        item.getChildByName('lbNickname').getComponent(cc.Label).string = data['nickname'];
        item['data'] = data;
        item.active = true;
    }

    onClickItemAgency(even) {
        if (even.target.parent['data'].rank < 1) {
            App.instance.showToast(App.instance.getTextLang('txt_agency_note1'));
        } else {
            let dataAgency = even.target.parent['data'];
            this.currentDataDaily = dataAgency;
            this.nodeIsAgency.active = true;
            this.edbNickName.string = dataAgency['nickname'];
        }
    }

    edbChanged() {
        var temp = Utils.ToInt(this.edbMoney.string.trim());
        temp = Math.abs(temp);
        this.edbMoney.string = Utils.ToVND(temp);

        if (cc.sys.isBrowser) {
            this.edbMoney.focus();
        }
        
        const free = temp * (this.feeTransfer / 100);
        const money = temp - free;

        this.lbFree.string = this.feeTransfer + "%";
        this.lbChipReceive.string = Utils.formatNumber(Math.floor(money));
    }

    edbDetailChanged() {
       
    }

    onClickConfirm() {
        let nickname = this.edbNickName.string.trim();
       // let reNickname = this.edbReNickname.string.trim();
        let coin = Utils.stringToInt(this.edbMoney.string);
        let note = this.edbDetail.string.trim();
        let otp = this.edbOTP.string.trim();
        if (nickname == "") {
            App.instance.alertDialog.showMsg("Nickname không được để trống.");
            return;
        }
        // if (nickname != reNickname) {
        //     App.instance.alertDialog.showMsg("Hai nickname không giống nhau.");
        //     return;
        // }
        if (note == "") {
            App.instance.alertDialog.showMsg("Lý do chuyển khoản không được để trống.");
            return;
        }
        if (coin < 10000) {
            App.instance.alertDialog.showMsg("Số tiền giao dịch tối thiểu bằng 10.000.");
            return;
        }
        if (coin > Configs.Login.Coin) {
            App.instance.alertDialog.showMsg("Số dư không đủ.");
            return;
        }
        if (otp == "") {
            App.instance.alertDialog.showMsg("OTP không được để trống.");
            return;
        }
        App.instance.confirmDialog.show2("Bạn có chắc chắn muốn chuyển cho\nTài khoản: \"" + nickname + "\"\nSố tiền: " + this.edbMoney.string + "\nLý do: " + note, (isConfirm) => {
            if (isConfirm) {
                App.instance.showLoading(true);
                MiniGameNetworkClient.getInstance().send(new cmd.ReqTransferCoin(nickname, coin, note, otp));
            }
        });
    }

    goToConfirmNode(){
        this.nodeConfirm.active = true;
        this.nodeMain.active = false;
        this.edbOTP.string = "";
    }

    goToMainNode(){
        this.nodeConfirm.active = false;
        this.nodeMain.active = true;
        this.edbOTP.string = "";
    }

    onClickGetOTP(){
        App.instance.showLoading(true, -1);
        MiniGameNetworkClient.getInstance().send(new cmd.ReqGetOTP(this.toogleOtpTele.isChecked ? 1 : 0));
    }

    onClickConfirmCashOut(event) {
        cc.warn("OTP",this.edbOTP.string)
        App.instance.showLoading(true);
        Http.get(Configs.App.API, {
            "c": 2010,
            "am": this.dataCashOut['amount'],
            "nn": Configs.Login.Nickname,
            "at": Configs.Login.AccessToken,
            "code": this.dataCashOut['agencyID'],
            "bn": this.dataCashOut['userbanknumber'],
        }, (err, res) => {
            App.instance.showLoading(false);
            cc.log(res);
            if (res['success']) {
                App.instance.ShowAlertDialog(App.instance.getTextLang('txt_request_cashin_success'));
            } else {
                App.instance.ShowAlertDialog(res['message']);
            }
            this.goToMainNode();
        });
    }
   
}
