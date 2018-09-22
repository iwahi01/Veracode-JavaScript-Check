function initBatchNaibuWorkArea(){
 // 初期処理が必要となったらここで実装
}
function createWorkAreaHot1(){
 // dataHotを設定する
 dataHot1 = [{data: "No"},
  {data: "レベル", editor: 'select',selectOptions: ['01', '03', '05', '07','09']},
  {data: "データ項目名称"},
  {data: "属性"}, 
  {data: "桁数"},
  {data: "小数桁数"},
  {data: "USAGE"},
  {data: "再定義データ項目名称"},
  {data: "繰り返し"},
  {data: "VALUE値"},
  {data: "使用用途"},
  {data: "エリアタイプ"}];
 if(afterData.ワークエリア.rows === undefined || afterData.ワークエリア.rows.length == 0){
  afterData.ワークエリア.rows =  [{
   "No": "",
   "レベル": "",
   "データ項目名称": "",
   "属性": "",
   "桁数": "",
   "小数桁数": "",
   "USAGE": "",
   "再定義データ項目名称": "",
   "繰り返し": "",
   "VALUE値": "",
   "使用用途": "",
   "エリアタイプ": ""
  }];
 }
 /* イベント／サーバー側イベント */
 let hotOption = {
   //data: afterData.rowEvents,
   colHeaders: ["No","レベル","データ項目名称","属性","桁数","小数桁数","USAGE","再定義データ項目名称","繰り返し","VALUE値/接頭語","使用用途・説明","エリアタイプ"],
   colWidths: [30, 50, 300, 80,80,80,80,100,80,150,150,100],
   columns: dataHot1,
   data:afterData.ワークエリア.rows,
   contextMenu : {
     items: {
      "row_above": {name: '挿入（行）', 
       callback: function(id, range) {
        workAreaHot1.alter('insert_row', range[0].start.row, range[0].end.row - range[0].start.row + 1);
       }
      },
      "row_aboves": {name: '挿入（指定行）', 
       callback: function(id, range) {
        let rows = prompt("挿入する行数を入力してください", 0);
        workAreaHot1.alter('insert_row', range[0].start.row, rows);
       }
      },
      "remove_row": {name: '削除（行）' }
     }
   }
  };
 // 共通で設定されるオプションをセット
 setCommonHotOption(hotOption);
 workAreaHot1 = new Handsontable(document.getElementById('workAreaHot1'), hotOption);
}
/**
 * バッチ内部処理記の概要タブの内容を保存
 * @returns
 */
function getBatchNaibuWorkArea(){
 let workArea = {};
 workArea.rows = afterData.ワークエリア.rows;
 afterData.ワークエリア = workArea;
}
/**
 * バッチ内部処理記の概要タブの内容を画面にセット
 * @returns
 */
function dispBatchNaibuWorkArea(){
 if(afterData.ワークエリア === undefined){
  afterData.ワークエリア = {};
 }
 // handsonTable生成
 createWorkAreaHot1();
}
