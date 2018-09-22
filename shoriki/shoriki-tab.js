/**
 * タブ関係の処理
 */
function initTabs() { 
 // tab追加ボタン
 $("#sTree_addtab").click(function() {
  tabChange();
  addTab();
  setActiveTab($("#sTree_tab_area").children(".sTree_tab").length - 1);
  addProc($sTree, "free");
 });
 // 既存tab選択時
 $("#sTree_tab_area").on("click", ".sTree_tab", function() {
  if($(this).hasClass("active")) {
   return false;
  }
  tabChange(getTabIndex($(this)));
 });
 // 既存tabダブルクリック時、編集可にする
 $("#sTree_tab_area").on("dblclick", ".sTree_tab", function() {
  $(this).attr("contenteditable", true);
  $(this).focus();
    // Rangeオブジェクトの取得
    var range = document.createRange();
    // 範囲の指定
    range.selectNodeContents(this);
  　// Selectionオブジェクトを返す。ユーザが選択した範囲が格納されている
    var selection = window.getSelection();
    // 選択をすべてクリア
    selection.removeAllRanges();
  　// 新規の範囲を選択に指定
    selection.addRange(range);
 });
 // タブカーソルアウト時、編集不可にする
 $("#sTree_tab_area").on("blur", ".sTree_tab", function() {
  if($(this).text() === "") {
   $(this).addClass("error");
   $(this).focus();
   $(this).select();
   return;
  } else {
   $(this).removeClass("error");
  }
  $(this).attr("contenteditable", false);
 });
 // タブ右クリックメニュー
 $("#sTree_tab_area").on("contextmenu", ".sTree_tab", function() {
  tabChange(getTabIndex($(this)));
  $selectedTab = $(this);
  $("#tabMenu").removeClass("hidden");
  $("#tabMenu").position({
   my: "left-2 top-2",
         of: event,
         collision: "fit"
  });
  return false;
 });
 // 右クリックメニューを消す
 $("#tabMenu").hover(
  function() {
   // hover時は特に何もしない
  },
  function() {
   // mouseleaveで非表示にする
   $(this).addClass("hidden");
  }
 );
 // タブ右クリックメニュー押下時
 $("#tabMenu").on("click", "li", function() {
  $("#tabMenu").addClass("hidden");
  switch($(this).text()) {
  case "編集":
   $selectedTab.attr("contenteditable", true);
   // Rangeオブジェクトの取得
   var range = document.createRange();
   // 範囲の指定
   range.selectNodeContents($selectedTab[0]);
   // Selectionオブジェクトを返す。ユーザが選択した範囲が格納されている
   var selection = window.getSelection();
   // 選択をすべてクリア
   selection.removeAllRanges();
   // 新規の範囲を選択に指定
   selection.addRange(range);
   break;
  case "削除":   
   $(setTreeData(getActiveIndex()));
   if(getTabCount() == 1) {
    alert("これ以上削除できません。");
    return false;
   }
   removeTab($selectedTab);
   setActiveTab(0);
   $sTree.children("ul").remove();
   dispNode(afterData.layoutList[0]);
   break;
  default:
   break;
  }
 });
}
/**
 * タブを新規追加する
 * @param name タブの名前(イベントID) 指定がないときは"E"+index
 * @returns
 */
function addTab(name) {
 if(name === undefined) {
  if(DOCUMENT_TYPE === "BATCH"){
   name = "";
  }else{
   name = "E" + ("00" + getTabCount()).slice( -2 );
  } 
 }
 $("#sTree_addtab").before("<li class='sTree_tab'>" + name + "</li>");
 $("#sTree_tab_area").sortable({
  "axis": "x",
  "items": ">li",
  "containment": "#sTree_tab_area ",
  "start": function(event, ui) {
   if(!ui.item.hasClass("active")) {
    tabChange(getTabIndex(ui.item));
   } else {
    // 現在のtreeデータを保存
    setTreeData(getActiveIndex());
   }
  },
  "update": function(event, ui) {
   // afterDataを複製
   let afterDataBk = JSON.parse(JSON.stringify(afterData));
   // changeDataを複製
   let changeDataBk = JSON.parse(JSON.stringify(changeData));
   // 元のafterDataの中身を空に
   afterData.layoutList = [];
   // 現在の画面のタブ順に合わせて、データを並べ直す
   // (複製したafterDataを取得)
   $("#sTree_tab_area").children("li").each(function(i){
    let tabname = $(this).text();
    for(let j=0; j < afterDataBk.layoutList.length;j++){
     if(afterDataBk.layoutList[j].イベントID == tabname){
      afterData.layoutList.push(afterDataBk.layoutList[j]);
      // changeDataのインデックスを正しい値に変更する
      for(let cdidx = 0;cdidx < changeDataBk.changed.length;cdidx++){
       // 画面のインデックス( i ) = 変更後のインデックス
       // 複製したafterDataのインデックス( j ) =変更前のインデックス
       if(changeDataBk.changed[cdidx].layout == j){
        changeData.changed[cdidx].layout = i;
       }
      }
     }
    }
   });
   // sTreeを空にして再描画
   tabChange(getTabIndex(ui.item));
  }
 });
}
/**
 * tabを削除してafterDataからデータを削除する
 * @param $tab
 * @returns
 */
function removeTab($tab) {
 var idx = getTabIndex($tab);
 // UNDOできるように、消す前のデータをUNDOにためておく
 let changeDataList = getChangeData();
 var layout = {
   "シート": idx,
   "イベントID": $(".sTree_tab:eq(" + idx + ")").text(),
   "処理": afterData.layoutList[idx].処理,
   "変更点":changeDataList,
 };
 undoData.push(layout);
 afterData.layoutList.splice(idx, 1);
 $("#sTree_tab_area .sTree_tab:eq(" + idx + ")").remove();
}
function removeAllTab() {
 $("#sTree_tab_area .sTree_tab").remove();
 // バッチ内部処理記の場合は出力編集仕様のタブも消す
 if(path.split("/")[0] == BATCHNAIBUSHORIKI){
  $(".syuturyoku_tab").remove();
 }
}
/**
 * アクティブなタブのindexを取得する
 */
function getActiveIndex() {
 if(DOCUMENT_TYPE === "BATCH"){
  return 0;
 }else{
  return $(".sTree_tab").index($(".sTree_tab.active"));
 }
}
/**
 * activeタブを設定する
 * @param idx
 * @returns
 */
function setActiveTab(idx) {
 $("#sTree_tab_area .sTree_tab").removeClass("active");
 $("#sTree_tab_area .sTree_tab:eq(" + idx + ")").addClass("active");
}
/**
 * 指定したタブのindexを返す
 * @param $tab jQueryオブジェクト
 * @returns index 見つからないときは-1
 */
function getTabIndex($tab) {
 return $("#sTree_tab_area:not(.ui-sortable-placeholder)").children(".sTree_tab").index($tab);
}
/**
 * タブの数を返す
 * @returns
 */
function getTabCount() {
 return $("#sTree_tab_area").children(".sTree_tab").length;
}
/**
 * タブの変更
 * @param idx
 * @returns
 */
function tabChange(idx) {
 // 表示が終わっている場合のみデータを保管する
 if(dispProcPromiseList.length === 0){
  // タブ切り替えるときに代入処理の空のデータをnoneに置き換える
  emptyAssignCheck();
  //切り替える前に変更点情報を保管
  setChangeData();
  setTreeData(getActiveIndex());
 }else{
  // 中途半端に表示してしまった場合にchangeDataが破損するのでバックアップから戻し
  if(changeDataBk !== undefined &&  changeData !== undefined){
   changeData.changed = changeDataBk;
  }
 }
 dispProcPromiseList = [];
 $sTree.children("ul").remove();
 if(idx !== undefined) {
  setActiveTab(idx);
  dispNode(afterData.layoutList[idx]);
 } 
}
function initNaibushorikiTab(){
 $("#batchNaibu_tab_area").on("click", "#tab_gaiyou", function() {
  if(! $(this).hasClass("active")){
   clearNaibuShorikiView($(this));
   $("#batchNaibu_tab_area").children(".active").removeClass("active");
   $("#gaiyou_area").show();
   $(this).addClass("active");
  }
 });
 $("#batchNaibu_tab_area").on("click", "#tab_shoriki", function() {
  if(! $(this).hasClass("active")){
   clearNaibuShorikiView($(this));
   $("#batchNaibu_tab_area").children(".active").removeClass("active");
   $("#sTree").show();
   $(this).addClass("active");
  }
 });
 $("#batchNaibu_tab_area").on("click", "#tab_syuturyoku", function() {
  if(! $(this).hasClass("active")){
   clearNaibuShorikiView($(this));
   $("#batchNaibu_tab_area").children(".active").removeClass("active");
   $("#syuturyoku_area").show();
   syuturyokuHot.render();
   $(this).addClass("active");
  }
 });
 $("#batchNaibu_tab_area").on("click", "#tab_subProgram", function() {
  if(! $(this).hasClass("active")){
   clearNaibuShorikiView($(this));
   $("#batchNaibu_tab_area").children(".active").removeClass("active");
   $("#subProgram_area").show();
   $(this).addClass("active");
  }
 });
 $("#batchNaibu_tab_area").on("click", "#tab_workArea", function() {
  if(! $(this).hasClass("active")){
   clearNaibuShorikiView($(this));
   $("#batchNaibu_tab_area").children(".active").removeClass("active");
   $("#workarea_area").show();
   $(this).addClass("active");
  }
 });
}
/**
 * 表示されている内容を消去する
 * 
 * @returns
 */
function clearNaibuShorikiView($this){
 $("#gaiyou_area").hide();
 $("#sTree").hide();
 $("#syuturyoku_area").hide();
 $("#subProgram_area").hide();
 $("#workarea_area").hide();
}
function seachTab(name){
 let idx = -1;
 $("#sTree_tab_area").children(".sTree_tab").each(function(i){
  if($(this).text() == name){
   idx = i;
  }
 });
 return idx;
}
