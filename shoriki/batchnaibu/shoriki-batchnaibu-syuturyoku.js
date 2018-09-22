/**
 * 出力編集仕様
 */
function initBatchNaibuSyuturyoku(){
 // 初期処理が必要となったらここで実装
 $("#syuturyoku_tab_area").on("click", ".syuturyoku_tab", function() {
  if($(this).hasClass("active")) {
   return false;
  }else{
   getBatchNaibuSyuturyoku();
   $(".syuturyoku_tab.active").removeClass("active");
   $(this).addClass("active");
   syuturyokuTabChange();
  }
 });
 $("#syuturyoku_tab_area").on("click", "#syuturyoku_addtab", function() {
  addSyuturyokuTab();
  getBatchNaibuSyuturyoku();
  $(".syuturyoku_tab.active").removeClass("active");
  let index = $("#syuturyoku_tab_area").children(".syuturyoku_tab").length;
  $($("#syuturyoku_tab_area").children(".syuturyoku_tab").get(index-1)).addClass("active");
  syuturyokuTabChange();
 });
 // 既存tabダブルクリック時、編集可にする
 $("#syuturyoku_tab_area").on("dblclick", ".syuturyoku_tab", function() {
  $(this).attr("contenteditable", true);
  $(this).focus();
    // Rangeオブジェクトの取得
    var range = document.createRange();
    // 範囲の指定
    range.selectNodeContents(this);
  　// Selectionオブジェクトを返す。ユーザが選択した範囲が格納されている
    var selection = window.getSelection();
    // 選択をすべてクリア
    selection.removeAllRanges();
  　// 新規の範囲を選択に指定
    selection.addRange(range);
 });
 // タブカーソルアウト時、編集不可にする
 $("#syuturyoku_tab_area").on("blur", ".syuturyoku_tab", function() {
  if($(this).text() === "") {
   $(this).addClass("error");
   $(this).focus();
   $(this).select();
   return;
  } else {
   $(this).removeClass("error");
  }
  $(this).attr("contenteditable", false);
 });
 // 並び替えを有効にする
 $("#syuturyoku_tab_area").sortable({
  "axis": "x",
  "items": ">li",
  "containment": "#syuturyoku_tab_area ",
  "clone":false,
  "start": function(event, ui) {
   // 現在のtreeデータを保存
   getBatchNaibuSyuturyoku();
   syuturyokuTabChange();
   // 移動前のタブ位置を記録
   selectedTab = getSyuturyokuTabIndex(ui.item);
  },
  "update": function(event, ui) {
   // afterDataを複製
   let afterDataBk = JSON.parse(JSON.stringify(afterData));
   // changeDataを複製
   let changeDataBk = JSON.parse(JSON.stringify(changeData));
   // 元のafterDataの中身を空に
   afterData.出力編集仕様 = [];
   // 現在の画面のタブ順に合わせて、データを並べ直す
   // (複製したafterDataを取得)
   $("#syuturyoku_tab_area").children("li").each(function(i){
    let tabname = $(this).text();
    for(let j=0; j < afterDataBk.出力編集仕様.length;j++){
     if(afterDataBk.出力編集仕様[j].シート名 == tabname){
      afterData.出力編集仕様.push(afterDataBk.出力編集仕様[j]);
      // TODO 変更点情報の対応後、ここに変更点情報のインデックスを修正するロジックを入れる
     }
    }
   });
   // sTreeを空にして再描画
   syuturyokuTabChange();
  }
 });
 // 右クリックメニュー
 $.contextMenu({
  // define which elements trigger this menu
  selector : ".syuturyoku_tab",
  // define the elements of the menu
  items : {
   copy : {
    name : "削除",
    disabled : false,
    callback : function(key, opt) {
     //removeTab($selectedTab);
     let index = getSyuturyokuActiveTabIndex();
     afterData.出力編集仕様.splice(index, 1);
     $(this).remove();
     if($("#syuturyoku_tab_area").children(".syuturyoku_tab").length > 0){
      $($("#syuturyoku_tab_area").children(".syuturyoku_tab").get(0)).addClass("active");
      syuturyokuTabChange();
     } else{
      syuturyokuHot.loadData([]);
     }
    }
   }
  },
  events: {
            show: function(){
             if($(this).hasClass("active")) {
           return true;
          }else{
           getBatchNaibuSyuturyoku();
           $(".syuturyoku_tab.active").removeClass("active");
           $(this).addClass("active");
           syuturyokuTabChange();
          }
             return true;
            },
  },
  zIndex : 1000
 });
}
/**
 * 出力編集仕様のタブを追加する
 * @returns
 */
function addSyuturyokuTab(name){
 if(name == undefined){
  name = "シート名を入力";
 }
 $("#syuturyoku_addtab").before("<li class='syuturyoku_tab'>" + name + "</li>");
}
/**
 * タブの変更
 * @returns
 */
function syuturyokuTabChange(){
 let index = getSyuturyokuActiveTabIndex();
 // 追加の場合か判定
 if(afterData.出力編集仕様[index] === undefined){
  let layout = {rows:[]};
  afterData.出力編集仕様[index] = layout;//.push(layout);
 }
 //syuturyokuHot.alter('insert_row',afterData.出力編集仕様[index].rows );
 syuturyokuHot.loadData(afterData.出力編集仕様[index].rows);
 if(afterData.出力編集仕様[index].rows.length == 0){
  syuturyokuHot.alter('insert_row',0, 10);
 }
}
/**
 * 出力編集仕様用のhandsonTableを作成する
 * @returns
 */
function createSyuturyokuHot1(){
 let index = getSyuturyokuActiveTabIndex();
 // dataHotを設定する
 dataHotSyuturyoku = [{data: "No"},
  {data: "レベル", editor: 'select',selectOptions: ['', '03', '05', '07','09']},
  {data: "データ項目名称設定先"},
  {data: "属性"}, 
  {data: "桁数"},
  {data: "小数桁数"},
  {data: "USAGE"},
  {data: "集団項目名"},
  {data: "データ項目名称設定元"},
  {data: "編集要領"}
  ];
 if(afterData.出力編集仕様[index] === undefined){
  afterData.出力編集仕様[index] =  {rows:[
   {
    "No": "",
    "レベル": "",
    "データ項目名称設定先": "",
    "属性": "",
    "桁数": "",
    "小数桁数": "",
    "USAGE": "",
    "集団項目名": "",
    "データ項目名称設定元": "",
    "編集要領": ""
   }
  ]};
 }
 /* イベント／サーバー側イベント */
 let hotOption = {
   //data: afterData.rowEvents,
   colHeaders: ["No","レベル","データ項目名称（設定先）","属性","桁数","小数桁数","USAGE","集団項目名/エンティティ名","データ項目名称(設定元)","編集要領"],
   colWidths: [30, 50, 300, 70, 70, 70,70,200,300,200],
   columns: dataHotSyuturyoku,
   data:[],
   contextMenu : {
     items: {
      "row_above": {name: '挿入（行）', 
       callback: function(id, range) {
        syuturyokuHot.alter('insert_row', range[0].start.row, range[0].end.row - range[0].start.row + 1);
       }
      },
      "row_aboves": {name: '挿入（指定行）', 
       callback: function(id, range) {
        let rows = prompt("挿入する行数を入力してください", 0);
        syuturyokuHot.alter('insert_row', range[0].start.row, rows);
       }
      },
      "remove_row": {name: '削除（行）' }
     }
   }
  };
 // 共通で設定されるオプションをセット
 setCommonHotOption(hotOption);
 syuturyokuHot = new Handsontable(document.getElementById('syuturyokuHot'), hotOption);
}
/**
 * アクティブなタブのindexを取得する
 */
function getSyuturyokuActiveTabIndex() {
 return $(".syuturyoku_tab:not(.ui-sortable-placeholder)").index($(".syuturyoku_tab.active"));
}
/**
 * アクティブなタブの名称を取得する
 * @returns
 */
function getSyuturyokuActiveTabName(){
 return $(".syuturyoku_tab.active").text();
}
/**
 * バッチ内部処理記の概要タブの内容を保存
 * @returns
 */
function getBatchNaibuSyuturyoku(){
 let index = getSyuturyokuActiveTabIndex();
 if(index >= 0){
  afterData.出力編集仕様[index].シート名 = getSyuturyokuActiveTabName();
 }
}
/**
 * バッチ内部処理記の概要タブの内容を画面にセット
 * @returns
 */
function dispBatchNaibuSyuturyoku(){
 if(afterData.出力編集仕様 === undefined){
  afterData.出力編集仕様 = [];
 }
 for(let i = 0;i < afterData.出力編集仕様.length;i++){
  addSyuturyokuTab(afterData.出力編集仕様[i].シート名);
 }
 $($("#syuturyoku_tab_area").children(".syuturyoku_tab").get(0)).addClass("active");
 // handsonTable生成
 createSyuturyokuHot1();
 if(afterData.出力編集仕様.length > 0){
  syuturyokuTabChange();
 }
}
/**
 * 指定したタブのindexを返す
 * @param $tab jQueryオブジェクト
 * @returns index 見つからないときは-1
 */
function getSyuturyokuTabIndex($tab) {
 return $("#syuturyoku_tab_area").children(".syuturyoku_tab").index($tab);
}
