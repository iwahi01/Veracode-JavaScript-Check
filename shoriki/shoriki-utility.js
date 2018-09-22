/**
 * 　データの変換や文字数カウント
 * 　指定したノードの取得等のユーティリティ
 * 
 */
/**
 * 処理ノードのラベル（日本語）を英語に変換
 * 
 * @param label
 *            処理ノードのラベル
 * @returns
 */
function labelToKind(label) {
 if (label == "自由記述") {
  return "free";
 }
 if (label == "代入") {
  return "assign";
 }
 if (label == "リンク") {
  return "link";
 }
 if (label == "データアクセス") {
  return "dao";
 }
 if (label == "ループ") {
  return "for";
 }
 if (label == "条件付き処理") {
  return "fork";
 }
 if (label == "メッセージ") {
  return "message";
 }
 if (label == "メソッド") {
  return "method";
 }
 if (label == "メソッド呼び出し") {
  return "call";
 }
 if (label == "try") {
  return "try";
 }
 if (label == "catch") {
  return "catch";
 }
 if (label == "finally") {
  return "finally";
 }
 if (label == "概要") {
  return "outline";
 }
 if (label == "共通機能呼び出し") {
  return "callcommon";
 }
 if (label == "ファイル読み込み") {
  return "readfile";
 }
 if (label == "ファイル出力") {
  return "writefile";
 }
 if (label == "アンロード") {
  return "unload";
 }
 if (label == "ディシジョン") {
  return "decision";
 }
 if (label == "if") {
  return "if";
 }
 if (label == "else") {
  return "else";
 }
 if (label == "else if") {
  return "else if";
 }
 if (label == "マッチング") {
  return "matching";
 }
 if (label == "ソート") {
  return "sort";
 }
 if (label == "HULFT") {
  return "hulft";
 }
 if (label == "要求分析票") {
  return "youkyu";
 }
 if (label == "関数") {
  return "func";
 }
 if (label == "関数呼び出し") {
  return "callfunc";
 }
 if (label == "日本語マクロ") {
  return "macro";
 }
 if (label == "DA呼び出し") {
  return "callda";
 }
}
/**
 * オブジェクトを配列に変換する
 * 
 * @param obj
 *            変換元オブジェクト
 * @returns
 */
function ObjToArray(obj){
 if(obj === undefined) return;
 let array = [];
 let A = 'A'.charCodeAt(0);
 let Z = 'Z'.charCodeAt(0);
 // 最も大きい列の値を保存するための変数maxindex
 // 2行目以降にしか値が入っていない列を表示されるために使用
 let maxindex = -1;
 for(let i = 0;i<obj.length;i++){
  // objを2次元配列にしていく
  let rec = obj[i];
  let recdata = [];
  // recからカラム要素を全て取り出す
  for(let colname in rec){
   // AからZの文字コードとそれぞれ比較
   for(let j = A;j <= Z;j ++){
    // カラムを表すアルファベットを配列のインデックスとして変換し、そのインデックスに値を入れる
    // A ⇒ 0,B⇒1,C⇒2...
    if(colname === String.fromCharCode(j)){
     recdata[j-A] = rec[colname];
     if(j-A > maxindex){
      maxindex = j-A;
     }
    }
   } 
  }
  array.push(recdata);
 }
 // 作成した2次元配列に欠番が出てしまうので、欠番を埋める
 // 1行目の配列に欠番がなければ、2行目以降も正しく表示できる
 for(let i = 0;i <= maxindex; i++){
  if(array[0][i] === undefined){
   array[0][i] = "";
  }
 }
 return array;
}
/**
 * 配列をオブジェクトに変換する
 * 
 * @param array
 *            変換元2次元配列
 * @param header
 *            オブジェクトのヘッダ
 * @returns
 */
function arrayToObj(array, header) {
 if (array === undefined) return;
 var cols = [];
 for (var i = 0; i < array.length; i++) {
  var col = {
   "col": i + 1
  };
  for (var j = 0; j < header.length; j++) {
   col[header[j]] = array[i][j];
  }
  cols.push(col);
 }
 return cols;
}
/**
 * データをblobに変換する
 * 
 * @param base64
 *            変換元データ
 * @returns 変換後データ
 */
function toBlob(base64) {
 var bin = atob(base64.replace(/^.*,/, ''));
 var buffer = new Uint8Array(bin.length);
 for (var i = 0; i < bin.length; i++) {
  buffer[i] = bin.charCodeAt(i);
 }
 // Blobを作成
 var blob;
 try {
   blob = new Blob([buffer.buffer], {
   type: 'application/binary'
  });
 } catch (e) {
  return false;
 }
 return blob;
}
/**
 * 文字列の長さを取得する
 */
var strLength = function(str) {
 var count = 0,
  c = '';
 for (var i = 0, len = str.length; i < len; i++) {
  c = str.charCodeAt(i);
  if ((c >= 0x0 && c < 0x81) || (c === 0xf8f0) || (c >= 0xff61 && c < 0xffa0) ||
   (c >= 0xf8f1 && c < 0xf8f4)) {
   count += 1;
  } else {
   count += 1.8;
  }
 }
 if (count === 0) {
  count = 10;
 }
 return Math.ceil(count);
};
/**
 * 二次元配列から特定の列を削除する
 * 
 * @param ary
 *            二次元配列
 * @param row
 *            削除したい要素名(string)
 */
var removeArrayColumn = function(ary, row) {
 for (var i = 0; i < ary.length; i++) {
  for (var col in ary[i]) {
   delete ary[i][row];
  }
 }
 return ary;
};
/**
 * inputのサイズを自動調整する
 * @param $input
 * @returns
 */
function autoSize($input){
 $input.attr('size', charcount($input.val()) + 1);
}
/**
 * 文字数を数える
 * @param str
 * @returns
 */
function charcount(str) {
   len = 0;
   str = escape(str);
   for (i=0;i<str.length;i++,len++) {
     if (str.charAt(i) == "%") {
       if (str.charAt(++i) == "u") {
         i += 3;
         len++;
       }
       i++;
     }
   }
   return len;
}
/**
 * クリック時、テキストが選択されている状態にする
 * 
 * @param obj
 *            対象のDOM要素
 */
function selectDomElm(obj) {
 // Rangeオブジェクトの取得
 var range = document.createRange();
 // 範囲の指定
 range.selectNodeContents(obj);
 // Selectionオブジェクトを返す。ユーザが選択した範囲が格納されている
 var selection = window.getSelection();
 // 選択をすべてクリア
 selection.removeAllRanges();
 // 新規の範囲を選択に指定
 selection.addRange(range);
}
/**
 * @returns gitに保存するファイル名
 */
function getFileName() {
 return $("#ID").val() + "_" + $("#名称").val() + ".xml";
}
/**
 * 渡されたノードの親となるノードを全て配列にして返す
 * （jqueryオブジェクトを渡す）
 * @param $node
 * @param parentList
 * @returns
 */
function getAllParentNode($node,parentList){
 let $parentUl = $node.closest("ul");
 if($parentUl.prev().length === 0){
  return parentList;
 } else {
  parentList.push($parentUl.prev());
  getAllParentNode($parentUl.prev(),parentList);
 }
}
/**
 * 子処理を全て取得して返す
 * （データで渡す）
 * @param procs
 * @param returnProcList
 * @returns
 */
function getAllSubProc(procs,returnProcList){
 for(let proc of procs){
  returnProcList.push(proc);
  if(proc.子処理 !== undefined){
   getAllSubProc(proc.子処理,returnProcList);
  }
 }
 return returnProcList;
}
/**
 * 
 * 文字列を検索し、該当するセルを選択する
 * 
 * @param text 検索文字列
 * @returns　見つかった件数
 */
function doc_search(text, opt, all) {
 // 前回と検索テキストが同じ場合
 if(!_.isEmpty(found) && text == searchWord) {
  // 検索値の最後の場合は１つめに戻る
  if(found.length - 1 <= foundIdx) {
   if(all) {
    return 0;
   } else {
    foundIdx = 0;
   }
  } else {
   foundIdx++;
  }
  // 対象アイテムがない場合、終了
  if(found[foundIdx] == undefined) {
   return 0;
  } 
  // foundIdxのアイテムに検索ワードが含まれない場合、アイテムを削除して次を検索する
  if(found[foundIdx].ins == undefined) {
   if(!found[foundIdx].val().includes(text)) {
    found.splice(foundIdx, 1);
    doc_search(text, opt, all);
   }
  } else {
   var str = found[foundIdx].ins.getCell(found[foundIdx].row, found[foundIdx].col).textContent;
   if(!str.includes(text)) {
    found.splice(foundIdx, 1);
    doc_search(text, opt, all);
   }
  }
 // 初回検索or検索ワードが変わった場合
 } else {
  searchFoundResultClear();
  // input, textareaを検索
  for(var inp of $("#page").find("input,textarea")) {
   if($(inp).val().includes(text)) {
    found.push($(inp));
   }
  }
  // 全てのhotインスタンスに対して実施
  for(var hotins of getAllHot()) {
   // handsontableのsearch機能
   var queryResult = hotins.getPlugin('search').query(text);
   for(var res in queryResult) {
    queryResult[res].ins = hotins;
    found.push(queryResult[res]);
   }
  }
 }
 // 検索結果の表示
 if(found.length > 0) {
  // input等
  if(found[foundIdx].ins == undefined) {
   found[foundIdx].addClass("highlight");
   found[foundIdx].parents().show();
   dispContents(found[foundIdx]);
  // handsontableのcell
  } else {
   // 該当セルを選択する
   if(!all) {
    found[foundIdx].ins.selectCell(found[foundIdx].row, found[foundIdx].col);
   }
   // handsontableを再描画（検索を反映）
   found[foundIdx].ins.render(); 
   // 該当セルまでスクロールする
   dispCell(found[foundIdx].ins, found[foundIdx].row, found[foundIdx].col);
  }
 }
 // 今回検索値を保存
 searchWord = text;
 // 見つかった件数を返す
 return found.length;
}
/**
 * 
 * 文字列を置換し、次の該当するセルを選択する
 * 
 * @param before 置換対象文字列
 * @param after 置換後文字列
 * @returns　
 */
function doc_replace(before, after, all) {
 // 検索されてない場合、一度検索して終了
 if(found == undefined || found.length == 0 || found[foundIdx] == undefined) {
  doc_search(before, getSearchOpt(), all);
  return false;
 }
 // input/textareaの場合
 if( found[foundIdx].ins == undefined) {
  var str = found[foundIdx].val();
  if (!(str.includes(before))) {
   //　検索文字列が変わってる場合検索し直す
   doc_search(before, getSearchOpt(), all);
  } else {
   // inputやtextareaの置換を行う
   found[foundIdx].val(replaceAll(str, before, after));
  }
 // handsontableのセルの場合
 } else { 
  // 検索値を選択する
  var str = found[foundIdx].ins.getCell(found[foundIdx].row, found[foundIdx].col).textContent;
  // セルに値が含まれない場合、検索しなおす
  if (!str.includes(before)) {
   doc_search(before, getSearchOpt(), all);
   return false;
  } else {
   //　検索でヒットする文字列が変わったため再度取得する
   str = found[foundIdx].data;
   var repstr = replaceAll(str, before, after);
   // handsontableのセルの値を変更する
   found[foundIdx].ins.setDataAtCell(found[foundIdx].row, found[foundIdx].col, repstr);
   // handsontableを再描画（変更を反映）
   found[foundIdx].ins.render(); 
  }
 }
 // 最後でない場合は次を検索
 if(foundIdx < found.length - 1) {
  doc_search(before, getSearchOpt(), all);
 } else if(!all) {
  // 最後の場合は最初から再度検索
  searchFoundResultClear();
  doc_search(before, getSearchOpt(), all);
 } else {
  // 最後フラグ
  return true;
 }
 return false;
}
function searchFoundColorClear() {
 // 前回のハイライトを削除
 $(".highlight").removeClass("highlight");
}
function searchFoundResultClear() {
 found = [];
 foundIdx = 0;
}
/**
 * handsontableのセルが画面内に表示されるようにスクロールする
 * handsontableはoffsetの計算がおかしくなるので独自ロジック実装
 * 
 * @param ins handsontableのインスタンス
 * @param row 行番号
 * @param col 列番号
 */
function dispCell(ins, row, col) {
 var td = ins.getCell(row, col);
 var $area = $(".table_contents");
 $(td).parents().show();
 // 縦移動
 if($(td).offset() !== undefined) {
  var top = $(td).offset().top - $area.offset().top;
  var sctop = $area.scrollTop();
  var conheight = $area.innerHeight();
  var height = $(td).outerHeight();
  if( top < 0 || top + height > conheight) {
   $area.scrollTop(top + sctop - 10);
  }
  // 横移動
  var left = $(td).offset().left - $area.offset().left;
  var scleft = $area.scrollLeft();
  var conwidth = $area.innerWidth();
  var width = $(td).outerWidth();
  if(left < 0 || left + width > conwidth) {
   $area.scrollLeft(left + scleft - 10);
  }
 }
}
function getAllHot() {
 var hots = [];
 for(var div of $(".decisionDiv")) {
  let hot = $(div).handsontable('getInstance');
  if(!_.isEmpty(hot)) {
   hots.push(hot);
  }
 }
 return hots;
}
/**
 * 引数の文字で辞書を変換して返す
 * @param word
 * @returns
 */
function convertByDictionary(word){
 let result = {};
 let text = "";
 let target = word;
 let len = target.length;
 let j = 0;
 let notFoundText = "";
 let wordList = [];
 for(let i = 0; i < len; i++) {
  // 最大一致する単語を探す。　
  // （例）　辞書： 決算、決算年　単語：決算年月日　一致：決算年
  let temp = target.substring(j, target.length - i);
   if(wordDictionary[temp] !== undefined) {
    // 単語と一致したら英名をresultに代入し、次の文字から検索を続行
    // （例）　result=FLFF、　次の検索：月日
    let word = {};
    word.和名 = temp;
    word.英名 = wordDictionary[temp].nameEN;
    word.意味 =  wordDictionary[temp].meaning;
    wordList.push(word);
    j = target.length - i;
    temp = target.substring(j);
    i = -1;
    len = temp.length;
   }
 }
 result.wordList = wordList;
 if(len !== 0){
  let notFoundWord = target.substring(target.length - len);
  result.notFoundWord =  notFoundWord;
 }
 return result;
}
