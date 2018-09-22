/**
 * ディシジョン関連の処理
 * 
 */
/**
 * ディシジョンテーブル用のhandsonTableを生成
 * 
 * @param $proc
 *            対象のdiv.proc
 * @param data
 *            行×列の二次元配列
 */
function insertDecision($proc,initData) {
 if(initData === undefined){
  initData = [["","条件"]];
 }
 var $ss = $proc.children(".proc_content").children(".decisionDiv");
 $ss.handsontable({
  colWidths: [45,500,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30],
  data : initData,
  colHeaders : false,
  rowHeaders : false,
  manualColumnMove : false,
  manualColumnResize : false,
  manualRowMove : false,
  manualRowResize : false,
  autoColumnSize:false,
  undo:false,
  contextMenu:false,
  dragToScroll: false,
  fillHandle: false,
  filter:false,
  renderAllRows:true,
  cells : function(row, col, prop) {
   var cellProperties = {};
   if (row === 0) {
    cellProperties.renderer = firstRowRenderer;
    cellProperties.readOnly = true;
   } else if(col === 1 ) {
    cellProperties.renderer = proclinkRenderer;
   } else if(col === 0){
    cellProperties.readOnly = true;
   }
   return cellProperties;
  },
  // handsonTableによる強制スクロール回避
  beforeKeyDown: function(e) {
             scroll_Y_before = document.getElementById("sTree").scrollTop;
     }
 });
 function firstRowRenderer(instance, td, row, col, prop, value, cellProperties) {
  Handsontable.renderers.TextRenderer.apply(this, arguments);
  td.style.fontWeight = 'bold';
  td.style.color = '#ffffff';
  td.style.background = 'green';
 }
 function proclinkRenderer(instance, td, row, col, prop, value, cellProperties) {
  Handsontable.renderers.TextRenderer.apply(this, arguments);
  let id = instance.getCellMeta(row, col).proc;
  if( id !== undefined) {
   if(id !== "NG") {
    td.style.color = 'blue';
    //td.style.textDecorationLine = 'underline';
   } else {
    td.style.color = 'red';
    td.style.textDecorationLine = 'line-through';
   }
  }
 }
}
/**
 * ディシジョンの初期処理（初期表示行の追加）
 * @param $proc
 * @returns
 */
function addNewDecisionNode($proc){
 insertDecision($proc);
 var $ss = $proc.children(".proc_content").children(".decisionDiv");
 let hot = $ss.handsontable('getInstance');
 if(hot == undefined) return; 
 addDecisionProcess(hot,"");
 addDecisionProcess(hot,"");
 addDecisonInput(hot,"");
 addDecisonInput(hot,"");
 addDecisionPattern(hot,"");
 addDecisionPattern(hot,"");
}
/**
 * ディシジョンの入力追加
 * @param hot
 * @param input
 * @returns
 */
function addDecisonInput(hot,input){
 let hotData = hot.getSourceData();
 let rowNum = -1;
 for(let i = 0;i<hotData.length;i++){
  if(hotData[i][0] == "処理"){
   rowNum = i;
   break;
  }
 }
 hot.alter('insert_row', rowNum);
 hotData[rowNum][0] = "入力";
 setDroppableToDecisionSell(hot,rowNum,1);
 hot.setDataAtCell(rowNum,1,input);
 for(let i = 2;i < hotData[rowNum].length;i++){
  hot.setCellMeta(rowNum,i,"editor","select");
  hot.setCellMeta(rowNum,i,"selectOptions", ['Y','N',"-"]);
 }
 for(let i = 0;i < hotData[rowNum].length;i++){
  hot.setCellMeta(rowNum,i,"className", "decisionInput");
 }
 let colNum = hotData[1].length -1;
 if(hotData[1][colNum] == "左記以外"){
  decisionMergeElseCol(hot,colNum);
 }
}
/**
 * ディシジョンの列（パターン）追加
 * @param hot
 * @param pattern
 * @returns
 */
function addDecisionPattern(hot,pattern){
 let hotData = hot.getSourceData();
 let colNum =  hotData[0].length;
 if(hotData[1][colNum - 1] == "左記以外"){
  hotData[0][colNum - 1] = hotData[0][colNum - 1] + 1;
  colNum = colNum - 1;
 }
 hot.alter('insert_col', colNum);
 hotData[0][colNum] = colNum - 1;
 if(pattern !== undefined && pattern !== ""){
  patterns = pattern.split(",");
  for(let i = 1; i < patterns.length + 1;i++){
   hot.setDataAtCell(i,colNum,patterns[i - 1]);
  }
 }
 for(let i = 1;i < hotData.length;i++){
  for(let j = 2;j <  hotData[i].length;j++){
   if(hotData[i][0] === undefined || hotData[i][0] === null){
    continue;
   }
   if(hotData[i][0].startsWith("入力")){
    hot.setCellMeta(i,j,"editor","select");
    hot.setCellMeta(i,j,"selectOptions", ['Y','N',"-"]);
    hot.setCellMeta(i,j,"className", "decisionInput");
   }else{
    hot.setCellMeta(i,j,"editor","select");
    hot.setCellMeta(i,j,"selectOptions", ['',　'○']);
   }
  }
 }
 colNum =  hotData[0].length;
 if(hotData[1][colNum - 1] == "左記以外"){
  decisionMergeElseCol(hot,colNum-1);
 }
}
/**
 * 「左記以外」のためのセルのマージ情報を設定
 * @param hot
 * @param colNum
 * @returns
 */
function decisionMergeElseCol(hot,colNum){
 let hotData = hot.getSourceData();
 let rowNum = -1;
 for(let i = 0;i<hotData.length;i++){
  if(hotData[i][0] == "処理"){
   rowNum = i;
   break;
  }
 }
 let setting =  { mergeCells :  [{
  row: 1,
  col: colNum,
  rowspan: rowNum - 1,
  colspan: 1
 }]};
 for(let i = 1; i < rowNum;i++){
  hot.setCellMeta(i,colNum,"editor","text");
  hot.setCellMeta(i,colNum,"readOnly",true);
  hot.setCellMeta(i,colNum,"className", "decisionInput");
 }
 hot.updateSettings(setting);
}
/**
 * 「左記以外」の追加
 * @param hot
 * @returns
 */
function addDecisionPatternElse(hot){
 let hotData = hot.getSourceData();
 // 既に「左記以外」が追加されちないかチェック
 let colNum =  hotData[0].length;
 if(hotData[1][colNum - 1] == "左記以外"){
  alert("「左記以外」は1列しか追加できません。");
  return;
 }
 // 「処理」の最初の位置を求める
 let rowNum = -1;
 for(let i = 0;i<hotData.length;i++){
  if(hotData[i][0] == "処理"){
   rowNum = i;
   break;
  }
 }
 hot.alter('insert_col', colNum);
 hotData[0][colNum] = colNum - 1;
 hotData[1][colNum] = "左記以外";
 for(let i = rowNum;i < hotData.length;i++){
  hot.setCellMeta(i,colNum,"editor","select");
  hot.setCellMeta(i,colNum,"selectOptions", ['',　'○',"-"]);
 }
 decisionMergeElseCol(hot,colNum);
}
/**
 * 「処理」の追加
 * @param hot
 * @param process
 * @returns
 */
function addDecisionProcess(hot,process){
 let hotData = hot.getSourceData();
 let rowNum =  hotData.length;
 hot.alter('insert_row', rowNum);
 hotData[rowNum][0] = "処理";
 hot.setDataAtCell(rowNum,1,process);
 for(let i = 2;i <  hotData[rowNum].length;i++){
  hot.setCellMeta(rowNum,i,"editor","select");
  hot.setCellMeta(rowNum,i,"selectOptions", ['',　'○']);
 }
}
/**
 * handsonTableの条件網羅の充足チェック
 * (作成中)
 * @param hotData
 * @returns
 */
function checkDecition(hotData){
 // 入力のYN部分の取得
 let joukenData = getDecisionJouken(hotData);
 // 「-」が入力されている部分を展開する
 let tenkaiDecision = [];
 for(let dd of joukenData){
  let tenkai = ANYtenkai(dd);
  for(let t of tenkai){
   tenkaiDecision.push(t);
  }
 }
 let allYN = YNtenkai(joukenData[0].length,[]);
 let only = allYN.filter(isNotFound);
 console.log("以下のパターンが不足");
 console.log(only);
 function isNotFound(ar){
  let flg = true;
  for(let td of tenkaiDecision){
   if(ar == td){
    flg = false;
   }
  }
  return flg;
 }
}
/**
 * ディシジョンの中の条件の部分を抽出する
 * @param hotData
 * @returns
 */
function getDecisionJouken(hotData){
 let decisionData = [];
 for(let i = 0;i <hotData.length;i++){
  decisionData.push(hotData[i].concat());
 }
 // 条件箇所を抽出
 for(let i = 0;i < decisionData.length;i++){
  if(decisionData[i][0] === undefined || decisionData[i][0] === null){
   continue;
  }
  if(!decisionData[i][0].startsWith("入力")){
   decisionData.splice(i,1);
   i --;
  }else{
   decisionData[i].splice(0,2)
  }
 }
 let joukenData = transpose(decisionData);
 return joukenData;
}
/**
 * ディシジョンの中のパターンのところを抽出する
 * @param hotData
 * @returns
 */
function getDecisionPattern(hotData){
 let decisionData = [];
 for(let i = 2;i < hotData[0].length;i++){
  let decisonDataRow = "";
  for(let j  = 1;j<hotData.length;j++){
   let cell = hotData[j][i];
   if(cell === null){
    cell = "";
   }
   decisonDataRow += cell;
   decisonDataRow += ",";
  }
  if(decisonDataRow.length > 0){
   // 最後の文字を削除
   decisonDataRow = decisonDataRow.slice(0,-1)
  }
  decisionData.push(decisonDataRow);
 }
 return decisionData;
}
/**
 * ディシジョンの入力のところを抽出する
 * @param hotData
 * @returns
 */
function getDecisionInput(hotData){
 let inputList = [];
 for(hd of hotData){
  if(hd[0] !== null == undefined || hd[0] !== null){
   if(hd[0].startsWith("入力")){
    if(hd[1] == null){
     inputList.push("");
    }else{
     inputList.push(hd[1]);
    }
   }
  }
 }
 return inputList;
}
/**
 * ディシジョンの処理のところを抽出する
 * @param hotData
 * @returns
 */
function getDecisionProcess(hotData){
 let processList = [];
 for(hd of hotData){
  if(hd[0] == undefined || hd[0] == null){
   continue;
  }
  if(hd[0].startsWith("処理")){
   if(hd[1] == null){
    processList.push("");
   }else{
    processList.push(hd[1]);
   }
  }
 }
 return processList;
}
/**
 * ディシジョンの行削除
 * @param hot
 * @param rowNum
 * @returns
 */
function delDecisionRow(hot,rowNum){
 if(rowNum == 0){
  alert("その行は削除できません。");
  return;
 }
 let hotData = hot.getSourceData();
 let colNum = hotData[1].length - 1;
 if(hotData[1][colNum] == "左記以外"){
  // セルのマージを無効にする
  // （マージしたまま行削除するとデータが壊れるため）
  let setting =  { mergeCells : undefined};
  hot.updateSettings(setting);
  if(hotData[2][0] == "入力"){
   hotData[2][colNum] = "左記以外";
  }
 }
 hot.alter('remove_row', rowNum);
 if(hotData[1][colNum] == "左記以外"){
  // 再度セルマージする
   decisionMergeElseCol(hot,colNum);
 } 
}
/**
 * 列の削除
 * @param hot
 * @param colNum
 * @returns
 */
function delDecisionCol(hot,colNum){
 if(colNum == 0 || colNum == 1){
  alert("その列は削除できません。");
  return;
 }
 let hotData = hot.getSourceData();
 if(hotData[1][colNum] == "左記以外"){
  // セルのマージを無効にする
  let setting =  { mergeCells :  undefined};
  hot.updateSettings(setting);
 }
 hot.alter('remove_col', colNum);
 for(let i = 2; i < hotData[0].length;i++){
  hotData[0][i] = i - 1;
 }
 if(hotData[1][colNum] == "左記以外"){
  // 再度セルマージする
   decisionMergeElseCol(hot,colNum);
 }
}
/**
 * 2次元配列の行と列を入れ替える
 * @param a
 * @returns
 */
function transpose(a) {
    return Object.keys(a[0]).map(function (c) {
        return a.map(function (r) {
            return r[c];
        });
    });
}
/**
 * YNの全ての取りうる組み合わせを返す
 * @param num
 * @param array
 * @returns
 */
function YNtenkai(num,array){
 let returnArray = [];
 if(array.length == 0){
  returnArray.push("Y");
  returnArray.push("N");
 }else{
  for(let ar of array){
   returnArray.push(ar.concat("Y"));
   returnArray.push(ar.concat("N"));
  }
 }
 if(num == 1){
  return returnArray;
 } else{
  return YNtenkai(num - 1,returnArray);
 }
}
/**
 * ハイフンを展開し、YNのみのパターンで表現する
 * @param hotRow
 * @returns
 */
function ANYtenkai(hotRow){
 returnArray = [];
 for(let i = 0;i<hotRow.length;i++){
  if(hotRow[i] == "Y" || hotRow[i] == "N"){
   if(returnArray.length == 0){
    returnArray.push(hotRow[i]);
   }else{
    let workArray = [];
    for(let ar of returnArray){
     workArray.push(ar.concat(hotRow[i]));
    }
    returnArray = workArray;
   }
  }else{
   if(returnArray.length == 0){
    returnArray.push("Y");
    returnArray.push("N");
   }else{
    let workArray = [];
    for(let ar of returnArray){
     workArray.push(ar.concat("Y"));
     workArray.push(ar.concat("N"));
    }
    returnArray = workArray;
   }
  }
 }
 return returnArray;
}
/**
 * セルへのドラッグ＆ドロップを可能に設定する
 */
function setDroppableToDecisionSell(hot,row,col){
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
  // セルにドロップした要素をセット
  let tar = $(ui.draggable).parent().children(".selected")[0];
  let text = resType.toLowerCase() + "." + parentID + "." +  $(tar).children().children(".resource_name_row:last-child").text();
  let oldtext = hot.getDataAtCell(row,col);
  if(oldtext == null){
   oldtext = "";
  }
  hot.setDataAtCell(row,col,oldtext + " " +text);
  $(ui.draggable).parent().children(".selected").removeClass("selected");
 },
 hoverClass : "dropHighlight"
 });
}
