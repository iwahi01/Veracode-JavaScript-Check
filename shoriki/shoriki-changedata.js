/**
 * 変更点情報を切替
 * @param $this
 * @returns
 */
function toggleChangeData($this) {
 var $focused = $(':focus');
 if ($focused.length === 0) {
  $this.toggleClass("changed");
 }
}
/**
 * 自動変更点記録
 * 自動変更モードがONなら記録する
 * @param $target
 * @returns
 */
function autoChangeMark($target) {
 if (parentNodeHasChangeMark($target)) {
  return;
 }
 if ($("#autoChangeMarkSwitch").hasClass("switch-ON")) {
  $target.addClass("changed");
 }
}
/**
 * 親ノードに既に変更点マークが付いているか判定する
 * 付いている true
 * 付いていない false
 * @returns
 */
function parentNodeHasChangeMark($target) {
 if ($target.closest(".node").hasClass("changed")) {
  return true;
 } else {
  return false;
 }
}
/**
 * 変更点の保存 保存時にradget.jsから呼び出される シート変更時にも呼び出される
 * @returns
 */
function setChangeData() {
 if (changeData.changed !== undefined) {
  changeData.changed = changeData.changed.concat(getChangeData());
 }
}
/**
 * 表示されているシートの変更点情報を取得する
 * 保存時とUNDOのデータを貯める処理に使用される
 * 
 * @returns
 */
function getChangeData() {
 var changeDataList = [];
 // 処理記の移送のデータを引っ張ってくる
 $sTree.find(".node").each(function() {
  let chData;
  let result = getNodePosInfo($(this));
  //　ノードに変更点がセットされているか
  if ($(this).hasClass("changed")) {
   pushChangeData(result, "node", changeDataList);
  }
  // ノードの親liに変更点がセットされているか
  if ($(this).parent().hasClass("changed")) {
   pushChangeData(result, "nodeli", changeDataList);
  }
  $proc = $(this);
  $procContent = $proc.children(".proc_content");
  // 全タイプ共通
  let $target = $proc.children(".proc_title");
  if ($target.hasClass("changed")) {
   pushChangeData(result, "概要", changeDataList);
  }
  let kind = $proc.children(".proc_kind").text();
  // 全タイプ共通
  $target = $proc.children(".proc_comment").children("textarea");
  if ($target.hasClass("changed")) {
   pushChangeData(result, "コメント", changeDataList);
  }
  //　全タイプ共通　ワーク変数
  $proc.children(".proc_work").children("li").children(".proc_wk_row").each(function(i = 0) {
   addChangeData(result, $(this), "ワークノード-" + (i + 1).toString(), changeDataList);
   $target = $(this).children(".work_name");
   addChangeData(result, $target, "ワーク-" + (i + 1).toString() + "-変数名", changeDataList);
   $target = $(this).children(".work_type");
   addChangeData(result, $target, "ワーク-" + (i + 1).toString() + "-型", changeDataList);
   $target = $(this).children(".work_init");
   addChangeData(result, $target, "ワーク-" + (i + 1).toString() + "-初期値", changeDataList);
  });
  // 表の処理
  let hyo = $proc.children(".proc_content").children(".hyou");
  if(hyo !== undefined && hyo.length > 0) {  
   addTableChangeData($proc,result,changeDataList);
  }
  // 各ノードごと
  switch (kind) {
  case "自由記述":
   $target = $procContent.children(".input_free");
   addChangeData(result, $target, "自由記述テキスト", changeDataList);
   break;
  case "代入":
   $procContent.children(".proc_assigns").each(function(i = 0) {
    $(this).children(".input_value").each(function(j = 0) {
     $target = $(this);
     addChangeData(result, $target, "代入-" + (i + 1).toString() + "-" + (j + 1).toString(), changeDataList);
    });
   });
   break;
  case "リンク":
   $target = $procContent.children(".choose_proc");
   addChangeData(result, $target, "リンク先", changeDataList);
   break;
  case "データアクセス":
   $target = $procContent.children(".accessID");
   addChangeData(result, $target, "データアクセスID", changeDataList);
   //　引数
   $procContent.children(".argument_content").children(".proc_args").children("li").children(".argument_row").each(function(i = 0) {
    $target = $(this);
    addChangeData(result, $target, "引数ノード-" + (i + 1).toString(), changeDataList);
    $target = $(this).children(".arg_name");
    addChangeData(result, $target, "引数-" + (i + 1).toString() + "-引数名", changeDataList);
    $target = $(this).children(".arg_type");
    addChangeData(result, $target, "引数-" + (i + 1).toString() + "-型", changeDataList);
    $target = $(this).children(".arg_from");
    addChangeData(result, $target, "引数-" + (i + 1).toString() + "-代入内容", changeDataList);
   });
   $target = $procContent.children(".return_content").children(".return_name");
   addChangeData(result, $target, "戻り値の変数名", changeDataList);
   $target = $procContent.children(".return_content").children(".return_type");
   addChangeData(result, $target, "戻り値の型", changeDataList);
   $target = $procContent.children(".return_content").children(".return_target");
   addChangeData(result, $target, "戻り値の代入先", changeDataList);
   break;
  case "ループ":
   //　条件
   $proc.children(".proc_conditions").children("li").children(".condition_content").each(function(i = 0) {
    $target = $(this);
    addChangeData(result, $target, "条件ノード-" + (i + 1).toString(), changeDataList);
    $target = $(this).children(".cond_left");
    addChangeData(result, $target, "条件-" + (i + 1).toString() + "-左辺", changeDataList);
    $target = $(this).children(".cond_right");
    addChangeData(result, $target, "条件-" + (i + 1).toString() + "-右辺", changeDataList);
   });
   break;
  case "if":
   //　条件
   $proc.children(".proc_conditions").children("li").children(".condition_content").each(function(i = 0) {
    $target = $(this);
    addChangeData(result, $target, "条件ノード-" + (i + 1).toString(), changeDataList);
    $target = $(this).children(".cond_left");
    addChangeData(result, $target, "条件-" + (i + 1).toString() + "-左辺", changeDataList);
    $target = $(this).children(".cond_right");
    addChangeData(result, $target, "条件-" + (i + 1).toString() + "-右辺", changeDataList);
   });
   break;
  case "else if":
   //　条件
   $proc.children(".proc_conditions").children("li").children(".condition_content").each(function(i = 0) {
    $target = $(this);
    addChangeData(result, $target, "条件ノード-" + (i + 1).toString(), changeDataList);
    $target = $(this).children(".cond_left");
    addChangeData(result, $target, "条件-" + (i + 1).toString() + "-左辺", changeDataList);
    $target = $(this).children(".cond_right");
    addChangeData(result, $target, "条件-" + (i + 1).toString() + "-右辺", changeDataList);
   });
   break;
  case "メソッド":
   $target = $procContent.children(".method_info").children(".modifier");
   addChangeData(result, $target, "修飾子", changeDataList);
   $target = $procContent.children(".method_info").children(".method_name");
   addChangeData(result, $target, "メソッド名", changeDataList);
   $target = $procContent.children(".exception_content").children(".exception_type");
   addChangeData(result, $target, "例外の型", changeDataList);
   //　引数
   $procContent.children(".argument_content").children(".proc_args").children("li").children(".argument_row").each(function(i = 0) {
    $target = $(this);
    addChangeData(result, $target, "引数ノード-" + (i + 1).toString(), changeDataList);
    $target = $(this).children(".arg_name");
    addChangeData(result, $target, "引数-" + (i + 1).toString() + "-引数名", changeDataList);
    $target = $(this).children(".arg_type");
    addChangeData(result, $target, "引数-" + (i + 1).toString() + "-型", changeDataList);
    $target = $(this).children(".arg_from");
    addChangeData(result, $target, "引数-" + (i + 1).toString() + "-代入内容", changeDataList);
   });
   $target = $procContent.children(".return_content").children(".return_name");
   addChangeData(result, $target, "戻り値の変数名", changeDataList);
   $target = $procContent.children(".return_content").children(".return_type");
   addChangeData(result, $target, "戻り値の型", changeDataList);
   break;
  case "メソッド呼び出し":
   $target = $procContent.children(".method_call_info").children(".input_method");
   addChangeData(result, $target, "呼び出しメソッド", changeDataList);
   $target = $procContent.children(".return_content").children(".return_name");
   addChangeData(result, $target, "戻り値の変数名", changeDataList);
   $target = $procContent.children(".return_content").children(".return_type");
   addChangeData(result, $target, "戻り値の型", changeDataList);
   $target = $procContent.children(".return_content").children(".return_target");
   addChangeData(result, $target, "戻り値の代入先", changeDataList);
   //　引数
   $procContent.children(".argument_content").children(".proc_args").children("li").children(".argument_row").each(function(i = 0) {
    $target = $(this);
    addChangeData(result, $target, "引数ノード-" + (i + 1).toString(), changeDataList);
    $target = $(this).children(".arg_name");
    addChangeData(result, $target, "引数-" + (i + 1).toString() + "-引数名", changeDataList);
    $target = $(this).children(".arg_type");
    addChangeData(result, $target, "引数-" + (i + 1).toString() + "-型", changeDataList);
    $target = $(this).children(".arg_from");
    addChangeData(result, $target, "引数-" + (i + 1).toString() + "-代入内容", changeDataList);
   });
   break;
  case "共通機能呼び出し":
   $target = $procContent.children(".call_common_info").children(".input_common");
   addChangeData(result, $target, "共通機能ID", changeDataList);
   $target = $procContent.children(".return_content").children(".return_name");
   addChangeData(result, $target, "戻り値の変数名", changeDataList);
   $target = $procContent.children(".return_content").children(".return_type");
   addChangeData(result, $target, "戻り値の型", changeDataList);
   $target = $procContent.children(".return_content").children(".return_target");
   addChangeData(result, $target, "戻り値の代入先", changeDataList);
   //　引数
   $procContent.children(".argument_content").children(".proc_args").children("li").children(".argument_row").each(function(i = 0) {
    $target = $(this);
    addChangeData(result, $target, "引数ノード-" + (i + 1).toString(), changeDataList);
    $target = $(this).children(".arg_name");
    addChangeData(result, $target, "引数-" + (i + 1).toString() + "-引数名", changeDataList);
    $target = $(this).children(".arg_type");
    addChangeData(result, $target, "引数-" + (i + 1).toString() + "-型", changeDataList);
    $target = $(this).children(".arg_from");
    addChangeData(result, $target, "引数-" + (i + 1).toString() + "-代入内容", changeDataList);
   });
   break;
  case "メッセージ":
   // メッセージID
   $target = $procContent.children(".messageID");
   addChangeData(result, $target, "メッセージID", changeDataList);
   //　赤くする画面項目
   $procContent.children(".message_redProp").children(".input_value").each(function(i = 0) {
    $target = $(this);
    addChangeData(result, $target, "赤くする画面項目-" + (i + 1).toString(), changeDataList);
   });
   break;
  case "catch":
   $target = $procContent.children(".exception_content").children(".exception_type");
   addChangeData(result, $target, "例外の型", changeDataList);
   break;
  case "ファイル読み込み":
   // 読み込みファイル　readFileID 
   $target = $procContent.children(".readFileID");
   addChangeData(result, $target, "読み込みファイル-0", changeDataList);
   break;
  case "ファイル出力":
   // 出力ファイル writeFileID
   $target = $procContent.children(".writeFileID");
   addChangeData(result, $target, "出力ファイル", changeDataList);
   break;
  case "アンロード":
   // テーブルID tableID
   $target = $procContent.children(".tableID");
   addChangeData(result, $target, "テーブルID", changeDataList);
   // 出力ファイル writeFileID
   $target = $procContent.children(".writeFileID");
   addChangeData(result, $target, "出力ファイル", changeDataList);
   // アンロードの補足情報　unload_info
   $target = $procContent.children(".unload_info");
   addChangeData(result, $target, "補足情報", changeDataList);
   break;
  case "ソート":
   // ソートするファイルID　sortFileID
   $procContent.children(".sortFileID").each(function(i = 0) {
    $target = $(this);
    addChangeData(result, $target, "ソートするファイルID-" + (i + 1).toString(), changeDataList);
   });
   //ソートするキー sortkeys > sortkeyRow > sortkey
   $procContent.children(".sortkeys").children(".sortkeyrow").each(function(i = 0) {
    $target = $(this).children(".sortkey");
    addChangeData(result, $target, "ソートキー-" + (i + 1).toString(), changeDataList);
   });
   $target = $procContent.children(".writeFileID");
   addChangeData(result, $target, "出力ファイル", changeDataList);
   //補足情報　sort_info
   $target = $procContent.children(".sort_info");
   addChangeData(result, $target, "補足情報", changeDataList);
   break;
  case "マッチング":
   // マッチングするファイルID 1 matchFileID1
   $target = $procContent.children(".matchFileID1");
   addChangeData(result, $target, "マッチングするファイルID1", changeDataList);
   // マッチングするファイル1のキー項目　matchingkeys1 > matchkey
   $procContent.children(".matchingkeys1").children(".matchkey").each(function(i = 0) {
    $target = $(this);
    addChangeData(result, $target, "マッチングするファイル1のキー-" + (i + 1).toString(), changeDataList);
   });
   // マッチングするファイルID 2 matchFileID2
   $target = $procContent.children(".matchFileID2");
   addChangeData(result, $target, "マッチングするファイルID2", changeDataList);
   // マッチングするファイル2のキー項目　matchingkeys2 > matchkey
   $procContent.children(".matchingkeys2").children(".matchkey").each(function(i = 0) {
    $target = $(this);
    addChangeData(result, $target, "マッチングするファイル2のキー-" + (i + 1).toString(), changeDataList);
   });
   break;
  case "HULFT":
   // HULFTID hulftID 
   $target = $procContent.children(".hulftID");
   addChangeData(result, $target, "HULFTID", changeDataList);
   // HULFT接続先hostname
   $target = $procContent.children(".hostname");
   addChangeData(result, $target, "接続先", changeDataList);
   break;
  case "ディシジョン":
   addDecisionChangeData($proc,result,changeDataList);
   break;
  case "要求分析票":
   //$target = $procContent.children(".input_youkyu");
   //addChangeData(result, $target, "要求分析テキスト", changeDataList);
   //break;
   break;
  case "関数":
   $target = $procContent.children(".func_name");
   addChangeData(result,$target, "関数", changeDataList);
   break;
  case "関数呼び出し":
   $target = $procContent.children(".input_callfunc");
   addChangeData(result,$target, "関数呼び出し", changeDataList);
   break;
  case "日本語マクロ":
   break;
  case "DA呼び出し":
   $target = $procContent.children(".callda_id");
   addChangeData(result,$target, "DA呼び出し", changeDataList);
   break; 
  }
 });
 return changeDataList;
}
/**
 * 
 * @param $proc
 * @param result
 * @param changeDataList
 * @returns
 */
function addDecisionChangeData($proc,result,changeDataList){
 let hot = $proc.children(".proc_content").children(".decisionDiv").handsontable('getInstance');
 if(hot !== undefined){
  let cellsMeta = hot.getCellsMeta();
  for(let cm of cellsMeta){
   if(cm === undefined){
    // 非表示状態などでundefinedが入ることがあるので回避
    continue;
   }
   if(cm.className !== undefined){
    if(cm.className.includes("changed")){
     let row = cm.row;
     let col = cm.col;
     pushChangeData(result,"ディシジョン-"+ row + "-" + col, changeDataList);
    }
   }
  }
 }
}
/**
 * 
 * @param $proc
 * @param result
 * @param changeDataList
 * @returns
 */
function addTableChangeData($proc,result,changeDataList){
 let hot = $proc.children(".proc_content").children(".hyou").handsontable('getInstance');
 if(hot !== undefined){
  let cellsMeta = hot.getCellsMeta();
  for(let cm of cellsMeta){
   if(cm.className !== undefined){
    if(cm.className.includes("changed")){
     let row = cm.row;
     let col = cm.col;
     pushChangeData(result,"表-"+ row + "-" + col, changeDataList);
    }
   }
  }
 }
}
/**
 * 
 */
function addChangeData(result, $target, type, changeDataList) {
 if ($target.hasClass("changed")) {
  pushChangeData(result, type, changeDataList);
 }
}
/**
 * 渡された情報をchangeDataにpushする
 * @param result
 * @param type
 * @returns
 */
function pushChangeData(result, type, changeDataList) {
 let chData = {
  "layout" : getActiveIndex(),
  "num" : result.num,
  "parent" : result.parentName,
  "type" : type
 };
 changeDataList.push(chData);
}
/**
 * 変更点を保存するために指定したノードを特定するための位置情報を取得
 * @param $node
 * @returns
 */
function getNodePosInfo($node) {
 // 最初の親を取得（メソッド配下であるかの判断に使用）
 let parentList = [];
 getAllParentNode($node, parentList);
 let $rootParent = parentList.pop();
 let parentName; // メソッド配下の場合、親メソッドの名前を格納するための箇所
 let num; // 処理番号の格納場所を定義
 // メソッド配下の場合に処理番号が重複するため、親メソッドの情報を保存
 // メソッド配下ではない場合は処理番号が重複しない前提のため、親情報は保存しない
 if ($rootParent !== undefined) {
  if ($rootParent.hasClass("node_method")) {
   parentName = $rootParent.children(".proc_content")
    .children(".method_info").children(
    ".method_name").val();
  }
 }
 // 変更点がメソッドの場合、処理番号をもたないため、メソッド名を保存
 if ($node.hasClass("node_method")) {
  num = "method:" + $node.children(".proc_content").children(
   ".method_info").children(".method_name")
   .val();
 } else if($node.children(".proc_num").length !== 0) {
  num = $node.children(".proc_num").val();
 } else{
  // 処理番号をもたないノード
 }
 let result = {};
 result.parentName = parentName;
 result.num = num;
 return result;
}
/**
 * 変更点情報の初期処理
 * 
 * @returns
 */
function initChangeData() {
 // 変更点情報を読み込み
 var uri = makeURI("review/data", owner, repo);
 ajaxCall(uri, "GET", null, function(res) {
  changeData = res;
  if (changeData.changed === undefined) {
   // 変更点情報を初期化
   changeData.changed = [];
  }
  // 変更点情報が読み込み完了前に蓄積されているundo関連の情報は削除する
  // undo時に変更点なしの状態になってしまうことを防止
  undoData = [];
  currProcData = null;
  storeUndoData();
  if(dispProcPromiseList.length === 0){
   dispChangeData(changeData.changed);
  }
 }, function(jqXHR, status, errorThrown) {
  // 変更点情報を初期化
  changeData.changed = [];
  if (jqXHR.responseText !== undefined) {
   if (jqXHR.status == 404) {
    // 404なら何もしない
   } else {
    // エラー時はコンソールに表示する
    console.log(jqXHR.responseText);
   }
  } else {
   console.log(errorThrown);
  }
 });
}
/**
 * 変更点情報の表示 
 * 
 * @returns
 */
function dispChangeData(changeDataList) {
 if(changeDataList != undefined) {
  // バックアップを取っておく
  changeDataBk = JSON.parse(JSON.stringify(changeDataList));
  let actIdx = getActiveIndex();
  if (changeDataList !== undefined) {
   for (let i = 0; i < changeDataList.length; i++) {
    // 表示しているシートと一致している変更点情報のみ処理する
    if (changeDataList[i].layout == actIdx) {
     // 変更点情報の適用先のノードを取得し、適用する
     let $targetNode = getChangeDataTargetNode(changeDataList[i])
     setChangeDataToNode($targetNode, changeDataList[i]);
     // 保存時・シート切替時に変更点情報が再取得されるため、
     // データを2重で保存されないよう、
     // 画面へセットした変更点情報はいったん配列から消す
     changeDataList.splice(i, 1);
     i = i - 1;
    }
   }
  }
 }
}
/**
 * 変更点情報のセットされるノードを取得
 * 処理パターンは以下 
 * 1．メソッド配下ではない処理 
 * 2.メソッド配下の処理 
 * 3.メソッド
 * @param changeDataRow
 * @returns
 */
function getChangeDataTargetNode(changeDataRow) {
 if(changeDataRow.num === undefined){
  return;
 }
 let returnNode;
 let num = changeDataRow.num.split(":");
 if (num.length == 1) {
  //メソッド配下ではない処理またはメソッド配下の処理
  if (changeDataRow.parent === undefined) {
   //　メソッド配下ではない処理
   $sTree.find(".proc_num").each(function() {
    if ($(this).val() == num[0]) {
     let parentList = [];
     getAllParentNode($(this), parentList);
     let $rootParent = parentList.pop();
     if ($rootParent === undefined || $rootParent.hasClass("node_method") === false) {
      // 目当てのノード発見
      returnNode = $(this).parent();
     }
    }
   });
  } else {
   //　メソッド配下の処理
   $sTree.find(".proc_num").each(function() {
    if ($(this).val() == changeDataRow.num) {
     let parentList = [];
     getAllParentNode($(this), parentList);
     let $rootParent = parentList.pop();
     if ($rootParent !== undefined) {
      let rootParentName = $rootParent.children(".proc_content")
       .children(".method_info").children(".method_name").val();
      if (rootParentName == changeDataRow.parent) {
       // // 目当てのノード発見
       returnNode = $(this).parent();
      }
     }
    }
   });
  }
 } else {
  //　メソッド
  $sTree.find(".method_name").each(function() {
   if ($(this).val() === num[1]) {
    // 目当てのノード発見
    returnNode = $(this).parent().parent().parent();
   }
  });
 }
 return returnNode;
}
/**
 * 変更点情報をノードにセットする
 * @param $proc
 * @param chData
 * @returns
 */
function setChangeDataToNode($proc, chData) {
 if($proc === undefined){
  return;
 }
 $procContent = $proc.children(".proc_content");
 let target = chData.type.split("-");
 if (target[0] === "node") {
  $proc.addClass("changed");
 } else if (target[0] === "nodeli") {
  $proc.parent().addClass("changed");
 } else if (target[0] === "概要") {
  $proc.children(".proc_title").addClass("changed");
 } else if (target[0] === "コメント") {
  $proc.children(".proc_comment").children("textarea").addClass("changed");
 } else if (target[0] === "自由記述テキスト") {
  $procContent.children(".input_free").addClass("changed");
 } else if (target[0] == "ワークノード") {
  let index = parseInt(target[1]) - 1;
  $($proc.children(".proc_work").children("li").children(".proc_wk_row").get(index)).addClass("changed");
 } else if (target[0] == "ワーク") {
  let index = parseInt(target[1]) - 1;
  if (target[2] == "変数名") {
   $($proc.children(".proc_work").children("li").children(".proc_wk_row").get(index)).children(".work_name").addClass("changed");
  } else if (target[2] == "型") {
   $($proc.children(".proc_work").children("li").children(".proc_wk_row").get(index)).children(".work_type").addClass("changed");
  } else if (target[2] == "初期値") {
   $($proc.children(".proc_work").children("li").children(".proc_wk_row").get(index)).children(".work_init").addClass("changed");
  }
 } else if (target[0] == "代入") {
  let indexRow = parseInt(target[1]) - 1;
  let indexCol = parseInt(target[2]) - 1;
  let $targetRow = $($procContent.children(".proc_assigns").get(indexRow));
  let $target = $($targetRow.children(".input_value").get(indexCol));
  $target.addClass("changed");
 } else if (target[0] == "引数ノード") {
  let index = parseInt(target[1]) - 1;
  $($procContent.children(".argument_content").children(".proc_args").children("li").children(".argument_row").get(index)).addClass("changed");
 } else if (target[0] == "引数") {
  let index = parseInt(target[1]) - 1;
  if (target[2] == "引数名") {
   $($procContent.children(".argument_content").children(".proc_args").children("li").children(".argument_row").get(index)).children(".arg_name").addClass("changed");
  } else if (target[2] == "型") {
   $($procContent.children(".argument_content").children(".proc_args").children("li").children(".argument_row").get(index)).children(".arg_type").addClass("changed");
  } else if (target[2] == "代入内容") {
   $($procContent.children(".argument_content").children(".proc_args").children("li").children(".argument_row").get(index)).children(".arg_from").addClass("changed");
  }
 } else if (target[0] == "条件ノード") {
  let index = parseInt(target[1]) - 1;
  $($proc.children(".proc_conditions").children("li").children(".condition_content").get(index)).addClass("changed");
 } else if (target[0] == "条件") {
  let index = parseInt(target[1]) - 1;
  if (target[2] == "左辺") {
   $($proc.children(".proc_conditions").children("li").children(".condition_content").get(index)).children(".cond_left").addClass("changed");
  } else if (target[2] == "右辺") {
   $($proc.children(".proc_conditions").children("li").children(".condition_content").get(index)).children(".cond_right").addClass("changed");
  }
 } else if (target[0] == "リンク先") {
  $procContent.children(".choose_proc").addClass("changed");
 } else if (target[0] == "データアクセスID") {
  $procContent.children(".accessID").addClass("changed");
 } else if (target[0] == "戻り値の変数名") {
  $procContent.children(".return_content").children(".return_name").addClass("changed");
 } else if (target[0] == "戻り値の代入先") {
  $procContent.children(".return_content").children(".return_target").addClass("changed");
 } else if (target[0] == "戻り値の型") {
  $procContent.children(".return_content").children(".return_type").addClass("changed");
 } else if (target[0] == "例外の型") {
  $procContent.children(".exception_content").children(".exception_type").addClass("changed");
 } else if (target[0] == "共通機能ID") {
  $procContent.children(".call_common_info").children(".input_common").addClass("changed");
 } else if (target[0] == "修飾子") {
  $procContent.children(".method_info").children(".modifier").addClass("changed");
 } else if (target[0] == "メソッド名") {
  $procContent.children(".method_info").children(".method_name").addClass("changed");
 } else if (target[0] == "呼び出しメソッド") {
  $procContent.children(".method_call_info").children(".input_method").addClass("changed");
 }else if (target[0] == "メッセージID") {
  $procContent.children(".messageID").addClass("changed");
 } else if (target[0] == "赤くする画面項目") {
  let index = parseInt(target[1]) - 1;
  $($procContent.children(".message_redProp").children(".input_value").get(index)).addClass("changed");
 } else if (target[0] == "読み込みファイル") {
  $procContent.children(".readFileID").addClass("changed");
 } else if (target[0] == "出力ファイル") {
  $procContent.children(".writeFileID").addClass("changed");
 } else if (target[0] == "テーブルID") {
  $procContent.children(".tableID").addClass("changed");
 } else if (target[0] == "補足情報") {
  $procContent.children(".unload_info").addClass("changed");
 } else if (target[0] == "マッチングするファイルID1") {
  $procContent.children(".matchFileID1").addClass("changed");
 } else if (target[0] == "マッチングするファイル1のキー") {
  let index = parseInt(target[1]) - 1;
  $($procContent.children(".matchingkeys1").children(".matchkey").get(index)).addClass("changed");
 } else if (target[0] == "マッチングするファイルID2") {
  $procContent.children(".matchFileID2").addClass("changed");
 } else if (target[0] == "マッチングするファイル2のキー") {
  let index = parseInt(target[1]) - 1;
  $($procContent.children(".matchingkeys2").children(".matchkey").get(index)).addClass("changed");
 } else if (target[0] == "ソートするファイルID") {
  let index = parseInt(target[1]) - 1;
  $($procContent.children(".sortFileID").get(index)).addClass("changed");
 } else if (target[0] == "ソートキー") {
  let index = parseInt(target[1]) - 1;
  $($procContent.children(".sortkeys").children(".sortkeyrow").get(index)).children(".sortkey").addClass("changed");
 } else if (target[0] == "HULFTID") {
  $procContent.children(".hulftID").addClass("changed");
 } else if (target[0] == "接続先") {
  $procContent.children(".hostname").addClass("changed");
 } else if (target[0] == "ディシジョン") {
  setChangeDataDecision($proc, chData);
 }else if (target[0] == "表") {
  setChangeDataTable($proc, chData);
 } else if (target[0] === "要求分析テキスト") {
  //$procContent.children(".input_youkyu").addClass("changed");
 }else if (target[0] == "関数") {
  $procContent.children(".func_name").addClass("changed");
 }else if (target[0] == "関数呼び出し") {
  $procContent.children(".input_callfunc").addClass("changed");
 }else if (target[0] == "DA呼び出し") {
  $procContent.children(".callda_id").addClass("changed");
 }
}
function setChangeDataDecision($proc,chData){
 let hot = $proc.children(".proc_content").children(".decisionDiv").handsontable('getInstance');
 let target = chData.type.split("-");
 let row = target[1];
 let col = target[2];
 let className = hot.getCellMeta(row,col).className;
 if(className === undefined || className === ""){
  className = "changed";
 } else{
  className = className + " changed";
 }
 hot.setCellMeta(row,col,"className",className);
 hot.render();
}
function setChangeDataTable($proc,chData){
 let hot = $proc.children(".proc_content").children(".hyou").handsontable('getInstance');
 let target = chData.type.split("-");
 let row = target[1];
 let col = target[2];
 let className = hot.getCellMeta(row,col).className;
 if(className === undefined || className === ""){
  className = "changed";
 } else{
  className = className + " changed";
 }
 hot.setCellMeta(row,col,"className",className);
 hot.render();
}
