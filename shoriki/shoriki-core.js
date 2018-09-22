/**
 * 文書の読み込み・表示・保存などの
 * 基幹機能
 */
/**
 * 設計データをグローバル変数に格納する
 */
function setAfterData() {
 // 保存する前に代入処理の空のデータをnoneに置き換える
 emptyAssignCheck();
 // 処理情報を取得
 setTreeData(getActiveIndex());
 //　リソース情報を取得
 setResourceData();
 // 項目移送情報を取得
 setEditSpecData();
 afterData.sha = sha;
 afterData.ID = $("#ID").val();
 afterData.名称 = $("#名称").val();
 afterData.システムID = $("#システムID").val();
 if (path.split("/")[0] == NAIBUSHORIKI) {
  afterData.クラス修飾子 = $("#クラス修飾子").val();
  afterData.継承 = $("#継承").val();
  afterData.インタフェース = $("#インタフェース").val();
 }
 // 自動採番用のボタンがあれば状態を保存
 if ($("#autoNumSwitch")[0]) {
  // 文書のパラメータを取得
  if ($("#autoNumSwitch").hasClass("switch-ON")) {
   afterData.自動採番 = "ON";
  } else {
   afterData.自動採番 = "OFF";
  }
 }
 // 添付画像に関するチェック
 for (let idx = 0; idx < storedFiledata.length; idx++) {
  // 添付ファイルが通常の添付ファイルであれば以降のチェックを飛ばす
  if (!storedFiledata[idx].name.startsWith("pasteImage-")) {
   continue;
  }
  let found = false;
  // 添付保存画像が処理記の中にあるか確認する
  for (let layout of afterData.layoutList) {
   for (let proc of layout.処理) {
    if (proc.画像 !== undefined && proc.画像.length > 0) {
     for (let pic of proc.画像) {
      if (storedFiledata[idx].name == pic.src) {
       found = true;
      } }
    } } }
  // 見つからなかった場合、undoで添付ファイルが消えてしまっている
  if (!found) {
   storedFiledata.splice(idx, 1);
   // 削除によりずれてくるidxを補正
   idx = idx - 1;
  }
 }
 // 削除画像に関するチェック
 for (let idx = 0; idx < deleteTargetFiles.length; idx++) {
  let found = false;
  // 添付保存画像が処理記の中にあるか確認する
  for (let layout of afterData.layoutList) {
   for (let proc of layout.処理) {
    if (proc.画像 !== undefined && proc.画像.length > 0) {
     for (let pic of proc.画像) {
      if (deleteTargetFiles[idx] == pic.src) {
       found = true;
      } }
    } } }
  // 見つかった場合、undoで削除が取り消されている
  if (found) {
   deleteTargetFiles.splice(idx, 1);
   // 削除によりずれてくるidxを補正
   idx = idx - 1;
  }
 }
 if(path.split("/")[0] == BATCHNAIBUSHORIKI){
  getBatchNaibuGaiyou();
  getBatchNaibuSyuturyoku();
  getBatchNaibuSubPgm();
  getBatchNaibuWorkArea();
 }
}
/**
 * 登録したリソース情報を保存する
 */
function setResourceData() {
 var resList = {};
 $("#resource_db").children(".resourceList").children("li").each(function() {
  if (!resList.hasOwnProperty("db")) {
   resList.db = [];
  }
  resList.db.push($(this).attr("path"));
 });
 $("#resource_file").children(".resourceList").children("li").each(function() {
  let resourceRow = {};
  if (!resList.hasOwnProperty("file")) {
   resList.file = [];
  }
  resourceRow.レイアウトID = $(this).attr("path");
  resourceRow.ファイルID = $(this).children("a").children(".resource_name").text();
  resourceRow.ファイル和名 = $(this).children("a").children(".resource_nameJp").text();
  resList.file.push(resourceRow);
 });
 $("#resource_gamen").children(".resourceList").children("li").each(function() {
  if (!resList.hasOwnProperty("画面")) {
   resList.画面 = [];
  }
  resList.画面.push($(this).attr("path"));
 });
 $("#resource_tyohyo").children(".resourceList").children("li").each(function() {
  if (!resList.hasOwnProperty("帳票")) {
   resList.帳票 = [];
  }
  resList.帳票.push($(this).attr("path"));
 });
 $("#resource_bdto").children(".resourceList").children("li").each(function() {
  if (!resList.hasOwnProperty("BDTO")) {
   resList.BDTO = [];
  }
  resList.BDTO.push($(this).attr("path"));
 });
 $("#resource_denbun").children(".resourceList").children("li").each(function() {
  if (!resList.hasOwnProperty("電文")) {
   resList.電文 = [];
  }
  resList.電文.push($(this).attr("path"));
 });
 $("#resource_dao").children(".resourceList").children("li").each(function() {
  if (!resList.hasOwnProperty("データアクセス")) {
   resList.データアクセス = [];
  }
  resList.データアクセス.push($(this).attr("path"));
 });
 $("#resource_naibushoriki").children(".resourceList").children("li").each(function() {
  if (!resList.hasOwnProperty("内部処理記")) {
   resList.内部処理記 = [];
  }
  resList.内部処理記.push($(this).attr("path"));
 });
 for (let res in resList) {
  resList[res].sort();
 }
 afterData.リソース = resList;
}
/**
 * 取得した設計データを画面に表示する
 */
var dispData = function(res) {
 // lastSavePathに自文書のpathが入っているか
 let shorikiSave = localStorage.getItem('lastSavePath');
 // lastSavePathをクリアする
 localStorage.setItem('lastSavePath',"");
 if(path === shorikiSave) {
  // 自動保存データのほうにはノードの開閉情報があるので、これを取得
  let evacuationData = JSON.parse(localStorage.getItem('evacuationData'));
  // 一応パスの確認や保存時刻の確認(ブックマークとかで遷移されてきておかしな挙動しないように)
  if(path === evacuationData.path){
   //　時刻の差を取り、差が30秒以内であることを確認する
   // 保存時刻のDate
   let msec = Date.parse(evacuationData.time);
   let savetime = new Date(msec);
   // 現在時刻のDate
   let nowtime = new Date();
   // 差分を求め、30秒以内か判定
   let sabun = nowtime.getTime() - savetime.getTime();
   let thirtySec = 1000 * 30;
   if(sabun <= thirtySec){
    // resのlayout情報を自動保存データで置き換える
    res.layoutList = evacuationData.data.layoutList;
    console.log("自動退避データから開閉情報の取得");
   }
  }
 }
 // tabを初期化
 removeAllTab()
 // treeの初期化
 $sTree.children("ul").remove();
 beforeData = res;
 afterData = JSON.parse(JSON.stringify(beforeData));
 if (afterData === "") {
  afterData = {
   "layoutList" : []
  };
 }
 if (afterData.layoutList === undefined) {
  afterData.layoutList = [];
 }
 // ヘッダと隠し項目の設定
 $("#ID").val(res.ID);
 $("#名称").val(res.名称);
 $("#システムID").val(res.システムID);
 if (path.split("/")[0] == NAIBUSHORIKI) {
  $("#クラス修飾子").val(res.クラス修飾子);
  $("#継承").val(res.継承);
  $("#インタフェース").val(res.インタフェース);
 }
 // 文書パラメータの設定
 if (res.自動採番 === "OFF") {
  $("#autoNumSwitch").removeClass("switch-ON");
  $("#autoNumSwitch").text("OFF");
 }
 // 1ページ目をアクティブにする
 if(_.isEmpty(page)) {
  var idx = 0;
 } else {
  var idx = page;
 }
 if (res.sha !== undefined) {
  // インポート機能実行時の場合、shaを取得しない
  if (importDataPath === null) {
   // 保存のためにshaを保管
   sha = res.sha;
  }
  if (res.layoutList !== undefined) {
   // sTreeの表示処理
   dispNode(res.layoutList[idx]);
   dispResource(res.リソース);
   // tabの生成
   for (var layout of res.layoutList) {
    addTab(layout.イベントID); }
  } else {
   addProc($sTree, "free");
   addTab();
  }
  // 添付ファイル用初期化処理
  getAttachFileInfo();
  // linkの表示処理
  dispLinks();
 } else {
  addProc($sTree, "free");
  addTab();
 }
 // 1ページ目をアクティブにする
 setActiveTab(idx);
 if(!_.isEmpty(scroll)) {
  $("#sTree").scrollTop(scroll);
 }
 if (path.split("/")[0] == NAIBUSHORIKI) {
  // オンライン内部処理記だったらそちらの初期化も呼ぶ
  setupMethodDataList(res);
 }
 // WK項目の入力アシストを設定する
 initProcWorkAssist();
 // 編集仕様情報を表示
 dispEditSpecData();
 // 自動採番ボタンの前回の状態を確認
 if (afterData.自動採番 == "ON") {
  $("#autoNumSwitch").addClass("switch-ON");
  $(".proc_num").prop("disabled", true);
  $(".proc_num").removeClass("clickable");
  $(this).text("ON");
 } else if (afterData.自動採番 == "OFF") {
  $("#autoNumSwitch").removeClass("switch-ON");
  $(".proc_num").prop("disabled", false);
  $(".proc_num").addClass("clickable");
  $(this).text("OFF");
 }
 if(path.split("/")[0] == BATCHNAIBUSHORIKI){
  dispBatchNaibuGaiyou();
  dispBatchNaibuSyuturyoku();
  dispBatchNaibuSubPgm();
  dispBatchNaibuWorkArea();
 }
};
/**
 * リソースの初期表示
 * 
 * @param resources
 * @returns
 */
function dispResource(resources) {
 let resFileID;
 let resNameJp;
 // リソースエリアの設定
 for (let arts in resources) {
  var kind = casualToFormal(arts);
  for (let art of resources[arts]) {
   if (kind === FILE) {
    resFileID = art.ファイルID;
    resNameJp = art.ファイル和名
    art = art.レイアウトID;
   }
   getItems(kind, art, resFileID, resNameJp); }
 }
}
function downloadFile() {
 var uri = makeURI("design/excel");
 location.href = encodeURI(uri);
}
