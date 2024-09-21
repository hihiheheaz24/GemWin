
import Lobby from "./XocDia.Lobby";
import Play from "./XocDia.Play";
import XocDiaNetworkClient from "./XocDia.XocDiaNetworkClient";
import Utils from "../../Lobby/LobbyScript/Script/common/Utils";
import Tween from "../../Lobby/LobbyScript/Script/common/Tween";

import Configs from "../../Loading/src/Configs";
import App from "../../Lobby/LobbyScript/Script/common/App";
import InPacket from "../../Lobby/LobbyScript/Script/networks/Network.InPacket";
import cmdNetwork from "../../Lobby/LobbyScript/Script/networks/Network.Cmd";
import SPUtils from "../../Lobby/LobbyScript/Script/common/SPUtils";
import AudioManager from "../../Lobby/LobbyScript/Script/common/Common.AudioManager";
import cmd from "../../Lobby/LobbyScript/Lobby.Cmd";
import MiniGameNetworkClient from "../../Lobby/LobbyScript/Script/networks/MiniGameNetworkClient";

enum audio_clip {
    BG = 0,
    LOSE = 1,
    WIN = 2,
    START_GAME = 3,
    XOC_DIA = 4,
    CHIP = 5
}
const { ccclass, property } = cc._decorator;
@ccclass("XocDia.SoundManager")
export class SoundManager {
    @property(cc.AudioSource)
    bgMusic: cc.AudioSource = null;

    @property(cc.AudioSource)
    effSound: cc.AudioSource = null;

    @property([cc.AudioClip])
    listAudio: cc.AudioClip[] = [];
    playBgMusic() {
        if (SPUtils.getMusicVolumn() > 0) {
            this.bgMusic.clip = this.listAudio[audio_clip.BG];
            this.bgMusic.play();
        }
    }
    playAudioEffect(indexAudio) {
        if (SPUtils.getSoundVolumn() > 0) {
            cc.audioEngine.play(this.listAudio[indexAudio], false, 1);
        }
    }
    stopBgMusic() {
        this.bgMusic.stop();
    }
}
@ccclass
export default class XocDiaController extends cc.Component {

    public static instance: XocDiaController = null;

    @property(cc.Node)
    noteLobby: cc.Node = null;
    @property(cc.Node)
    nodePlay: cc.Node = null;
    @property(SoundManager)
    soundManager: SoundManager = null;
	@property(cc.Label)
	lblTopHu: cc.Label = null;
    @property(cc.RichText)
    txtNotifyMarqueeWeb: cc.RichText = null;
	
	fakeJPInv = null;
    public lobby: Lobby = null;
    public play: Play = null;
	public hu = 500000000;
    private static notifyMarqueeWeb = [];
    dataAlertMini: any = {}

    listTips = [
        {
          note: "Tài khoản gian lận, lạm dụng khuyến mãi sẽ bị kiểm tra,\n thẩm định qua nhiều bộ phận và tiến hành khoá khi có\n bằng chứng cụ thể."
        },
        {
           note: "Cổng game quốc tế GemWin nói không với bot và người\n chơi ảo."
        }
    ];

    getStrTips() {
        let strTip = this.listTips[this.randomRangeInt(0, this.listTips.length)];
        return strTip["note"];
    }

    randomRangeInt(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    showAlertMiniGameWeb() {
        let txtFormat = "<color=#C8A878>%s</c> " + "<color=#FF7A00> %s </c>" + App.instance.getTextLang('txt_win') + "<color=#c9b200> %s</c>        ";
        for (let i = 0; i < this.dataAlertMini["entries"].length; i++) {
            let e = this.dataAlertMini["entries"][i];
            XocDiaController.notifyMarqueeWeb.push(cc.js.formatStr(txtFormat, Configs.GameId.getGameName(e["g"]), e["n"], Utils.formatNumber(e["m"])));

        }
      
        this.scheduleOnce(() => {
            cc.Tween.stopAllByTarget(this.txtNotifyMarqueeWeb.node);
            cc.tween(this.txtNotifyMarqueeWeb.node)
            .repeatForever(
                cc.tween()
                    .to(0.3, { opacity: 0 })
                    .delay(0.5)
                    .call(()=>{
                        if(XocDiaController.notifyMarqueeWeb.length > 0){
                            const item = XocDiaController.notifyMarqueeWeb.shift();
                            this.txtNotifyMarqueeWeb.string = item;
                        } else {
                            cc.Tween.stopAllByTarget(this.txtNotifyMarqueeWeb.node);
                        }
                    })
                    .to(0.2, { opacity: 255 })
                    .delay(3)
            )
            .start()
        }, 0.5);
    }

    onLoad() {
        XocDiaController.instance = this;
        this.lobby = this.noteLobby.getComponent(Lobby);
		this.initFakeJP(); 
		setInterval(this.fakeJPInv = () => {
			if (!Configs.Login.IsLogin) {
				this.initFakeJP();
			} else {
				clearInterval(this.fakeJPInv);
			}
		}, 5000);
		
    }

    start() {
        this.lobby.init();
        // this.play.init();

        this.lobby.node.active = true;
        // this.play.node.active = false;

        App.instance.showErrLoading("Đang kết nối tới server...");
        XocDiaNetworkClient.getInstance().addOnOpen(() => {
            App.instance.showErrLoading("Đang đăng nhập...");
            XocDiaNetworkClient.getInstance().send(new cmdNetwork.SendLogin(Configs.Login.Nickname, Configs.Login.AccessToken));
        }, this);
        XocDiaNetworkClient.getInstance().addOnClose(() => {
            //  cc.log("-----------XocDia close:"+XocDiaNetworkClient.getInstance().isConnected());
            XocDiaNetworkClient.getInstance().close();
            MiniGameNetworkClient.getInstance().close();
            App.instance.loadScene("Lobby");
        }, this);
        XocDiaNetworkClient.getInstance().addListener((data) => {
            let inpacket = new InPacket(data);
            switch (inpacket.getCmdId()) {
                case cmdNetwork.Code.LOGIN:
                    App.instance.showLoading(false);
                    this.lobby.actRefesh();
					//this.lobby.actQuickPlay();
                    break;
            }
        }, this);
        //  cc.log("-----------XocDia start:"+XocDiaNetworkClient.getInstance().isConnected());
        if(XocDiaNetworkClient.getInstance().isConnected() == false){
            XocDiaNetworkClient.getInstance().connect();
        }
        AudioManager.getInstance().playBackgroundMusic(this.soundManager.listAudio[audio_clip.BG]);
        this.txtNotifyMarqueeWeb.string = this.getStrTips();
		MiniGameNetworkClient.getInstance().addListener((data) => {

            let inPacket = new InPacket(data);
            switch (inPacket.getCmdId()) {
                case cmd.Code.NOTIFY_MARQUEE: {
                    let res = new cmd.ResNotifyMarquee(data);
                    let resJson = JSON.parse(res.message);
                    this.dataAlertMini = resJson;
                    this.showAlertMiniGameWeb();
                    break;
                }
            }		
        }, this);
	
    }
	initFakeJP() {		
		this.hu = this.getJackpot();
		if (this.lblTopHu) Tween.numberTo(this.lblTopHu, this.hu, 0.3);	
	}
    public showLobby() {
        this.lobby.show();
        this.play.node.active = false;
    }
    public showGamePlay(res) {
        if (this.play == null) {
            App.instance.showLoading(true);
            cc.assetManager.loadBundle("XocDia", (err, bundleGame) => {
                bundleGame.load("res/prefabs/Play", cc.Prefab, (finish, total) => {
                    App.instance.showErrLoading(App.instance.getTextLang('txt_loading1'));
                }, (err, prefab: cc.Prefab) => {
                    this.play = cc.instantiate(prefab).getComponent(Play);
                    this.play.node.parent = this.node;
                    this.play.init(this.hu);
                    this.play.show(res);
                    App.instance.showLoading(false);
                    //  cc.log("init game player succecss!");
                    this.lobby.node.active = false;
                });
            })
        } else {
            this.lobby.node.active = false;
            this.play.show(res);
        }
    }
    public playAudioEffect(index) {
        this.soundManager.playAudioEffect(index);
    }

    public updateJackpot(jack) {
        this.lobby.updateJack(jack);
    }

    public getJackpot() {
        return this.lobby.getJack();
    }
}
