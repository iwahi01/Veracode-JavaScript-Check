/**
 *　undo処理用のもの
 */
observeFunc = function (MutationRecords, MutationObserver) {
 if(dispProcPromiseList.length === 0){
  storeUndoData();
 }
};
/** DOM監視用オブジェクト */
shorikiObserver = new MutationObserver(observeFunc);
/**  
 * 監視を開始する
 */
function startObserve(){
 shorikiObserver.observe(
  $sTree.get(0), 
 {
  childList: true, 
  attribute: false,
//  attributeFilter: ['value'],
  subtree: true
 }); 
}
var currProcData = null;
/**
 * undoロジック
 * observerの使用に変更
 * 添付・undo時に画像の制御はしないよう変更
 * (保存時に添付データの追加・削除のチェック処理を入れるようにして対応)
 * @returns
 */
function storeUndoData(){
 if(dispProcPromiseList.length !== 0){
  return;
 }
 // 現状必要ないので削除（ノードの描画中はUNDO蓄積が動かない）
 // let nowTime = +new Date();
// if(nowTime - lastUndoStoreTime < 300){
//  console.log("前回UNDO蓄積から0.3秒以内 undo貯めずにskip");
//  return;
// }
 lastUndoStoreTime = +new Date();
 var procList = [];
 $sTree.children("ul").children("li").children(".node").each(function() {
  procList.push(getProcData($(this)));
 });
 let changeDataList = getChangeData();
 var layout = {
   "シート": getActiveIndex(),
   "イベントID": $(".sTree_tab:eq(" + getActiveIndex() + ")").text(),
   "処理": procList,
   "変更点":changeDataList,
 };
 if(JSON.stringify(currProcData) === JSON.stringify(layout)){
  console.log("ダブりデータなのでundo貯めずにskip");
  return;
 }
 if(currProcData !== null){
  undoData.push(currProcData); 
 }else{
  undoData.push(layout);
 }
 console.log("undoデータ蓄積");
 currProcData = JSON.parse(JSON.stringify(layout));
}
/**
 * Undo処理
 * @returns
 */
function undo(){
 //監視停止
 shorikiObserver.disconnect();
 var procList = [];
 $sTree.children("ul").children("li").children(".node").each(function() {
  procList.push(getProcData($(this)));
 });
 if(undoData.length <= 0){
  alert("これ以上undoできません。");
  startObserve();
  return;
 }
 let dispdata = undoData.pop();
 let tabIdx = seachTab(dispdata.イベントID);
 if(getActiveIndex() !== tabIdx){
  //シート切り替わるときにデータを保存しておくセット
  setTreeData(getActiveIndex());
 }
 if(tabIdx == -1){
  addTab(dispdata.イベントID);
  tabIdx = getTabCount()-1;
 }
 setActiveTab(tabIdx);
 currProcData = JSON.parse(JSON.stringify(dispdata));
 $sTree.children("ul").remove();
 dispNode(dispdata);
 dispChangeData(dispdata.変更点);
// //監視再開
// startObserve();
}
