/**
 *　項目編集仕様の関連ソース
 */
/**
 * 項目編集仕様関連のイベントセット
 */
function initEditSpec() {
 if(DOCUMENT_TYPE === "BATCH"){
  $(".online_only").remove();
 }else{
  $(".batch_only").remove();
 }
 /**
  * 項目移送画面を開く
  */
 $("#editSpec_btn").click(function() {
  setAfterData();
  //$("#editSpec_area").removeClass("hidden");
  $("#shoriki-menu").toggle("slide", {direction:"right"});
  setTimeout(function(){
   $("#editSpec-menu").toggle("slide", {direction:"right"});
  },500);
  setTimeout(function(){
   $("#editSpec-menu").append($("#resourceMenuLi"));
  },250);
  $sTree.hide();
  $("#sTree_tab_area").hide();
  $("#editSpec_area").show();
  showEditSpec();
 });
 /**
  * 項目移送画面のcloseボタン
  */
 $("#editSpec_close_btn").click(function() {
  $sTree.show();
  $("#sTree_tab_area").show();
  $("#editSpec_area").hide();
  $("#editSpec-menu").toggle("slide", {direction:"right"});
  setTimeout(function(){
   $("#shoriki-menu").toggle("slide", {direction:"right"});
  },500);
  setTimeout(function(){
   $("#shoriki-menu").append($("#resourceMenuLi"));
  },250);
 });
 /**
  * 編集仕様を追加する
  */
 $("#editSpec_add_btn").click(function() {
  addEditSpec();
 });
 /**
  * 移送先の自動入力ボタン
  */
 $("#editSpec_area").on("click",".autoTargetInput",function() {
  let target = $(this).parent().children(".editSpec_resource").val();
  if(target === "" || target === undefined){
   return;
  }
  colNames = [];
  for(r of resourceName){
   if(r.startsWith(target) && r != target){
    let rs = r.split(".");
    colNames.push(rs[rs.length - 1]);
   }
  }
  setEditSpecAssignTarget($(this).parent(),colNames);
 });
 /**
  * 移送元の自動入力ボタン
  */
 $("#editSpec_area").on("click",".autoSourceInput",function() {
  let eventID = $(this).parent().children(".editSpec_event").val();
  assignList = includeAssignInfomation(eventID,[]);
  for(let assign of assignList){
   console.log(assign.移送先);
  }
  let hotData = $(this).parent().data("hot").getSourceData();
  let resourceName = $(this).parent().children(".editSpec_resource").val() + ".";
  let afterHotData = [];
  for(let row of hotData){
   let assignTarget = resourceName + row.移送先;
   let found = false;
   for(let assign of assignList){
    if(assign.移送先 == assignTarget){
     found = true;
     row.移送元 = assign.移送元;
     // オブジェクトをそのままpushすると、複数の代入が見つかった場合に
     //　pushされているオブジェクトも同時に書き換えられてしまうため、
     // 新オブジェクトを作って参照関係を持たせないようにする
     let pushrow = JSON.parse(JSON.stringify(row));
     afterHotData.push(pushrow);
    }
   }
   if(!found){
    row.移送元 = "-";
    afterHotData.push(row);
   }
  }
   $(this).parent().data("hot").loadData(afterHotData);
   editSpecDoubleCheck($(this).parent().data("hot"));
   $(this).parent().data("hot").render();
 });
}
/**
 * 保存のために画面から編集仕様情報を取得する
 * @returns
 */
function setEditSpecData(){
 afterData.項目編集仕様リスト = [];
 $("#editSpec_area").children(".editSpecNode").each(function(){
  let editSpecObj = {};
  //　ノードに保管されたhotオブジェクトを取得する
  let hot = $(this).data("hot");
  if(hot === undefined){
   return;
  }
  // handsontableのデータを取得する
  editSpecObj.移送情報 = hot.getSourceData();
  editSpecObj.イベントID =$(this).children(".editSpec_event").val();
  editSpecObj.リソース名 = $(this).children(".editSpec_resource").val();
  afterData.項目編集仕様リスト.push(editSpecObj);
  // handsonTableからメタ情報を取得
  let metas = hot.getCellsMeta();
  // ハンド編集されている箇所の情報を保管
  editSpecObj.editedList = [];
  for(let meta of metas){
   if(meta == undefined){
    continue;
   }
   if(meta.className == "edited"){
    let pos = meta.row + "," + meta.col;
    editSpecObj.editedList.push(pos);
   }
  }
 });
}
/**
 * 項目編集仕様の情報を画面に表示する
 * @returns
 */
function dispEditSpecData(){
 showEditSpec();
 if(afterData.項目編集仕様リスト === undefined){
  return;
 }
 for(let layout of afterData.項目編集仕様リスト){
  addEditSpec();
  let $event = $("#editSpec_area").children(".editSpecNode:last-child").children(".editSpec_event");
  $event.val(layout.イベントID);
  $resource = $("#editSpec_area").children(".editSpecNode:last-child").children(".editSpec_resource");
  // ここの表示時点ではリソース情報の読み込みが完了していないので、
  // 保存されているリソース名のoptionを追加しておき選択しておく
  // 項目編集仕様の表示ボタン押下時に、リソース情報の再設定が行われる
  $option = $('<option>', { value: layout.リソース名, text:　layout.リソース名});
  $resource.append($option);
  $resource.val(layout.リソース名);
  createNewHot($("#editSpec_area").children(".editSpecNode:last-child"),layout.移送情報);
  let hotins = $("#editSpec_area").children(".editSpecNode:last-child").data("hot");
  if(layout.editedList !== undefined){
   for(let edit of layout.editedList){
    let edits = edit.split(",");
    hotins.setCellMeta(edits[0],edits[1],"className","edited");
   }
  }
 }
}
/**
 * 新しくhandsonTableを生成し、項目編集仕様ノードにセット
 * @param $node
 * @param data
 * @returns
 */
function createNewHot($node,data){
 // handsonTableを作成する
 var ss = $node.children(".handsontable").get(0);
 hot =  new Handsontable(ss,{
  data : data,
  colHeaders : ["移送先","移送元","備考"],
  minSpareRows: 0,
  minSpareCols: 0,
  minCols: 3,
  maxCols: 3,
  search: true,
  comments: true,
  manualColumnMove: false,
  manualColumnResize: true,
  manualRowMove: false,
  manualRowResize: false,
  persistentState: true,
  autoWrapRow: true,
  autoWrapCol: true,
  autoColumnSize: true,
  renderAllRows : true,
  filter:false,
  colWidths: [350, 350, 350],
  contextMenu: {
         items: {
             row_above: {
                 name: '上に行を挿入'
             },
             row_below: {
                 name: '下に行を挿入'
             },
             remove_row:{
              name: '行を削除する'
             }
         }
     },
     afterChange: function (changes, source) {
   // changes 変更内容
      // source 変更原因（何によってデータが変わったか）
      if(changes === null){
       return;
      }
      if(changes[0][2] == changes[0][3]){
       return;
      }
      let hotins = $(this);
   if(source === "edit"){
    // 編集による変更
    let colidx;
    let col = changes[0][1];
    switch(col){
    case "移送先":
     colidx = 0;
     break;
    case "移送元":
     colidx = 1;
     break;
    case "備考":
     colidx = 2;
     break;
    }
    this.setCellMeta(changes[0][0],colidx,"className","edited");
    this.render();
   }
  }
 });
 //ノードにhotを保管しておく
 $node.data("hot",hot);
 hot.render();
}
/**
 * 移送先リソース名を表示する
 * @param $node
 * @param colNames
 * @returns
 */
function setEditSpecAssignTarget($node,colNames){
 let data = [];
 for(let col of colNames){
  let row = {};
  row.移送先 = col;
  row.移送元 = "";
  row.備考 = "";
  data.push(row);
 }
 if($node.data("hot") === undefined){
  createNewHot($node,data);
 }else{
  $node.data("hot").loadData(data);
 }
 let hotData = $node.data("hot").getSourceData();
 for(let i = 0;i<hotData.length;i++){
  setDroppableToEditSpecSell($node.data("hot"),i,1);
 }
}
/**
 * 項目移送仕様画面を開いたときの処理
 * @returns
 */
function showEditSpec(){
 let procList = [];
 // 処理記の移送のデータを引っ張ってくる
 editSpecResourceName = [];
 editSpecEventName = [];
 // イベント名の一覧
 for(layout of afterData.layoutList){
  editSpecEventName.push(layout.イベントID);
 }
 for(let r of resourceName){
  let rs = r.split(".");
  if(rs[0] === "code"){
   continue;
  }
  if(rs.length <= 2){
   continue;
  }
  let curr = "";
  for(let i = 0; i < rs.length -1; i++){
   curr += rs[i] + ".";
  }
  if(curr !== ""){
   curr = curr.substr(0,curr.length - 1);
   editSpecResourceName.push(curr);
  }
 }
 //　filterとindexofを使って重複除去
 editSpecResourceName = editSpecResourceName.filter(function (x, i, self) {
        return self.indexOf(x) === i;
    });
 //　リソース
 $(".editSpec_resource").each(function(){
  $resource = $(this);
  let val = $(this).val();
  $(this).children("option").remove();
  $option = $('<option>', { value: "", text: ""});
  $resource.append($option);
  for(let rsName of editSpecResourceName){
   $option = $('<option>', { value: rsName, text: rsName});
   $resource.append($option);
  }
  $(this).val(val);
 });
 // handsonTableのインスタンスを取得し、全て再描画
 $(".editSpecNode").each(function(){
  let hot = $(this).data("hot");
  if(hot !== undefined){
   editSpecDoubleCheck(hot);
   hot.render();
   let hotData = hot.getSourceData();
   for(let i = 0;i<hotData.length;i++){
    setDroppableToEditSpecSell(hot,i,1);
   }
  }
 });
}
/**
 * 項目移送仕様ノードを追加したときの処理
 * @returns
 */
function addEditSpec(){
 $("#editSpec_area").append($("#editSpec_node").html());
 $event = $("#editSpec_area").children(".editSpecNode:last-child").children(".editSpec_event");
 let $option = $('<option>', { value: "", text: ""});
 $event.append($option);
 for(let evName of editSpecEventName){
  $option = $('<option>', { value: evName, text: evName});
  $event.append($option);
 }
 $resource = $("#editSpec_area").children(".editSpecNode:last-child").children(".editSpec_resource");
 let val = $resource.val();
 $resource.children("option").remove();
 $option = $('<option>', { value: "", text: ""});
 $resource.append($option);
 for(let rsName of editSpecResourceName){
  $option = $('<option>', { value: rsName, text: rsName});
  $resource.append($option);
 }
 $resource.val(val);
 return;
}
/**
 * 指定したイベントIDの代入の移送情報を抽出して返す
 * @param procList
 * @returns
 */
function includeAssignInfomation(eventID,assignList){
 if(DOCUMENT_TYPE === "BATCH"){
  for(let layout of afterData.layoutList){
   assignList = includeAssign(layout.処理);
  }
 }else{
  for(let layout of afterData.layoutList){
   if(layout.イベントID == eventID){
    assignList = includeAssign(layout.処理);
   }
  }
 }
 return assignList; 
}
/**
 *  渡された処理のリストから移送情報を抽出して返す
 * 　子処理があれば再帰呼び出し
 * @param procList
 * @returns
 */
function includeAssign(procList){
 let assignList = [];
 for(let proc of procList){
  if(proc.種類 == "代入"){
   for(let as of proc.移送情報){
    assignList.push(as);
   }
  }
  if(proc.子処理 !== undefined){
   let subprocAssign = includeAssign(proc.子処理);
   for(let subas of subprocAssign){
    assignList.push(subas);
   }
  }
 }
 return assignList;
}
/**
 * 渡されたhandsonTableに対して、移送先が同じ行が複数ないかチェック
 * ダブりがあればセルにクラスをセットする
 * @param hot
 * @returns
 */
function editSpecDoubleCheck(hot){
 let data = hot.getSourceData();
 for(let rowidx = 0;rowidx < data.length;rowidx++){
  if(rowidx > 0){
   if(data[rowidx].移送先 == data[rowidx - 1].移送先){
    hot.setCellMeta(rowidx,0,"className","editSpecDouble");
    hot.setCellMeta(rowidx,1,"className","editSpecDouble");
    hot.setCellMeta(rowidx,2,"className","editSpecDouble");
   }
  }
  if(rowidx < data.length - 1){
   if(data[rowidx].移送先 == data[rowidx + 1].移送先){
    hot.setCellMeta(rowidx,0,"className","editSpecDouble");
    hot.setCellMeta(rowidx,1,"className","editSpecDouble");
    hot.setCellMeta(rowidx,2,"className","editSpecDouble");
   }
  }
 }
}
/**
 * セルへのドラッグ＆ドロップを可能に設定する
 */
function setDroppableToEditSpecSell(hot,row,col){
 let td = hot.getCell(row, col);
 $(td).droppable({
 accept:".resource_item_row",
 drop: function(ev, ui) {
  // リソースのIDを取得
  var parentID = $(ui.draggable).parent().parent().children("a").children(".resource_name").text();
  // リソースのタイプを取得
  var resType =  $(ui.draggable).parent().parent().parent().parent().children("a").text();
  resType = resType.slice(0,resType.length -3);
  resType = resType.toLowerCase();
  $(ui.draggable).parent().children(".selected").each(function(idx){
   // セルにドロップした要素をセット
   let tar = $(ui.draggable).parent().children(".selected")[idx];
   let text = resType.toLowerCase() + "." + parentID + "." +  $(tar).children().children(".resource_name_row:last-child").text();
   hot.setDataAtCell(row + idx,col,text);
  });
  hot.render();
  $(ui.draggable).parent().children(".selected").removeClass("selected");
 },
 hoverClass : "dropHighlight"
 });
}
