const { ccclass, property } = cc._decorator;

@ccclass
export default class ButtonPayBet extends cc.Component {
    @property(cc.Button)
    button: cc.Button = null;
    @property(cc.Label)
    lblTotal: cc.Label = null;
    @property(cc.Label)
    lblBeted: cc.Label = null;
    @property(sp.Skeleton)
    overlay: sp.Skeleton = null;
    @property(cc.Sprite)
    lblFactor: cc.Sprite = null;

    @property([cc.SpriteFrame])
    listSprFactor: cc.SpriteFrame[] = [];

}