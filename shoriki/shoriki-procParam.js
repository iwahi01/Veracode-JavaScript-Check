/**
 * procのパラメータ関連
 * （条件、引数、戻り値、例外、ワーク変数）
 * 
 */
/**
 * 条件ノードを追加する
 */
function addCondition($base) {
 if ($base.children(".proc_conditions").length === 0) {
  $base.append($("#proc_condition").html());
 } else {
  $base.children(".proc_conditions").append($("#proc_condition").children("ul").html());
 }
 activateInputAutoResize($base.children(".proc_conditions").children("li:last-child").children(".condition_content"));
 //ドロップされたときのイベント
 $base.children(".proc_conditions").children("li:last-child").children(".condition_content").children(".input_value").each(function(){
  setDroppableResourceItemRow($(this));
 });
}
/**
 * 条件ノードの情報を取得する
 * @param $content
 * @returns
 */
function getConditionData($content) {
 var subs;
 // 再帰呼出
 $content.next().children("li").each(function() {
  if (subs === undefined) {
   subs = [];
  }
  subs.push(getConditionData($(this).children(".condition_content")));
 });
 var condition = {
  条件番号: $content.children(".condition_num").text(),
  左辺: $content.children(".cond_left").val(),
  演算子: $content.children(".operator").val(),
  右辺: $content.children(".cond_right").val(),
  論理演算子: $content.children(".condition_andor").text(),
  子条件: subs
 };
 return condition;
}
/**
 * 条件文を表示する
 * 
 * @param $proc
 *            条件文をセットするproc
 * @param cond
 *            gitから取得した条件情報
 */
function dispCondition($proc, cond) {
 addCondition($proc);
 var $content = $proc.children(".proc_conditions").children("li:last-child").children(
  ".condition_content");
 $content.children(".cond_left").val(cond.左辺);
 $content.children(".operator").val(cond.演算子);
 $content.children(".cond_right").val(cond.右辺);
 $content.children(".condition_andor").text(cond.論理演算子);
 if (cond.子条件 !== undefined) {
  for (let sub of cond.子条件) {
   dispCondition($content.parent(), sub);
  }
 }
}
/**
 * 引数ノードを追加する
 */
function addArgument($base) {
 // メソッドの場合、メッセージの場合、その他の場合でレイアウトが異なる
 let pattern = "";
 switch ($base.children(".proc_kind").text()){
  case "メソッド":
   pattern = "#proc_argA";
   break;
  case "メッセージ":
  case "日本語マクロ":
  case "DA呼び出し":
   pattern = "#proc_argB";
   break;
  default:
   pattern = "#proc_argC";
   break;
 }
 $args = $base.children(".proc_content").children(".argument_content").children(".proc_args");
 if ($args.length === 0) {
  $base.children(".proc_content").children(".argument_content").append($(pattern).html());
 } else {
  $args.append($(pattern).children("ul").html());
 }
 $base.children(".proc_content").children(".argument_content").children(".proc_args").append($("#proc_arg").children(pattern).html());
 activateInputAutoResize($base.children(".proc_content").children(".argument_content").children(".proc_args").children("li:last-child").children(".argument_row"));
 //ドロップされたときのイベント
 $base.children(".proc_content").children(".argument_content").children(".proc_args").children("li:last-child").children(".argument_row").children(".input_value").each(function(){
  setDroppableResourceItemRow($(this));
 });
}
/**
 * 引数データを取得する
 * @param $content
 * @returns
 */
function getArgumentData($content) {
 var argument = {
  型: $content.children(".arg_type").val(),
  引数名: $content.children(".arg_name").val(),
  代入内容: $content.children(".arg_from").val()
 };
 return argument;
}
/**
 * 引数を表示する
 * 
 * @param $proc
 *            条件文をセットするproc
 * @param cond
 *            gitから取得した条件情報
 */
function dispArgument($proc, cond) {
 addArgument($proc);
 var $content = $proc.children(".proc_content").children(".argument_content").children(".proc_args")
  .children("li:last-child").children(".argument_row");
 $content.children(".arg_type").val(cond.型);
 $content.children(".arg_name").val(cond.引数名);
 $content.children(".arg_from").val(cond.代入内容);
}
/**
 * 戻り値データを取得する
 * @param $content
 * @returns
 */
function getReturnData($content) {
 var condition = {
  型: $content.children(".return_type").val(),
  変数名: $content.children(".return_name").val(),
  代入先: $content.children(".return_target").val()
 };
 return condition;
}
/**
 * 戻り値を表示する
 * 
 * @param $proc
 *            条件文をセットするproc
 * @param cond
 *            gitから取得した条件情報
 */
function dispReturn($proc, cond) {
 var $content = $proc.children(".proc_content").children(
  ".return_content");
 $content.children(".return_type").val(cond.型);
 $content.children(".return_name").val(cond.変数名);
 $content.children(".return_target").val(cond.代入先);
}
/**
 * 例外データを取得する
 * @param $content
 * @returns
 */
function getExceptionData($content) {
 var condition = {
  型: $content.children(".exception_type").val()
 };
 return condition;
}
/**
 * 例外を表示する
 * 
 * @param $proc
 *            条件文をセットするproc
 * @param cond
 *            gitから取得した条件情報
 */
function dispException($proc, cond) {
 var $content = $proc.children(".proc_content").children(
 ".exception_content");
 $content.children(".exception_type").val(cond.型);
}
/**
 * ワークデータを取得する
 * @param $content
 * @returns
 */
function getProcWorkData($content) {
 var workrow = {
  変数名: $content.children(".work_name").val(),
  型: $content.children(".work_type").val(),
  初期値: $content.children(".work_init").val()
 };
 return workrow;
}
/**
 * ワークを表示
 * 
 * @param $proc
 *            条件文をセットするproc
 * @param cond
 *            gitから取得した条件情報
 */
function dispProcWork($proc, work) {
 addProcWork($proc);
 var $content = $proc.children(".proc_work").children("li:last-child").children(
  ".proc_wk_row");
 $content.children(".work_name").val(work.変数名);
 $content.children(".work_type").val(work.型);
 $content.children(".work_init").val(work.初期値);
}
/**
 * procにワークを追加する
 * @param $proc
 * @returns
 */
function addProcWork($proc){
 if ($proc.children(".proc_work").length === 0) {
  $proc.children(".proc_content").before($("#proc_wk_row").html());
 } else {
  $proc.children(".proc_work").append($("#proc_wk_row").children("ul").html());
 }
}
