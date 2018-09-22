var bdto = {
  sinkibanlayout : [{name: "階層1",displayName: "階層1",data: "階層1",combo: ["Y", "-"]},
   {name: "階層2",displayName: "階層2",data: "階層2",combo: ["Y", "-"]},
   {name: "階層3",displayName: "階層3",data: "階層3",combo: ["Y", "-"]},
   {name: "項目名",displayName: "項目名",data: "項目名",hissu: true},
   {name: "ストアID", displayName: "ストアID",data: "ストアID" },
   {name: "ストア名", displayName: "ストア名",data: "ストア名" }, 
   {name: "データ項目名",displayName: "データ項目名",data: "データ項目名"},
   {name: "一覧",displayName: "一覧",data: "一覧",combo: ["Y", "-"]},
   {name: "IO区分", displayName: "I/O区分", data: "IO区分", combo: ["I", "O"]},
   {name: "型名",displayName: "型名",data: "型名",hissu: true, ecombo:["int","String","BigDecimal","Timestamp","File"]},
   {name: "プロパティー名", displayName: "プロパティー名",data: "プロパティー名", hissu: true},
   {name: "DBアクセスID",displayName: "DBアクセスID",data: "DBアクセスID"}, 
   {name: "備考",displayName: "備考",data: "備考"}],
  jpassLayout: [{name: "項目名", displayName: "項目名", data: "項目名", hissu: true },
   {name: "プロパティー名", displayName: "変数", data: "プロパティー名", hissu: true },
   {name: "型名", displayName: "データ型", data: "型名", hissu: true},
   {name: "入力", displayName: "入力", data: "入力" },
   {name: "出力",displayName: "出力", data: "出力" },
   {name: "備考",displayName: "備考",data: "備考"}
   ],
  mallLayout : [
   {name: "項目名",displayName: "項目名",data: "項目名",hissu: true},
   {name: "プロパティー名", displayName: "変数名",data: "プロパティー名", hissu: true },
   {name: "型名",displayName: "型", data: "型名",hissu: true },
   {name: "備考",displayName: "備考",data: "備考"}],
};
$(function () {
 $("body").on("focus", "input[type=text]", function () {
  if (helps !== undefined) {
   helpTitle = $(this).attr("id");
   // ヘルプ情報の書き換え
   setHelp(helps);
  }
 });
 $("body").on("click", "div[class^='ss']", function () {
  if (helps !== undefined) {
   helpTitle = getActiveSheet().getCell(0, getActiveSheet().getActiveColumnIndex(), GC.Spread.Sheets.SheetArea.colHeader).text();
   // ヘルプ情報の書き換え
   setHelp(helps);
  }
 });
});
var helpInfo = function () {
 if (helpTitle === undefined) {
  helpTitle = getActiveSheet().getCell(0, getActiveSheet().getActiveColumnIndex(), GC.Spread.Sheets.SheetArea.colHeader).text();
 }
 return {
  url: "/Radget/json/bdto.json",
  title: helpTitle
 };
};
 function helpChooseSys(data) {
  switch (sys) {
   default:
    // 新基盤,PARKS
    return data["DEFAULT"];
   case "J-PASS":
    return data["J-PASS"];
   case "モール":
    return data["MALL"];
  }
 }
function setRes(res) {
 var data;
 if (res !== null && res !== "") {
  beforeData = res;
  afterData = JSON.parse(JSON.stringify(beforeData));
  //0行で保存されたデータを読むとbindできなくなるので、1行作成してからbind
  for (let layout of afterData.layoutList) {
   if (layout.rows.length === 0) {
    layout.rows = [{}];
   }
  }
 } else {
  beforeData = {
   layoutList: []
  };
  afterData = beforeData;
  setNewLayout();
  var newLayout = JSON.parse(JSON.stringify(layoutJSON));
  afterData.layoutList.push(newLayout);
  afterData.BussinessFacade名 = "";
  afterData.BDTO名 = "";
  afterData.セッションDTO名 = "";
  afterData.クラス名_JPASS = "";
 }
 // システムによって表示項目編集
 systemViewSetting();
 // 成功時処理
 $("#システムID").val(afterData.システムID); 
 $("#BussinessFacade名").val(afterData.BussinessFacade名);
 $("#BDTO名").val(afterData.BDTO名);
 $("#セッションDTO名").val(afterData.セッションDTO名);
 $("#クラス名_JPASS").val(afterData.クラス名_JPASS);
 //レイアウト数を取得
 layoutMax = afterData.layoutList.length;
 // 初期表示
 initSpreadSheet(SPREADSHEETSID);
 getLayoutInfo(0);
 autoSizeCol(0);
 let spread = getSpread();
 //ドラッグ&ドロップを禁止
 spread.AllowColumnMove = false;
 activeIndex = 0;
 /* activeシートが変わった時 */
 spread.bind(GC.Spread.Sheets.Events.ActiveSheetChanged, function(e, args) {
  var spread = getSpread();
  var beforeIndex = args.oldSheet.getParent().getSheetIndex(args.oldSheet.name());
  if (spread.getSheetCount() == layoutMax) {
   /* シート切替 */
   // タイトル編集内容を保存
   setAfterData(beforeIndex);
   sheetNameSet(beforeIndex);
   // activeシートのタイトル取得
   getLayoutInfo(getActiveIndex());
   autoSizeRow(getActiveIndex());
  } else if (spread.getSheetCount() > layoutMax) {
   /* シート追加 */
   // 現在の編集内容を保存
   setAfterData(beforeIndex);
   // 編集内容をSpreadJs表に反映
   editSheet = spread.sheets[beforeIndex];
   sheetNameSet(beforeIndex);
   // 新規レイアウト作成を呼び出し
   addStyle();
  }
  activeIndex = getActiveIndex();
 });
 // シート名変更時
 spread.bind(GC.Spread.Sheets.Events.SheetNameChanged, function(e, args) {
  // SpreadJsシート名をセット
  sheetNameSet_s2a(args.sheet.parent.sheets.indexOf(args.sheet), args.newValue);
  $("#イベントID").val(args.newValue);
 });
};
//<!--------------------------------- システム別項目定義 -------------------------------->
function systemViewSetting() {
 //システムに応じて不要なヘッダー情報を削除する
 switch (sys) {
  default:
   // 新基盤、PARKS
   $(".JPASS_ONLY").remove();
   $(".MALL_ONLY").remove();
   break;
  case "J-PASS":
   $(".SHINKIBAN_ONLY").remove();
   $(".MALL_ONLY").remove();
   break;
  case "モール":
   $(".JPASS_ONLY").remove();
   $(".SHINKIBAN_ONLY").remove();
   break;
 }
 //システムごとのカラム情報を設定
 switch (sys) {
  default:
   // 新基盤、PARKS
   colInfos = bdto.sinkibanlayout;
   break;
  case "J-PASS":
   colInfos = bdto.jpassLayout;
   break;
  case "モール":
   colInfos = bdto.mallLayout;
   break;
 }
 // 保存するファイル名を設定する
 switch (sys) {
  case "J-PASS":
   afterData.BussinessFacade名 = afterData.セッションDTO名;
   afterData.BDTO名 = afterData.クラス名_JPASS;
   break;
  case "モール":
   afterData.BussinessFacade名 = afterData.layoutList[0].アプリID;
   afterData.BDTO名 = afterData.layoutList[0].アプリ名;
   break;
 }
}
function setNewLayout() {
 //システムごとのカラム情報を設定
 layoutJSON = {
  "画面ID": "",
  "イベントID": "",
  "メソッド名": "",
  "アプリID": "",
  "アプリ名": "",
  "クラス名_モール": "",
  "プロパティファイルキー名": "",
  "画面ID_JPASS": "",
  "イベントID_JPASS": "",
  "rows": [{}]
 };
}
// シート名をリセットする(afterData→spreadJS)
function sheetNameSet(idx, newname) {
 var editSheet = getSpread().sheets[idx]; 
 if(newname === undefined) {
  // シート追加、シート名を直接編集した場合
  switch (sys) {
  default:
   // 新基盤、PARKS
   if (!(afterData.layoutList[idx].イベントID)) {
    afterData.layoutList[idx].イベントID = "イベントIDを入力してください" + idx;
   }
   try {
    editSheet.name(afterData.layoutList[idx].イベントID);
   } catch(e) {
    alert("イベントIDは重複しないよう入力してください。");
    $("#イベントID").val(afterData.layoutList[idx].イベントID);
   }
   break;
  case "J-PASS":
   if (!(afterData.layoutList[idx].画面ID_JPASS)) {
    afterData.layoutList[idx].画面ID_JPASS = "画面IDを入力してください" + idx;
   }
   try {
    editSheet.name(afterData.layoutList[idx].画面ID_JPASS);
   } catch(e) {
    alert("画面IDは重複しないよう入力してください。");
    $("#画面ID_JPASS").val(afterData.layoutList[idx].画面ID_JPASS);
   }
   break;
  case "モール":
   if (!(afterData.layoutList[idx].クラス名_モール)) {
    afterData.layoutList[idx].クラス名_モール = "クラス名を入力してください" + idx;
   }
   try {
    editSheet.name(afterData.layoutList[idx].クラス名_モール);
   } catch(e) {
    alert("クラス名は重複しないよう入力してください。");
    $("#クラス名_モール").val(afterData.layoutList[idx].クラス名_モール);
   }
   break;
  }
 } else {
  // ヘッダーの値を変えた場合
  if (newname != "") {
   switch (sys) {
   default:
    // 新基盤、PARKS
    try {
     editSheet.name(newname);
     afterData.layoutList[idx].イベントID = newname;
    } catch(e) {
     alert("イベントIDは重複しないよう入力してください。");
     $("#イベントID").val(afterData.layoutList[idx].イベントID);
    }
    break;
   case "J-PASS":
    try {
     editSheet.name(newname);
     afterData.layoutList[idx].画面ID_JPASS = newname;
    } catch(e) {
     alert("画面IDは重複しないよう入力してください。");
     $("#画面ID_JPASS").val(afterData.layoutList[idx].画面ID_JPASS);
    }
    break;
   case "モール":
    try {
     editSheet.name(newname);
     afterData.layoutList[idx].クラス名_モール = newname;
    } catch(e) {
     alert("クラス名は重複しないよう入力してください。");
     $("#クラス名_モール").val(afterData.layoutList[idx].クラス名_モール);
    }
    break;
   }
  }
 }
}
//onload処理
$(function() {
 $("body").on("change", "#イベントID", function() {
  sheetNameSet(activeIndex, $(this).val());
 });
 $("body").on("change", "#画面ID_JPASS", function() {
  sheetNameSet(activeIndex, $(this).val());
 });
 $("body").on("change", "#クラス名_モール", function() {
  sheetNameSet(activeIndex, $(this).val());
 });
});
//シート名をリセットする(spreadJS→afterData)
function sheetNameSet_s2a(idx, sheetName) {
 switch (sys) {
  default:
   // 新基盤、PARKS
   afterData.layoutList[idx].イベントID = sheetName;
   break;
  case "J-PASS":
   afterData.layoutList[idx].画面ID_JPASS = sheetName;
   break;
  case "モール":
   afterData.layoutList[idx].クラス名_モール = sheetName;
   break;
 }
}
function sheetNameGet(idx) {
 switch (sys) {
  default:
   // 新基盤、PARKS
   return afterData.layoutList[idx].イベントID;
   break;
  case "J-PASS":
   return afterData.layoutList[idx].画面ID_JPASS;
   break;
  case "モール":
   return afterData.layoutList[idx].クラス名_モール;
   break;
 }
}
function colInfosSet(idx) {
 return true;
}
//<!------------------------------------ 個別機能定義 ------------------------------------>
// ファイル名取得 
function getFileName() {
 switch (sys) {
  default:
   // 新基盤、PARKS
   return $("#BussinessFacade名").val() + "_" + $("#BDTO名").val() + ".xml";
   break;
  case "J-PASS":
   return $("#セッションDTO名").val() + "_" + $("#クラス名_JPASS").val() + ".xml";
   break;
  case "モール":
   return $("#アプリID").val() + "_" + $("#アプリ名").val() + ".xml";
   break;
 }
}
// 表示用データをセット
function getRowData(idx) {
 return afterData.layoutList[idx].rows;
}
/* afterData保存 */
//保存イベント用・レイアウト切替時にも使用する
function setAfterData(idx) {
 if(idx === undefined) {
  idx = getActiveIndex();
 }
 switch (sys) {
 default:
  // 新基盤、PARKS
  sheetLayoutSort("イベントID");
  break;
 case "J-PASS":
  sheetLayoutSort("画面ID_JPASS");
  break;
 case "モール":
  sheetLayoutSort("クラス名_モール");
  break;
 }
 //画面からデータをセット
 afterData.システムID = $("#システムID").val();
 afterData.BDTO名 = $("#BDTO名").val();
 afterData.BussinessFacade名 = $("#BussinessFacade名").val();
 afterData.セッションDTO名 = $("#セッションDTO名").val();
 afterData.クラス名_JPASS = $("#クラス名_JPASS").val();
 afterData.アプリID = $("#アプリID").val();
 afterData.アプリ名 = $("#アプリ名").val();
 afterData.layoutList[idx].画面ID = $("#画面ID").val();
 afterData.layoutList[idx].イベントID = $("#イベントID").val();
 afterData.layoutList[idx].メソッド名 = $("#メソッド名").val();
 afterData.layoutList[idx].アプリID = $("#アプリID").val();
 afterData.layoutList[idx].アプリ名 = $("#アプリ名").val();
 afterData.layoutList[idx].クラス名_モール = $("#クラス名_モール").val();
 afterData.layoutList[idx].プロパティファイルキー名 = $("#プロパティファイルキー名").val();
 afterData.layoutList[idx].画面ID_JPASS = $("#画面ID_JPASS").val();
 afterData.layoutList[idx].イベントID_JPASS = $("#イベントID_JPASS").val();
}
/* afterData取得 */
function getLayoutInfo(idx) {
 // レイアウト情報取得
 $("#画面ID").val(afterData.layoutList[idx].画面ID);
 $("#イベントID").val(afterData.layoutList[idx].イベントID);
 $("#メソッド名").val(afterData.layoutList[idx].メソッド名);
 $("#アプリID").val(afterData.layoutList[idx].アプリID);
 $("#アプリ名").val(afterData.layoutList[idx].アプリ名);
 $("#クラス名_モール").val(afterData.layoutList[idx].クラス名_モール);
 $("#プロパティファイルキー名").val(afterData.layoutList[idx].プロパティファイルキー名);
 $("#画面ID_JPASS").val(afterData.layoutList[idx].画面ID_JPASS);
 $("#イベントID_JPASS").val(afterData.layoutList[idx].イベントID_JPASS);
}
//印刷用処理を定義
function printData() {
 //印刷プレビュー画面を開く
 subWindow = window.open('/Radget/html/printPreview.html');
}
//印刷ビューの生成処理 
//印刷ビューから呼び出される
function printViewInit() {
 //子画面にHandsonTableを作成
 var activeIndex =  getActiveIndex();
 subWindow.createHot(afterData.layoutList[activeIndex].rows, colInfos);
 subWindow.createHeader($("#gw_repo").text(), $("#gw_branch").text(), $(
  "#gw_directory").text(), getFileName());
}
function downloadFile() {
 var uri = makeURI("design/excel");
 location.href = uri;
 location.href = encodeURI(uri);
}
