// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class ItemSlot extends cc.Component {

    @property(cc.Sprite)
    sprite: cc.Sprite = null;
    @property(sp.Skeleton)
    spine: sp.Skeleton = null;

    @property(cc.SpriteAtlas)
    sprAtlas: cc.SpriteAtlas = null;

    @property([sp.SkeletonData])
    listSpine: sp.SkeletonData[] = [];

    @property([cc.SpriteFrame])
    listSpr: cc.SpriteFrame[] = [];

    id = 0;
    animName = "";
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}
    setId(id) {
        this.sprite.spriteFrame = this.listSpr[id];
        this.spine.skeletonData = this.listSpine[id];
        // this.sprite.node.active = false;
        // this.spine.node.active = true;
        // this.spine.setAnimation(0, "animation", true);
    }
    setBlur() {
        this.sprite.spriteFrame = this.listSpr[this.id]
        this.spine.node.active = false;
        this.sprite.node.active = true;
    }

    // update (dt) {}
}
