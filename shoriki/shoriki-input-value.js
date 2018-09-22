/**
 * 各種INPUT項目に対する操作をまとめたもの
 */
function initInputVal(){
 // リソース関係のコードアシストの初期化
 initResourceCodeAssist();
 // メソッド関係のコードアシストの初期化
 initMethodCodeAssist();
 // リソースの選択入力の初期化
 initInputSelect();
}
/**
 * streeに対するイベントセット input_valueに recourceのコードアシストを有効にする
 * 
 * @param $sTree
 * @returns
 */
function initResourceCodeAssist(){
 // 処理番号候補表示（コードアシスト）
 $sTree.on("focus", ".choose_proc", function() {
  numlist = [];
  $(".proc_num").each(function() {
   var num = $(this).val();
   if (num !== "処理番号") {
    numlist.push(num);
   }
  });
  $(this).autocomplete({
   source : numlist,
   autoFocus : true,
   delay : 500,
   minLength : 0,
   change : function() {
    setProcNum($(this));
   }
  });
 });
 // INPUT候補表示（コードアシスト）
 $sTree.on("focus", ".input_value", function() {
  $(this).autocomplete({
   source : resourceName,
   autoFocus : false,
   delay : 500,
   minLength : 2,
   change : function() {
    setBalloon($(this));
   }
  });
 });
 // オートコンプリートの検索結果が返ってきたときの処理
 $sTree.on("autocompleteresponse", function(event, ui) {
  // 実行したい処理
  let displayLength = 10;
  if (ui.content.length > displayLength) {
   while (ui.content.length !== displayLength) {
    ui.content.pop();
   }
   // topの位置を取得して変数に格納
   let offsetTop = $(':focus').offset().top - 60;
   // leftの位置を取得して変数に格納
   let offsetLeft = $(':focus').offset().left - 40;
   // メッセージを表示 ３秒
   fadeMessage("検索結果が多すぎるため省略されました", offsetTop, offsetLeft, 3000);
  }
 });
 // データアクセス
 $sTree.on("focus", ".accessID", function() {
  $(this).autocomplete({
   source : dataAccessIDList,
   autoFocus : false,
   delay : 100,
   minLength : 0,
   change: function(event, ui) {
    inputDataAccessChanged($(this));
   }
  });
 });
 // データアクセスIDの入力を変更したらバルーンセット
 $sTree.on("change", ".accessID", function() {
  inputDataAccessChanged($(this));
 });
 // 共通機能呼び出し
 $sTree.on("focus", ".input_common", function() {
  $(this).autocomplete({
   source : kyotsuKinouIDList,
   autoFocus : false,
   delay : 100,
   minLength : 0,
   select: function(event, ui) {
    inputCommonChanged($(this));
   }
  });
 });
 // 共通機能呼び出しの入力を変更したらバルーンセット
 $sTree.on("change", ".input_common", function() {
  inputCommonChanged($(this));
 });
 // メッセージID
 $sTree.on("focus", ".messageID", function() {
  $(this).autocomplete({
   source : messageIDList,
   autoFocus : false,
   delay : 100,
   minLength : 0,
   select: function(event, ui) {
    inputMessageIdSetBalloon($(this));
   }
  });
 });
 // ワークの変数名が変更されたら辞書から意味等のセット
 $sTree.on("change", ".work_name", function() {
  setDictionaryBalloon($(this))
 });
 // ディクショナリコードアシスト
 $sTree.on("focus", ".work_name", function() {
  $(this).autocomplete({
   source : dictionary,
   autoFocus : false,
   delay : 500,
   minLength : 1
  });
 });
}
/**
 * 共通機能呼び出しのIDの入力箇所が変わったら呼び出される
 * (共通機能呼び出しノード)
 * @param value
 * @returns
 */
function inputCommonChanged($this){
 let value = $this.val();
 //　データ取得済みチェック
 let data = null;
 for(let kyotsu of kyotsukinouDataList){
  if(kyotsu.共通機能ID == value){
   data = kyotsu;
  }
 }
 // データが未取得
 if(data === null){
  // もし共通機能一覧のデータがなかった場合は処理終了
  if(kyotsuKinouListData == undefined){
   return;
  }
  for(let layout of kyotsuKinouListData.layoutList){
   for(let row of layout.rows){
    if(row.共通機能ID == value){
     let uri;
     if(layout.システムID === undefined){
      uri = '/Radget/design/data/' + owner + '/' + repo + '/' + branch + "/" + KYOTSU +"/" + row.共通機能ID + "_" + row.共通機能名  + ".xml";
     }else{
      uri = '/Radget/design/data/' + owner + '/' + repo + '/' + branch + "/" + KYOTSU + "/" + layout.システムID  + "/" + row.共通機能ID + "_" + row.共通機能名  + ".xml";
     }
     ajaxCall(uri, "GET", null, function(res, status, jqXHR) {
      kyotsukinouDataList.push(res);
      // 共通機能利用概要の情報をセット
      inputCommonSetBalloon($this);
      // 取得した共通機能利用概要の情報を画面に反映する
      setKyotsuKinouInfo($this,res);
     },function(){});
    }
   }
  }
 }else{
  // データが取得済み
  // 共通機能利用概要の情報をセット
  inputCommonSetBalloon($this);
  // 取得した共通機能利用概要の情報を画面に反映する
  setKyotsuKinouInfo($this,data);
 }
}
/**
 * @param value
 * @returns
 */
function inputDataAccessChanged($this){
 let value = $this.val();
 //　データ取得済みチェック
 let data = null;
 for(let dataaccess of dataAccessDataList){
  for(let layout of dataaccess.layoutList){
   if(layout.データアクセスID == value){
    data = layout;  
   }
  }
 }
 // データが未取得
 if(data !== null){
  // 共通機能利用概要の情報をセット
  inputDataAccessSetBalloon($this);
  // 取得した共通機能利用概要の情報を画面に反映する
  setDataAccessInfo($this,data);
 }
}
/**
 * リソース選択処理の初期化 (リソース選択入力)
 */
function initInputSelect() {
 // INPUT項目編集
 $sTree.on("click", ".input_value", function() {
  shorikiObserver.disconnect();
  if ($(this).next().text() !== "選択") {
   $(this).after("<div class='input_select clickable'>選択</div>");
   $(this).parent().addClass("edit_now");
  }
  startObserve();
 });
 // 編集エリア以外を選択した時に元に戻す
 $(document).on("click touchend mousedown", function(event) {
  if (!$(event.target).parent().hasClass("edit_now") && !$(event.target).parents(".modal_select").length) {   
   $(".input_select").remove();
   $(".modal_select").remove();
   $(".proc_content").removeClass("edit_now");
   $(".condition_content").removeClass("edit_now");
   $(".argument_content").removeClass("edit_now");
   $(".return_content").removeClass("edit_now");
   $(".exception_content").removeClass("edit_now");
  }
 });
 $sTree.on("mouseleave", ".modal_select", function() {
  $(".input_select").remove();
  $(this).remove();
 });
 // 「選択」ボタン押下時
 $sTree.on("click", ".input_select", function() {
  var left = $(this).offset().left - 200;
  $(this).after(makeResourceList());
  $(".modal_select").css("left", left);
 });
 // リソース種類選択エリアクリック時
 $sTree.on("click", ".res_select > div", function() {
  $(this).parent().next().remove();
  $(this).parent().next().remove();
  $(this).parent().next().remove();
  var res = $(this).text();
  var art;
  if (res === "wk") {
   art = makeItemList(res);
  } else {
   art = makeArtList($(this).text());
  }
  if (art !== null && art !== "") {
   $(this).parent().next().remove();
   $(this).parent().after(art);
  }
  $(".res_select > div").removeClass("selected");
  $(this).addClass("selected");
 });
 // 成果物選択エリアクリック時
 $sTree.on("click", ".art_select > div", function() {
  $(this).parent().next().remove();
  $(this).parent().next().remove();
  var res = $(".res_select").find(".selected").text();
  var item;
  if (res === "file" ||　res === "電文") {
   item = makeLayoutList(res, $(this).text());
  } else {
   item = makeItemList(res, $(this).text());
  }
  if (item !== null && item !== "") {
   $(this).parent().next().remove();
   $(this).parent().after(item);
  }
  $(".art_select > div").removeClass("selected");
  $(this).addClass("selected");
 });
 // レイアウト選択エリアクリック時
 $sTree.on("click", ".layout_select > div", function() {
  $(this).parent().next().remove();
  var item = makeItemList($(".res_select").find(".selected").text(), $(".art_select").find(".selected").text(), $(this).text());
  if (item !== null && item !== "") {
   $(this).parent().next().remove();
   $(this).parent().after(item);
  }
  $(".layout_select > div").removeClass("selected");
  $(this).addClass("selected");
 });
 // 項目選択エリアクリック時
 $sTree.on("click", ".item_select > div", function() {
  var text = "";
  $(".modal_select .selected").each(function() {
   text = text + $(this).text() + ".";
  });
  var $target = $(".modal_select").prev().prev();
  $target.val(text + $(this).text());
  setBalloon($target);
  $(".modal_select").prev().prev().attr("size", strLength($(".modal_select").prev().prev().val()));
  $(".input_select").remove();
  $(".modal_select").remove();
 });
}
/**
 * リソースの選択リストを作る (リソース選択入力)
 * 
 * @returns リソース選択リストのHTML
 */
function makeResourceList() {
 var list = "<div class='modal_select'><div class='res_select'>";
 for (var res in resources) {
  if (resources[res].length === 0) {
   list = list + "<div class='disabled'>" + res + "</div>";
  } else {
   list = list + "<div class='clickable'>" + res + "</div>";
  }
 }
 list = list + "</div></div>";
 return list;
}
/**
 * 成果物の選択リストを作る (リソース選択入力)
 * 
 * @param resName
 *            リソース名
 * @returns 成果物選択リストのHTML
 */
function makeArtList(resource) {
 var artlist = getId(resource);
 if (artlist.length === 0) {
  return "";
 }
 var list = "<div class='art_select'>";
 for (var id of artlist) {
  list = list + "<div class='clickable'>" + id + "</div>";
 }
 list = list + "</div></div>";
 return list;
}
/**
 * レイアウトの選択リストを作る (リソース選択入力)
 * 
 * @param resource
 *            リソース名
 * @param artifact
 *            成果物名
 * @returns レイアウト選択リストのHTML
 */
function makeLayoutList(resource, artifact) {
 var layoutlist = getId(resource, artifact);
 if (layoutlist.length === 0) return "";
 var list = "<div class='layout_select'>";
 for (var layout of layoutlist) {
  list = list + "<div class='clickable'>" + layout + "</div>";
 }
 list = list + "</div></div>";
 return list;
}
/**
 * 項目名の選択リストを作る (リソース選択入力)
 * 
 * @param resource
 *            リソース名
 * @param artifact
 *            成果物名
 * @param layout
 *            レイアウト名
 * @returns 項目選択リストのHTML
 */
function makeItemList(resource, artifact, layout) {
 var itemlist = getId(resource, artifact, layout);
 if (itemlist.length === 0) return "";
 var list = "<div class='item_select'>";
 for (var id of itemlist) {
  list = list + "<div class='clickable'>" + id + "</div>";
 }
 list = list + "</div></div>";
 return list;
}
/**
 * InputValにリロースの行をドリップ可能にする
 * 
 * @param $inputVal
 * @returns
 */
function setDroppableResourceItemRow($inputVal){
 $inputVal.droppable({
  accept:".resource_item_row",
  drop: function(ev, ui) {
   // リソースのIDを取得
   var parentID = $(ui.draggable).parent().parent().children("a").children(".resource_name").text();
   // リソースのタイプを取得
   var resType =  $(ui.draggable).parent().parent().parent().parent().children("a").text();
   resType = resType.slice(0,resType.length -3);
   resType = resType.toLowerCase();
   //　ドロップ先が代入の場合は選択されている要素の数だけループし行追加の処理がある
   if($(this).parent().hasClass("proc_assigns")){
    // 初回はドロップされたinput_textに代入するために対象を保存
    let $firstTarget = $(this);
    // 代入処理の左右どちら側にドロップされているかを判定するためのもの
    let leftFlg = false;
    if($(this).hasClass("assign_target")){
     leftFlg = true;
    }
    // ドラッグされてきた要素と同じリソースの選択済みのものに対してループ
    var $curr = 　$(this).parent();
    // ドロップされた要素の数を取得
    let droppedCount = $(ui.draggable).parent().children(".selected").length;
    for(let tar of $(ui.draggable).parent().children(".selected")){
     let text = resType.toLowerCase() + "." + parentID + "." +  $(tar).children().children(".resource_name_row:last-child").text();
     // 初回はドロップされた位置(３番目要素などへのドロップに対応するため)
     if($firstTarget !== undefined){
      setTextToInputVal($firstTarget,text);
      $firstTarget = undefined;
     } else if(leftFlg){
      //左側(代入先)
      setTextToInputVal($curr.children(".assign_target"),text);
     }else{
      // 右側（代入元）
      setTextToInputVal($curr.children(".assign_from"),text);
     }
     // ドロップされた要素の残数を減らす
     droppedCount --;
     // 次の要素がなかった場合、新しく追加
     if($curr.next().next().length === 0 && droppedCount>0){
      // 代入処理の行を追加する
      var $proc = $(this).parent().parent().parent();
      addAssignRowToProc($proc);
     }
     $(tar).removeClass("selected");
     $curr = $curr.next();
    }
   }else{
    //ドロップ先が代入以外の場合は1つの要素しかないので行追加等しない
    let tar = $(ui.draggable).parent().children(".selected")[0];
    let text = resType.toLowerCase() + "." + parentID + "." +  $(tar).children().children(".resource_name_row:last-child").text();
    setTextToInputVal($(this),text);
    $(ui.draggable).parent().children(".selected").removeClass("selected");
   }
  },
  hoverClass : "dropHighlight"
 });
}
/**
 * InputValにリロースの行をドリップ可能にする
 * 項目名のみを入力するパターン
 * 
 * @param $inputVal
 * @returns
 */
function setDroppableResourceItemRow_B($inputVal){
 $inputVal.droppable({
  accept:".resource_item_row",
  drop: function(ev, ui) {
    let tar = $(ui.draggable).parent().children(".selected")[0];
    let text = $(tar).children().children(".resource_name_row:last-child").text();
    setTextToInputVal($(this),text);
    $(ui.draggable).parent().children(".selected").removeClass("selected");
  },
  hoverClass : "dropHighlight"
 });
}
/**
 * InputValにリロース要素をドリップ可能にする
 * 
 * @param $inputVal
 * @returns
 */
function setDroppableResourceItem($inputVal){
 $inputVal.droppable(
   {
    accept : ".resource_item",
    drop : function(ev, ui) {
     let dropText = $(ui.draggable).children("a").children(
       ".resource_name").text();
     // リソースのタイプを取得
     let resType = $(ui.draggable).parent().parent().children(
       "a").text();
     resType = resType.slice(0, resType.length - 3);
     resType = resType.toLowerCase();
     // ドロップ前後の値の判定のために変更前の値を保管
     // (ipoSyncで使用する)
     oldData = $(this).val();
     $(this).val(resType + "." + dropText);
     ipoSync($(this));
    },
    hoverClass : "dropHighlight"
   });
}
/**
 * 引数で渡されたinput-valに対してテキストをセット
 * あわせて自動リサイズとバルーンのセットも実行
 * 
 * @param $target
 * @param text
 * @returns
 */
function setTextToInputVal($target,text){
 $target.val(text);
 setBalloon($target);
 autoSize($target);
}
/**
 * 入力エリアの自動リサイズ ドラッグアンドドロップでは反応しないので、 ドラッグアンドドロップ時は個別でリサイズ
 * 
 * @param リサイズする対象要素
 */
function activateInputAutoResize($proc) {
 $proc.find("input[type=text]").each(function(index, element){
  $(element).on("input", function() {
   // リソースエリアに手入力時サイズ自動調整
   autoSize($(element));
  });
  $(element).on("autocompleteselect", function( event, ui ) {
   // プルダウンリストから選択時サイズ自動調整
   $(element).attr('size', charcount(ui.item.value) + 1);
  });
 });
 $proc.find("textarea").each(function(index, element){  
  // textareaに入力時、入力内容により自動リサイズ
  $(element).on("input", function(evt) {
   if (evt.target.scrollHeight > evt.target.offsetHeight) {
    $(evt.target).height(evt.target.scrollHeight);
   } else {
    var lineHeight = Number($(evt.target).css("lineHeight").split("px")[0]);
    while (true) {
     $(evt.target).height($(evt.target).height() - lineHeight);
     if (evt.target.scrollHeight > evt.target.offsetHeight) {
      $(evt.target).height(evt.target.scrollHeight + 10);
      break;
     }
    }
   }
  });
 });
}
