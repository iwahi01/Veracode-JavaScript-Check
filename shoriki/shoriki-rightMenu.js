/**
 * 処理記の右側メニューに関する処理
 */
/**
 * 右側メニューのボタンの処理（ノード追加）
 * 
 */
function initNodeAreaFunc() {
 // 全てのノード追加ボタンをドラッグ可能にする
 $(".nodeadd_btn").draggable({
  scroll: false,
  zIndex: 3000,
  helper: "clone",
  connectToSortable: false,
  start: function() { 
   shorikiObserver.disconnect();
  }
 });
 // 自由記述ボタン押下時の処理
 $("#nodeadd_free").click(function() {
  addProcBtnClicked( "free");
 });
 // 代入
 $("#nodeadd_assign").click(function() {
  addProcBtnClicked( "assign");
 });
 // リンク
 $("#nodeadd_link").click(function() {
  addProcBtnClicked( "link");
 });
 // データアクセス
 $("#nodeadd_dao").click(function() {
  addProcBtnClicked( "dao");
 });
 // 繰り返し
 $("#nodeadd_for").click(function() {
  addProcBtnClicked( "for");
 });
 // 条件分岐
 $("#nodeadd_fork").click(function() {
  addProcBtnClicked( "fork");
 });
 // メッセージ
 $("#nodeadd_message").click(function() {
  addProcBtnClicked( "message");
 });
 // 以下、内部設計用ノードの記述
 // メソッド
 $("#nodeadd_method").click(function() {
  addProcBtnClicked("method");
 });
 // メソッド呼び出し
 $("#nodeadd_call").click(function() {
  addProcBtnClicked("call");
 });
 // try
 $("#nodeadd_try").click(function() {
  addProcBtnClicked("try");
 });
 // catch
 $("#nodeadd_catch").click(function() {
  addProcBtnClicked("catch");
 });
 // finally
 $("#nodeadd_finally").click(function() {
  addProcBtnClicked("finally");
 });
 // ディシジョン
 $("#nodeadd_decision").click(function() {
  addProcBtnClicked( "decision");
 });
 // 共通機能呼び出し
 $("#nodeadd_callcommon").click(function() {
  addProcBtnClicked("callcommon");
 });
 // ファイル読み込み
 $("#nodeadd_readfile").click(function() {
  addProcBtnClicked("readfile");
 });
 // ファイル読み込み
 $("#nodeadd_writefile").click(function() {
  addProcBtnClicked("writefile");
 });
 // アンロード
 $("#nodeadd_unload").click(function() {
  addProcBtnClicked("unload");
 });
 // 概要
 $("#nodeadd_outline").click(function() {
  addProcBtnClicked("outline");
 });
 // マッチング
 $("#nodeadd_matching").click(function() {
  addProcBtnClicked("matching");
 });
 // ソート
 $("#nodeadd_sort").click(function() {
  addProcBtnClicked("sort");
 });
 // HULFT
 $("#nodeadd_hulft").click(function() {
  addProcBtnClicked("hulft");
 });
 // 要求分析票
 $("#nodeadd_youkyu").click(function() {
  addProcBtnClicked("youkyu");
 });
 // 関数
 $("#nodeadd_func").click(function() {
  addProcBtnClicked("func");
 });
 // 関数呼び出し
 $("#nodeadd_callfunc").click(function() {
  addProcBtnClicked("callfunc");
 });
 // 日本語マクロ
 $("#nodeadd_macro").click(function() {
  addProcBtnClicked("macro");
 });
 // DA呼び出し
 $("#nodeadd_callda").click(function() {
  addProcBtnClicked("callda");
 });
}
/**
 * 右側メニュー　文書操作の箇所の初期化
 * @returns
 */
function initDocOpe(){
 // 初期処理ではIPOエリア隠す
 $(".ipo_in").hide();
 $(".ipo_out").hide();
 // IPO表示ボタン
 $("#ipoViewSwitch").click(function(){
  $(this).toggleClass("switch-ON");
  if($(this).hasClass("switch-ON")){
   $(this).text("ON");
   $(".ipo_in").show();
   $(".ipo_out").show();
  }else{
   $(this).text("OFF");
   $(".ipo_in").hide();
   $(".ipo_out").hide();
  }
 });
 // 自動採番ボタン
 $("#autoNumSwitch").click(function(){
  $(this).toggleClass("switch-ON");
  if($(this).hasClass("switch-ON")){
   $(this).text("ON");
   //　全ての処理番号の状態を変更（隠し要素も変更されるため、新たに追加される要素にも適用される）
   $(".proc_num").prop("disabled", true);
   $(".proc_num").removeClass("clickable");
  }else{
   $(this).text("OFF");
   //　全ての処理番号の状態を変更（隠し要素も変更されるため、新たに追加される要素にも適用される）
   $(".proc_num").prop("disabled", false);
   $(".proc_num").addClass("clickable");
  }
 });
 // 自動変更点記録ボタン
 $("#autoChangeMarkSwitch").click(function(){
  $(this).toggleClass("switch-ON");
  if($(this).hasClass("switch-ON")){
   $(this).text("ON");
  }else{
   $(this).text("OFF");
  }
 });
 // ノード操作モード
 $("#quickModeSwitch").click(function(){
  $(this).toggleClass("switch-ON");
  if($(this).hasClass("switch-ON")){
   $(this).text("ON");
   document.body.style.cursor = 'crosshair';
   $(".node").css("cursor","crosshair");
   $(".proc_content").css("cursor","crosshair");
   $("textarea").css("cursor","crosshair");
   $("input").css("cursor","crosshair");
  }else{
   $(this).text("OFF");
   document.body.style.cursor = 'auto';
   $(".node").css("cursor","auto");
   $(".proc_content").css("cursor","auto");
   $("textarea").css("cursor","auto");
   $("input").css("cursor","auto");
   $(".quickModeHighlight").removeClass("quickModeHighlight");
   $(".quickModeHover").removeClass("quickModeHover");
  }
 });
 // 全処理の詳細を表示
 $("#detailBtn").click(function() {
  $(".proc_content").slideDown();
  $(".proc_conditions").slideDown();
  $(".proc_args").slideDown();
  $(".proc_work").slideDown();
  $("#sTree").find(".proc_comment").each(function(){
   if($(this).children("textarea").val() !== ""){
    $(this).slideDown();
   }
  });
  $(".opt.proc_up").show();
  $(".opt.proc_down").hide();
 });
 // 全処理の詳細を隠す
 $("#aboutBtn").click(function() {
  $("#sTree").find(".proc_content").slideUp();
  $("#sTree").find(".proc_conditions").slideUp();
  $("#sTree").find(".proc_args").slideUp();
  $("#sTree").find(".proc_work").slideUp();
  $("#sTree").find(".proc_comment").slideUp();
  $("#sTree").find(".opt.proc_down").show();
  $("#sTree").find(".opt.proc_up").hide();
 });
 // I/O 表示ボタン
 // shoriki-resource.jsに初期処理あり
 // initShorikiResource実行時に初期化されている
 // 項目編集仕様の表示ボタン
 //　項目編集仕様関連の初期化
 // shoriki-editSpecification.jsに初期処理あり
 initEditSpec();
 // インポートボタン
 $("#shoriki_import_btn").click(function() {
  getShoriki();
 });
 // クラス構造仕様の初期化
 // shoriki-classKozo.jsに初期処理あり
 initClassKozo();
 // ソース生成ボタン
 $("#source_generate").find(".clickable").click(function() {
  switch ($(this).text()) {
  default:
   window.open(makeURI("source/" + $(this).text().toLowerCase()));
   break;
  case "BusinessFacade":
   window.open(makeURI("source/businessfacade"), "_blank");
   break;
  }
 });
 // ケース生成ボタン
 $("#case_generate").click(function() {
  window.open(makeURI("test/case"));
 });
 // 辞書確認ボタン
 $("#dic_view").click(function() {
  $("#dic_view_area").toggleClass("hidden");
 });
 // IPO仕様書生成ボタン
 $("#ipo_generate").click(function() {
  window.open(makeURI("generate/ipo"));
 });
}
/**
 * 右側メニュー
 * スタイル変更関連の初期化
 * @returns
 */
function initStyleChange(){
 function isFontChangable() {
  return $selectItem !== undefined 
    && $selectItem.closest(".handsontable").length == 0
 }
 $("#font_color").click(function() {
  if (isFontChangable()) {
   $selectItem.css("color", $("#selectColor").val());
  }
  storeUndoData();
 });
 $("#selectColor").change(function() {
  if (isFontChangable()) {
   $selectItem.css("color", $(this).val());
  }
  storeUndoData();
 });
 $("#font_bold").click(function() {
  if (isFontChangable()) {
   $selectItem.toggleClass("bold");
  }
  storeUndoData();
 });
 $("#font_italic").click(function() {
  if (isFontChangable()) {
   $selectItem.toggleClass("italic");
  }
  storeUndoData();
 });
 $("#font_underline").click(function() {
  if (isFontChangable()) {
   $selectItem.toggleClass("underline");
  }
  storeUndoData();
 });
 $("#font_cancel").click(function() {
  if (isFontChangable()) {
   $selectItem.toggleClass("cancelline");
  }
  storeUndoData();
 });
 $("#bg_color").click(function() {
  if (isFontChangable()) {
   $selectItem.css("background-color", $("#selectBGColor").val());
  }
  storeUndoData();
 });
 $("#selectBGColor").change(function() {
  if (isFontChangable()) {
   $selectItem.css("background-color", $(this).val());
  }
  storeUndoData();
 });
}
/**
 * オンライン処理機能記述には必要ないボタンを消す
 * @returns
 */
function initShorikiMenu(){
 $("#shoriki_import_btn").remove();
 $("#shoriki_showStruc").remove();
 $("#nodeadd_method").remove();
 $("#nodeadd_call").remove();
 $("#nodeadd_try").remove();
 $("#nodeadd_catch").remove();
 $("#nodeadd_finally").remove();
 $("#nodeadd_readfile").remove();
 $("#nodeadd_writefile").remove();
 $("#nodeadd_unload").remove();
 $("#nodeadd_matching").remove();
 $("#nodeadd_sort").remove();
 $("#nodeadd_hulft").remove();
 $("#nodeadd_func").remove();
 $("#nodeadd_callfunc").remove();
 $("#nodeadd_macro").remove();
 $("#nodeadd_callda").remove();
 $("#resource_naibushoriki").remove();
 $("#autoNum").remove();
 $(".naibushoriki_only").remove();
}
/**
 * オンライン内部処理機能記述には必要ないボタンを消す
 * @returns
 */
function initNaibushorikikiMenu(){
 $("#nodeadd_callcommon").remove();
 $("#nodeadd_link").remove();
 $("#nodeadd_readfile").remove();
 $("#nodeadd_writefile").remove();
 $("#nodeadd_unload").remove();
 $("#nodeadd_matching").remove();
 $("#nodeadd_sort").remove();
 $("#nodeadd_hulft").remove();
 $("#nodeadd_func").remove();
 $("#nodeadd_callfunc").remove();
 $("#nodeadd_macro").remove();
 $("#nodeadd_callda").remove();
 switch (sys) {
 case "J-PASS":
  break;
 default:
  $(".J-PASS_ONLY").remove();
  break;
 }
}
/**
 * バッチ処理機能記述には必要ないボタンを消す
 * @returns
 */
function initBatchshorikikiMenu(){
 // 使わないノードを非表示
 $("#nodeadd_method").remove();
 $("#nodeadd_call").remove();
 $("#nodeadd_try").remove();
 $("#nodeadd_catch").remove();
 $("#nodeadd_finally").remove();
 $("#nodeadd_message").remove();
 $("#nodeadd_func").remove();
 $("#nodeadd_callfunc").remove();
 $("#nodeadd_macro").remove();
 $("#nodeadd_callda").remove();
 // 不要な文書操作機能を非表示
 $("#shoriki_import_btn").remove();
 $("#shoriki_showStruc").remove();
 $("#source_generate").remove();
 $("#case_generate").remove();
 // 必要ないリソースを非表示
 $("#resource_gamen").remove();
 $("#resource_denbun").remove();
 $("#resource_bdto").remove();
 $("#resource_naibushoriki").remove();
}
/**
 * バッチ処理機能記述には必要ないボタンを消す
 * @returns
 */
function initBatchNaibushorikikiMenu(){
 // 使わないノードを非表示
 $("#nodeadd_method").remove();
 $("#nodeadd_call").remove();
 $("#nodeadd_try").remove();
 $("#nodeadd_catch").remove();
 $("#nodeadd_finally").remove();
 $("#nodeadd_message").remove();
 $("#nodeadd_readfile").remove();
 $("#nodeadd_writefile").remove();
 $("#nodeadd_unload").remove();
 $("#nodeadd_matching").remove();
 $("#nodeadd_sort").remove();
 $("#nodeadd_hulft").remove();
 $("#nodeadd_dao").remove();
 $("#nodeadd_link").remove();
 $("#nodeadd_decision").remove();
 $("#nodeadd_callcommon").remove();
 // 不要な文書操作機能を非表示
 $("#shoriki_import_btn").remove();
 $("#shoriki_showStruc").remove();
 $("#source_generate").remove();
 $("#case_generate").remove();
 $("#editSpec_btn").remove();
 $("#shoriki_classKozo").remove();
 $("#resource_ipo_btn").remove();
 // 必要ないリソースを非表示
 $("#resource_gamen").remove();
 $("#resource_denbun").remove();
 $("#resource_bdto").remove();
 $("#resource_tyohyo").remove();
 $("#resource_dao").remove();
 $("#resource_naibushoriki").remove();
}
