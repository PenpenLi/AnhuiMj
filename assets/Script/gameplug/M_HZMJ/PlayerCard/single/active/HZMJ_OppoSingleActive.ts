import HZMJ_SingleActiveBase from "../HZMJ_SingleActiveBase";
import { HZMJMahjongDef, HZMJ } from "../../../ConstDef/HZMJMahjongDef";
import { SetTextureRes, SetTextureResAry } from "../../../../MJCommon/MJ_Function";

const { ccclass, property } = cc._decorator;

@ccclass
export default class HZMJ_OppoSingleActive extends HZMJ_SingleActiveBase {
    @property(cc.Sprite)
    bmp_liecardback: cc.Sprite=null;

    onLoad() {
        // init logic
        
    }

    public init(){
        super.init();
        this.node.active=false;
    }

    /**
     * 显示牌
     * */
    public showCard(card: number,isLie: boolean,index:number): void {
        if(card==this._cardValue&&isLie==this._isLie)
        {
            if(!isLie)
                return;
        }
        super.showCard(card,isLie,index);
        this.bmp_cardcolor.node.active = false;
        this.bmp_cardback.node.active = false;
        this.bmp_liecardback.node.active=false;
        let url="";
        let url1="";
        if(HZMJ.ins.iclass.is2D()){
            this.bmp_liecardback.node.width=39;
            this.bmp_liecardback.node.height=56;
            this.bmp_liecardback.node.scaleX=1;
            this.bmp_cardback.node.width=39;
            this.bmp_cardback.node.height=56;

            this.bmp_cardcolor.node.x=0;
            this.bmp_cardcolor.node.y=5;
            this.bmp_cardcolor.node.scaleX=0.45;
            this.bmp_cardcolor.node.scaleY=0.45;
            this.bmp_cardcolor.node.skewX=0;

            if(isLie) {
                if(HZMJMahjongDef.gBackMahjongValue != card){
                    // url=`gameres/gameCommonRes/Texture/Mahjong/PaiBei3/pb3_showcard_oppo_1280`;
                    // SetTextureRes(url,this.bmp_cardback);
                    // url=HZMJ.ins.iclass.getMahjongResName(card);
                    // SetTextureRes(url,this.bmp_cardcolor);
                    
                    url=`gameres/gameCommonRes/Texture/Mahjong/PaiBei3/pb3_showcard_oppo_1280`;
                    //url1=HZMJ.ins.iclass.getMahjongResName(card);
                    this.bmp_liecardback.spriteFrame=HZMJ.ins.iclass.getMahjongPaiBeiRes("pb3_showcard_oppo_1280");
                    this.bmp_cardcolor.spriteFrame=HZMJ.ins.iclass.getMahjongPaiHuaRes(card);
                    //SetTextureResAry([url,url1],[this.bmp_liecardback,this.bmp_cardcolor]);

                    // this.bmp_cardcolor.node.x = 0;
                    // this.bmp_cardcolor.node.y = 5;
                    // this.bmp_cardcolor.node.scaleX = 0.45;
                    // this.bmp_cardcolor.node.scaleY = 0.45;
                }else{
                    url=`gameres/gameCommonRes/Texture/Mahjong/PaiBei3/pb3_showcardback_oppo_self_1280`;
                    this.bmp_liecardback.spriteFrame=HZMJ.ins.iclass.getMahjongPaiBeiRes("pb3_showcardback_oppo_self_1280");
                    //SetTextureRes(url,this.bmp_liecardback);
                } 

                this.bmp_liecardback.node.active=true;
                this.bmp_cardcolor.node.active = HZMJMahjongDef.gBackMahjongValue != card;

            } else {
                url=`gameres/gameCommonRes/Texture/Mahjong/PaiBei3/pb3_active_oppo_1280`;
                this.bmp_cardback.spriteFrame=HZMJ.ins.iclass.getMahjongPaiBeiRes("pb3_active_oppo_1280");
                //SetTextureRes(url,this.bmp_cardback);
                this.bmp_cardback.node.active=true;

                //this.bmp_cardcolor.node.active = false;
            }
        }else{

            this.bmp_liecardback.node.width=45;
            this.bmp_liecardback.node.height=64;
            this.bmp_liecardback.node.scaleX=1;
            this.bmp_cardback.node.width=46;
            this.bmp_cardback.node.height=54;
            
            this.bmp_cardcolor.node.x=0;
            this.bmp_cardcolor.node.y=5;
            this.bmp_cardcolor.node.scaleX=0.31;
            this.bmp_cardcolor.node.scaleY=0.23;
            this.bmp_cardcolor.node.skewX=0.2;

            if(isLie) {
                if(HZMJMahjongDef.gBackMahjongValue != card){
                    // // url=`gameres/gameCommonRes/Texture/Mahjong/PaiBei3/pb3_showcard_oppo_1280`;
                    // // SetTextureRes(url,this.bmp_cardback);
                    // // url=HZMJ.ins.iclass.getMahjongResName(card);
                    // // SetTextureRes(url,this.bmp_cardcolor);
                    
                    // url=`gameres/gameCommonRes/Texture/Mahjong/PaiBei3/pb3_showcard_oppo_1280`;
                    // //url1=HZMJ.ins.iclass.getMahjongResName(card);
                    // this.bmp_liecardback.spriteFrame=HZMJ.ins.iclass.getMahjongPaiBeiRes("pb3_showcard_oppo_1280");
                    // this.bmp_cardcolor.spriteFrame=HZMJ.ins.iclass.getMahjongPaiHuaRes(card);
                    // //SetTextureResAry([url,url1],[this.bmp_liecardback,this.bmp_cardcolor]);

                    // // this.bmp_cardcolor.node.x = 0;
                    // // this.bmp_cardcolor.node.y = 5;
                    // // this.bmp_cardcolor.node.scaleX = 0.45;
                    // // this.bmp_cardcolor.node.scaleY = 0.45;
                    this.showDaoPai();
                }else{
                    // url=`gameres/gameCommonRes/Texture/Mahjong/PaiBei3/pb3_showcardback_oppo_self_1280`;
                    // this.bmp_liecardback.spriteFrame=HZMJ.ins.iclass.getMahjongPaiBeiRes("pb3_showcardback_oppo_self_1280");
                    // //SetTextureRes(url,this.bmp_liecardback);
                    this.showDaoPai();
                } 

                this.bmp_liecardback.node.active=true;
                this.bmp_cardcolor.node.active = HZMJMahjongDef.gBackMahjongValue != card;

            } else {
                //url=`gameres/gameCommonRes/Texture/Mahjong/PaiBei3/pb3_active_oppo_1280`;
                this.showShuPai();
                //this.bmp_cardback.spriteFrame=HZMJ.ins.iclass.getMahjong3DPaiBeiRes("hand_oppo_3_1");
                //SetTextureRes(url,this.bmp_cardback);
                this.bmp_cardback.node.active=true;

                //this.bmp_cardcolor.node.active = false;
            }
        }
        
        this.node.active=true;
    }
    
    public down(): void {
        if(this._isUp) {
            this.node.y -= 10;
            this._isUp = false;
        }
    }

    /**
     * 起立
     * */
    public up(): void {
        if(!this._isUp) {
            this.node.y += 10;
            this._isUp = true;
        }
    }
    private showDaoPai():void{
        cc.log(this._cardIndex + "..oppo.."+this._cardValue);
        switch(this._cardIndex){
            case 1:{
                this.node.x=212;
                this.node.y=296;
                this.bmp_liecardback.spriteFrame=HZMJ.ins.iclass.getMahjong3DPaiBeiRes("hand_oppo_1_15");
                this.bmp_cardcolor.spriteFrame=HZMJ.ins.iclass.getMahjongPaiHuaRes(this._cardValue);
                this.bmp_cardcolor.node.scaleX=0.30;
                this.bmp_cardcolor.node.scaleY=0.22;
                this.bmp_cardcolor.node.skewX=0.2;
                this.bmp_cardcolor.node.x=0.7;
                this.bmp_cardcolor.node.y=9.4;
                break;
            }
            case 2:{
                this.node.x=177;
                this.node.y=297;
                this.bmp_liecardback.spriteFrame=HZMJ.ins.iclass.getMahjong3DPaiBeiRes("hand_oppo_1_14");
                this.bmp_cardcolor.spriteFrame=HZMJ.ins.iclass.getMahjongPaiHuaRes(this._cardValue);
                this.bmp_cardcolor.node.scaleX=0.30;
                this.bmp_cardcolor.node.scaleY=0.22;
                this.bmp_cardcolor.node.skewX=1;
                this.bmp_cardcolor.node.x=0;
                this.bmp_cardcolor.node.y=9.4;
                break;
            }
            case 3:{
                this.node.x=140;
                this.node.y=297;
                this.bmp_liecardback.spriteFrame=HZMJ.ins.iclass.getMahjong3DPaiBeiRes("hand_oppo_1_13");
                this.bmp_cardcolor.spriteFrame=HZMJ.ins.iclass.getMahjongPaiHuaRes(this._cardValue);
                this.bmp_cardcolor.node.scaleX=0.30;
                this.bmp_cardcolor.node.scaleY=0.22;
                this.bmp_cardcolor.node.skewX=1.5;
                this.bmp_cardcolor.node.x=0;
                this.bmp_cardcolor.node.y=9.4;
                break;
            }
            case 4:{
                this.node.x=104;
                this.node.y=297;
                this.bmp_liecardback.spriteFrame=HZMJ.ins.iclass.getMahjong3DPaiBeiRes("hand_oppo_1_12");
                this.bmp_cardcolor.spriteFrame=HZMJ.ins.iclass.getMahjongPaiHuaRes(this._cardValue);
                this.bmp_cardcolor.node.scaleX=0.30;
                this.bmp_cardcolor.node.scaleY=0.22;
                this.bmp_cardcolor.node.skewX=2;
                this.bmp_cardcolor.node.x=0.3;
                this.bmp_cardcolor.node.y=9.4;
                break;
            }
            case 5:{
                this.node.x=67;
                this.node.y=297;
                this.bmp_liecardback.spriteFrame=HZMJ.ins.iclass.getMahjong3DPaiBeiRes("hand_oppo_1_11");
                this.bmp_cardcolor.spriteFrame=HZMJ.ins.iclass.getMahjongPaiHuaRes(this._cardValue);
                this.bmp_cardcolor.node.scaleX=0.30;
                this.bmp_cardcolor.node.scaleY=0.22;
                this.bmp_cardcolor.node.skewX=2.5;
                this.bmp_cardcolor.node.x=0.6;
                this.bmp_cardcolor.node.y=9.4;
                break;
            }
            case 6:{
                this.node.x=31;
                this.node.y=297;
                this.bmp_liecardback.spriteFrame=HZMJ.ins.iclass.getMahjong3DPaiBeiRes("hand_oppo_1_10");
                this.bmp_cardcolor.spriteFrame=HZMJ.ins.iclass.getMahjongPaiHuaRes(this._cardValue);
                this.bmp_cardcolor.node.scaleX=0.30;
                this.bmp_cardcolor.node.scaleY=0.22;
                this.bmp_cardcolor.node.skewX=3;
                this.bmp_cardcolor.node.x=0;
                this.bmp_cardcolor.node.y=9.4;
                break;
            }
            case 7:{
                this.node.x=-5;
                this.node.y=297;
                this.bmp_liecardback.spriteFrame=HZMJ.ins.iclass.getMahjong3DPaiBeiRes("hand_oppo_1_9");
                this.bmp_cardcolor.spriteFrame=HZMJ.ins.iclass.getMahjongPaiHuaRes(this._cardValue);
                this.bmp_cardcolor.node.scaleX=0.30;
                this.bmp_cardcolor.node.scaleY=0.22;
                this.bmp_cardcolor.node.skewX=3.5;
                this.bmp_cardcolor.node.x=0;
                this.bmp_cardcolor.node.y=9.4;
                break;
            }
            case 8:{
                this.node.x=-41;
                this.node.y=297;
                this.bmp_liecardback.spriteFrame=HZMJ.ins.iclass.getMahjong3DPaiBeiRes("hand_oppo_1_8");
                this.bmp_cardcolor.spriteFrame=HZMJ.ins.iclass.getMahjongPaiHuaRes(this._cardValue);
                this.bmp_cardcolor.node.scaleX=0.30;
                this.bmp_cardcolor.node.scaleY=0.22;
                this.bmp_cardcolor.node.skewX=4;
                this.bmp_cardcolor.node.x=0;
                this.bmp_cardcolor.node.y=9.4;
                break;
            }
            case 9:{
                this.node.x=-77;
                this.node.y=297;
                this.bmp_liecardback.spriteFrame=HZMJ.ins.iclass.getMahjong3DPaiBeiRes("hand_oppo_1_7");
                this.bmp_cardcolor.spriteFrame=HZMJ.ins.iclass.getMahjongPaiHuaRes(this._cardValue);
                this.bmp_cardcolor.node.scaleX=0.30;
                this.bmp_cardcolor.node.scaleY=0.22;
                this.bmp_cardcolor.node.skewX=4.5;
                this.bmp_cardcolor.node.x=0;
                this.bmp_cardcolor.node.y=9.4;
                break;
            }
            case 10:{
                this.node.x=-113;
                this.node.y=297;
                this.bmp_liecardback.spriteFrame=HZMJ.ins.iclass.getMahjong3DPaiBeiRes("hand_oppo_1_6");
                this.bmp_cardcolor.spriteFrame=HZMJ.ins.iclass.getMahjongPaiHuaRes(this._cardValue);
                this.bmp_cardcolor.node.scaleX=0.30;
                this.bmp_cardcolor.node.scaleY=0.22;
                this.bmp_cardcolor.node.skewX=5;
                this.bmp_cardcolor.node.x=-0.6;
                this.bmp_cardcolor.node.y=9.4;
                break;
            }
            case 11:{
                this.node.x=-150;
                this.node.y=297;
                this.bmp_liecardback.spriteFrame=HZMJ.ins.iclass.getMahjong3DPaiBeiRes("hand_oppo_1_5");
                this.bmp_cardcolor.spriteFrame=HZMJ.ins.iclass.getMahjongPaiHuaRes(this._cardValue);
                this.bmp_cardcolor.node.scaleX=0.30;
                this.bmp_cardcolor.node.scaleY=0.22;
                this.bmp_cardcolor.node.skewX=5.5;
                this.bmp_cardcolor.node.x=-0.3;
                this.bmp_cardcolor.node.y=9.4;
                break;
            }
            case 12:{
                this.node.x=-187;
                this.node.y=297;
                this.bmp_liecardback.spriteFrame=HZMJ.ins.iclass.getMahjong3DPaiBeiRes("hand_oppo_1_4");
                this.bmp_cardcolor.spriteFrame=HZMJ.ins.iclass.getMahjongPaiHuaRes(this._cardValue);
                this.bmp_cardcolor.node.scaleX=0.30;
                this.bmp_cardcolor.node.scaleY=0.22;
                this.bmp_cardcolor.node.skewX=6;
                this.bmp_cardcolor.node.x=-0.5;
                this.bmp_cardcolor.node.y=9.4;
                break;
            }
            case 13:{
                this.node.x=-223;
                this.node.y=297;
                this.bmp_liecardback.spriteFrame=HZMJ.ins.iclass.getMahjong3DPaiBeiRes("hand_oppo_1_3");
                this.bmp_cardcolor.spriteFrame=HZMJ.ins.iclass.getMahjongPaiHuaRes(this._cardValue);
                this.bmp_cardcolor.node.scaleX=0.30;
                this.bmp_cardcolor.node.scaleY=0.22;
                this.bmp_cardcolor.node.skewX=6.5;
                this.bmp_cardcolor.node.x=0;
                this.bmp_cardcolor.node.y=9.4;
                break;
            }
            case 14:{
                this.node.x=-278;
                this.node.y=297;
                this.bmp_liecardback.spriteFrame=HZMJ.ins.iclass.getMahjong3DPaiBeiRes("hand_oppo_1_2");
                this.bmp_cardcolor.spriteFrame=HZMJ.ins.iclass.getMahjongPaiHuaRes(this._cardValue);
                this.bmp_cardcolor.node.scaleX=0.30;
                this.bmp_cardcolor.node.scaleY=0.22;
                this.bmp_cardcolor.node.skewX=7;
                this.bmp_cardcolor.node.x=-0.7;
                this.bmp_cardcolor.node.y=9.4;
                break;
            }
        }
    }

    private showShuPai():void{
        switch(this._cardIndex){
            case 1:{
                this.node.x=204+36;
                this.node.y=285;
                this.bmp_liecardback.spriteFrame=HZMJ.ins.iclass.getMahjong3DPaiBeiRes("hand_oppo_3_1");           
                break;
            }
            case 2:{
                this.node.x=168+36;
                this.node.y=285;
                this.bmp_liecardback.spriteFrame=HZMJ.ins.iclass.getMahjong3DPaiBeiRes("hand_oppo_3_2");
                break;
            }
            case 3:{
                this.node.x=132+36;
                this.node.y=285;
                this.bmp_liecardback.spriteFrame=HZMJ.ins.iclass.getMahjong3DPaiBeiRes("hand_oppo_3_3");
                break;
            }
            case 4:{
                this.node.x=96+36;
                this.node.y=285;
                this.bmp_liecardback.spriteFrame=HZMJ.ins.iclass.getMahjong3DPaiBeiRes("hand_oppo_3_4");
                break;
            }
            case 5:{
                this.node.x=60+36;
                this.node.y=285;
                this.bmp_liecardback.spriteFrame=HZMJ.ins.iclass.getMahjong3DPaiBeiRes("hand_oppo_3_5");
                break;
            }
            case 6:{
                this.node.x=24+36;
                this.node.y=285;
                this.bmp_liecardback.spriteFrame=HZMJ.ins.iclass.getMahjong3DPaiBeiRes("hand_oppo_3_6");
                break;
            }
            case 7:{
                this.node.x=-12+36;
                this.node.y=285;
                this.bmp_liecardback.spriteFrame=HZMJ.ins.iclass.getMahjong3DPaiBeiRes("hand_oppo_3_7");
                break;
            }
            case 8:{
                this.node.x=-48+36;
                this.node.y=285;
                this.bmp_liecardback.spriteFrame=HZMJ.ins.iclass.getMahjong3DPaiBeiRes("hand_oppo_3_8");
                break;
            }
            case 9:{
                this.node.x=-84+36;
                this.node.y=285;
                this.bmp_liecardback.spriteFrame=HZMJ.ins.iclass.getMahjong3DPaiBeiRes("hand_oppo_3_9");
                break;
            }
            case 10:{
                this.node.x=-120+36;
                this.node.y=285;
                this.bmp_liecardback.spriteFrame=HZMJ.ins.iclass.getMahjong3DPaiBeiRes("hand_oppo_3_10");
                break;
            }
            case 11:{
                this.node.x=-156+36;
                this.node.y=285;
                this.bmp_liecardback.spriteFrame=HZMJ.ins.iclass.getMahjong3DPaiBeiRes("hand_oppo_3_11");
                break;
            }
            case 12:{
                this.node.x=-192+36;
                this.node.y=285;
                this.bmp_liecardback.spriteFrame=HZMJ.ins.iclass.getMahjong3DPaiBeiRes("hand_oppo_3_12");
                break;
            }
            case 13:{
                this.node.x=-228+36;
                this.node.y=285;
                this.bmp_liecardback.spriteFrame=HZMJ.ins.iclass.getMahjong3DPaiBeiRes("hand_oppo_3_13");
                break;
            }
            case 14:{
                this.node.x=-265+36-5;
                this.node.y=285;
                this.bmp_liecardback.spriteFrame=HZMJ.ins.iclass.getMahjong3DPaiBeiRes("hand_oppo_3_14");
                break;
            }
        }
    }

}
