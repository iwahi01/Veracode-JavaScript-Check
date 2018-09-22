/**
 * 呼び出し編集仕様
 */
function initBatchNaibuSubPgm(){
 // 初期処理が必要となったらここで実装
 $("#subPgm_tab_area").on("click", ".subPgm_tab", function() {
  if($(this).hasClass("active")) {
   return false;
  }else{
   getBatchNaibuSubPgm();
   $(".subPgm_tab.active").removeClass("active");
   $(this).addClass("active");
   subPgmTabChange();
  }
 });
 $("#subPgm_tab_area").on("click", "#subPgm_addtab", function() {
  addSubPgmTab();
  getBatchNaibuSubPgm();
  $(".subPgm_tab.active").removeClass("active");
  let index = $("#subPgm_tab_area").children(".subPgm_tab").length;
  $($("#subPgm_tab_area").children(".subPgm_tab").get(index-1)).addClass("active");
  subPgmTabChange();
 });
 // 既存tabダブルクリック時、編集可にする
 $("#subPgm_tab_area").on("dblclick", ".subPgm_tab", function() {
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
 $("#subPgm_tab_area").on("blur", ".subPgm_tab", function() {
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
 $("#subPgm_tab_area").sortable({
  "axis": "x",
  "items": ">li",
  "containment": "#subPgm_tab_area ",
  "clone":false,
  "start": function(event, ui) {
   // 現在のtreeデータを保存
   getBatchNaibuSubPgm();
   subPgmTabChange();
   // 移動前のタブ位置を記録
   selectedTab = getSubPgmTabIndex(ui.item);
  },
  "update": function(event, ui) {
   // afterDataを複製
   let afterDataBk = JSON.parse(JSON.stringify(afterData));
   // changeDataを複製
   let changeDataBk = JSON.parse(JSON.stringify(changeData));
   // 元のafterDataの中身を空に
   afterData.呼び出し編集仕様 = [];
   // 現在の画面のタブ順に合わせて、データを並べ直す
   // (複製したafterDataを取得)
   $("#subPgm_tab_area").children("li").each(function(i){
    let tabname = $(this).text();
    for(let j=0; j < afterDataBk.呼び出し編集仕様.length;j++){
     if(afterDataBk.呼び出し編集仕様[j].シート名 == tabname){
      afterData.呼び出し編集仕様.push(afterDataBk.呼び出し編集仕様[j]);
      // TODO 変更点情報の対応後、ここに変更点情報のインデックスを修正するロジックを入れる
     }
    }
   });
   // sTreeを空にして再描画
   subPgmTabChange();
  }
 });
 // 右クリックメニュー
 $.contextMenu({
  // define which elements trigger this menu
  selector : ".subPgm_tab",
  // define the elements of the menu
  items : {
   copy : {
    name : "削除",
    disabled : false,
    callback : function(key, opt) {
     //removeTab($selectedTab);
     let index = getSubPgmActiveTabIndex();
     afterData.呼び出し編集仕様.splice(index, 1);
     $(this).remove();
     if($("#subPgm_tab_area").children(".subPgm_tab").length > 0){
      $($("#subPgm_tab_area").children(".subPgm_tab").get(0)).addClass("active");
      subPgmTabChange();
     } else{
      subPgmHot1.loadData([]);
      subPgmHot2.loadData([]);
      subPgmHot3.loadData([]);
     }
    }
   }
  },
  events: {
            show: function(){
             if($(this).hasClass("active")) {
           return true;
          }else{
           getBatchNaibuSubPgm();
           $(".subPgm_tab.active").removeClass("active");
           $(this).addClass("active");
           subPgmTabChange();
          }
             return true;
            },
  },
  zIndex : 1000
 });
}
/**
 * 呼び出し編集仕様のタブを追加する
 * @returns
 */
function addSubPgmTab(name){
 if(name == undefined){
  name = "シート名を入力";
 }
 $("#subPgm_addtab").before("<li class='subPgm_tab'>" + name + "</li>");
}
/**
 * タブの変更
 * @returns
 */
function subPgmTabChange(){
 let index = getSubPgmActiveTabIndex();
 // 追加の場合か判定
 if(afterData.呼び出し編集仕様[index] === undefined){
  afterData.呼び出し編集仕様[index] = {};
  afterData.呼び出し編集仕様[index].tables = [];
  let layout1 = {rows:[]};
  let layout2 = {rows:[]};
  let layout3 = {rows:[]};
  afterData.呼び出し編集仕様[index].tables.push(layout1);
  afterData.呼び出し編集仕様[index].tables.push(layout2);
  afterData.呼び出し編集仕様[index].tables.push(layout3);
 }
 $("#外部呼出しタイプ").val(afterData.呼び出し編集仕様[index].外部呼出しタイプ);
 $("#外部呼出しプログラム名").val(afterData.呼び出し編集仕様[index].外部呼出しプログラム名);
 $("#外部呼出しプログラムID").val(afterData.呼び出し編集仕様[index].外部呼出しプログラムID);
 $("#外部呼出しDAOID").val(afterData.呼び出し編集仕様[index].外部呼出しDAOID);
 subPgmHot1.loadData(afterData.呼び出し編集仕様[index].tables[0].rows);
 $("#集団項目名1").val(afterData.呼び出し編集仕様[index].tables[0].集団項目名);
 $("#コピー句ID1").val(afterData.呼び出し編集仕様[index].tables[0].コピー句ID);
 subPgmHot2.loadData(afterData.呼び出し編集仕様[index].tables[1].rows);
 $("#集団項目名2").val(afterData.呼び出し編集仕様[index].tables[1].集団項目名);
 $("#コピー句ID2").val(afterData.呼び出し編集仕様[index].tables[1].コピー句ID);
 subPgmHot3.loadData(afterData.呼び出し編集仕様[index].tables[2].rows);
 $("#集団項目名3").val(afterData.呼び出し編集仕様[index].tables[2].集団項目名);
 $("#コピー句ID3").val(afterData.呼び出し編集仕様[index].tables[2].コピー句ID);
 if(afterData.呼び出し編集仕様[index].tables[0].rows.length == 0){
  subPgmHot1.alter('insert_row',0, 5);
 }
 if(afterData.呼び出し編集仕様[index].tables[1].rows.length == 0){
  subPgmHot2.alter('insert_row',0, 5);
 }
 if(afterData.呼び出し編集仕様[index].tables[2].rows.length == 0){
  subPgmHot3.alter('insert_row',0, 5);
 }
}
/**
 * 呼び出し編集仕様用のhandsonTableを作成する
 * @returns
 */
function createSubPgmHot1(){
 let index = getSubPgmActiveTabIndex();
 // dataHotを設定する
 dataHotSubPgm = [{data: "No"},
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
 if(afterData.呼び出し編集仕様[index] === undefined){
  afterData.呼び出し編集仕様[index] =  {tables:[]};
  let data = {rows:[
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
  afterData.呼び出し編集仕様[index].tables.push(data);
 }
 /* イベント／サーバー側イベント */
 let hotOption = {
   //data: afterData.rowEvents,
   colHeaders: ["No","レベル","データ項目名称（設定先）","属性","桁数","小数桁数","USAGE","集団項目名/エンティティ名","データ項目名称(設定元)","編集要領"],
   colWidths: [30, 50, 300, 70, 70, 70,70,200,300,200],
   columns: dataHotSubPgm,
   data:[],
   contextMenu : {
     items: {
      "row_above": {name: '挿入（行）', 
       callback: function(id, range) {
        subPgmHot1.alter('insert_row', range[0].start.row, range[0].end.row - range[0].start.row + 1);
       }
      },
      "row_aboves": {name: '挿入（指定行）', 
       callback: function(id, range) {
        let rows = prompt("挿入する行数を入力してください", 0);
        subPgmHot1.alter('insert_row', range[0].start.row, rows);
       }
      },
      "remove_row": {name: '削除（行）' }
     }
   }
  };
 // 共通で設定されるオプションをセット
 setCommonHotOption(hotOption);
 subPgmHot1 = new Handsontable(document.getElementById('subPgmHot1'), hotOption);
}
/**
 * 呼び出し編集仕様用のhandsonTableを作成する
 * @returns
 */
function createSubPgmHot2(){
 let index = getSubPgmActiveTabIndex();
 // dataHotを設定する
 dataHotSubPgm = [{data: "No"},
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
 if(afterData.呼び出し編集仕様[index] === undefined){
  afterData.呼び出し編集仕様[index] =  {tables:[]};
  let data = {rows:[
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
  afterData.呼び出し編集仕様[index].tables.push(data);
 }
 /* イベント／サーバー側イベント */
 let hotOption = {
   //data: afterData.rowEvents,
   colHeaders: ["No","レベル","データ項目名称（設定先）","属性","桁数","小数桁数","USAGE","集団項目名/エンティティ名","データ項目名称(設定元)","編集要領"],
   colWidths: [30, 50, 300, 70, 70, 70,70,200,300,200],
   columns: dataHotSubPgm,
   data:[],
   contextMenu : {
     items: {
      "row_above": {name: '挿入（行）', 
       callback: function(id, range) {
        subPgmHot2.alter('insert_row', range[0].start.row, range[0].end.row - range[0].start.row + 1);
       }
      },
      "row_aboves": {name: '挿入（指定行）', 
       callback: function(id, range) {
        let rows = prompt("挿入する行数を入力してください", 0);
        subPgmHot2.alter('insert_row', range[0].start.row, rows);
       }
      },
      "remove_row": {name: '削除（行）' }
     }
   }
  };
 // 共通で設定されるオプションをセット
 setCommonHotOption(hotOption);
 subPgmHot2 = new Handsontable(document.getElementById('subPgmHot2'), hotOption);
}
/**
 * 呼び出し編集仕様用のhandsonTableを作成する
 * @returns
 */
function createSubPgmHot3(){
 let index = getSubPgmActiveTabIndex();
 // dataHotを設定する
 dataHotSubPgm = [{data: "No"},
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
 if(afterData.呼び出し編集仕様[index] === undefined){
  afterData.呼び出し編集仕様[index] =  {tables:[]};
  let data = {rows:[
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
  afterData.呼び出し編集仕様[index].tables.push(data);
 }
 /* イベント／サーバー側イベント */
 let hotOption = {
   //data: afterData.rowEvents,
   colHeaders: ["No","レベル","データ項目名称（設定先）","属性","桁数","小数桁数","USAGE","集団項目名/エンティティ名","データ項目名称(設定元)","編集要領"],
   colWidths: [30, 50, 300, 70, 70, 70,70,200,300,200],
   columns: dataHotSubPgm,
   data:[],
   contextMenu : {
     items: {
      "row_above": {name: '挿入（行）', 
       callback: function(id, range) {
        subPgmHot3.alter('insert_row', range[0].start.row, range[0].end.row - range[0].start.row + 1);
       }
      },
      "row_aboves": {name: '挿入（指定行）', 
       callback: function(id, range) {
        let rows = prompt("挿入する行数を入力してください", 0);
        subPgmHot3.alter('insert_row', range[0].start.row, rows);
       }
      },
      "remove_row": {name: '削除（行）' }
     }
   }
  };
 // 共通で設定されるオプションをセット
 setCommonHotOption(hotOption);
 subPgmHot3 = new Handsontable(document.getElementById('subPgmHot3'), hotOption);
}
/**
 * アクティブなタブのindexを取得する
 */
function getSubPgmActiveTabIndex() {
 return $(".subPgm_tab:not(.ui-sortable-placeholder)").index($(".subPgm_tab.active"));
}
/**
 * アクティブなタブの名称を取得する
 * @returns
 */
function getSubPgmActiveTabName(){
 return $(".subPgm_tab.active").text();
}
/**
 * バッチ内部処理記の概要タブの内容を保存
 * @returns
 */
function getBatchNaibuSubPgm(){
 let index = getSubPgmActiveTabIndex();
 if(index >= 0){
  afterData.呼び出し編集仕様[index].シート名 = getSubPgmActiveTabName();
  afterData.呼び出し編集仕様[index].外部呼出しタイプ = $("#外部呼出しタイプ").val();
  afterData.呼び出し編集仕様[index].外部呼出しプログラム名 = $("#外部呼出しプログラム名").val();
  afterData.呼び出し編集仕様[index].外部呼出しプログラムID = $("#外部呼出しプログラムID").val();
  afterData.呼び出し編集仕様[index].外部呼出しDAOID = $("#外部呼出しDAOID").val();
  for(let i = 0; i < afterData.呼び出し編集仕様[index].tables.length;i ++){
   afterData.呼び出し編集仕様[index].tables[i].集団項目名 = $("#集団項目名" + (i + 1)).val();
   afterData.呼び出し編集仕様[index].tables[i].コピー句ID = $("#コピー句ID" + (i + 1)).val();
  }
 }
}
/**
 * @returns
 */
function dispBatchNaibuSubPgm(){
 if(afterData.呼び出し編集仕様 === undefined){
  afterData.呼び出し編集仕様 = [];
 }
 for(let i = 0;i < afterData.呼び出し編集仕様.length;i++){
  addSubPgmTab(afterData.呼び出し編集仕様[i].シート名);
 }
 $($("#subPgm_tab_area").children(".subPgm_tab").get(0)).addClass("active");
 // handsonTable生成
 createSubPgmHot1();
 createSubPgmHot2();
 createSubPgmHot3();
 if(afterData.呼び出し編集仕様.length > 0){
  subPgmTabChange();
 }
}
/**
 * 指定したタブのindexを返す
 * @param $tab jQueryオブジェクト
 * @returns index 見つからないときは-1
 */
function getSubPgmTabIndex($tab) {
 return $("#subPgm_tab_area").children(".subPgm_tab").index($tab);
}
