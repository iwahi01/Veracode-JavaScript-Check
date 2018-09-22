/**
* 処理機の処理項番等の自動採番ロジック関連
*/
/**
 * 処理項番の並べ替え
 * 
 * @param ul
 *            並び替えるルートのul要素
 */
function sortList(ul) {
 // 再帰用インナーファンクション
 function sortListInner(ul) { 
  var parentNum = ul.prev().children(".proc_num").val();
  let numStart = "";
  if (parentNum !== undefined && parentNum !== "") {
   numStart = parentNum + "." ;
  }
  let idx = 1;
  ul.children("li").each(function(i, li) {
   if($(li).children("div").children(".proc_num").length > 0){
    // 親ノードの番号を先頭につける。親ノードがない場合は空白
    $(li).children("div").children(".proc_num").val(numStart + idx);
    // 幅を調整する
    $(li).children("div").children(".proc_num").attr("size",strLength($(li).children("div").children(".proc_num").val()));
    idx ++ ;
   }
   // 子要素があればノードを閉じるボタンを表示される処理を呼び出す
   ul.children("li").each(function(i, li) {
    activateProcCloseBtn(this);
   });
   sortListInner($(li).children("ul"));
  });
 }
 // 自動採番が有効か判断
 if( $("#autoNumSwitch").length === 0 || $("#autoNumSwitch").hasClass("switch-ON")){
  // ノードの描画中に自動採番が動くと番号が狂うので、ここで待つ
  dispProcAfter(function(value) {
   // 並べ替えを実行
   sortListInner(ul);
   // 「リンク」ノードのリンク先付け替え
   $(".choose_proc").each(function() {
    searchProcNum($(this));
   }); 
   // デシジョンのリンク先付け替え
   $(".decisionDiv").each(function() {
    changeProcNum($(this));
   }); 
  });
 }
}
/**
 * 子が存在しているノードに対して、開閉可能にするボタンを追加する
 * @returns
 */
function activateProcCloseBtn(li){
 // ノードの開閉ボタン
 if ($(li).children("ul").length !== 0) {
  $(li).children(".node").children(".proc_close").removeClass("hidden");
 } else {
  $(li).children(".node").children(".proc_close").addClass("hidden");
 }
 if($(li).children(".node").hasClass("childClose")){
  $(li).children("ul").hide();
  $(li).children(".node").children(".proc_close").html("<i class='fa fa-plus'>");
  $(li).children(".node").children(".proc_close").addClass("proc_open");
  $(li).children(".node").children(".proc_close").removeClass("proc_close");
 }
}
/**
 * 処理項番振り直し時の処理番号リンク再セット
 * 
 * @param $chooseProc
 *            振りなおしするjQueryオブジェクト
 * 
 */
function searchProcNum($chooseProc) {
 var procnum = $chooseProc.next().next().text();
 var num = $("#" + procnum).children(".proc_num").val();
 if (num !== undefined &&　num !== "") {
  $chooseProc.val(num);
 } else {
  $chooseProc.addClass("highlight");
 }
}
/**
 * 処理項番振り直し時のディシジョン内処理番号再セット
 * 
 * @param $chooseProc
 *            振りなおしするjQueryオブジェクト
 * 
 */
function changeProcNum($chooseProc) {
 let hot = $chooseProc.handsontable('getInstance');
 if(hot == undefined) return;
 let rownum = hot.countRows();
 for(let i=0; i<rownum;i++) {
  let meta = hot.getCellMeta(i, 1);
  // 「条件」列にメタデータ「proc」が設定されている行がある場合
  if(meta.proc != undefined && meta.proc !== "NG") {
   let target = $("#" + meta.proc);
   let title = target.find(".proc_title").val();
   if(target.length != 0) {
    let num = target.children(".proc_num").val();
    if (num !== undefined &&　num !== "") {
     // デシジョンの処理項番を再セットする
     if(title !== "") {
      hot.setDataAtCell(i, 1, "処理" + num + "(" + title + ")" + "へ");
     } else {
      hot.setDataAtCell(i, 1, "処理" + num + title + "へ");
     }
    }
   }
  }
 }
}
/**
 * 条件項番の並べ替え
 * 
 * @param ul
 *            並び替えるルートのul要素
 */
function sortConditions(ul) {
 ul.children("li").each(function(i = 0,li) {
  var parentNum = $(li).parent().parent().children(".condition_content").children(
   ".condition_num").text();
  // ルートノードの場合
  if (parentNum === "" || parentNum === undefined) {
   $(li).children(".condition_content").children(".condition_num").text((i +
    1).toString());
  } else {
   $(li).children(".condition_content").children(".condition_num").text(
    parentNum + "." + (i + 1).toString());
  }
  sortConditions($(li).children("ul"));
 });
}
/**
 * 処理番号リンクのセット
 */
function setProcNum($chooseProc) {
 var procnum = $chooseProc.val();
 var targetId;
 $(".proc_num").each(function() {
  if ($(this).val() === procnum) {
   targetId = $(this).closest(".proc").attr("id");
  }
 });
 if (targetId === undefined) {
  $chooseProc.addClass("highlight");
 } else {
  $chooseProc.next().next().text(targetId);
  $chooseProc.removeClass("highlight");
 }
}
/**
 * リンク機能の処理番号をセットしなおす
 */
function resetProcNum() {
 $(".choose_proc").each(function() {
  setProcNum($(this));
 });
 $(".decisionDiv").each(function() {
  setProcNumDecision($(this));
 });
}
/**
 * ディシジョンの処理番号セット
 * @param $div
 * @returns
 */
function setProcNumDecision($div) {
 let hot = $div.handsontable('getInstance');
 if(hot == undefined) return;
 let rownum = hot.countRows();
 var renderflg = false;
 // 0行目はヘッダ、1行目は入力欄なので2行目から
 for(let i=2; i<rownum;i++) {
  let data = hot.getDataAtCell(i, 1);
  // 「条件」列に「処理x.x(xxx)へ」がある場合
  if(!_.isEmpty(data) && data.startsWith("処理") && data.endsWith("へ")) {
   renderflg = true;
   // 処理番号のみを取り出す
   var dat = data.replace("処理", "").replace(/(.*)へ/, "$1").split("(")[0];
   // 初期値でNGをセット
   hot.setCellMeta(i, 1, "proc", "NG");
   // 該当番号が見つかればIDをセット
   $(".proc_num").each(function() {
    if ($(this).val() === dat) {
     let targetId = $(this).closest(".proc").attr("id");
     hot.setCellMeta(i, 1, "proc", targetId);
     return;
    }
   });
  }
 }
 // 色を反映させるために再描画
 if(renderflg) {
  hot.render();
 }
}
