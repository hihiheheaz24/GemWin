

import { Global } from "../../Loading/src/Global";
import TabsListGame from "./Lobby.TabsListGame";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TabMenuGame extends cc.Component {


    @property([cc.Node])
    listTab: cc.Node[] = [];


    @property([cc.Node])
    listAllGame: cc.Node[] = [];
    @property([cc.Node])
    listLiveGame: cc.Node[] = [];
    @property([cc.Node])
    listSlotGame: cc.Node[] = [];
    @property([cc.Node])
    listCardGame: cc.Node[] = [];
    @property([cc.Node])
    listMiniGame: cc.Node[] = [];
    @property([cc.Node])
    listGameSport: cc.Node[] = [];

    onBtnTabAll() {
        this.listAllGame.forEach(e => {
            if (e) e.active = true;
        });
    }

    onBtnTabSport() {
        this.listAllGame.forEach(e => {
            if (e) e.active = false;
        });
        this.listGameSport.forEach(e => e.active = true);
    }

    onBtnTabLive() {
        this.listAllGame.forEach(e => {
            if (e) e.active = false;
        });
        cc.log("check list game live ", this.listLiveGame)
        this.listLiveGame.forEach(e => {
            if (e) e.active = true;
        });
    }
    onBtnTabSlot() {
        this.listAllGame.forEach(e => {
            if (e) e.active = false;
        });
        this.listSlotGame.forEach(e => {
            if (e) e.active = true;
        });
        // Global.LobbyController.showOrHideSelectTabGame(false);
    }
    onBtnTabMini() {
        this.listAllGame.forEach(e => {
            if (e) e.active = false;
        });
        this.listMiniGame.forEach(e => {
            if (e) e.active = true;
        });
        // Global.LobbyController.showOrHideSelectTabGame(false);
    }
    onBtnTabCard() {
        this.listAllGame.forEach(e => {
            if (e) e.active = false;
        });
        this.listCardGame.forEach(e => {
            if (e) e.active = true;
        });
        // Global.LobbyController.showOrHideSelectTabGame(false);
    }
    onBtnTabFish() {
        // this.listAllGame.forEach(e => {
        //     if (e) e.active = false;
        // });
        Global.LobbyController.actGoToShootFish();
        // Global.LobbyController.showOrHideSelectTabGame(false);
    }
}
