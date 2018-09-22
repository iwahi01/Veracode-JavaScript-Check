/**
 * 処理記が他の成果物情報を使用するためのメソッド群
 */
function initShorikiResource(){
 // IPO表示機能の初期化
 initIPO();
 // 用語マスタの取得
 getDictionarymaster();
 // コード値マスタの取得
 getCodemaster();
 //共通機能一覧のデータを取得
 initKyotsuListData();
 // メッセージ一覧(全体版)のデータを取得
 initMessageListData();
}
/**
 * IPO表示機能の初期化
 * @returns
 */
function initIPO(){
 // IPO表示
 $("#resource_ipo_btn").click(function() {
  var input = [];
  var output = [];
  $(".assign_target").each(function() {
   output.push($(this).val());
  });
  $(".assign_from").each(function() {
   input.push($(this).val());
  });
  // 重複削除
  var inplist = input.filter(function(x, i, self) {
   return self.indexOf(x) === i;
  });
  var outlist = output.filter(function(x, i, self) {
   return self.indexOf(x) === i;
  });
  $(".resource_ipo_in").children(".content").remove();
  $(".resource_ipo_out").children(".content").remove();
  for (let inp of inplist) {
   insertIpo(inp, ".resource_ipo_in");
  }
  for (let out of outlist) {
   insertIpo(out, ".resource_ipo_out");
  }
  disp_resource($("#resource_ipo"));
 });
}
/**
 * IPO表示に要素を追加する
 * 
 * @param inp
 * @param inout
 * @returns
 */
function insertIpo(inp, inout) {
 if (inp.startsWith("db")) {
  $("#resource_ipo_db " + inout).append("<div class='content'>" + inp +
   "</div>");
 }
 if (inp.startsWith("file")) {
  $("#resource_ipo_file " + inout).append("<div class='content'>" + inp +
   "</div>");
 }
 if (inp.startsWith("画面")) {
  $("#resource_ipo_gamen " + inout).append("<div class='content'>" + inp +
   "</div>");
 }
 if (inp.startsWith("帳票")) {
  $("#resource_ipo_tyohyo " + inout).append("<div class='content'>" + inp +
   "</div>");
 }
 if (inp.startsWith("電文")) {
  $("#resource_ipo_denbun " + inout).append("<div class='content'>" + inp +
   "</div>");
 }
 if (inp.startsWith("データオブジェクト")) {
  $("#resource_ipo_bdto " + inout).append("<div class='content'>" + inp +
   "</div>");
 }
}
/**
 * 処理記の選択用エリアを表示する
 *  (インポート機能)
 * 
 * @param $target
 * @returns
 */
function disp_shoriki($target) {
 $target.removeClass("hidden");
}
/**
 * 処理記の一覧を取得する 
 * (インポート機能)
 * 
 * @returns
 */
function getShoriki() {
 let uri = '/Radget/design/resource/' + owner + '/' + repo + '/' + branch +
  '/' + SHORIKI;
 ajaxCall(uri, "GET", null, function(res, status, jqXHR) {
  $("#shoriki_choice").children("ul").empty();
  for (let file of res.tree) {
   if (file.path.endsWith(".xml")) {
    $("#shoriki_choice").children("ul").append("<li class='clickable'>" +
     file.path.replace(".xml", "") + "</li>");
   }
  }
  activeResource = SHORIKI;
  disp_shoriki($("#shoriki_choice"));
 });
}
/**
 * 処理記のデータを取得する
 *  (インポート機能)
 * 
 * @param kind
 * @param resName
 * @returns
 */
function getShorikiData(kind, resName) {
 var uri = '/Radget/design/data/' + owner + '/' + repo + '/' + branch + '/' +
  kind + "/" + resName + ".xml";
 importDataPath = kind + "/" + resName + ".xml";
 ajaxCall(uri, "GET", null, function(res, status, jqXHR){
  // インポートしたデータに対して外部設計⇒内部設計の変換をかける
  for(let layout of res.layoutList){
   for(proc of layout.処理){
    replaceProc(proc);
   }
  }
  // 2シート目以降の画像データをあらかじめ取得
  for(let i = 1;i < res.layoutList.length;i++){
   dispNode(res.layoutList[i]);
  }
  $("#sTree_tab_area").children(".sTree_tab").each(function(){
   removeTab($(this));
  });
  //
  $sTree.children("ul").remove();
  dispData(res, status, jqXHR);
  importPath = null;
 });
 $("#shoriki_choice").addClass("hidden");
}
/**
 * 外部設計⇒内部設計で置き換えが必要な内容を置き換える
 * (子処理があれば再帰呼び出し)
 * @param proc
 * @returns
 */
function replaceProc(proc){
 if(proc.種類 === "共通機能呼び出し"){
  proc.種類 = "メソッド呼び出し";
 }
 if(proc.子処理 !== undefined){
  for(let p of proc.子処理){
   replaceProc(p);
  }
 }
}
/**
 * 共通機能一覧のデータを取得 
 * (共通機能呼び出しノードで使用)
 * 
 * @returns
 */
function initKyotsuListData(){
 var uri = '/Radget/design/data/' + owner + '/' + repo + '/' + branch + "/" + KYOTSULIST + ".xml";
 ajaxCall(uri, "GET", null, function(res, status, jqXHR) {
  // グローバル変数にストアしておく
  kyotsuKinouListData = res;
  // 共通機能IDのリストを作る
  for(let layout of kyotsuKinouListData.layoutList){
   for(let row of layout.rows){
    if(row.共通機能ID !== undefined && row.共通機能ID !== ""){
     kyotsuKinouIDList.push(row.共通機能ID);
    }
   }
  } 
 },function(){});
 // 共通機能IDの入力箇所が変更されたら、
 // 入力内容から該当の共通機能利用概要のパスを特定し、データ取得
 $sTree.on("change", ".input_common", function() {
  inputCommonSetBalloon($(this));  
 });
}
/**
 * メッセージ一覧のデータを取得
 *  (メッセージスノードで使用)
 * 
 * @returns
 */
function initMessageListData(){
 var uri = '/Radget/design/data/' + owner + '/' + repo + '/' + branch + "/" + MESSAGELIST + ".xml";
 ajaxCall(uri, "GET", null, function(res, status, jqXHR) {
  messageListData = res;
   for(let layout of res.layoutList){
    for(let row of layout.rows){
     if(row.メッセージID !== undefined && row.メッセージID !== ""){
      messageIDList.push(row.メッセージID);
     } 
    }
   }  
 },function(){});
 // 共通機能IDの入力箇所が変更されたら、
 // 入力内容から該当の共通機能利用概要のパスを特定し、データ取得
 $sTree.on("change", ".messageID", function() {
  inputMessageIdSetBalloon($(this));  
 });
}
/**
 * コード値マスタを取得
 * @returns
 */
function getCodemaster(){
 let uri = '/Radget/master/code';
 ajaxCall(uri, "GET", null, function(res, status, jqXHR){
  for(let layout of res.layoutList){
   if(layout.sysName === repo){
    codeMaster = layout.codes;
    for(let code of layout.codes){
     resourceName.push("code." + code.nameJP + "." + code.codeValueNameJP);
    }
   }
  }
 });
}
/**
 * 共通機能利用概要の引数の情報をノードにセット
 * @param $this
 * @param res
 * @returns
 */
function setKyotsuKinouInfo($this,res){
 let argLength = res.rowParas.length;
 let $procContent = $this.parent().parent();
 let $procArgs = $procContent.children(".argument_content").children(".proc_args");
 if(argLength >  $procArgs.children("li").length){
  let num = argLength - $procArgs.children("li").length;
  for(let i = 0;i<num;i++){
   addArgument($procContent.parent());
  }
 }else if(argLength <  $procArgs.children("li").length){
  for(let i = $procArgs.children("li").length - 1;i >= argLength;i--){
   $procArgs.children("li")[i].remove();
  }
 }
 let $argrows = $procArgs.children("li").children(".argument_row");
 for(let i = 0; i < res.rowParas.length;i++){
  let $arg = $($argrows.get(i));
  $arg.children(".arg_name").val(res.rowParas[i].引数);
  autoSize($arg.children(".arg_name"));
  $arg.children(".arg_type").val(res.rowParas[i].引数_属性);
  autoSize($arg.children(".arg_type"));
 } 
}
/**
 * データアクセスの情報をノードにセット
 * @param $this
 * @param res
 * @returns
 */
function setDataAccessInfo($this,layout){
 let argLength = layout.入力情報.length;
 let $procContent = $this.parent();
 let $procArgs = $procContent.children(".argument_content").children(".proc_args");
 if(argLength >  $procArgs.children("li").length){
  let num = argLength - $procArgs.children("li").length;
  for(let i = 0;i<num;i++){
   addArgument($procContent.parent());
  }
 }else if(argLength <  $procArgs.children("li").length){
  for(let i = $procArgs.children("li").length - 1;i >= argLength;i--){
   $procArgs.children("li")[i].remove();
  }
 }
 let $argrows = $procArgs.children("li").children(".argument_row");
 for(let i = 0; i < layout.入力情報.length;i++){
  let $arg = $($argrows.get(i));
  $arg.children(".arg_name").val(layout.入力情報[i].項目名);
  autoSize($arg.children(".arg_name"));
 } 
}
