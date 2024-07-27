const { ccclass, property } = cc._decorator;
@ccclass
export default class Slot8ItemSlotAthur extends cc.Component {

    @property(cc.Sprite)
    spriteIcon: cc.Sprite = null;

    @property(sp.Skeleton)
    spineIcon: sp.Skeleton = null;

    @property(cc.Node)
    nodeBox: cc.Node = null;
    @property(cc.SpriteAtlas)
    itemAtlast: cc.SpriteAtlas = null;
    @property(cc.SpriteAtlas)
    itemBlur: cc.SpriteAtlas = null;
    @property(cc.SpriteFrame)
    item4: cc.SpriteFrame = null;

    public gamePlayManager = null;
    public itemId = null;
    public index = null;
    public animName = null;
    onLoad() {
        this.spriteIcon = cc.find("Box/Sprite", this.node).getComponent(cc.Sprite);
        this.spineIcon = cc.find("Box/Spine", this.node).getComponent(sp.Skeleton);
        this.nodeBox = this.node.getChildByName("Box");
        this.node.setContentSize(cc.size(168, 168));

    }
    init(itemId, index, gamePlayManager) {
        var self = this;
        self.gamePlayManager = gamePlayManager;
        self.itemId = itemId;
        self.index = index;
        self.spriteIcon.node.active = true;
        this.spineIcon.node.scale = 0.8;
        this.spineIcon.node.y = 5;
        this.spriteIcon.node.setContentSize(cc.size(this.spriteIcon.node.width / 0.5, this.spriteIcon.node.height / 0.5));
        self.spineIcon.node.active = false;
        this.setSpriteFrame(itemId);
    }



    changeSpriteBlurByItemId(itemId) {
        var self = this;
        this.itemId = itemId;
        this.spineIcon.node.active = false;
        this.spriteIcon.node.active = true;
        this.spriteIcon.sizeMode = cc.Sprite.SizeMode.TRIMMED;
        this.setSpriteFrame(itemId, true);
        this.spriteIcon.node.setContentSize(cc.size(this.spriteIcon.node.width / 1.2, this.spriteIcon.node.height / 1.2));
    }

    changeSpriteRealByItemId(itemId) {
        this.itemId = itemId;
        this.spriteIcon.sizeMode = cc.Sprite.SizeMode.TRIMMED;
        this.setSpriteFrame(itemId);
        this.spriteIcon.node.setContentSize(cc.size(this.spriteIcon.node.width / 1.2, this.spriteIcon.node.height / 1.2));
    }

    changeSpineIcon(itemId) {
        var self = this;
        self.itemId = itemId;
        //  cc.log("itemid=" + itemId);
        this.spriteIcon.node.y = 0;
        this.spriteIcon.sizeMode = cc.Sprite.SizeMode.TRIMMED;
        itemId = parseInt(itemId);
        switch (itemId) {
            case 0:
                this.animName = "jackport"
                this.spriteIcon.node.y = 10;
                break;
            case 1:
                this.animName = "bonus"
                break;
            case 2:
                this.animName = "freespin";
                break;

        }
        this.setSpriteFrame(itemId);
        this.spriteIcon.node.setContentSize(cc.size(this.spriteIcon.node.width / 1.2, this.spriteIcon.node.height / 1.2));
        // this.spineIcon.setAnimation(0, animName, true);
    }
    setSpriteFrame(itemId, isBlur = false) {
        let atlast = isBlur ? this.itemBlur : this.itemAtlast;
        switch (itemId) {
            case 0:
                this.spriteIcon.spriteFrame = atlast.getSpriteFrame("jackpot");
                break;
            case 1:
                this.spriteIcon.spriteFrame = atlast.getSpriteFrame("bonus");
                break;
            case 2:
                this.spriteIcon.spriteFrame = atlast.getSpriteFrame("freespin");
                break;
            case 3:
                this.spriteIcon.spriteFrame = this.item4;
                break;
            case 4:
            case 5:
            case 6:
                this.spriteIcon.spriteFrame = atlast.getSpriteFrame("item_" + (itemId - 2));
                break;
        }
    }
    checkShowSpriteOrSpine() {
        cc.Tween.stopAllByTarget(this.spriteIcon.node);
        cc.Tween.stopAllByTarget(this.spineIcon.node);
        // if (this.itemId > 2) {
            this.spineIcon.node.active = false;
            this.spriteIcon.node.active = true;
            this.spriteIcon.node.color = cc.Color.WHITE;
            cc.tween(this.spriteIcon.node)
                .repeatForever(
                    cc.tween().sequence(
                        cc.tween().to(0.25, { scale: 1 }, { easing: cc.easing.sineOut }),
                        cc.tween().to(0.25, { scale: 0.85 }, { easing: cc.easing.sineOut })))
                .start();
            cc.tween(this.spriteIcon.node)
                .delay(0.9)
                .call(() => {
                    this.spriteIcon.node.color = cc.Color.GRAY;
                    cc.Tween.stopAllByTarget(this.spriteIcon.node);
                    this.spriteIcon.node.scale = 0.85;
                }).start();
        // } else {
        //     this.spineIcon.node.active = true;
        //     this.spriteIcon.node.active = false;
        //     this.spineIcon.setAnimation(0, this.animName, true);
        //     this.spineIcon.node.color = cc.Color.WHITE;

        //     cc.tween(this.spineIcon.node)
        //         .delay(0.9).call(() => {
        //             this.spineIcon.node.color = cc.Color.GRAY;
        //             this.spriteIcon.node.active = true;
        //             this.spineIcon.node.active = false;
        //         }).start();
        // }
    }
}