const { ccclass, property } = cc._decorator;

import { IPDKView, PDK } from "./GameHelp/PDK_IClass";
import {MaxPlayerCount,UserState,ScoreboolEle,ScoreStrEle,ScoreEle,ScoreView,TimeFlag,SkinDissolveTableParam, GameInfo,TableInfo,RoomType, TableCostType, TimerValue, GameStage, CardType, TexturePath ,GameRule} from "./GameHelp/PDK_GameHelp";
import { QL_Common } from "../../CommonSrc/QL_Common";
import { GameIF } from "../../CommonSrc/GameIF";
import M_PDKClass from "./M_PDKClass";
import { M_PDK_GameMessage } from "../../CommonSrc/M_PDK_GameMessage";

import { AudioType } from "../../CustomType/Enum";
import GameLogic from "./GameHelp/PDK_GameLogic";

import Global from "../../Global/Global";
import HuDong_Animation from "../MJCommon/HuDong_Animation";

import SkinLabelView from "./SkinView/PDK_SkinLabelView";
import SkinPlayerControl from "./SkinView/PDK_SkinPlayerControl";
import SkinButtonView from "./SkinView/PDK_SkinButtonView"
import { TranslateMoneyTypeName, PlayEffect } from "../../Tools/Function";
import PokerCardsRes from "./GameHelp/PDK_PokerCardsRes";
import SkinDissolveTable from "./SkinView/PDK_SkinDissolveTable";
import SelfSelectCardView from "./SkinView/PDK_selfSelectCardView";
import {ShowNodeView} from "./GameHelp/PDK_baseFunction";
import PDK_RoundResult from "./SkinView/PDK_RoundResult";
import SkinTotalScore from "./SkinView/PDK_SkinTotalScore";
import SkinCommunionView from "./SkinView/PDK_SkinCommunionView";
import SkinClock from "./SkinView/PDK_SkinClock";
import Ani_CardType  from "./AniView/Ani_CardType";
import SkinRecordVideo from "./SkinView/PDK_SkinRecordVideo";
import VoicePlayer from "./GameHelp/PDK_VoicePlayer";

@ccclass
export default class M_PDKView extends cc.Component implements IPDKView {
    private static _instance: M_PDKView;
    public static get Instance(): M_PDKView { return this._instance; }
    public get skingameClass(): M_PDKClass { return M_PDKClass.Instance; }

    //组件
    @property(cc.Node)
    private background: cc.Node = null;
    @property(cc.Prefab)
    prefab_labelView = null;
    private skinLabelView:SkinLabelView = null;
    @property(cc.Prefab)
    prefab_palyercontrol: cc.Prefab = null;
    private skinPlayerControl: SkinPlayerControl;
    @property(cc.Prefab)
    prefab_buttonView: cc.Prefab = null;
    public skinButtonView: SkinButtonView;
    @property(cc.Prefab)
    prefab_dissolveTable:cc.Prefab = null;
    private skinDissolveTable: SkinDissolveTable;

    @property(cc.Prefab)
    prefab_selfSelectCardView:cc.Prefab = null;
    public selfSelectCardView: SelfSelectCardView;
    @property(cc.Prefab)
    prefab_clock: cc.Prefab = null;
    private skinClock: SkinClock;
    @property(cc.Prefab)
    prefab_AniCardType: cc.Prefab = null;
    private ani_CardType: Ani_CardType;
    @property(cc.Prefab)
    prefab_hudong:cc.Prefab = null;
    private huDongDaoJu:HuDong_Animation;

    public gamerule:GameRule;
    public tableInfo:TableInfo;
    public gameInfo:GameInfo;
    private skinCommunionView: SkinCommunionView;
    private msg_Start: M_PDK_GameMessage.CMD_S_GameStart;
    public scoreView:ScoreView = null;
    public roundResult:PDK_RoundResult = null;
    private skinTotalScore:SkinTotalScore = null;
    private skinRecordVideo: SkinRecordVideo;
    private setId:number = 0;
   
    onLoad() {
        M_PDKView._instance = this;
        PDK.ins.iview = this;
        this.tableInfo = new TableInfo();
        this.gameInfo = new GameInfo();
        let orderIndex = this.node.childrenCount;//1
        this.skinLabelView = this.AddPrefab(this.prefab_labelView, "PDK_SkinLabelView", orderIndex++);//2
        this.skinPlayerControl = this.AddPrefab(this.prefab_palyercontrol, "PDK_SkinPlayerControl", orderIndex++);//3 
        this.selfSelectCardView = this.AddPrefab(this.prefab_selfSelectCardView, "PDK_selfSelectCardView", orderIndex++)//4;
        orderIndex++;//SkinCommunionView:5
        orderIndex++;
        this.skinButtonView = this.AddPrefab(this.prefab_buttonView, "PDK_SkinButtonView", orderIndex++);//6
        this.skinClock = this.AddPrefab(this.prefab_clock, "PDK_SkinClock", orderIndex++)//8;
        this.ani_CardType = this.AddPrefab(this.prefab_AniCardType, "Ani_CardType", orderIndex++)//9;
        this.skinDissolveTable = this.AddPrefab(this.prefab_dissolveTable, "PDK_SkinDissolveTable", 20);
        this.huDongDaoJu = this.AddPrefab(this.prefab_hudong,"HuDong_Animation",orderIndex++);
        //SkinTiren:11
        //SkinPlayerInfo:12
        //SkinRecordVideo:13
        //SkinGameHelp:14
        //SkinTotalScore:15
        //SkinQueryScore:16
        //SkinDissolveTable:17
    }
    /**
     * 添加预设体到this节点下
     */
    private AddPrefab(prefab: cc.Prefab, className: string, zOrder: number) {
        let com = cc.instantiate(prefab).getComponent(className);
        this.node.addChild(com.node, zOrder);
        return com;
    }

     //==================================== 基类可重写 开始 =======================================
    //
    /**
     * 初始化游戏视图,皮肤已经加载完成,在这里可以访问皮肤里的组件，也可以访问gameClass中的成员
     * */
    public InitGameView(): void {
        console.log("InitGameView");
        this.Init();
        this.AddTimerForm();
    }
    /**
     * 初始化游戏 有参数 用于初始化，每次游戏中断线重连都会被调用
     */
    public ReInitView() {
        console.log("ReInitView");
        this.Init();
    }
    /**
     * 销毁游戏视图,游戏需要移除所有子元素
     * */
    public DestroyGameCiew(): void {
    }
    private AddTimerForm() {
        let timeForm = this.skingameClass.UiManager.GetTimerForm();
        this.background.getChildByName("top_left").addChild(timeForm);
        timeForm.x = 115;
        timeForm.y = 0;
        timeForm.color=cc.color().fromHEX("#ffffff");
        timeForm.getComponent(cc.Label).fontSize =22;
    }
    //
    //==================================== 基类可重写 结束 =======================================

    //==================================== 常用 开始 =======================================
    /**
     * 初始化
     */
    private Init() {
        this.tableInfo.Init();
        this.gameInfo.Init();
        
        this.skinLabelView.Init();
        this.skinPlayerControl.Init();
        // if (this.skingameClass.IsCreateTable())
        //     this.skinLabelView.SetTableNum(this.skingameClass.TableID);
        this.skinPlayerControl.SetPlayerTransForm(this.skingameClass.isSelfCreateRoom);
    }
    /**
     * 重置
     **/
    public Reset(): void {
        this.gameInfo.Reset();
        this.gameInfo.SetIsGaming(false);
        this.skinLabelView.SetGameCount(this.gameInfo.gameCount);
        this.skinPlayerControl.Reset();
    }
    /**
     * 清理
     */
    public Clear() {
        this.skinPlayerControl.SelfReadyClear();
    }
    //==================================== 常用 结束 =======================================

    //==================================== 来自Class的消息 开始 =======================================
    /**
     * 设置玩家信息
     */
    public SetUserInfo(chair: number, faceID: string, name: string, gender: number): void {
        console.log("chair:" + chair + ",name:" + name + ",faceID:" + faceID + ",gender:" + gender);
        this.skinPlayerControl.SetUserInfo(chair, faceID, name, gender);
    }
    public AgreeNextGameReset(){
        this.gameInfo.gameCount[1] += this.gameInfo.startNum;
        this.skinLabelView.SetGameCount( this.gameInfo.gameCount);
        this.gameInfo.SetIsTrueReady(false);
        if(this.roundResult != undefined && this.roundResult.node.active){
            this.roundResult.changeBtnReadyImage(true);
        }
    }
    public RefuseNextGameReset(){
        //this.gameInfo.gameCount[1] -= this.gameInfo.startNum;
        //this.gameInfo.gameCount[0] = this.gameInfo.gameCount[1]; 
      //  this.skinLabelView.SetGameCountForNext(this.gameInfo.gameCount[1]);
        cc.log("---------清理-----------游戏--------规则------");
        this.TheEnd();
        if(this.roundResult != undefined && this.roundResult.node.active){
            this.roundResult.changeBtnReadyImage(false);
        }
       // this.skinButtonView.ShowTotalScore();
    }
    /**
     * 设置玩家状态
     */
    public SetUserState(chair: number, state: QL_Common.GState) {
        this.skinPlayerControl.SetUserState(chair, state);

        console.log("测试创建牌------------")
    }
    /**
     * 设置玩家离开
     */
    public SetUserLeave(chair: number) {
        this.skinPlayerControl.SetUserLeave(chair); 
    }
    /**
     * 显示文字聊天
     */
    public ShowChat(chair: number, value: string) {
        this.ShowCommunionView(chair, 0, value);
    }
    /**
     * 显示聊天表情
     */
    public ShowChatEmoji(chair: number, value: cc.AnimationClip) {
        this.skinPlayerControl.ShowChatEmoji(chair, value);
    }
    /**
     * 显示互动道具
     * @param spschair 发起者
     * @param rechair 接收者
     * @param index 道具索引
     */
    public ShowChatItem(spschair:number,rechair:number,index:string){
        var idx = parseInt(index);
        if(idx==4){
            var path = cc.url.raw("resources/Sound/Item/guzhang.mp3");
            this.skingameClass.PlaySound(path,AudioType.Effect,false);
            this.skinPlayerControl.ShowGuZhang(spschair);
        }else{
            var point = this.skinPlayerControl.GetPlayerInfoPoint(spschair);
            var point2 = this.skinPlayerControl.GetPlayerInfoPoint(rechair);
       //     if(rechair !=0){
                 point2.y += 20;
  //          }
               

            this.huDongDaoJu.showChatItem(idx,point,point2);
        }
     

    }

    /**
     * 余额更新
     */
    public RefreshMoney() {
        if (this.gameInfo.waitPay) {
            this.gameInfo.SetWaitPay(false);
            this.skingameClass.SendGameData(new M_PDK_GameMessage.CMD_C_RefreshMoney());
        }
    }
    //==================================== 来自Class的消息 结束 =======================================



    //==================================== 接收消息 开始 =======================================
    /**
     * 特殊属性
     */
    public Rec_Attribute(msg: GameIF.CustomMessage) {
        var data = <M_PDK_GameMessage.CMD_S_Attribute>msg;
        this.gamerule = new GameRule();
        this.skinLabelView.allgamenum = data.startNum;
        this.skinLabelView.SetMoneyType(data.moneyType);
        this.skinLabelView.SetGameCount(data.gameCount);
       
        this.gameInfo.SetGameCount(data.gameCount);
        this.gameInfo.SetPlayerCount(data.PeopleNum);
        this.gameInfo.SetCardsCount(data.gameModel);
        this.tableInfo.SetMoneyType(data.moneyType);
        this.gameInfo.SetTableCreateWaitTime(data.tableCreateWaitTime);
        
        this.tableInfo.SetRoomType(<RoomType>data.roomType);
        this.tableInfo.SetTableCostType(<TableCostType>data.tableCostType);

        
        this.gameInfo.startNum = data.startNum;
        this.tableInfo.SetTableCostNum(data.tableCostNum);
        this.tableInfo.SetForceLeftMoney(data.forceLeftMoney);
        this.tableInfo.SetForceLeftMoneyType(<QL_Common.CurrencyType>data.forceLeftMoneyType);
        this.tableInfo.SetCheckIP(data.ifcansameip);
        
        this.gameInfo.SetHasForceLeft(data.hasForceLeft);
        this.skingameClass.allmoney = data.tableCostNum;
        if(data.startNum == 8){
            this.gamerule.SetGameNum = 0;
        }else if(data.startNum == 12){
            this.gamerule.SetGameNum = 1;
        }
        console.log("局数为："+this.gamerule.SetGameNum );
        this.gameInfo.PlayerCount = data.PeopleNum;
        this.gamerule.zhuaNiaoScore = data.zhuaNiaoScore;
        this.gamerule.mustOut = data.mustOut;
        this.gamerule.have2OutA = data.have2OutA;
        this.gamerule.PeopleNum = data.PeopleNum;
        if(data.PeopleNum ==2){
            let leftCardCount = 0;
            if(data.gameModel == 16){
                leftCardCount = 16;
            }else if(data.gameModel == 15){
                leftCardCount = 15;
            }
            this.skinLabelView.showPaihe(leftCardCount);
        }


        this.gamerule.spades3MustOut = data.spades3MustOut;
        this.gamerule.spadesRedPeach3 = data.spadesRedPeach3;
        this.gamerule.redPeach3MustOut = data.redPeach3MustOut;


        this.gamerule.bomb = data.bomb;
        this.gamerule.FZBP = data.FZBP;
        this.gamerule.SZTW = data.SZTW;
        this.gamerule.firstSpades3Out = data.firstSpades3Out;
        this.gamerule.threeAIsBomb = data.threeAIsBomb;
        this.gamerule.showRemainNum = data.showRemainNum;
        this.gamerule.ifcansameip = data.ifcansameip;
        this.gamerule.checkGps = data.CheckGps;
        this.gamerule.extendBet = 0;
        this.gamerule.gameModel = data.gameModel;
        this.gamerule.isValid = true;
        this.gamerule.rubCard = false;
        this.gamerule.tableCreatorPay = data.tableCostType;
        if (this.skingameClass.IsCreateTable()){
            this.skinLabelView.SetTableNum(this.skingameClass.TableID,data.isgroup);
            this.skinLabelView.setPlayerNum(data.PeopleNum);
       }
      
        if (this.skingameClass.GetSelfState() != QL_Common.GState.Gaming)
            this.skinButtonView.ShowReady();
        if (this.skingameClass.IsCreateTable()) {
            if (data.tableCreator >= 0 && data.tableCreator < MaxPlayerCount) {
                this.tableInfo.SetTableCreator(this.skingameClass.GetClientChair(data.tableCreator));
                this.skinPlayerControl.SetTableCreator(this.tableInfo.tableCreator);
            }
            //this.skinButtonView.btn_queryscore.node.active = true;
            this.skinButtonView.btn_voice.node.active = true;
            if (this.skingameClass.GetSelfState() != QL_Common.GState.Gaming)
                this.skinButtonView.SetTirenButton(this.tableInfo.IsSelfCreateTable());
        }
        
        const tableCostName = this.tableInfo.tableCostType == TableCostType.GroupOwnerPay ? "钻石" : TranslateMoneyTypeName(this.skingameClass.RoomClient.TableCostMoneyType);
        //if(this.roundResult == undefined || this.roundResult.node.active == false){
        //    PDK.ins.iclass.ShowWanFa();
        //}
        let ruleStr:string = "";
        ruleStr = data.gameModel + "张玩法 ";
        if(data.mustOut == 0){
            ruleStr = ruleStr + "有牌必要 ";
        }else if(data.mustOut == 1){
            ruleStr = ruleStr + "可不要 ";
            if(data.have2OutA){
                ruleStr = ruleStr + "有2必打A ";
            }
        }
        if(data.bomb){
            ruleStr = ruleStr + "炸弹+10 ";
        }
        if(data.SZTW){
            ruleStr = ruleStr + "剩三张拖尾 ";
        }
        if(data.zhuaNiaoScore != -1){
            if(data.zhuaNiaoScore == 1){
                ruleStr = ruleStr + "抓鸟(翻倍) ";
            }else{
                ruleStr = ruleStr + "抓鸟(" + data.zhuaNiaoScore + "分) ";
            }
        }
        if(data.threeAIsBomb){
            ruleStr = ruleStr + "3A为炸(可带1)";
        }

        this.skinLabelView.showGameRule(ruleStr);
    }
    /**
     * 请求玩家创建房间
     */
    public Rec_GameCreatePlease(msg: GameIF.CustomMessage) {
        this.gameInfo.SetShowExitAsk(true);
    }

    /**
     * 发送setID
     */
    public Rec_setSetId(msg: GameIF.CustomMessage) {
        var data = <M_PDK_GameMessage.CMD_S_SendSetId>msg;
        if(data.Setid==undefined||data.Setid<=0){
            return;
        }
        if(cc.isValid(this.skinTotalScore)){
            this.skinTotalScore.ModifySetId(data.Setid);
        }
        this.setId = data.Setid;
    }

    public ShowJieSuanCopy(url:string){
        if(url ==null||url ==""){
            return;
        }
        if(cc.isValid(this.skinTotalScore)){
            this.skinTotalScore.OnButtonCopy(url);
        }else{
            cc.log("此时结算面板无效");
        }
    }

    /**
     * 游戏开始
     */
    public Rec_GameStart(msg: GameIF.CustomMessage, aniFinish: boolean = false) {
        VoicePlayer.PlaySysSound("bull_start");
        //设置游戏开始
        this.gameInfo.SetIsGaming(true);
        var data = <M_PDK_GameMessage.CMD_S_GameStart>msg;
        let FirstcChair = this.skingameClass.GetClientChair(data.FirstOperationChair);

        if(aniFinish){
            this.selfSelectCardView.showFristCardAni(data.FirstCard,this.skinPlayerControl.skinPlayer[FirstcChair].node.getPosition(),FirstcChair);
        }else{
            this.gameInfo.AddCurCount();
            this.skinPlayerControl.userStateClear();
            this.selfSelectCardView.clearHandCard();
            this.gameInfo.firstOutValue = data.FirstCard;
            this.Clear();

            this.msg_Start = data;
            console.log("--------Rec_GameStart:" + aniFinish);
            //设置是否真实结束
            this.gameInfo.SetIsTrueOver(false);
    
            this.skinButtonView.SetMulGameButton(this.skingameClass.isSelfCreateRoom);
            this.skinButtonView.HideReady();
            this.skinButtonView.HideShare();
            this.skinPlayerControl.clearAllOutCards();
            this.skinLabelView.SetGameCount(this.gameInfo.gameCount);
            this.selfSelectCardView.SetPlayerCard(data.cards);
            this.skinPlayerControl.setCardView();
            this.selfSelectCardView.showGetCardAni(data);
        }
    } 
    /**
     * 显示先出标签
     */
    public showFirstIcon(cChair:number){
        this.skinPlayerControl.skinPlayer[cChair].showFirstIcon();  
    }
    
    /**
     * 断线重连--出牌中
     */
    public Rec_GameContext_OutCard(msg: GameIF.CustomMessage) {
        console.log("出牌中断线重连----")
        var data = <M_PDK_GameMessage.CMD_S_GameContext_OutCard>msg;
        this.gameInfo.SetIsTrueOver(false);
        this.selfSelectCardView.clearHandCard();

        this.skinButtonView.SetMulGameButton(this.skingameClass.isSelfCreateRoom);
        this.skinButtonView.HideReady();
        this.skinButtonView.HideShare();
        this.selfSelectCardView.SetPlayerCard(data.cards);
        this.skinPlayerControl.setCardViewByData(data.playerChair,data.playerCardsCount,data.playerOutCards);
        this.gameInfo.SetGameCount(data.gameCount);
        this.skinLabelView.SetGameCount(this.gameInfo.gameCount);
        this.gameInfo.lastOutCardChair = data.lastOutCardChair;
        let nextcChair = this.skingameClass.GetClientChair(data.nowOprationChair);
        this.gameInfo.nextOutCardChair = nextcChair;
        if(data.lastOutCardChair != -1){
            this.gameInfo.lastOutCardChair = this.skingameClass.GetClientChair(data.lastOutCardChair);
            this.gameInfo.lastOutCards = data.lastOutCard;
            this.gameInfo.lastOutCardType = data.lastOutCardType;
            this.changeOperationPlayer(nextcChair,data.CanOut);
        }else{
            this.changeOperationPlayer(nextcChair,true);
        }
        if(data.zhuaNiaoChair != 100){
            this.ShowZhuaNiaoIcon(this.skingameClass.GetClientChair(data.zhuaNiaoChair));
        }
        this.showFirstIcon(this.skingameClass.GetClientChair(data.firstChair));
         //设置游戏开始
         this.gameInfo.SetIsGaming(true);
    }
    /**
     * 断线重连--准备阶段
     */
    public Rec_GameContext_Interval(msg: GameIF.CustomMessage) {
        var data = <M_PDK_GameMessage.CMD_S_GameContext_Interval>msg;
        this.gameInfo.SetIsTrueOver(false);

        this.skinButtonView.SetMulGameButton(this.skingameClass.isSelfCreateRoom);
        this.skinButtonView.HideReady();
        this.skinButtonView.HideShare();
        this.gameInfo.SetGameCount(data.gameCount);
        this.skinLabelView.SetGameCount(this.gameInfo.gameCount);
        let cChair:number[] = [];
        for(let i = 0;i<data.chair.length;i++){
            cChair[i] = this.skingameClass.GetClientChair(data.chair[i]);
            if(cChair[i] == 0 && data.userState[i] == UserState.Free){
                this.skinButtonView.showReady();
            }
        }
        this.skinPlayerControl.showReadyImage(cChair,data.userState);
        this.selfSelectCardView.clearHandCard();
         //设置游戏开始
         this.gameInfo.SetIsGaming(true);
    }
    /**
     *玩家准备
     */
    public Rec_ShowReady(msg:GameIF.CustomMessage){
        var data = <M_PDK_GameMessage.CMD_C_Ready>msg;
        let cChair = this.skingameClass.GetClientChair(data.chair);
        this.skinPlayerControl.skinPlayer[cChair].SetUserReady(true);
    }
    /**
     * 游戏结束
     */
    private OnGameOver() {
        console.log("OnGameOver");
        this.OnClassOver();
    }
    public OnClassOver() {
        console.log("OnClassOver");
        if (this.gameInfo.isTrueOver) {
            this.ShowReady();
        }
        else {
            this.gameInfo.SetIsTrueOver(true);
        }
    }
    /**
     * 解散房间成功
     */
    public OnDisTableSuccess() {
        if (!this.gameInfo.isGaming)
            this.TimeResume();
    }
    /**
     * 局数打完或者解散房间
     */
    private TheEnd() {
        this.selfSelectCardView.clearTips();
        this.ani_CardType.HideAllAni();
        this.gameInfo.SetIsTrueOver(false);
        this.Reset();
        this.tableInfo.Reset();
        this.skinButtonView.SetMulGameButton(true);
        if (this.gameInfo.isDissolveTable && (this.roundResult == undefined || (this.roundResult != undefined && this.roundResult.node.active== false))) {
            this.ShowTotalScore();
        }
        else {
            this.ShowQueryScore();
            this.gameInfo.SetIsTrueReady(this.gameInfo.IsEnd());
        }
    }
    /**
     * 显示总计
     */
    public ShowTotalScore() {
        ShowNodeView("TotalScore", this.skinTotalScore, (prefab) => {
            this.skinTotalScore = this.AddPrefab(prefab, "PDK_SkinTotalScore", 15);
        }, () => {
            this.skinTotalScore.Show(this.skingameClass.TableID,this.setId);
        });
    }

    /**
     * 显示计分板
     */
    public ShowQueryScore(isExit: boolean = true) {
        ShowNodeView("RoundResult", this.roundResult, (prefab) => {
            this.roundResult = this.AddPrefab(prefab, "PDK_RoundResult", 16);
        }, () => {
            this.roundResult.Show(this.scoreView);
        });
    }
    private ShowReady() {
        //this.skinPlayerControl.StopAni(GameStage.Free);
        this.Reset();
        if (this.skingameClass.IsCreateTable()) {
            if (this.gameInfo.IsEnd()) {
                this.tableInfo.Reset();
                return;
            }
    //        this.RegTimer(TimeFlag.Interval);
        }
    }
    /**
     * 计分板
     */
    public Rec_ScoreView(msg: GameIF.CustomMessage) {
        var data = <M_PDK_GameMessage.CMD_S_GameRoundResult>msg;
        if(this.scoreView == null){
            this.scoreView = new ScoreView(data.chairList, this.GetIDList(data.chairList), data.nameList, this.GetFaceList(data.chairList), data.gameNum);
        }
        this.scoreView.datalist.push(new ScoreEle(data.dataList));      
        this.scoreView.bomblist.push(new ScoreEle(data.bombList)); 
        this.scoreView.zhuaNiaolist.push(new ScoreEle(data.zhuaNiaoList)); 
        this.scoreView.beiMenGuolist.push(new ScoreEle(data.menGuoList)); 
        this.scoreView.haveCardlist.push(new ScoreEle(data.haveCardList));
        this.scoreView.baoPeilist.push(new ScoreboolEle(data.baoPeiList));
        this.scoreView.RoundScoreInfolist.push(new ScoreStrEle(data.scoreInfoList)); 
        this.scoreView.isWinList.push(new ScoreEle(data.isWinList)); 
        this.skinPlayerControl.showHandCard(data.chairList,data.cardsList);
        this.skinPlayerControl.stopWarningEffect()

        for(let i = 0 ;i< data.dataList.length;i++){
            if(this.skingameClass.GetClientChair(data.chairList[i]) == 0){
                if(data.isWinList[i] == 1){
                    //播放胜利特效
                    VoicePlayer.PlaySysSound("bull_win");
                    this.selfSelectCardView.showRoundResultTip(1);
                }else{
                    if(data.baoPeiList[i] == true){
                        //播放包赔特效
                        this.playCardTypeAni(CardType.baopei,0,new cc.Vec2(0,-100));
                        //this.selfSelectCardView.showRoundResultTip(2);
                    }else if(data.menGuoList[i] == 1){
                         //播放春天特效
                         this.playCardTypeAni(CardType.chuantian,0,new cc.Vec2(0,0));
                    }else{
                        //播放普通输牌特效
                        this.selfSelectCardView.showRoundResultTip(3);
                    }
                    VoicePlayer.PlaySysSound("bull_loss");
                }
            }

        }

        
        this.scheduleOnce(function(){
            this.selfSelectCardView.showRoundResultTip(0);
            this.TheEnd();
        },3);
    }
    /**
     * 刷新计分板所有信息
     */
    public  Rec_RefreshScoreView(msg: GameIF.CustomMessage) {
        var data = <M_PDK_GameMessage.CMD_S_ScoreView>msg;
        this.scoreView = new ScoreView(data.chairList, this.GetIDList(data.chairList), data.nameList, this.GetFaceList(data.chairList), data.gameNum);
        for(let i = 0;i<data.dataList.length;i++){
            this.scoreView.datalist.push(new ScoreEle(data.dataList[i]));      
            this.scoreView.bomblist.push(new ScoreEle(data.bombList[i])); 
            this.scoreView.zhuaNiaolist.push(new ScoreEle(data.zhuaNiaoList[i])); 
            this.scoreView.beiMenGuolist.push(new ScoreEle(data.menGuoList[i])); 
            this.scoreView.haveCardlist.push(new ScoreEle(data.haveCardList[i]));
            this.scoreView.baoPeilist.push(new ScoreboolEle(data.baoPeiList[i]));
            this.scoreView.RoundScoreInfolist.push(new ScoreStrEle(data.scoreInfoList[i])); 
            this.scoreView.isWinList.push(new ScoreEle(data.isWinList[i])); 
        }
        if (data.isExit && this.skinDissolveTable != undefined) {
            //if (this.gameInfo.isGaming)
                this.gameInfo.SetIsDissolveTable(true);
            this.skinDissolveTable.OnClose();
        }
        if (data.isExit){
            cc.log("---------清理-----------游戏--------规则------");
            this.TheEnd();
        }
    }
    /**
     * 局数中间时的桌子上玩家状态
     */
    public Rec_TableState(msg: GameIF.CustomMessage) {
        this.skinButtonView.SetMulGameButton(this.skingameClass.isSelfCreateRoom);
        var data = <M_PDK_GameMessage.CMD_S_TableState>msg;
        this.skinPlayerControl.userStateClear()
        this.skinPlayerControl.GameStartClear();
        this.skinButtonView.HideTiRen();
        for (var i = 0; i < data.chair.length; i++) {
            var chair = this.skingameClass.GetClientChair(data.chair[i]);           
            if (data.ready[i]) {
                var gender = SkinPlayerControl.Instance.skinPlayer[chair].userGender;
                  cc.log("--------播----放----音------效"+gender)
             //       VoicePlayer.PlayChatVoice(9,gender);
                this.skinPlayerControl.SetUserReady(chair);
                if (chair == 0) {
                    this.skinButtonView.HideReady();
                    this.skinButtonView.HideShare();
                    
                }
            }
            else if (chair == 0) {
                console.log(chair + "," + data.surplusTimer);
                let isRoundEnd = false;
                if(this.roundResult != undefined && this.roundResult.node.active){
                    isRoundEnd = true;
                }
                this.skinButtonView.ShowReady(isRoundEnd);
                // if (data.surplusTimer > 0)
                //     this.RegTimer(TimeFlag.Interval, false, data.surplusTimer);
            }
        }
        //var master = this.skingameClass.GetClientChair(data.master);
      //  this.gameInfo.SetMaster(master);
      //  this.skinPlayerControl.SetUserMaster(master);
      cc.log("局数中间断线重连,桌子上玩家状态刷新完毕");
        this.gameInfo.SetIsTrueReady(data.isend);
    }
    /**
     * 房主信息
     */
    public Rec_TableCreator(msg: GameIF.CustomMessage) {
        var data = <M_PDK_GameMessage.CMD_S_TableCreator>msg;
        if (data.chair >= 0 && data.chair < this.gameInfo.PlayerCount) {
            this.tableInfo.SetTableCreator(this.skingameClass.GetClientChair(data.chair));
            this.skinPlayerControl.SetTableCreator(this.tableInfo.tableCreator);
            if (this.skingameClass.GetSelfState() != QL_Common.GState.Gaming)
                this.skinButtonView.SetTirenButton(this.tableInfo.IsSelfCreateTable());

                if(this.tableInfo.tableCreator==0&&!this.gameInfo.isGaming&&this.gameInfo.gameCount[0]<1){
                for(var i = 1;i<4;i++){
                    if(this.skinPlayerControl.skinPlayer[i].IsJoinGame()){
                        this.skinPlayerControl.skinPlayer[i].ShowTiren();
                    }
                }             
            }
        }
    }
     /**
     * 解散房间
     */
    public Rec_DissolveTable(msg: GameIF.CustomMessage) {
        var data = <M_PDK_GameMessage.CMD_S_DissolveTable>msg;
        this.ShowDissolveTable(msg,this.GetFaceList(data.member));
    }
    /**
     * 强退结果
     */
    public Rec_ForceLeftSuccess(msg: GameIF.CustomMessage) {
        var data = <M_PDK_GameMessage.CMD_S_ForceLeftSuccess>msg;
        var chair = this.skingameClass.GetClientChair(data.chair);
        if (chair == 0) {
            this.skingameClass.ForceQuitting();
        }
    }
    /**
     * 解散房间
     */
    private ShowDissolveTable(msg: GameIF.CustomMessage,faceID:string[]) {
        // ShowNodeView("DissolveTable", this.skinDissolveTable, (prefab) => {
        //     this.skinDissolveTable = this.AddPrefab(prefab, "BJ_SkinDissolveTable", 17);
        // }, () => {
        this.skinDissolveTable.Show(new SkinDissolveTableParam(msg),faceID);
        // });
    }
     /**
     * 房主离开成功
     */
    public Rec_TableCreatorLeftSuccess(msg: GameIF.CustomMessage) {
        if (!this.gameInfo.tableOwnerWaitExit) return;
        this.skingameClass.ExitGame();
    }
    /**
     * 显示来自服务端的消息
     */
    public Rec_ShowMsg(msg: GameIF.CustomMessage) {
        var data = <M_PDK_GameMessage.CMD_S_ShowMsg>msg;
        if (data.type == 0) {
            this.skingameClass.UiManager.ShowTip(data.msg);
        }
        else if (data.type == 1) {
            if (data.isexit) {
                this.skingameClass.ForceQuitting();
                //  this.skingameClass.UiManager.ShowMsgBox(data.msg, this, () => {
                //     this.skingameClass.ForceQuitting();
                //     });
                this.skingameClass.UiManager.ShowTip(data.msg);
            }
            else {
                this.skingameClass.UiManager.ShowTip(data.msg);
            }
        }
    }
    /**
     * 切换操作玩家
     */
    public changeOperationPlayer(nextcChair:number,canOut){
        this.DestroyTimer();
        let cChair = nextcChair;
        this.skinPlayerControl.showZhishi(cChair);
        this.selfSelectCardView.showBtnCantOut(false);
        let ClockTimes = 15;
        if(cChair === 0 ){
            if(canOut){
                this.selfSelectCardView.SetCanSelectCard(true);
                //最后出牌的人是自己，表示自己的牌无人要的起，必须要出牌，不出按钮禁用
                if(this.gameInfo.lastOutCardChair == -1 || this.gameInfo.lastOutCardChair == 0 || this.gamerule.mustOut == 0){
                    if(this.gameInfo.lastOutCardChair == -1 || this.gameInfo.lastOutCardChair == 0 ){
                        this.selfSelectCardView.setPromptBtnState(false);
                        ClockTimes = 30;
                    }else{
                        this.selfSelectCardView.setPromptBtnState(true);
                    }
                    this.selfSelectCardView.setPassBtnState(false);
                }else{
                    this.selfSelectCardView.setPassBtnState(true);
                    this.selfSelectCardView.setPromptBtnState(true);
                }
                this.RegTimer(TimeFlag.OutCards,true,ClockTimes,"",cChair);
            }else{
                this.selfSelectCardView.showBtnCantOut(true);
            }
        }else{
            if(this.gameInfo.lastOutCardChair == -1 || this.gameInfo.lastOutCardChair == cChair ){
                ClockTimes = 30;
            }
            this.RegTimer(TimeFlag.OutCards,true,ClockTimes,"",cChair);
            this.selfSelectCardView.showAuto();
        }
        
    }
    //玩家出牌消息
    public Rec_OutCard(msg: GameIF.CustomMessage){
        var data = <M_PDK_GameMessage.CMD_S_OutCard>msg;
        let cChair = this.skingameClass.GetClientChair(data.chair);
        let nextcChair = this.skingameClass.GetClientChair(data.nextChair);
        if(data.cards.length > 0){
            this.gameInfo.lastOutCardChair = cChair;
            this.gameInfo.lastOutCards = data.cards;
            this.gameInfo.lastOutCardType = data.cardType;
        } 
        this.gameInfo.nextOutCardChair = nextcChair;

        let cards = GameLogic.SortCardToSmall(data.cards,data.cards.length,true);
        this.OutCard(cChair,cards,data.cardType,data.isRoundEnd,true);
        if(this.gamerule.zhuaNiaoScore != -1){
            for(let value of data.cards){
                if(value == 0x2A){
                    this.selfSelectCardView.showZhuaNiaoAni(cChair,this.skinPlayerControl.skinPlayer[cChair].getZhuaNiaoIconPos());
                    break;
                }
            }
        }
        if(data.isRoundEnd){
            this.selfSelectCardView.showBtnCantOut(false);
            this.DestroyTimer();
        }else{
            this.changeOperationPlayer(nextcChair,data.canOut);
        }
    }

    //显示玩家打出的牌
    public OutCard(cChair:number,cards:number[],cardType:CardType,isRoundEnd:boolean,isNeedSound:boolean){
        this.skinPlayerControl.showOutCard(cChair,cards,cardType,isRoundEnd,isNeedSound);
    }
    /**
     * 玩家余额
     */
    public Rec_PlayerScore(msg: GameIF.CustomMessage) {
        var data = <M_PDK_GameMessage.CMD_S_PlayerScore>msg;
        for (var i = 0; i < data.score.length; i++) {
            var chair = this.skingameClass.GetClientChair(i);
            this.skinPlayerControl.SetUserMoney(chair, data.score[i],data.isRefresh);
        }
    }
    public ShowZhuaNiaoIcon(cChair:number){
        this.skinPlayerControl.skinPlayer[cChair].showZhuaNiaoIcon();
    }
    //==================================== 接收消息 结束 =======================================

    //==================================== 按钮事件 开始 =======================================
    /**
     * 背景点击，隐藏菜单栏
     */
    private OnButtonBg() {
        this.skingameClass.closeChat();
        this.skinButtonView.HideMenu();
    }
    /**
     * 退出按钮事件
     */
    public OnButtonExit(iskey: boolean = false) {
        if (this.skingameClass.isSelfCreateRoom) {
            if (!this.skingameClass.IsCanExitGame(this.skingameClass.ChairID))  {
                //自主建房中途不许退出;
                return;
            }
            if (this.tableInfo.IsSelfCreateTable()) {
                if (this.tableInfo.tableCostType == TableCostType.AAPay) {
            //        this.skingameClass.UiManager.ShowMsgBox("是否确认退出房间，如果是房主将直接解散房间", this, () => {
                      var data = new M_PDK_GameMessage.CMD_C_TableCreatorLeft();
                       data.saveTable = false;
                        this.skingameClass.SendGameData(data);
                        this.skingameClass.ExitGame();
               //     });
                }
                else if (this.tableInfo.tableCostType == TableCostType.GroupOwnerPay) {
                    this.NomalExit(iskey);
                }
                else if (this.gameInfo.showExitAsk) {
                   // this.NomalExit(iskey);
              //      let strTips = "是否确认退出房间，如果是房主将直接解散房间" ;
              //      this.skingameClass.UiManager.ShowMsgBox(strTips, this, () => {
                        var data = new M_PDK_GameMessage.CMD_C_TableCreatorLeft();
                        data.saveTable = false;
                        this.skingameClass.SendGameData(data);
                        this.skingameClass.ExitGame();                        
             //       });
                }
                else {
                    this.NomalExit(iskey);
                }
            }
            else {
                this.NomalExit(iskey);
            }
        }
        else if (!this.skingameClass.IsCanExitGame(this.skingameClass.ChairID)) {
            var money = Math.abs(this.tableInfo.forceLeftMoney);
            if (!this.gameInfo.hasForceLeft && money > 0) {
                var moneytype = TranslateMoneyTypeName(this.tableInfo.forceLeftMoneyType);
                this.skingameClass.UiManager.ShowMsgBox(`在游戏中退出会扣除${moneytype}${money},是否退出`, this, () => {
                    this.ForceExit();
                });
            }
            else {
                if (iskey) {
                    this.skingameClass.UiManager.ShowMsgBox("是否退出跑得快？", this, () => {
                        this.ForceExit();
                    });
                }
                else {
                    if (money > 0)
                        M_PDKClass.Instance.SendGameData(new M_PDK_GameMessage.CMD_C_ForceLeft());
                    else
                        this.skingameClass.ForceQuitting();
                }
            }
        }
        else {
            this.NomalExit(iskey);
        }
    }
    private ForceExit() {
        if (!this.skingameClass.IsCanExitGame(this.skingameClass.ChairID)) {
            if (Math.abs(this.tableInfo.forceLeftMoney) > 0)
            M_PDKClass.Instance.SendGameData(new M_PDK_GameMessage.CMD_C_ForceLeft());
            else
                this.skingameClass.ForceQuitting();
        }
        else
            this.skingameClass.ExitGame();
    }
    private NomalExit(iskey: boolean) {
        if (iskey) {
            this.skingameClass.UiManager.ShowMsgBox("是否退出跑得快？", this, () => {
                this.skingameClass.ExitGame();
            });
        }
        else {
            this.skingameClass.ExitGame();
        }
    }
    /** 
     * 分享按钮事件
     */
    public OnButtonShare() {
        var title = "";
         if(Global.Instance.DataCache.GroupId>0){
            title = this.skingameClass.isSelfCreateRoom ? `【跑得快】亲友圈房号：${this.skingameClass.TableID}` : `赶快加入"跑得快"`;
         }else{
              title = this.skingameClass.isSelfCreateRoom ? `【跑得快】房号：${this.skingameClass.TableID}` : `赶快加入"跑得快"`;
         }
        var context = this.skingameClass.isSelfCreateRoom ? this.getShareText() : `你的好友邀请你来加入"跑得快"！`;
        this.skingameClass.ShowShare(0, this.skingameClass.TableID, title, context);
    }
    public OnButtonCopy(){
           var title = this.skingameClass.isSelfCreateRoom ? `跑得快${this.skingameClass.TableID}` : `赶快加入"跑得快"`;
            title = title + this.getShareText();
            cc.log(title);
        this.skingameClass.CopyToClipboard(title);
    }

    private getShareText(){
        var gameCount = this.GetGameCount();
        var tableCostType = this.GetTableCostType();   
         var shareText = `玩法:${gameCount}局,${tableCostType},`;
         var CardNum = this.gamerule.gameModel + "张玩法,";
         var mustOut = "有牌必要,";
         var have2OutA ="";
         if(this.gamerule.mustOut == 1){
             mustOut = "可不要,";
             if(this.gamerule.have2OutA){
                 have2OutA = "有2必打A,";
             }
         }
         var spadesRedPeach3 = "";
         var firstMustOut = "";
         if(this.gamerule.spadesRedPeach3 == 1){
             spadesRedPeach3 = "红桃三,";
             if(this.gamerule.redPeach3MustOut){
                 firstMustOut = "红桃三必出,";
             }
         }else{
             spadesRedPeach3 = "黑桃三,";
             if(this.gamerule.spades3MustOut){
                 firstMustOut = "黑桃三必出,";
             }
         }

         var bomb = "";
         if(this.gamerule.bomb){
             bomb = "炸弹+10,";
         }
         var FZBP = "";
         if(this.gamerule.FZBP){
             FZBP = "放走包赔,";
         }
         var SZTW = "";
         if(this.gamerule.SZTW){
             FZBP = "三张拖尾,";
         }
         var showRemainNum = "";
         if(this.gamerule.showRemainNum){
             showRemainNum = "显示剩余张数,";
         }

         var zhuaNiao = "";
         if(this.gamerule.zhuaNiaoScore != -1){
             if(this.gamerule.zhuaNiaoScore = 1){
                 zhuaNiao = "抓鸟翻倍,";
             }else{
                 zhuaNiao = "抓鸟+" + this.gamerule.zhuaNiaoScore + "分,";
             }
         }

         var checkIP = "";
         if(this.gamerule.ifcansameip){
             checkIP = "同IP检测,";
         }

         var checkGps = "";
         if(this.gamerule.checkGps){
             checkIP = "GPS定位,";
         }
         
         var j = 0;
         for (var i = 0; i < this.gameInfo.PlayerCount; i++) {
             if (this.skinPlayerControl.skinPlayer[i].IsJoinGame()) {
                 j++;
             }
         }
         var text = shareText + CardNum + mustOut + have2OutA + spadesRedPeach3 + firstMustOut + bomb + FZBP + SZTW + showRemainNum + zhuaNiao + checkIP + checkGps +j+"缺"+(this.gameInfo.PlayerCount-j);
         return text;
    }

    /**
     * 设置按钮事件
     */
    public OnButtonAudio() {
        this.skingameClass.ShowSettingForm();
    }
    /**
     * 帮助按钮事件
     */
    public OnButtonHelp() {
        this.ShowGameHelp();
    }
    /**
     * 文本聊天按钮事件
     */
    public OnButtonChat() {
        this.skingameClass.showChat();
    }
    /**
     * 语音按钮事件
     */
    public OnButtonVoice() {
        this.skingameClass.StartRecord();
        if (this.skingameClass.AudioManager.IsRecording()) {
            this.ShowRecordVideo();
        }
    }
    /**
     * 语音按钮关闭事件
     */
    public OnVoiceStop() {
        if (this.skingameClass.AudioManager.IsRecording()) {
            this.skinButtonView.btn_voice.node.scale = 1;
            if (this.skinRecordVideo != undefined) {
                this.skinRecordVideo.Close();
            }
            this.skingameClass.StopRecord();
        }
    }
    /**
     * 积分板按钮事件
     */
    public OnButtonQueryScore() {
        PlayEffect(cc.url.raw("resources/Sound/open_panel.mp3"));
    }
    /**
     * 显示踢人按钮
     */
    public ShowTiren(chair:number){
        this.skinPlayerControl.skinPlayer[chair].ShowTiren();
    }
    /**
     * 隐藏踢人按钮
     */
    public HideTiren(chair:number){
        this.skinPlayerControl.skinPlayer[chair].HideTiren();
    }
    /**
     * 踢人按钮事件
     */
    public OnButtonTiren() {
        var state = this.skinPlayerControl.GetPlayerState();
        var count = 0;
        for (var i = 0; i < state.length; i++) {
            if (state[i] == 1)
                count++;
        }
        if (count > 0) {
          // this.ShowTiren(state);
        }
        else
            this.skingameClass.UiManager.ShowMsgBox("当前没有可以踢的玩家。");
    }
    /**
     * 踢出某玩家
     */
    public OnTiren(chair: number) {
        console.log("OnTiren:" + chair);
        var logicchair = this.skingameClass.GetServerChair(chair);
        var user = this.skingameClass.TablePlayer[logicchair];
        if (user != undefined && user != null)
            this.skingameClass.PleaseLeavePlayer(user.PlayerID);
    }
    /**
     * 开局前准备和清理桌面
     */ 
    public OnReadyAndClear(){
        this.selfSelectCardView.clearHandCard();
        this.skinPlayerControl.GameStartClear();
        this.OnButtonReady();
    }
    /**
     * 准备按钮事件
     */
    public OnButtonReady() {
        if(this.gameInfo.GetLastGameCount() == 0 || this.gameInfo.isDissolveTable){
            this.ShowTotalScore();
            return;
        }
        if (!this.CheckMoneyEnought()) {
            cc.log("-------------钱不够-----------")
            this.gameInfo.SetWaitPay(true);
            return;
        }
        this.skinButtonView.HideReady();
        if (this.gameInfo.isTrueReady ) {
            cc.log("-------------真的准备过了-----------")
            this.skingameClass.SendUserReady();
        }
        else {
            cc.log("--------往服务端发送准备-------")
            this.skingameClass.SendGameData(new M_PDK_GameMessage.CMD_C_Ready());
        }
    }

    //==================================== 按钮事件 开始 =======================================

    //==================================== 其他 开始 =======================================
    /**
     * 显示牌型特效动画
     */
    public playCardTypeAni(cardType:CardType,chair:number,pos:cc.Vec2,cardCount:number = 0){
        this.ani_CardType.playAni(cardType,chair,pos,cardCount);
    }

    /**
     * 隐藏按钮
     */
    private HideButton(value: number) {
        if (value == 0) {
            this.skinButtonView.HideRob();
        }
        else if (value == 1) {
            this.skinButtonView.HideBet();
            this.skinButtonView.HideRob();
        }
        else {
            this.skinButtonView.HideBet();
            this.skinButtonView.HideRob();
            this.skinButtonView.HideSelectCard();
        }
    }
    /**
     * 检查IP
     */
    private CheckUserIP() {
        if (this.skingameClass.isSelfCreateRoom && this.gameInfo.isTrueReady) {
            //检查IP
            var list = new Array(0);
            for (var i = 0; i < this.gameInfo.PlayerCount; i++) {
                if (this.skinPlayerControl.skinPlayer[i].IsJoinGame()) {
                    var contain = false;
                    for (var k = 0; k < list.length; k++) {
                        if (list[k].indexOf(i) > 0) {
                            contain = true;
                            break;
                        }
                    }
                    if (!contain) {
                        var list2 = new Array(0);
                        list2.push(i);
                        var iIP = this.skingameClass.TablePlayer[this.skingameClass.GetServerChair(i)].UserIP;
                        for (var j = i + 1; j < this.gameInfo.PlayerCount; j++) {
                            if (this.skinPlayerControl.skinPlayer[j].IsJoinGame()) {
                                var jIP = this.skingameClass.TablePlayer[this.skingameClass.GetServerChair(j)].UserIP;
                                if (iIP == jIP) {
                                    list2.push(j);
                                }
                            }
                        }
                        if (list2.length > 1)
                            list.push(list2);
                    }
                }
            }
            if (list.length > 0) {
                var tipMsg = "";
                for (var i = 0; i < list.length; i++) {
                    var list3: number[] = list[i];
                    for (var j = 0; j < list3.length; j++) {
                        tipMsg += `玩家:${this.skingameClass.TablePlayer[this.skingameClass.GetServerChair(list3[j])].NickName}`;
                        if (j != list3.length - 1)
                            tipMsg += ",";
                    }
                    tipMsg += "  IP相同";
                    if (i != list.length - 1)
                        tipMsg += "\n";
                }
                console.log("tipMsg:" + tipMsg);
                this.skingameClass.UiManager.ShowTip(tipMsg);
            }
        }
    }
     /**
     * 注册计时器
     */
    public RegTimer(timeflag: TimeFlag, onlyShow: boolean = false, value: number = 0, msg: string = "",cChair:number) {
        this.skinClock.RegTimer(timeflag, onlyShow, value, msg,cChair);
    }
    /**
     * 销毁计时器
     */
    public DestroyTimer() {
        this.skinClock.DestroyTimer();
    }
    /**
     * 计时器结束
     */
    public TimerOver(value: TimeFlag) {
        console.log("TimerOver:" + value);
        switch (value) {
            case TimeFlag.WaitStart: {
                //this.OnButtonExit();
                break;
            }
            case TimeFlag.Interval: {
                // this.OnButtonReady();
                break;
            }
        }
    }
    /**
     * 桌费
     */
    private TableCost() {
        if (this.skingameClass.IsCreateTable()) {
            if (this.tableInfo.tableCostType == TableCostType.TableCreatorPay) {
                if (this.gameInfo.isTrueReady || this.skingameClass.validata||(this.gameInfo.gameCount[0]%10==0)) {
                    this.skingameClass.validata = false;
                    return this.tableInfo.tableCostNum;
                }

            }
            if (this.tableInfo.tableCostType == TableCostType.AAPay) {
                if (this.gameInfo.isTrueReady || this.skingameClass.validata||(this.gameInfo.gameCount[0]%10==0)) {
                    cc.log("检查玩家桌费 AA制钻石" + this.gameInfo.gameCount[1]);
                    this.skingameClass.validata = false;
                    return this.gameInfo.gameCount[1];
                }
            }

            return 0;
        }
        return this.skingameClass.RoomClient.TableCost;
    }
    /**
     * 游戏准入金额
     */
    private JoinMoney() {
        if (this.skingameClass.IsCreateTable())
            return this.tableInfo.joinMoney * this.gameInfo.GetLastGameCount();
        else
            return this.skingameClass.RoomClient.BaseMoney * this.skingameClass.RoomClient.JoinMultiNum;
    }
    /**
     * 自己的余额是否够付桌费
     */
    private IsTableCostEnought() {
        if((this.tableInfo.tableCostType == TableCostType.TableCreatorPay)&&(this.tableInfo.tableCreator!=0)){
            return true;
        }
        if (this.skingameClass.UserBagEntity(this.skingameClass.RoomClient.TableCostMoneyType) >= this.TableCost())
            return true;
        else
            return false;
    }
    /**
     * 检查玩家余额
     */
    private CheckMoneyEnought() {
        if (this.tableInfo.roomType == RoomType.ScoreRoom) {
            if (!this.IsTableCostEnought())
                this.ShowNeedMoneyTip(1);
            else
                return true;
            return false;
        }
        if (this.skingameClass.RoomClient.TableCostMoneyType == this.tableInfo.moneyType) {
            if (this.tableInfo.selfScore < this.JoinMoney())
                this.ShowNeedMoneyTip(2);
            else
                return true;
            return false;
        }
        else {
            var needMoney = this.tableInfo.selfScore < this.JoinMoney();
            var needCost = !this.IsTableCostEnought();
            if (needMoney && needCost)
                this.ShowNeedMoneyTip(3);
            else if (needMoney)
                this.ShowNeedMoneyTip(2);
            else if (needCost)
                this.ShowNeedMoneyTip(1);
            else
                return true;
            return false;
        }
    }
    /**
     * 显示余额不足提示
     * 3:金币和房卡都不足，2:金币不足，3:房卡不足
     */
    private ShowNeedMoneyTip(type: number) {
        var str = "";
        var tableMoneyName = TranslateMoneyTypeName(this.skingameClass.RoomClient.CheckMoneyType);
        var tableCostName = TranslateMoneyTypeName(this.skingameClass.RoomClient.TableCostMoneyType);
        var tableMoney = this.JoinMoney();
        var tableCostNum = this.TableCost();
        if (type == 3)
            str = `您的账户的${tableMoneyName}和${tableCostName}不足,所需${tableMoneyName}${tableMoney}及${tableCostName}${tableCostNum},是否充值？`;
        else if (type == 2)
            str = `您的账户的${tableMoneyName}不足,所需${tableMoneyName}${tableMoney},是否充值？`;
        else if (type == 1)
            str = `您的账户的${tableCostName}不足,所需${tableCostName}${tableCostNum},是否充值？`;
        this.skingameClass.UiManager.ShowMsgBox(str, this, () => { this.skingameClass.showPay() })
    }
     /**
     * 显示玩家信息
     */
    public ShowPlayerInfo(chair: number) {
        let playerinfo = this.skingameClass.TablePlayer[this.skingameClass.GetServerChair(chair)];
        if (playerinfo != null) {
            let point = this.skinPlayerControl.GetPlayerInfoPoint(chair);
            M_PDKClass.Instance.showPlayerInfoForm(playerinfo,point,this.skingameClass.GetServerChair(chair));
            // ShowNodeView("PlayerInfo", this.skinPlayerInfo, (prefab) => {
            //     this.skinPlayerInfo = this.AddPrefab(prefab, "BJ_SkinPlayerInfo", 12);
            // }, () => {
            //     this.skinPlayerInfo.Show(chair, point, playerinfo.FaceID, playerinfo.PlayerID, playerinfo.NickName, playerinfo.UserIP, this.skingameClass.isSelfCreateRoom);
            // });
        }
    }
    /**
     * 显示录音界面
     */
    private ShowRecordVideo() {
        ShowNodeView("RecordVideo", this.skinRecordVideo, (prefab) => {
            this.skinRecordVideo = this.AddPrefab(prefab, "PDK_SkinRecordVideo", 13);
        }, () => {
            if (this.skingameClass.AudioManager.IsRecording())
                this.skinRecordVideo.Show();
            else
                this.skinRecordVideo.Close();
        });
    }

    /**
     * 显示游戏帮助
     */
    private ShowGameHelp() {

    }
    //==================================== 其他 结束 =======================================

    //==================================== 辅助 开始 =======================================
    /**
     * 显示聊天消息
     */
    private ShowCommunionView(chair: number, type: number, msg: string = "") {
        ShowNodeView("CommunionView", this.skinCommunionView, (prefab) => {
            this.skinCommunionView = this.AddPrefab(prefab, "PDK_SkinCommunionView", 4);
        }, () => {
            this.skinCommunionView.Show(chair, type, msg);
        });
    }

    /**
     * 获取总局数
     */
    public GetGameCount() {
        return this.gameInfo.GetAllGameCount();
    }

    
    /**
     * 获取桌费模式
     */
    public GetTableCostType() {
        switch (this.tableInfo.tableCostType) {
            case TableCostType.AAPay:
                return "AA制";
            case TableCostType.TableCreatorPay:
                return "房主付费";
            case TableCostType.GroupOwnerPay:
                return "圈主付费";
        }
        return "";
    }
    /**
     * 获取ID列表
     */
    public GetIDList(chairlist: number[]): number[] {
        var IDlist = new Array();
        for (var i = 0; i < chairlist.length; i++) {
            var playerinfo = this.skingameClass.TablePlayer[chairlist[i]];
            if (playerinfo != undefined && playerinfo != null)
                IDlist.push(playerinfo.PlayerID);
            else
                IDlist.push(0);
        }
        return IDlist;
    }
    /**
     * 获取头像列表
     */
    public GetNameList(chairlist: number[]): string[] {
        var namelist = new Array();
        for (var i = 0; i < chairlist.length; i++) {
            var playerinfo = this.skingameClass.TablePlayer[chairlist[i]];
            if (playerinfo != undefined && playerinfo != null)
                namelist.push(playerinfo.NickName);
            else
                namelist.push("");
        }
        return namelist;
    }
    /**
     * 获取头像列表
     */
    public GetFaceList(chairlist: number[]): string[] {
        var facelist = new Array();
        for (var i = 0; i < chairlist.length; i++) {
            var playerinfo = this.skingameClass.TablePlayer[chairlist[i]];
            if (playerinfo != undefined && playerinfo != null)
                facelist.push(playerinfo.FaceID);
            else
                facelist.push("");
        }
        return facelist;
    }
    /**
     * 获取牌资源
     */
    public GetCardsRes(value: number): cc.SpriteFrame {
        return this.getComponent<PokerCardsRes>(PokerCardsRes).GetCardsRes(value);
    }
    public GetSmallCardsRes(value: number): cc.SpriteFrame {
        return this.getComponent<PokerCardsRes>(PokerCardsRes).GetSmallCardsRes(value);
    }

    /**
     * 获取Gameinfo
     */
    public GetGameInfo():GameInfo{
        return this.gameInfo;
    }
    /**
     * 获取GameRule
     */
    public GetGameRule():GameRule{
        return this.gamerule;
    }
    /**
     * 获取scoreView
     */
    public GetScoreView():ScoreView{
        return this.scoreView;
    }
    /**
     * 获取tableinfo
     */
    public GetTableInfo():TableInfo{
        return this.tableInfo;
    }
    //==================================== 辅助 结束 =======================================

    //==================================== 计时器 开始 =======================================
    public TimePause() {
    }
    public TimeResume() {
    }
    //==================================== 计时器 结束 =======================================
}
    