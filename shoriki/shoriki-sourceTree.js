/**
 * 処理フローの初期化（表示）
 */
function initFlow() {
 var options = {
  containment: 'parent',
  placeholderCss : {
   'background-color' : '#ff8'
  },
  hintCss : {
   'background-color' : '#bbf'
  },
  onDragStart : function(event, element) {
   // Drug開始したら選択を外す
   $(':focus').blur();
   element.children("ul").hide();
   element.children(".node").children(".proc_content").hide(); 
   element.find("li").hide(); 
   // 監視停止
   shorikiObserver.disconnect();
  },
  onChange : function(element) {
   // console.log( 'onChange' );
   // ドラッグ等でフローを変更した場合はここでチェックされる
   // 追加ボタン等でノードを変更した場合、
   // ここは反応しない
   autoChangeMark(element.children(".node").parent());
  },
  complete : function(element) {
   sortList($("#sTree").children());
   $(".proc_conditions").each(function() {
    sortConditions($(this));
   });
   element.children("ul").show();
   element.children(".node").children(".proc_content").show(); 
   element.find("li").show(); 
   // ドロップしたときにundoDataをためる
   storeUndoData();
   // 監視再開
   startObserve();
  },
  isAllowed : function(cEl, hint, target) {
   if (target.data('module') === 'c' && cEl.data('module') !== 'c') {
    hint.css('background-color', '#ff9999');
    return false;
   } else {
    hint.css('background-color', '#99ff99');
    return true;
   }
  },
  opener : {
   active : false,
   as : 'html', // if as is not set plugin uses background image
  },
  ignoreClass : 'clickable'
 };
 $('#sTree').sortableLists(options);
}
/**
 * ツリーの情報をafterDataに保存する
 * 
 * @param idx
 *            ツリーのシートindex
 */
function setTreeData(idx) {
 // エラーチェック用参照項目リストの取得
 var itemList = [];
 $sTree.find(".input_value").each(function() {
  var item = $(this).val();
  if (item.startsWith("db.") ||
   item.startsWith("file.") ||
   item.startsWith("画面.") ||
   item.startsWith("帳票.")) {
   itemList.push(item);
  }
 });
 // 参照項目リストの重複削除
 itemList = itemList.filter(function(x, i, self) {
  return self.indexOf(x) === i;
 });
 // 処理リストの取得
 var procList = [];
 $sTree.children("ul").children("li").children(".node").each(function() {
  procList.push(getProcData($(this)));
 });
 let eventId = "";
 if(DOCUMENT_TYPE === "ONLINE"){
  eventId = $(".sTree_tab:eq(" + idx + ")").text();
 }
 if (itemList !== undefined) itemList.sort();
 var layout = {
  "イベントID": eventId,
  "処理": procList,
  "参照項目" : itemList
 };
 if(afterData.layoutList[idx] === undefined) {
  afterData.layoutList.push(layout); 
 } else {
  afterData.layoutList[idx] = layout;
 }
}
/**
 * 取得したproc情報を画面に表示する
 */
function dispProc($base, proc) {
 addProc($base, labelToKind(proc.種類));
 $base.children("ul").children("li:last-child").addClass(proc.階層);
 var $proc = $base.children("ul").children("li:last-child").children(".node");
 // ここを非同期実行させる
 var promise = dispProcData($proc,proc);
 dispProcPromiseList.push(promise);
 if (proc.子処理 !== undefined) {
  for (let subproc of proc.子処理) {
   dispProc($proc.parent(), subproc);
  }
 }
}
function dispProcData($proc,proc){
 var defer = $.Deferred();// Deferredを生成
 // 後ろの処理を先に実行させるために、処理を一瞬止める
 setTimeout(function() {
  try{
   $proc.children(".proc_num").val(proc.番号);
   $proc.children(".proc_title").val(proc.概要);
   // マークされている
   if(proc.マーク !== undefined){
    marking($proc);
   }
   switch (proc.種類){
    case "自由記述":
     $proc.children(".proc_content").children(".input_text").text(proc.内容);
     // 高さをリサイズする
     let $textarea = $proc.children(".proc_content").children(".input_text");
     $textarea.css("height",  $textarea.get(0).scrollHeight + 12);
     if (proc.表 !== undefined) {
      let array = ObjToArray(proc.表);
      insertTable($proc, array);
     }
     $.each(proc.画像, function(i, val) {
      // メモリ格納済みであれば、そちらから取得する
      let found = false;
      for(let imgdata of storedImageData){
       if(imgdata.name == this.src){
        dispImage($proc, imgdata.data, this.src, this.width, this.height);
        found = true;
       }
      }
      // メモリ格納済みでなければ、サーバーから取得
      if(!found){
       // まずdispImageで画像の入れものを作っておく
       // (先に作っておかないと、読み込みが完了した順で作成されるので並び変わってしまうことがある)
       dispImage($proc, "", this.src, this.width, this.height);
       var uri;
       if(importDataPath !== null){
        uri = "/Radget/design/loadattach/" + owner + "/" + repo + "/" +
        branch + "/ATTACH/" + importDataPath + "/" + this.src;
       }else{
        uri = "/Radget/design/loadattach/" + owner + "/" + repo + "/" +
        branch + "/ATTACH/" + path + "/" + this.src;
       }
       var $img = $proc.children(".proc_content").children(".img_area:last-child").find(".pasteImg");
       var $img_div = $proc.children(".proc_content").children(".img_area:last-child");
       ajaxCall(uri, "GET", null, function(res, status, jqXHR) {
        $img.attr("src", res.content);
        $img_div.children("a").attr("href", res.content);
        let imageData = {
          "name" : proc.画像[i].src,
          "data" : res.content,
          "width" : proc.画像[i].width,
          "height" : proc.画像[i].height
        };
        // メモリ上に画像データを保管
        storedImageData.push(imageData);
        // インポート機能実行時の場合、画像は新しく保存する対象に入れておく
        if(importDataPath !== null){
         var sfddata = {
           baseBranch: "",
           message: "",
           detail: "",
           itemdata: "",
           // BASE64データを保存
           attachFile: res.content
          };
         var sfd = {
           name: proc.画像[i].src,
           data: sfddata
          };
         storedFiledata.push(sfd);
        }
       });  
      }
     });
     break;
    case "代入":
     if(proc.移送情報 !== undefined){
      $proc.children(".proc_content").children(".proc_assigns").remove();
      for(let as of proc.移送情報){
       addAssignRowToProc($proc);
       $proc.children(".proc_content").children(".proc_assigns:last").children(".assign_target").val(as.移送先);
       assignSet($proc.children(".proc_content").children(".proc_assigns:last").children(".assign_from"),as.移送元);
      }
     }
     break;
    case "条件付き処理":
     if (proc.表 !== undefined) {
      let array = ObjToArray(proc.表);
      insertTable($proc, array);
     }
     break;
    case "リンク":
     $proc.children(".proc_content").children(".input_text").val(proc.内容);
     break;
    case "データアクセス":
     $proc.children(".proc_content").children(".accessID").val(proc.内容);
     break;
    case "メッセージ":
     $proc.children(".proc_content").children(".messageID").val(proc.内容);
     delMsgRedProp($proc);
     if(proc.redProperties != undefined){
      for(let prop of proc.redProperties){
       addMsgRedProp($proc);
       $proc.children(".proc_content").children(".message_redProp").children(".input_value").last().val(prop);
      }
     }
     break;
    case "メソッド":
     $proc.children(".proc_content").children(".method_info").children(".modifier").val(proc.修飾子);
     $proc.children(".proc_content").children(".method_info").children(".method_name").val(proc.メソッド名)
     break;
    case "メソッド呼び出し":
     $proc.children(".proc_content").children(".method_call_info").children(".input_method").val(proc.内容);
     break;
    case "共通機能呼び出し":
     $proc.children(".proc_content").children(".call_common_info").children(".input_common").val(proc.内容);
     break;
    case "ディシジョン":     
     // データ格納用の配列を作る
     let rownum = 1 + proc.ディシジョン.入力.length + proc.ディシジョン.処理.length;
     let colnum = 2 + proc.ディシジョン.パターン.length;
     let decisionData = new Array(rownum);
     for(let y = 0; y < rownum; y++) {
      decisionData[y] = new Array(colnum).fill("");
     }
     // まず空デシジョンを作る
     // (後でdicisionData書き換えても反映されるから大丈夫)
     // データのセットと書式のセットを同時にやるために、hotインスタンスを生成するため
     insertDecision($proc,decisionData);
     let hot = $proc.children(".proc_content").children(".decisionDiv").handsontable('getInstance');
     // 1行目を組み立てる
     decisionData[0][1] = "条件";
     for(let idx = 1;idx <= proc.ディシジョン.パターン.length;idx++){
      decisionData[0][1+idx] = (idx.toString());
     }
     // 入力部分をセット
     for(let idx = 1;idx <= proc.ディシジョン.入力.length;idx++){
      decisionData[idx][0] = "入力";
      decisionData[idx][1] =  proc.ディシジョン.入力[idx-1];
      // 入力部分の書式をセット
      for(let idx2 = 0; idx2 < decisionData[idx].length;idx2++){
       hot.setCellMeta(idx,idx2,"className", "decisionInput");
       if(idx2 >= 2){
        hot.setCellMeta(idx,idx2,"editor","select");
        hot.setCellMeta(idx,idx2,"selectOptions", ['Y','N',"-"]);
       }
      }
      //　ドロップイベントセット
      setDroppableToDecisionSell(hot,idx,1);
     }
     let inputlen = proc.ディシジョン.入力.length
     // 処理部分をセット
     for(let idx = 1;idx <= proc.ディシジョン.処理.length;idx++){
      decisionData[inputlen+idx][0] = "処理";
      decisionData[inputlen+idx][1] =  proc.ディシジョン.処理[idx-1];
      for(let idx2 = 0; idx2 < decisionData[idx].length;idx2++){
       //　処理部分の書式をセット
       if(idx2 >= 2){
        hot.setCellMeta(inputlen+idx,idx2,"editor","select");
        hot.setCellMeta(inputlen+idx,idx2,"selectOptions", ['',　'○']);
       }
      }
     }
     // パターンのところをセット
     for(let idx = 0;idx < proc.ディシジョン.パターン.length;idx++){
      let patterns =  proc.ディシジョン.パターン[idx].split(",");
      for(let idx2 = 0;idx2 < patterns.length;idx2++){
       decisionData[1+idx2][2+idx] =  patterns[idx2];
      }
     }
     // 左記以外の設定
     if(decisionData[1][colnum-1] == "左記以外"){
      decisionMergeElseCol(hot,colnum-1);
     }
     hot.render();
     break;
    case "ファイル読み込み":
     $proc.children(".proc_content").children(".readFileID").val(proc.内容);
     break;
    case "ファイル出力":
     $proc.children(".proc_content").children(".writeFileID").val(proc.内容);
     break;
    case "アンロード":
     $proc.children(".proc_content").children(".unload_info").val(proc.内容);
     $proc.children(".proc_content").children(".tableID").val(proc.テーブルID);
     $proc.children(".proc_content").children(".writeFileID").val(proc.出力ファイルID);
     break;
    case "マッチング":
     $proc.children(".proc_content").children(".matching_pattern").val(proc.内容);
     $proc.children(".proc_content").children(".matchFileID1").val(proc.マッチング情報[0].ファイルID);
     for(let i = 1;i<proc.マッチング情報[0].マッチングキー.length;i++){
      addMatchingKey($proc.children(".proc_content").children(".matchingkeys1"));
     }
     $proc.children(".proc_content").children(".matchingkeys1").children(".matchkey").each(function(idx){
      $(this).val(proc.マッチング情報[0].マッチングキー[idx]);
     });
     $proc.children(".proc_content").children(".matchFileID2").val(proc.マッチング情報[1].ファイルID);
     for(let i = 1;i<proc.マッチング情報[1].マッチングキー.length;i++){
      addMatchingKey($proc.children(".proc_content").children(".matchingkeys2"));
     }
     $proc.children(".proc_content").children(".matchingkeys2").children(".matchkey").each(function(idx){
      $(this).val(proc.マッチング情報[1].マッチングキー[idx]);
     });
     setDroppableResourceItemRow_B($proc.children(".proc_content").find(".matchkey"));
     break;
    case "ソート":
     $proc.children(".proc_content").children(".sort_info").val(proc.内容);
     for(let i = 1;i<proc.読み込みファイルID.length;i++){
      addSortFile($proc.children(".proc_content"));
     }
     $proc.children(".proc_content").children(".sortFileID").each(function(idx){
      $(this).val(proc.読み込みファイルID[idx]);
     });
     $proc.children(".proc_content").children(".writeFileID").val(proc.出力ファイルID);
     for(let i = 1;i<proc.ソート情報.length;i++){
      addSortkey($proc);
     }
     $proc.children(".proc_content").children(".sortkeys").children(".sortkeyrow").each(function(idx){
      $(this).children(".sortkey").val(proc.ソート情報[idx].ソートキー);
      $(this).children(".order").val(proc.ソート情報[idx].並び順);
     });
     setDroppableResourceItemRow_B($proc.children(".proc_content").children(".sortkeys").find("input"));
     break;
    case "HULFT":
     $proc.children(".proc_content").children(".hulft_pattern").val(proc.内容);
     $proc.children(".proc_content").children(".hulftID").val(proc.HULFTID);
     $proc.children(".proc_content").children(".hostname").val(proc.接続先);
     break;
    case "要求分析票":
     $proc.children(".proc_content").children(".input_youkyu").val(proc.内容);
     // 高さをリサイズする
     let $inputyoukyu = $proc.children(".proc_content").children(".input_youkyu");
     $inputyoukyu.css("height",  $inputyoukyu.get(0).scrollHeight + 12);
     break;
    case "関数":
     $proc.children(".proc_content").children(".func_name").val(proc.内容);
     break;
    case "関数呼び出し":
     $proc.children(".proc_content").children(".input_callfunc").val(proc.内容);
     break;
    case "日本語マクロ":
     $proc.children(".proc_content").children(".macro_name").val(proc.内容);
     break;
    case "DA呼び出し":
     $proc.children(".proc_content").children(".callda_id").val(proc.内容);
     break;
   }
   if (proc.wkList !== undefined) {
    for (let work of proc.wkList) {
     dispProcWork($proc, work);
    }
   }
   if(proc.ipoIn !== undefined){
    for(let text of proc.ipoIn){
     addIpoIn($proc,text);
    }
   }
   if(proc.ipoOut !== undefined){
    for(let text of proc.ipoOut){
     addIpoOut($proc,text);
    }
   }
   if (proc.条件 !== undefined) {
    for (let cond of proc.条件) {
     dispCondition($proc, cond);
    }
   }
   if (proc.引数 !== undefined) {
    for (let arg of proc.引数) {
     dispArgument($proc, arg);
    }
   }
   if (proc.戻り値 !== undefined) {
    for (let ret of proc.戻り値) {
     dispReturn($proc, ret);
    }
   }
   if (proc.例外 !== undefined) {
    for (let ex of proc.例外) {
     dispException($proc, ex);
    }
   }
   if(proc.コメント !== undefined){
    $proc.children(".proc_comment").children("textarea").val(proc.コメント);
    $proc.children(".proc_comment").toggle();
    let $commenttextarea = $proc.children(".proc_comment").children("textarea");
    $commenttextarea.css("height",  $commenttextarea.get(0).scrollHeight + 12);
   }
   // スタイル情報をセットする
   setProcStyle($proc,proc);
   $proc.children(".proc_conditions").each(function() {
    sortConditions($(this));
   });
   // テキストボックスのサイズ調整
   $proc.find("input[type=text]").each(function() {
    $(this).attr("size", strLength($(this).val()));
   });
   // 表示非表示はここで
   if(proc.開閉状態 == "close"){
    $proc.children(".proc_content").hide();
    $proc.children(".proc_conditions").hide();
    $proc.children(".proc_args").hide();
    $proc.children(".proc_work").hide();
    $proc.children(".proc_comment").hide();
    $proc.children(".proc_up").hide();
    $proc.children(".proc_down").show();
   }
   // 子処理の開閉状態をクラスで持っておく
   // (ここで非表示にしてしまうとhandson等の追加処理に悪影響なのでやらない)
   if(proc.子処理状態 == "close"){
    $proc.addClass("childClose");
   }
   defer.resolve();
  }catch (e) {
   console.log(e);
   defer.reject();
  }
 }, 0);
 return defer.promise();
}
/**
 * sTreeを表示する
 * 
 * @param tree
 *            afterDataの該当layout
 * @returns
 */
function dispNode(tree) {
 shorikiObserver.disconnect();
 // カーソルを変える
 $("body").css("cursor", "progress");
 // 処理の表示
 if(tree.処理 !== undefined){
  for (let proc of tree.処理) {
   dispProc($sTree, proc);
  }
 }
 dispProcAfter(function(value) {
  // 項番振り直し
  sortList($sTree.children("ul"));
  // 処理番号リンクの再セット
  resetProcNum();
  dispChangeData(changeData.changed);
  storeUndoData();
  // 初回表示の場合、まだリソース情報の読み込みが完了していないので
  // 空振りするが、リソース読み込み完了時に再度セット処理が動く
  setBalloonToAllInputValue();
 });
}
/**
 * 処理データを取得する
 */
function getProcData($proc) {
 var kind = $proc.children(".proc_kind").text();
 var content = "";
 var conditions;
 var works;
 var args;
 var returns;
 var exceptions;
 var subs;
 var assigns = [];
 var modifier;
 var methodName;
 var styleList = [];
 var redProperties = [];
 var decisionData;
 var ipoIn = [];
 var ipoOut = [];
 var matchings = [];
 var sortkeys = [];
 var tableID;
 var readFileIDs = [];
 var writeFileID;
 var hulftID;
 var hostname;
 var openOrClose;// ノードの開閉状態
 var childULstatus;// 子処理の状態
 // 内容の取得
 if (kind == "自由記述") {
  content = $proc.children(".proc_content").children(".input_text").val();
 } else if (kind == "代入") {
  let assignFrom;
  $proc.children(".proc_content").children(".proc_assigns").each(function(){
   let assignData = "";
   $(this).children(":not(.assign_target,spam,i)").each(function() {
    if(this.tagName == "INPUT"){
     assignData = assignData + "〔" +  $(this).val() + "〕";
    } else if(this.tagName == "SELECT") {
     assignData = assignData + $(this).val();
    } else {
     assignData = assignData + "←";
    }
   });
   let as = {
     移送先 : $(this).children(".assign_target").val(),
     移送元 : assignData
   };
   assigns.push(as);
  });
 } else if (kind == "リンク") {
  content = $proc.children(".proc_content").children(".input_text").val();
 } else if (kind == "データアクセス"){
  content = $proc.children(".proc_content").children(".accessID").val();
 } else if (kind == "メッセージ"){
  content = $proc.children(".proc_content").children(".messageID").val();
  $proc.children(".proc_content").children(".message_redProp").children(".input_value").each(function(){
   redProperties.push($(this).val());
  });
 } else if (kind == "メソッド"){
  modifier = $proc.children(".proc_content").children(".method_info").children(".modifier").val();
  methodName = $proc.children(".proc_content").children(".method_info").children(".method_name").val();
 } else if (kind == "メソッド呼び出し"){
  content = $proc.children(".proc_content").children(".method_call_info").children(".input_method").val();
 }　else if (kind == "共通機能呼び出し"){
  content = $proc.children(".proc_content").children(".call_common_info").children(".input_common").val();
 } else if (kind == "ディシジョン"){
  decisionData = {};
  let hot = $proc.children(".proc_content").children(".decisionDiv").handsontable('getInstance');
  if(hot !== undefined){
   let hotData =  hot.getSourceData();
   let patternDataList = getDecisionPattern(hotData);
   let inputDataList = getDecisionInput(hotData);
   let processDataList = getDecisionProcess(hotData);
   decisionData.入力 = inputDataList;
   decisionData.処理 = processDataList;
   decisionData.パターン = patternDataList;
  }
 } else if (kind == "ファイル読み込み"){
  content = $proc.children(".proc_content").children(".readFileID").val();
 } else if (kind == "ファイル出力"){
  content = $proc.children(".proc_content").children(".writeFileID").val();
 } else if (kind == "アンロード"){
  content = $proc.children(".proc_content").children(".unload_info").val();
  tableID = $proc.children(".proc_content").children(".tableID").val();
  writeFileID = $proc.children(".proc_content").children(".writeFileID").val();
 } else if (kind == "マッチング"){
  content = $proc.children(".proc_content").children(".matching_pattern").val();
  let match1 = {};
  match1.ファイルID =  $proc.children(".proc_content").children(".matchFileID1").val();
  match1.マッチングキー = [];
  $proc.children(".proc_content").children(".matchingkeys1").children(".matchkey").each(function(){
   match1.マッチングキー.push($(this).val());
  });
  matchings.push(match1);
  let match2 = {};
  match2.ファイルID =  $proc.children(".proc_content").children(".matchFileID2").val();
  match2.マッチングキー = [];
  $proc.children(".proc_content").children(".matchingkeys2").children(".matchkey").each(function(){
   match2.マッチングキー.push($(this).val());
  });
  matchings.push(match2);
 }else if (kind == "ソート"){
  content = $proc.children(".proc_content").children(".sort_info").val();
  $proc.children(".proc_content").children(".sortFileID").each(function(){
   readFileIDs.push($(this).val());
  });
  writeFileID = $proc.children(".proc_content").children(".writeFileID").val();
  $proc.children(".proc_content").children(".sortkeys").children(".sortkeyrow").each(function(){
   let sortkeyRow = {};
   sortkeyRow.ソートキー = $(this).children(".sortkey").val();
   sortkeyRow.並び順 = $(this).children(".order").val();
   sortkeys.push(sortkeyRow);
  });
 } else if (kind == "HULFT"){
  content = $proc.children(".proc_content").children(".hulft_pattern").val();
  hulftID = $proc.children(".proc_content").children(".hulftID").val();
  hostname = $proc.children(".proc_content").children(".hostname").val();
 } else if (kind == "要求分析票"){
  content = $proc.children(".proc_content").children(".input_youkyu").val();
 }　else if (kind == "関数"){
  content = $proc.children(".proc_content").children(".func_name").val();
 }　else if (kind == "関数呼び出し"){
  content = $proc.children(".proc_content").children(".input_callfunc").val();
 }　else if (kind == "日本語マクロ"){
  content = $proc.children(".proc_content").children(".macro_name").val();
 }　else if (kind == "DA呼び出し"){
  content = $proc.children(".proc_content").children(".callda_id").val();
 }
 // ワークの取得
 $proc.children(".proc_work").children("li").each(function() {
  if (works === undefined) {
   works = [];
  }
  works.push(getProcWorkData($(this).children(".proc_wk_row")));
 });
 // 条件の取得
 $proc.children(".proc_conditions").children("li").each(function() {
  if (conditions === undefined) {
   conditions = [];
  }
  conditions.push(getConditionData($(this).children(".condition_content")));
 });
 // 引数の取得
 $proc.children(".proc_content").children(".argument_content").children(".proc_args").children("li").each(function() {
  if (args === undefined) {
   args = [];
  }
  args.push(getArgumentData($(this).children(".argument_row")));
 });
 // 戻り値の取得
 // return contentがproc配下のどこかにあれば取得する
 $proc.find(".return_content").each(function() {
  if (returns === undefined) {
   returns = [];
  }
  returns.push(getReturnData($(this)));
 });
 // 例外の取得
 $proc.find(".exception_content").each(function() {
  if (exceptions === undefined) {
   exceptions = [];
  }
  exceptions.push(getExceptionData($(this)));
 });
 // 再帰呼出
 $proc.next().children("li").children(".node").each(function() {
  if (subs === undefined) {
   subs = [];
  }
  subs.push(getProcData($(this)));
 });
 // パラメータ取得
 var marked;
 if($proc.hasClass("marked")){
  marked = true;
 }
 // 開閉情報を取得
 // サーバーのＸＭＬ定義には開閉情報はないので、保存はされない
 // ブラウザのＬｏｃａｌＳｔｏｒａｇｅに保存したものには開閉情報が残る
 if($proc.children(".proc_down").is(":visible")){
  openOrClose = "close";
 } else{
  openOrClose = "open";
 }
 // 子処理の状態を取得
 if($proc.parent().children("ul").length === 0){
  childULstatus = "none";
 }else if($proc.children(".proc_open").is(":visible")){
  childULstatus = "close";
 }else{
  childULstatus = "open";
 }
 // IPO - IN
 $proc.children(".ipo_in").children("div").each(function() {
  ipoIn.push($(this).children("input").val());
 });
 // IPO - OUT
 $proc.children(".ipo_out").children("div").each(function() {
  ipoOut.push($(this).children("input").val());
 });
 let 階層 = "";
 // 階層情報を取得
 if($proc.parent().hasClass("Validation")){
  階層 = "Validation";
 }else if($proc.parent().hasClass("Action")){
  階層 = "Action";
 }else if($proc.parent().hasClass("Delegate")){
  階層 = "Delegate";
 }else if($proc.parent().hasClass("SessionFacade")){
  階層 = "SessionFacade";
 }else if($proc.parent().hasClass("BusinessFacade")){
  階層 = "BusinessFacade";
 }else if($proc.parent().hasClass("Logic")){
  階層 = "Logic";
 }
 styleList = getProcStyle($proc);
 var row = {};
 setObj(row, "番号", $proc.children(".proc_num").val());
 setObj(row, "階層", 階層);
 setObj(row, "概要", $proc.children(".proc_title").val());
 setObj(row, "マーク",marked);
 setObj(row, "種類", kind);
 setObj(row, "内容", content);
 setObj(row, "修飾子", modifier);
 setObj(row, "テーブルID", tableID);
 if(readFileIDs.length > 0){
  setObj(row, "読み込みファイルID", readFileIDs);
 }
 setObj(row, "出力ファイルID", writeFileID);
 setObj(row, "メソッド名", methodName);
 setObj(row, "HULFTID", hulftID);
 setObj(row, "接続先", hostname);
 setObj(row, "ディシジョン", decisionData);
 if(ipoIn.length > 0){
  setObj(row, "ipoIn", ipoIn);
 }
 if(ipoOut.length > 0){
  setObj(row, "ipoOut", ipoOut);
 }
 let hyo = $proc.children(".proc_content").children(".hyou");
 if(hyo !== undefined && hyo.length > 0) {
  setObj(row, "表", arrayToObj(hyo.handsontable('getData'),
         hyo.handsontable('getColHeader')
  ));
 }
 $proc.children(".proc_content").children(".img_area").each(function() {
  getImgData(row, $(this));
 });
 if(assigns.length > 0){
  setObj(row, "移送情報", assigns);
 }
 if(matchings.length > 0){
  setObj(row, "マッチング情報", matchings);
 }
 if(sortkeys.length > 0){
  setObj(row, "ソート情報", sortkeys);
 }
 setObj(row, "wkList", works);
 setObj(row, "条件", conditions);
 setObj(row, "引数", args);
 setObj(row, "戻り値", returns);
 setObj(row, "例外", exceptions);
 setObj(row, "styleList", styleList);
 setObj(row, "開閉状態", openOrClose);
 setObj(row, "子処理状態", childULstatus);
 setObj(row, "子処理", subs);
 setObj(row, "redProperties", redProperties);
 // コメントに値が入っていればコメントを取得
 if( $proc.children(".proc_comment").children("textarea").val() !== ""){
  setObj(row, "コメント", $proc.children(".proc_comment").children("textarea").val());
 }
 return row;
}
/**
 * 処理ノードを追加する
 * 
 * @param $base
 *            追加する先のjQueryオブジェクト
 * @param kind
 *            処理ノードの種類
 * @returns なし
 */
function addProc($base, kind, position) {
 var $ul;
 if(kind == "method"){
  $ul = $($("#method_template").html());
 }else{
  $ul = $($("#proc_template").html());
 }
 var $newNode = $ul.children("li").children(".node");
 // 位置指定の場合
 if(position === "after") {
  // $baseの次に挿入
  $base.after($ul.children("li"));
 // 位置指定がない場合 
 } else {
  // $baseの中に挿入
  if ($base.children("ul").length === 0) {
   $base.append($ul);
  } else {
   $base.children("ul").append($ul.children("li"));
  }
 }
 $newNode.attr("id", "proc" + procSeq);
 procSeq = procSeq + 1;
 procContent($newNode, kind);
 // 追加されたprocの中のinput-valにイベント設定
 setDroppableResourceItemRow($newNode.find(".input_value"));
 // 追加されたprocの中のInputエリアの自動リサイズエベントを設定する
 activateInputAutoResize($newNode);
 if(path.split("/")[0] == NAIBUSHORIKI){
  if(kind === "link"){
   setMethodBalloon($newNode,"linkノードは非推奨です");
   $newNode.addClass("deprecated");
  }
 }
 if(kind === "youkyu"){
  $newNode.addClass("highlightProc");
 }
 return $newNode;
}
/**
 * 処理ノードを変更する
 */
function changeProc($proc, kind) {
 let title = $proc.children(".proc_title").val();
 var $base = $proc.parent().parent().parent();
 addProc($base, kind);
 var $newli = $base.children("ul").children("li:last-child");
 // ノード新規追加時の処理を実行
 addNewNode(kind,$newli.children(".node"));
 $newli.insertAfter($proc.parent());
 $newli.children(".node").children(".proc_title").val(title);
 $newli.children(".node").children(".proc_title").attr("size", strLength(title));
 $newli.children("ul").remove();
 $newli.append($proc.parent().children("ul"));
 sortList($newli.children("ul"));
 removeProc($proc.parent());
 autoChangeMark($newli.children(".node"));
}
/**
 * 処理ノードを削除する
 */
function removeProc($li) {
 let $delbtn = $li.find(".img_del");
 for(let $btn of $delbtn){
  $btn.click();
 }
 let $ul = $li.closest("ul")
 $li.remove();
 sortList($ul);
}
/**
 * 処理内容に合わせて表示内容をJSPのテンプレートから取得してきて $procにセットする
 * 
 * @param $proc
 *            jQueryオブジェクト 追加する先のHTMLオブジェクト
 * @param kind
 *            String 処理の種類を表す文字列"自由記述","代入"
 * @returns なし
 */
function procContent($proc, kind) {
 $proc.children(".proc_content").html($("#proc_content_" + kind).html());
 if (kind === "free") {
  $proc.children(".proc_kind").text("自由記述");
  $proc.children(".table_only").removeClass("hidden");
  $proc.children(".tabledel").addClass("hidden");
 } else if (kind === "assign") {
  $proc.children(".proc_kind").text("代入");
  $proc.children(".assign_only").removeClass("hidden");
 } else if (kind === "link") {
  $proc.children(".proc_kind").text("リンク");
 } else if (kind === "fork") {
  $proc.children(".proc_kind").text("条件付き処理");
  sortConditions($proc.children(".proc_conditions"));
  $proc.children(".fork_only").removeClass("hidden");
  $proc.children(".table_only").removeClass("hidden");
  $proc.children(".tabledel").addClass("hidden");
 } else if (kind === "for") {
  $proc.children(".proc_kind").text("ループ");
  sortConditions($proc.children(".proc_conditions"));
 } else if (kind === "dao") {
  $proc.children(".proc_kind").text("データアクセス");
  sortConditions($proc.children(".proc_conditions"));
 }else if (kind === "message") {
  $proc.children(".proc_kind").text("メッセージ");
 }else if (kind === "method"){
  $proc.children(".proc_kind").text("メソッド");
  sortConditions($proc.children(".proc_conditions"));
 }else if (kind == "call"){
  $proc.children(".proc_kind").text("メソッド呼び出し");
  sortConditions($proc.children(".proc_conditions"));
 }else if (kind == "try"){
  $proc.children(".proc_kind").text("try");
 }else if (kind == "catch"){
  $proc.children(".proc_kind").text("catch");
  sortConditions($proc.children(".proc_conditions"));
 }else if (kind == "finally"){
  $proc.children(".proc_kind").text("finally");
 }else if (kind == "outline"){
  $proc.children(".proc_kind").text("概要");
 }else if (kind == "callcommon"){
  $proc.children(".proc_kind").text("共通機能呼び出し");
 }else if (kind == "if"){
  $proc.children(".proc_kind").text("if");
  $proc.children(".proc_menu").addClass("hidden");
  $proc.children(".proc_menu_fork").removeClass("hidden");
 }else if (kind == "else"){
  $proc.children(".proc_kind").text("else");
  $proc.children(".proc_menu").addClass("hidden");
  $proc.children(".proc_menu_fork").removeClass("hidden");
 }else if (kind == "else if"){
  $proc.children(".proc_kind").text("else if");
  $proc.children(".proc_menu").addClass("hidden");
  $proc.children(".proc_menu_fork").removeClass("hidden");
 }else if (kind == "decision"){
  $proc.children(".proc_kind").text("ディシジョン");
 }else if (kind == "readfile"){
  $proc.children(".proc_kind").text("ファイル読み込み");
  setDroppableResourceItem($proc.children(".proc_content").children("input"));
 }else if (kind == "writefile"){
  $proc.children(".proc_kind").text("ファイル出力");
  setDroppableResourceItem($proc.children(".proc_content").children("input"));
 }else if (kind == "unload"){
  $proc.children(".proc_kind").text("アンロード");
  setDroppableResourceItem($proc.children(".proc_content").children("input"));
 }else if (kind == "matching"){
  $proc.children(".proc_kind").text("マッチング");
  setDroppableResourceItem($proc.children(".proc_content").children("input"));
  setDroppableResourceItemRow_B($proc.children(".proc_content").children(".matchingkeys1").children(".matchkey"));
  setDroppableResourceItemRow_B($proc.children(".proc_content").children(".matchingkeys2").children(".matchkey"));
 }else if (kind == "sort"){
  $proc.children(".proc_kind").text("ソート");
  setDroppableResourceItem($proc.children(".proc_content").children("input"));
  setDroppableResourceItemRow_B($proc.children(".proc_content").find(".sortkey"));
 }else if (kind == "hulft"){
  $proc.children(".proc_kind").text("HULFT");
  setDroppableResourceItem($proc.children(".proc_content").children("input"));
 }else if (kind == "youkyu"){
  $proc.children(".proc_kind").text("要求分析票");
  $proc.children(".proc_num").val("★");
  $proc.children(".proc_num").removeClass("proc_num");
 }else if (kind == "func"){
  $proc.children(".proc_kind").text("関数");
 }else if (kind == "callfunc"){
  $proc.children(".proc_kind").text("関数呼び出し");
 }else if (kind == "macro"){
  $proc.children(".proc_kind").text("日本語マクロ");
 }else if (kind == "callda"){
  $proc.children(".proc_kind").text("DA呼び出し");
 }
 // ノードの中にドロップした場合
 $proc.droppable({
  accept:".nodeadd_btn",
  drop: function(ev, ui) {
   $(".dropdummy").remove();
   let id = $(ui.draggable).attr("id");
   let $newnode = addProc($(this).parent(), id.split("_")[1]);
   changedFlg = true;
   autoChangeMark($newnode);
   addNewNode(id.split("_")[1], $newnode)
   sortList($(this).parent().children("ul"));
   storeUndoData();
   startObserve();
  },
  over: function(e, ui) {
   $(this).append($("<li class='dropdummy'>　</li>"));
  },
  out: function(e, ui) {
   $(".dropdummy").remove();
  },
  greedy: true,
  tolerance: "fit"
 });
 // ノードの間にドロップした場合
 $proc.parent().droppable({
  accept:".nodeadd_btn",
  drop: function(ev, ui) {
   $(".dropdummy").remove();
   let id = $(ui.draggable).attr("id");
   let $newnode = addProc($(this), id.split("_")[1], "after");
   changedFlg = true;
   autoChangeMark($newnode);
   addNewNode(id.split("_")[1], $newnode)
   sortList($(this).parent());
   storeUndoData();
   startObserve();
  },
  over: function(e, ui) {
   $(this).after($("<li class='dropdummy'>　</li>"));
  },
  out: function(e, ui) {
   $(".dropdummy").remove();
  },
  greedy: true,
  tolerance: "pointer"
 });
 // ドロップされたときのイベントをinputValにセット
 setDroppableResourceItemRow($proc.children(".proc_content").children(".input_value"));
}
/**
 * procのデータ表示後に動く処理
 */
function dispProcAfter(callback) {
 Promise.all(dispProcPromiseList).then(function(value) {
  // カーソルを元に戻す
  $("body").css("cursor", "auto");
  storeUndoData();
  //監視再開
  startObserve();
  // 表示後処理を実行
  callback(value);
  dispProcPromiseList = [];
 }, function(reason) {
  dispProcPromiseList = [];
  //監視再開
  startObserve();
  console.log(reason);
 });
}
