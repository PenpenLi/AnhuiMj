import HQMJ_SingleCardBase from "../../HQMJ_SingleCardBase";
import { HQMJMahjongDef, HQMJ } from "../../../ConstDef/HQMJMahjongDef";

const { ccclass, property } = cc._decorator;

@ccclass
export default class HQMJ_HunPi extends HQMJ_SingleCardBase {

    @property(cc.Sprite)
    bmp_cardback: cc.Sprite=null;

    @property(cc.Sprite)
    bmp_cardcolor: cc.Sprite=null;

    @property(cc.Sprite)
    bmp_greenZZ: cc.Sprite=null;

    onLoad() {
        // init logic
        
    }
    
    public init() {
        super.init();
    }
    /**
     * 显示牌
     * @param card 
     */
    public ShowCard(card:number):void{
        if(card==HQMJMahjongDef.gInvalidMahjongValue){
            return;
        }
        this.ShowGreenZZ=false;//隐藏绿色遮罩
        
        let url=`gameres/gameCommonRes/Texture/Mahjong/PaiBei3/pb3_showcard_oppo_1280`;
        this.bmp_cardback.spriteFrame=HQMJ.ins.iclass.getMahjongPaiBeiRes("pb3_showcard_oppo_1280");
        this.bmp_cardcolor.spriteFrame=HQMJ.ins.iclass.getMahjongPaiHuaRes(card);

        


        this.bmp_cardback.node.active=true;
        this.bmp_cardcolor.node.active=true;
        this.node.active=true;
    }
    /**
     * 显示牌(有绿色遮罩)
     * @param card 
     */
    public ShowCardHaveZZ(card:number):void{
        this.ShowCard(card);
        this.ShowGreenZZ=true;
    }

    /**
     * 是否显示绿色遮罩
     */
    public set ShowGreenZZ(isShow:boolean){
        this.bmp_greenZZ.node.active=isShow;
    }

    /**
     * 隐藏牌
     */
    public HideCard():void{
        this.node.active=false;
        this.bmp_cardback.node.active=false;
        this.bmp_cardcolor.node.active=false;
        this.bmp_greenZZ.node.active=false;
    }
}