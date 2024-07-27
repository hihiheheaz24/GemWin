const { ccclass, property } = cc._decorator;
@ccclass
export default class Slot8ItemSlot extends cc.Component {

    @property(cc.Sprite)
    spriteIcon: cc.Sprite = null;

    @property(sp.Skeleton)
    spineIcon: sp.Skeleton = null;

    @property(cc.Node)
    nodeBox: cc.Node = null;
    @property(cc.SpriteAtlas)
    itemAtlast: cc.SpriteAtlas = null;
    
    @property(sp.SkeletonData)
    skeFreeSpin : sp.SkeletonData = null;

    @property(sp.SkeletonData)
    skeBonus : sp.SkeletonData = null;

    @property(sp.SkeletonData)
    skeJackpot : sp.SkeletonData = null;


    public gamePlayManager = null;
    public itemId = null;
    public index = null;
    onLoad() {
        this.nodeBox = this.node.getChildByName("Box");
    }
    init(itemId, index, gamePlayManager) {
        if(itemId === 0)
        cc.log("chay vao day set item : ", itemId)
        var self = this;
        self.gamePlayManager = gamePlayManager;
        self.itemId = itemId;
        self.index = index;
        this.setSpriteFrame(itemId);
    }



    changeSpriteBlurByItemId(itemId) {
        var self = this;
        this.itemId = itemId;
        this.spriteIcon.sizeMode = cc.Sprite.SizeMode.TRIMMED;
        this.setSpriteFrame(itemId, true);
    }

    changeSpriteRealByItemId(itemId) {
        this.itemId = itemId;
        this.spriteIcon.sizeMode = cc.Sprite.SizeMode.TRIMMED;
        this.setSpriteFrame(itemId);
    }

    changeSpineIcon(itemId) {
        var self = this;
        self.itemId = itemId;
        //  cc.log("itemid=" + itemId);
        itemId = parseInt(itemId);
        this.setSpriteFrame(itemId);
    }
    setSpriteFrame(itemId, isBlur = false) {
        let atlast = this.itemAtlast;
        switch (itemId) {
            case 0:
                this.spriteIcon.node.active = false;
                this.spriteIcon.spriteFrame = null;
                this.spineIcon.node.active = true;
                this.spineIcon.skeletonData = this.skeJackpot;
                this.spineIcon.setAnimation(0, "animation", true);
                break;
            case 1:
                this.spineIcon.skeletonData = this.skeBonus;
                this.spriteIcon.node.active = false;
                this.spriteIcon.spriteFrame = null;
                this.spineIcon.node.active = true;
                this.spineIcon.setAnimation(0, "animation", true);
                break;
            case 2:
                this.spineIcon.skeletonData = this.skeFreeSpin;
                this.spriteIcon.node.active = false;
                this.spriteIcon.spriteFrame = null;
                this.spineIcon.node.active = true;
                this.spineIcon.setAnimation(0, "animation", true);
                break;
            case 3:
            case 4:
            case 5:
            case 6:
                this.spineIcon.skeletonData = null;
                this.spriteIcon.node.active = true;
                this.spineIcon.node.active = false;
                this.spriteIcon.spriteFrame = atlast.getSpriteFrame("item_" + (itemId - 2));
                break;
        }
    }
    checkShowSpriteOrSpine() {
        cc.Tween.stopAllByTarget(this.spriteIcon.node);
        cc.Tween.stopAllByTarget(this.spineIcon.node);

        if (this.itemId > 2) {
            this.spineIcon.node.active = false;
            this.spriteIcon.node.active = true;
            this.spriteIcon.node.color = cc.Color.WHITE;
            cc.tween(this.spriteIcon.node)
                .repeatForever(
                    cc.tween().sequence(
                        cc.tween().to(0.25, { scale: 1.1 }, { easing: cc.easing.sineOut }),
                        cc.tween().to(0.25, { scale: 1.0 }, { easing: cc.easing.sineOut })))
                .start();
            cc.tween(this.spriteIcon.node)
                .delay(0.9)
                .call(() => {
                    this.spriteIcon.node.color = cc.Color.GRAY;
                    cc.Tween.stopAllByTarget(this.spriteIcon.node);
                    this.spriteIcon.node.scale = 1.0
                }).start();
        } else {
            cc.log("chay vao day la mat", this.itemId)
            this.spineIcon.node.active = true;
            this.spriteIcon.node.active = false;
            this.spineIcon.setAnimation(0, "animation", true);
            this.spineIcon.node.color = cc.Color.WHITE;

            // cc.tween(this.spineIcon.node)
            //     .delay(0.9).call(() => {
            //         this.spineIcon.node.color = cc.Color.GRAY;
            //         this.spriteIcon.node.active = true;
            //         this.spineIcon.node.active = false;
            //     }).start();
        }
    }
}