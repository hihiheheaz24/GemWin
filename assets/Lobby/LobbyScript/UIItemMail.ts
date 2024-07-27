import Configs from "../../Loading/src/Configs";
import Http from "../../Loading/src/Http";
import App from "./Script/common/App";
import BroadcastReceiver from "./Script/common/BroadcastReceiver";



const {ccclass, property} = cc._decorator;

@ccclass
export default class UIItemDiemDanh extends cc.Component {

    @property(cc.Label)
    txtContent: cc.Label = null;
    
    private data = null;
    private uiPopupMail = null;
    init(uiPopupMail,data){
        this.uiPopupMail = uiPopupMail;
        this.data = data;
        this.txtContent.string = data.title;
        cc.log("chheck status : ", data.status)
        if(data.status === 0){
            this.node.opacity = 255
        }
        else{
            this.node.opacity = 100;
        }
    }

    onBtnRead(){
        this.uiPopupMail.readMail(this.data);
        cc.log("chheck status red: ", this.data.status)
        if(this.data.status == 0){
            //new
            this.data.status = 1;
            this.node.opacity = 100;
            // Http.get(Configs.App.API, { c: "404", mid: this.data.mail_id }, (err, res) => {
            //     App.instance.showLoading(false);
            //     if (err != null) return;
            //     BroadcastReceiver.send(BroadcastReceiver.ON_UPDATE_MAIL);
                
            // });
        }
    }
}
