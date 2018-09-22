function initBatchNaibuGaiyou(){
 // 初期処理が必要となったらここで実装
}
function createGaiyouHot1(){
 // dataHotを設定する
 dataHot1 = [{data: "No"},
  {data: "プログラムタイプ", editor: 'select',selectOptions: ['', 'SA：全業務共通サブプログラム', 'SB：業務共通サブプログラム', 'SC：個別機能サブプログラム','SD：DAO（データアクセサー） ','NM：日本語マクロ']},
  {data: "名称"},
  {data: "ID"}, 
  {data: "コピー句ID"},
  {data: "接頭語"}];
 if(afterData.処理概要.外部呼出し === undefined || afterData.処理概要.外部呼出し.length == 0){
  afterData.処理概要.外部呼出し =  [{
   "No": "",
   "プログラムタイプ": "",
   "名称": "",
   "ID": "",
   "コピー句ID": "",
   "接頭語": ""
  }];
 }
 /* イベント／サーバー側イベント */
 let hotOption = {
   //data: afterData.rowEvents,
   colHeaders: ["No","プログラムタイプ","名称","ID","コピー句ID","接頭語"],
   colWidths: [30, 200, 300, 100, 150, 150],
   columns: dataHot1,
   data:afterData.処理概要.外部呼出し,
   contextMenu : {
     items: {
      "row_above": {name: '挿入（行）', 
       callback: function(id, range) {
        gaiyouHot1.alter('insert_row', range[0].start.row, range[0].end.row - range[0].start.row + 1);
       }
      },
      "row_aboves": {name: '挿入（指定行）', 
       callback: function(id, range) {
        let rows = prompt("挿入する行数を入力してください", 0);
        gaiyouHot1.alter('insert_row', range[0].start.row, rows);
       }
      },
      "remove_row": {name: '削除（行）' }
     }
   }
  };
 // 共通で設定されるオプションをセット
 setCommonHotOption(hotOption);
 gaiyouHot1 = new Handsontable(document.getElementById('gaiyouHot1'), hotOption);
}
function createGaiyouHot2(){
 dataHot2 = [
  {data: "No"},
  {data: "名称"},
  {data: "コピー句ID"},
  {data: "接頭語"}, 
  {data: "レベル", editor: 'select',selectOptions: ['', '01', '03', '05', '07','09']},
  {data: "IO", editor: 'select',selectOptions: ['', 'I:入力', 'O:出力', 'I/O:入出力']},
  {data: "種類", editor: 'select',selectOptions: ['', 'P：PG間I/F', 'D：DB(テーブル）', 'FF：固定長ﾌｧｲﾙ', 'FV：可変長ﾌｧｲﾙ','S ：SYSIN']},
  {data: "FD名"},
  {data: "DD名"}];
 if(afterData.処理概要.IO === undefined || afterData.処理概要.IO.length == 0){
  afterData.処理概要.IO =  [{
   "No": "",
   "名称": "",
   "コピー句ID": "",
   "接頭語": "",
   "レベル": "",
   "IO": "",
   "種類": "",
   "FD名": "",
   "DD名": "",
  }];
 }
 let hotOption = {
  columns: dataHot2,
  data:afterData.処理概要.IO,
  colHeaders: [
   "No",
   "DB名称/ファイル名称",
   "コピー句ID",
   "接頭語",
   "レベル",
   "I/O",
   "種類",
   "FD名",
   "DD名"
  ],
  colWidths: [30, 320, 100, 100, 50, 80,130,60,60],
  contextMenu : {
   items: {
    "row_above": {name: '挿入（行）', 
     callback: function(id, range) {
      gaiyouHot2.alter('insert_row', range[0].start.row, range[0].end.row - range[0].start.row + 1);
     }
    },
    "row_aboves": {name: '挿入（指定行）', 
     callback: function(id, range) {
      let rows = prompt("挿入する行数を入力してください", 0);
      gaiyouHot2.alter('insert_row', range[0].start.row, rows);
     }
    },
    "remove_row": {name: '削除（行）' }
   }
  }
 };
 // 共通で設定されるオプションをセット
 setCommonHotOption(hotOption);
 gaiyouHot2 = new Handsontable(document.getElementById('gaiyouHot2'), hotOption);
}
/**
 * handsonTableに共通でセットされるオプションをセット
 * @param hotOption
 * @returns
 */
function setCommonHotOption(hotOption){
 hotOption.minSpareRows =  0;
 hotOption.renderAllRows =  true;
 hotOption.search = false;
 hotOption.comments = false;
 hotOption.manualColumnMove = false;
 hotOption.manualColumnResize =  false;
 hotOption.manualRowMove =  true;
 hotOption.manualRowResize =  true;
 hotOption.autoWrapRow =  true;
 hotOption.autoWrapCol =  true;
 hotOption.filter = false;
}
/**
 * バッチ内部処理記の概要タブの内容を保存
 * @returns
 */
function getBatchNaibuGaiyou(){
 let gaiyou = {};
 gaiyou.プログラムタイプ = $("#プログラムタイプ").val();
 gaiyou.機能ID = $("#機能ID").val();
 gaiyou.内部設計テンプレート = $("#内部設計テンプレート").val();
 gaiyou.HLLWBテンプレート = $("#HLLWBテンプレート").val();
 gaiyou.機能概要 = $("#機能概要").val();
 gaiyou.特記事項 = $("#特記事項").val();
 gaiyou.外部設計バッチ処理記述リファレンス = $("#外部設計バッチ処理記述リファレンス").val();
 gaiyou.外部呼出し = afterData.処理概要.外部呼出し;
 gaiyou.IO = afterData.処理概要.IO;
 afterData.処理概要 = gaiyou;
}
/**
 * バッチ内部処理記の概要タブの内容を画面にセット
 * @returns
 */
function dispBatchNaibuGaiyou(){
 if(afterData.処理概要 === undefined){
  afterData.処理概要 = {};
 }
 $("#プログラムタイプ").val(afterData.処理概要.プログラムタイプ);
 $("#機能ID").val(afterData.処理概要.機能ID);
 $("#内部設計テンプレート").val(afterData.処理概要.内部設計テンプレート);
 $("#HLLWBテンプレート").val(afterData.処理概要.HLLWBテンプレート);
 $("#機能概要").val(afterData.処理概要.機能概要);
 $("#特記事項").val(afterData.処理概要.特記事項);
 $("#外部設計バッチ処理記述リファレンス").val(afterData.処理概要.外部設計バッチ処理記述リファレンス);
 // handsonTable生成
 createGaiyouHot1();
 createGaiyouHot2();
}
