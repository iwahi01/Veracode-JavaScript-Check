/**
 * 右クリックメニューの初期化を行う
 * @returns
 */
function initContextMenu() {
 // 右クリックメニュー
 $.contextMenu({
  // define which elements trigger this menu
  selector : ".node",
  // define the elements of the menu
  items : {
   copy : {
    name : "コピー",
    disabled : false,
    callback : function(key, opt) {
     anotherTabCopyNode($(this), "copy");   
    }
   },
   cut : {
    name : "切り取り",
    disabled : false,
    callback : function(key, opt) {
     anotherTabCopyNode($(this), "cut");
    }
   },
   inserta : {
    name : "前に挿入",
    disabled :false,
    callback : function(key, opt) {
     pasteNode($(this), "before");
    }
   },
   insertb : {
    name : "後に挿入",
    disabled : false,
    callback : function(key, opt) {
     pasteNode($(this), "after");
    }
   },
   insertc : {
    name : "子として貼り付け",
    disabled : false,
    callback : function(key, opt) {
     pasteNode($(this), "child");
    }
   },
   changeMark : {
    name : "変更マーク",
    disabled : false,
    callback : function(key, opt) {
     toggleChangeData($(this));
    }
   },
   addIPOin : {
    name : "IPO : INPUT追加",
    disabled : false,
    callback : function(key, opt) {
     addIpoIn($(this));
    }
   },
   addIPOout : {
    name : "IPO : OUTPUT追加",
    disabled : false,
    callback : function(key, opt) {
     addIpoOut($(this));
    }
   },
   addPageBreak : {
    name : "改ページの挿入",
    disabled : false,
    callback : function(key, opt) {
     $(this).addClass("pagebreak");
    }
   },
   removePageBreak : {
    name : "改ページの削除",
    disabled : false,
    callback : function(key, opt) {
     $(this).removeClass("pagebreak");
    }
   }
  },
  events: {
            show: function(options){
             if($(this).hasClass("pagebreak")) {
              options.items.addPageBreak.disabled = true;
              options.items.removePageBreak.disabled = false;
             } else {
              options.items.addPageBreak.disabled = false;
              options.items.removePageBreak.disabled = true;
             }
            },
  },
  zIndex : 1000
 });
 // ディシジョンの右クリックメニュー
 $.contextMenu({
  // define which elements trigger this menu
  //selector : ".decisionDiv > ht_master> wtHolder > wtHider > wtSpreader > htCore",
  selector : ".decisionDiv .htCore",
  // define the elements of the menu
  items : {
   item1 : {
    name : "入力を追加",
    disabled : false,
    callback : function(key, opt) {
     let $ss = $(this).closest(".decisionDiv");
     let hot = $ss.handsontable('getInstance');
     addDecisonInput(hot,"");
     hot.render();
    }
   },
   item2 : {
    name : "処理を追加",
    disabled : false,
    callback : function(key, opt) {     
     let $ss = $(this).closest(".decisionDiv");
     let hot = $ss.handsontable('getInstance');
     addDecisionProcess(hot,"");
     hot.render();
    }
   },
   item3 : {
    name : "列の追加",
    disabled :false,
    callback : function(key, opt) {
     let $ss = $(this).closest(".decisionDiv");
     let hot = $ss.handsontable('getInstance');
     addDecisionPattern(hot);
     hot.render();
    }
   },
   item4 : {
    name : "「左記以外」の列の追加",
    disabled : false,
    callback : function(key, opt) {
     let $ss = $(this).closest(".decisionDiv");
     let hot = $ss.handsontable('getInstance');
     addDecisionPatternElse(hot);
     hot.render();
    }
   },
   item5 : {
    name : "行の削除",
    disabled : false,
    callback : function(key, opt) {
     if(hotRange == undefined){
      alert("削除する行を選択してください。");
      return;
     }
     let $ss = $(this).closest(".decisionDiv");
     let hot = $ss.handsontable('getInstance');
     delDecisionRow(hot,hotRange[0].from.row);
     hot.render();
    }
   },
   item6 : {
    name : "列の削除",
    disabled : false,
    callback : function(key, opt) {
     if(hotRange == undefined){
      alert("削除する列を選択してください。");
      return;
     }
     let $ss = $(this).closest(".decisionDiv");
     let hot = $ss.handsontable('getInstance');
     delDecisionCol(hot,hotRange[0].from.col);
     hot.render();
    }
   },
   item7 : {
    name : "変更点マーク追加",
    disabled : false,
    callback : function(key, opt) {
     let $ss = $(this).closest(".decisionDiv");
     let hot = $ss.handsontable('getInstance');
     if(hotRange == undefined){
      alert("変更点マークを追加するセルを選択してください。");
      return;
     }
     for(var i=hotRange[0].from.row; i<=hotRange[0].to.row; i++) {
      for(var j=hotRange[0].from.col; j<=hotRange[0].to.col; j++) {
       let className = hot.getCellMeta(i,j).className;
       if(className === undefined || className === ""){
        className = "changed";
       } else{
        className = className + " changed";
       }
       hot.setCellMeta(i,j,"className",className);
      }
     }
     // handsontableをすべて再描画（各jsに実装すること)
     hot.render();
    }
   },
   item8 : {
    name : "変更点マーク削除",
    disabled : false,
    callback : function(key, opt) {
     let $ss = $(this).closest(".decisionDiv");
     let hot = $ss.handsontable('getInstance');
     if(hotRange == undefined){
      alert("変更点マークを削除するセルを選択してください。");
      return;
     }
     for(var i=hotRange[0].from.row; i<=hotRange[0].to.row; i++) {
      for(var j=hotRange[0].from.col; j<=hotRange[0].to.col; j++) {
       let className = hot.getCellMeta(i,j).className;
       if(className === undefined || className === ""){
        className = "";
       } else{
        className = className.replace("changed","");
       }
       hot.setCellMeta(i,j,"className",className);
      }
     }
     // handsontableをすべて再描画（各jsに実装すること)
     hot.render();
    }
   },
   item9: {
    name: "処理リンク追加",
    disabled: true,
    callback: function(key, opt) {
     $("#proclink_add_text").val("");
     $("#proclink_add_area").removeClass("hidden");
     $("#proclink_add_text").focus();
     numlist = [];
     $(".proc_num").each(function() {
      var num = $(this).val();
      if (num !== "処理番号") {
       numlist.push(num);
      }
     });
     $("#proclink_add_text").autocomplete({
      source: numlist,
      autoFocus : true,
      delay : 500,
      minLength : 0
     });
    }
   }
  },
  events: {
            show: function(options) {
             let $ss = $(this).closest(".decisionDiv");
    let hot = $ss.handsontable('getInstance');
    hotRange = hot.getSelectedRange();
    // 「処理」行の「条件」列のみ「処理リンクの追加」を活性化
    if(hotRange != undefined) { 
     let cell = hotRange[0].from;
     if(hotRange[0].from.col == 1
       && hot.getDataAtCell(cell.row, 1)) {
      $("#proclink_add_area").data("hot", hot);
      $("#proclink_add_area").data("cell", hotRange[0].from);  
      options.items.item9.disabled = false;
     }
    }
            },
            hide: function(options) {
             options.items.item9.disabled = true;
            }
  },
  zIndex : 1000
 });
 // 自由記述ノードの表の右クリックメニュー
 $.contextMenu({
  // define which elements trigger this menu
  //selector : ".decisionDiv > ht_master> wtHolder > wtHider > wtSpreader > htCore",
  selector : ".hyou .htCore",
  // define the elements of the menu
  items : {
   item1 : {
    name : "行を挿入",
    disabled : false,
    callback : function(key, opt) {
     let $ss = $(this).closest(".hyou");
     let hot = $ss.handsontable('getInstance');
     let rowNum = hotRange[0].to.row - hotRange[0].from.row + 1;
     let startRow = hotRange[0].from.row;
     if(rowNum <= 0){
      rowNum = hotRange[0].from.row - hotRange[0].to.row + 1;
      startRow = hotRange[0].to.row;
     }
     hot.alter('insert_row',startRow,rowNum);
     hot.render();
    }
   },
   item2 : {
    name : "列を挿入",
    disabled :false,
    callback : function(key, opt) {
     let $ss = $(this).closest(".hyou");
     let hot = $ss.handsontable('getInstance');
     let colNum = hotRange[0].to.col - hotRange[0].from.col + 1;
     let startCol = hotRange[0].from.col;
     if(colNum <= 0){
      colNum = hotRange[0].from.col - hotRange[0].to.col + 1;
      startCol = hotRange[0].to.col;
     }
     hot.alter('insert_col',startCol,colNum);
     hot.render();
    }
   },
   item3 : {
    name : "行を削除",
    disabled : false,
    callback : function(key, opt) {
     if(hotRange == undefined){
      alert("削除する行を選択してください。");
      return;
     }
     let $ss = $(this).closest(".hyou");
     let hot = $ss.handsontable('getInstance');
     let rowNum = hotRange[0].to.row - hotRange[0].from.row + 1;
     let startRow = hotRange[0].from.row;
     if(rowNum <= 0){
      rowNum = hotRange[0].from.row - hotRange[0].to.row + 1;
      startRow = hotRange[0].to.row;
     }
     hot.alter('remove_row', startRow,rowNum);
     hot.render();
    }
   },
   item4 : {
    name : "列を削除",
    disabled : false,
    callback : function(key, opt) {
     if(hotRange == undefined){
      alert("削除する列を選択してください。");
      return;
     }
     let $ss = $(this).closest(".hyou");
     let hot = $ss.handsontable('getInstance');
     let colNum = hotRange[0].to.col - hotRange[0].from.col + 1;
     let startCol = hotRange[0].from.col;
     if(colNum <= 0){
      colNum = hotRange[0].from.col - hotRange[0].to.col + 1;
      startCol = hotRange[0].to.col;
     }
     hot.alter('remove_col', startCol,colNum);
     hot.render();
    }
   },
   item5 : {
    name : "変更点マーク追加",
    disabled : false,
    callback : function(key, opt) {
     let $ss = $(this).closest(".hyou");
     let hot = $ss.handsontable('getInstance');
     if(hotRange == undefined){
      alert("変更点マークを追加するセルを選択してください。");
      return;
     }
     for(var i=hotRange[0].from.row; i<=hotRange[0].to.row; i++) {
      for(var j=hotRange[0].from.col; j<=hotRange[0].to.col; j++) {
       let className = hot.getCellMeta(i,j).className;
       if(className === undefined || className === ""){
        className = "changed";
       } else{
        className = className + " changed";
       }
       hot.setCellMeta(i,j,"className",className);
      }
     }
     // handsontableをすべて再描画（各jsに実装すること)
     hot.render();
    }
   },
   item6 : {
    name : "変更点マーク削除",
    disabled : false,
    callback : function(key, opt) {
     let $ss = $(this).closest(".hyou");
     let hot = $ss.handsontable('getInstance');
     if(hotRange == undefined){
      alert("変更点マークを削除するセルを選択してください。");
      return;
     }
     for(var i=hotRange[0].from.row; i<=hotRange[0].to.row; i++) {
      for(var j=hotRange[0].from.col; j<=hotRange[0].to.col; j++) {
       let className = hot.getCellMeta(i,j).className;
       if(className === undefined || className === ""){
        className = "";
       } else{
        className = className.replace("changed","");
       }
       hot.setCellMeta(i,j,"className",className);
      }
     }
     // handsontableをすべて再描画（各jsに実装すること)
     hot.render();
    }
   }
  },
  events: {
            show: function(){
             let $ss = $(this).closest(".hyou");
    let hot = $ss.handsontable('getInstance');
    hotRange = hot.getSelectedRange();
            },
  },
  zIndex : 1000
 });
 // 右クリックメニュー
 $.contextMenu({
  // define which elements trigger this menu
  selector : ".ipoElement",
  // define the elements of the menu
  items : {
   deleteElement : {
    name : "削除",
    disabled : false,
    callback : function(key, opt) {
     $(this).remove();
    }
   },
   changeMark : {
    name : "変更マーク",
    disabled : false,
    callback : function(key, opt) {
     toggleChangeData($(this));
    }
   }
  },
  zIndex : 1000
 // there's more, have a look at the demos and docs...
 });
 // 右クリックメニュー
 $.contextMenu({
  // define which elements trigger this menu
  selector : ".subnode",
  // define the elements of the menu
  items : {
   changeMark : {
    name : "変更マーク",
    disabled : false,
    callback : function(key, opt) {
     toggleChangeData($(this));
    }
   }
  },
  zIndex : 1000
 // there's more, have a look at the demos and docs...
 });
}
/**
 * ノードの貼り付け処理
 * 
 * @param $proc
 *            貼り付け先のproc(JQueryオブジェクト)
 * @param ba
 *            before:前 or after:後(String)
 */
function pasteNode($proc, ba) {
 document.body.style.cursor = 'wait';
 // ノードの表示を待って実行する
 dispProcAfter(function(value) {
  var $li = anotherTabPasteNode($proc);
  if (ba == "before") {
   $proc.parent().before($li);
  } else if (ba == "after") {
   $proc.parent().after($li);
  } else {
   // 既に子として貼り付いているから何もしなくてよい
  }
  if($li == null) {
   return;
  }
  sortList($proc.closest("ul"));
  let off =$proc.offset();
  fadeMessage("ノードを挿入しました", off.top,  off.left, 2000);
  document.body.style.cursor = 'auto';
 });
}
/**
 * ノードを複製し、イベントもセットする
 */
function cloneNode($proc) {
 let $clone = $proc.clone();
 $clone.find(".input_value").each(function() {
  setDroppableResourceItemRow($(this));
 });
 return $clone;
}
/**
 * 引数で渡されたprocをマーキングする
 */
function marking($proc) {
 $proc.toggleClass("marked");
 $proc.children(".proc_content").toggleClass("marked");
}
/**
 * localStorageを使ってノードの情報をコピーする
 * @param $proc
 * @returns
 */
function anotherTabCopyNode($proc, ope) {
 document.body.style.cursor = 'wait';
 // ノードの表示を待って実行する
 dispProcAfter(function(value) {
  let procData = getProcData($proc);
  // IDとコピー方法を保存情報に付与
  procData.id = $proc.attr("id");
  procData.ope = ope;
  // 文字列にしてlocalStorageに保存
  let nodeData = JSON.stringify(procData);
  localStorage.setItem('shorikiNode', nodeData);
  document.body.style.cursor = 'auto';
  // フェードメッセージの表示
  let off = $proc.offset();
  if(ope == "cut") {
   fadeMessage("ノードを切り取りました", off.top,  off.left, 2000);
   $proc.parent().remove();
  } else {
   fadeMessage("ノードをコピーしました", off.top,  off.left, 2000); 
  }
 });
}
/**
 * localStorageからノードの情報を貼り付ける
 * @param $proc
 * @returns
 */
function anotherTabPasteNode($proc) {
 var node;
 try {
  node = JSON.parse(localStorage.getItem('shorikiNode'));
  if(_.isEmpty(node)) {
   alert("ノードをコピーしてください");
   return;
  }
 } catch (e) {
  alert("ノードをコピーしてください");
  return;
 }
 dispProc($proc.parent(), node);
 // 追加したLiを返す（なんらかの操作を後に実行する場合のため）
 var $li = $proc.parent().children("ul").children("li:last-child");
 // 切り取りの場合
 if(node.ope == "cut") {
  // IDは貼り付け前と同じにする
  if( $("#" + node.id).length == 0) {
   $li.children(".proc").attr("id", node.id);
  }
  // ローカルストレージから消去する
  localStorage.removeItem('shorikiNode');
 }
 return $li;
}
