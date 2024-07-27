
import Configs from "../../Loading/src/Configs";
import Http from "../../Loading/src/Http";
import App from "../../Lobby/LobbyScript/Script/common/App";
import Dialog from "../../Lobby/LobbyScript/Script/common/Dialog";
import Utils from "../../Lobby/LobbyScript/Script/common/Utils";

var TW = cc.tween
const { ccclass, property } = cc._decorator;

@ccclass
export default class Slot8GloryAthur extends Dialog {
    @property(cc.Label)
    lblPage: cc.Label = null;
    @property(cc.Node)
    itemTemplate: cc.Node = null;

    private page: number = 1;
    private maxPage: number = 1;
    private items = new Array<cc.Node>();

    show() {
        var _this = this;
        this.node.setSiblingIndex(this.node.parent.childrenCount);
        if (!this.bg) this.bg = this.node.getChildByName("Bg");
        if (!this.container) this.container = this.node.getChildByName("Container");
        this.node.active = true;
        this.isAnimated = false;

        this.bg.stopAllActions();
        this.bg.opacity = 0;
        this.bg.runAction(cc.fadeTo(0.2, 170));
        this.bg.setContentSize(cc.winSize);

        cc.Tween.stopAllByTarget(this.container);
        TW(this.container)
            .set({ opacity: 0, scale: this.startScale })
            .to(0.3, { opacity: 255, scale: 1.0 }, { easing: cc.easing.backOut })
            .call(() => {
                this._onShowed();
            })
            .start();
        this.node.zIndex = cc.macro.MAX_ZINDEX - 10;

        for (let i = 0; i < this.items.length; i++) {
            this.items[i].active = false;
        }
        if (this.itemTemplate != null) this.itemTemplate.active = false;
    }

    dismiss() {
        super.dismiss();
        for (let i = 0; i < this.items.length; i++) {
            this.items[i].active = false;
        }
    }

    _onShowed() {
        super._onShowed();

        this.page = 1;
        this.maxPage = 1;
        this.lblPage.string = this.page + "/" + this.maxPage;
        this.loadData();
    }

    actNextPage() {
        if (this.page < this.maxPage) {
            this.page++;
            this.lblPage.string = this.page + "/" + this.maxPage;
            this.loadData();
        }
    }

    actPrevPage() {
        if (this.page > 1) {
            this.page--;
            this.lblPage.string = this.page + "/" + this.maxPage;
            this.loadData();
        }
    }

    private loadData() {
        App.instance.showLoading(true);
        Http.get(Configs.App.API, { "c": 138, "p": this.page, "gn": "ATHUR" }, (err, res) => {
            App.instance.showLoading(false);
            if (err != null) return;
            if (!res["success"]) return;

            if (this.items.length == 0) {
                for (var i = 0; i < 8; i++) {
                    let item = cc.instantiate(this.itemTemplate);
                    item.parent = this.itemTemplate.parent;
                    this.items.push(item);
                }
                this.itemTemplate.destroy();
                this.itemTemplate = null;
            }

            this.maxPage = res["totalPages"];
            this.lblPage.string = this.page + "/" + this.maxPage;
            for (let i = 0; i < this.items.length; i++) {
                let item = this.items[i];
                if (i < res["results"].length) {
                    let itemData = res["results"][i];
                    item.getChildByName("bg").opacity = i % 2 == 0 ? 128 : 0;
                    item.getChildByName("Time").getComponent(cc.Label).string = itemData["ts"].replace(" ", "\n");
                    item.getChildByName("Bet").getComponent(cc.Label).string = Utils.formatNumber(itemData["bv"]);
                    item.getChildByName("Type").getComponent(cc.Label).string = itemData["rs"] == 3 ? "Nổ hũ" : "Thắng lớn";
                    item.getChildByName("Nickname").getComponent(cc.Label).string = itemData["un"];
                    item.getChildByName("Prize").getComponent(cc.Label).string = Utils.formatNumber(itemData["pz"]);
                    item.active = true;
                } else {
                    item.active = false;
                }
            }
        });
    }
}