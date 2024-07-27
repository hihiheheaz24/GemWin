import Dialog from "../Script/common/Dialog";
import cmd from "../Lobby.Cmd";
import InPacket from "../Script/networks/Network.InPacket";
import MiniGameNetworkClient2 from "../Script/networks/MiniGameNetworkClient";
import Dropdown from "../Script/common/Dropdown";
import Configs from "../../../Loading/src/Configs";
import App from "../Script/common/App";
import Utils from "../Script/common/Utils";
import SPUtils from "../Script/common/SPUtils";
import Http from "../../../Loading/src/Http";
import BroadcastReceiver from "../Script/common/BroadcastReceiver";
import Clipboards from "../Clipboards";
import UtilsNative from "../../../Loading/src/UtilsNative";
//import VersionConfig from "../Script/common/VersionConfig";
//import ShootFishNetworkClient from "../Script/networks/ShootFishNetworkClient";
const { ccclass, property } = cc._decorator;
@ccclass
export default class TabBanks extends Dialog {
    @property(cc.Node)
    itemFactorTemplate: cc.Node = null;

    @property(cc.Label)
    lblBankNumber: cc.Label = null;
    @property(cc.Label)
    lblBankAccountName: cc.Label = null;
    @property(cc.Label)
    lblBankName: cc.Label = null;

    @property(cc.Label)
    lblTransNote: cc.Label = null;
	@property(cc.Button)
    btnCopy: cc.Button = null;
	@property(cc.Button)
    btnCopyND: cc.Button = null;
    

    @property(Dropdown)
    dropdownBank: Dropdown = null;

    @property(cc.EditBox)
    edbAmount: cc.EditBox = null;
    private _listBank = [];

    start() {
        this.lblTransNote.string = Configs.Login.Nickname;
        App.instance.showLoading(true);
        Http.get(Configs.App.API, { "c": 130 }, (err, res) => {
            App.instance.showLoading(false);
            if (err == null) {
                if(res.list_bank === undefined || res.list_bank.length == 0){

                    return;
                }
              
                let listBank = res.list_bank;
                cc.log("check data bank ", listBank)
                this._listBank = listBank;
                let bankName = ["Chọn ngân hàng"];
                for(let i = 0; i < listBank.length; i ++){
                    bankName.push(listBank[i].bankName);
                }
                this.dropdownBank.setOptions(bankName);
                this.dropdownBank.setOnValueChange((idx) => {
                    if(idx > 0){
                       this.lblBankName.string = listBank[idx - 1].bankName;
                        this.lblBankAccountName.string = listBank[idx - 1].bankAccountName;
                        this.lblBankNumber.string = listBank[idx - 1].bankNumber;
                    }else {
                       this.lblBankName.string = "";
                        this.lblBankAccountName.string = "";
                        this.lblBankNumber.string = "";
                    }
                    
        
                })
            }
        });

        // MiniGameNetworkClient2.getInstance().addListener((data) => {
        //     let inpacket = new InPacket(data);
        //     console.log(inpacket.getCmdId());
        //     switch (inpacket.getCmdId()) {
        //         case cmd.Code.GET_LIST_BANK: {
        //             App.instance.showLoading(false);
        //             let res = new cmd.ResListBank(data);
        //             switch (res.error) {
        //                 case 0:
                           
        //                     break;
        //                 default:
        //                     App.instance.alertDialog.showMsg("Lỗi " + res.error + ". Không xác định.");
        //                     break;
        //             }
        //             break;
        //         }
            
        //     }
        // }, this);
		
		
		this.btnCopy.node.on("click", ()=> {
            if (this.lblBankNumber.string.length > 0) {
                Utils.copy(this.lblBankNumber.string);
				App.instance.alertDialog.showMsg("Đã sao chép số tài khoản.");
            } else {
                App.instance.alertDialog.showMsg("Chưa có số tài khoản.");  
            }
        });
		this.btnCopyND.node.on("click", ()=> {
            if (this.lblTransNote.string.length > 0) {
                    Utils.copy(this.lblTransNote.string);
					App.instance.alertDialog.showMsg("Đã sao chép nội dung.");
            } else {
                App.instance.alertDialog.showMsg("Chưa có nội dung.");  
            }
        });
        
    }

    // show() {
    //     super.show();
    //     MiniGameNetworkClient2.getInstance().send(new cmd.ReqListBank());
    // }

    submit() {
        let ddBank = this.dropdownBank.getValue();
        if (ddBank == 0) {
            App.instance.alertDialog.showMsg("Vui lòng chọn ngân hàng.");
            return;
        }
        let bankSelected = this._listBank[ddBank - 1].bankNumber;
        
        let amountSt = this.edbAmount.string.trim();
        let amount = Number(amountSt);
        if(isNaN(amount) || amount <= 0){
            App.instance.alertDialog.showMsg("Số tiền nạp không hợp lệ");
            return;
        }

        
        
        App.instance.showLoading(true);
        MiniGameNetworkClient2.getInstance().send(new cmd.ReqDepositBank(bankSelected, amount));
    }
	onBtnXacNhan() {
        if (this.node.active) {
		
        
		
            var money = Utils.formatEditBox(this.edbAmount.string);
			//let ddBank = this.dropdownBank.getValue();
			let ddBank = this.dropdownBank.getValue();
            let bankList = this.dropdownBank.getData();
		if (ddBank > 0) {
        
			var bank = bankList[ddBank];
        }
		// if (ddBank == 2) {
            
		// 	var bank = "VP Bank"
        // }
		// if (ddBank == 3) {
            
		// 	var bank = "TPBank"
        // }
		// if (ddBank == 4) {
            
		// 	var bank = "TechcomBank"
        // }
		// if (ddBank == 5) {
            
		// 	var bank = "BIDV"
        // }
		// if (ddBank == 6) {
            
		// 	var bank = "SacomBank"
        // }
            //var bankNumber = this.editBankNumber.string.trim();
            if (money == 0 || ddBank == 0) {
                App.instance.ShowAlertDialog(App.instance.getTextLang("txt_input_all"));
                return;
            }
            if (money < 1000) {
                App.instance.ShowAlertDialog(App.instance.getTextLang("txt_cash_in_min") + " 1000");
                return;
            }
            // if (money > 300000000) {
            //     App.instance.ShowAlertDialog(App.instance.getTextLang("txt_cash_in_max") + " 300.000.000");
            //     return;
            // }
            var self = this;
            App.instance.showLoading(true, -1);
            //Utils.Log("chuyen khoan:" + encodeURIComponent(this.editName.string.trim()));
            var request = {
                "c": 2003,
                "fn": encodeURIComponent(ddBank),
                "am": money,
                "pt": 1,
                "nn": Configs.Login.Nickname,
                "at": Configs.Login.AccessToken,
                "pn": "manualbank",
                "bc": bank,
                "ds": Configs.Login.Nickname,
                "bn": money
            };
            //this.lbTransMsg.string = request['ds'];
            Http.get(Configs.App.API, request, (err, res) => {
                App.instance.showLoading(false);
                cc.log(res);
                if (res.success == true) {
                    App.instance.ShowAlertDialog("Gửi thông tin nạp tiền thành công!");
                }
                else {
                    App.instance.ShowAlertDialog(res.message);
                }
            });
        }

    }
	onClickCopyBankNumber() {
        Utils.copy(this.lblBankNumber.string);
        App.instance.ShowAlertDialog("Đã sao chép số tài khoản!");
    }

    onClickCopyBankContent() {
        Utils.copy(this.lblTransNote.string);
        App.instance.ShowAlertDialog("Đã sao chép nội dung!");
    }

    

    
}

 