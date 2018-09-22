/**
 * 高速ノード操作モード
 */
function initQuickMode(){
 $("#sTree").on({
  "mouseenter": function(){
   if($("#quickModeSwitch").hasClass("switch-ON")){
    $(this).addClass("quickModeHover")
   }
  },
  "mouseleave": function(){
   $(this).removeClass("quickModeHover")
  }
  }, ".node");
 $("#sTree").on("click",".quickModeHover",function(){
  $(".quickModeHighlight").removeClass("quickModeHighlight");
  $(this).addClass("quickModeHighlight");
 });
 // ショートカットキー
  $(document).on('keydown', function(e) {
   if ( e.ctrlKey && e.keyCode == 81) {
    $("#quickModeSwitch").trigger("click"); 
    return;
   }
   if($("#quickModeSwitch").hasClass("switch-ON")){
    // 描画中は動作しない
    if(dispProcPromiseList.length !== 0){
     return;
    }
    // ノードが選択済みか判定
    if($(".quickModeHighlight").length == 0){
     return;
    }
    // メッセージを表示する位置を取得
    let off = $(".quickModeHighlight").offset();
    // ctrl + ??? で動作するタイプのショートカット
    if(e.ctrlKey){
     switch (e.keyCode){
     case (68):// Dキー
     case (46):// deleteキー
     removeProc($(".quickModeHighlight").parent());
        fadeMessage("ノードを削除しました", off.top,  off.left, 2000);
        // 元のイベントをキャンセル
     cancelEvent(e);
      break;
     case (67):// Cキー
     anotherTabCopyNode($(".quickModeHighlight"), "copy");
      // 元のイベントをキャンセル
     cancelEvent(e);
      break;
     case (86):// Vキー
     pasteNode($(".quickModeHighlight"), "after");
     // 元のイベントをキャンセル
     cancelEvent(e);
      break;
     case (88):// Xキー
     anotherTabCopyNode($(".quickModeHighlight"), "cut");
      // 元のイベントをキャンセル
     cancelEvent(e);
     break;
     }
    }
    // ctrlキーを押していなくても動作するキー
    switch (e.keyCode){
     case (38):// ↑キー
        $origin = $(".quickModeHighlight").parent();
        if($origin.prev().length == 0){
         return;
        }
        $target = $origin.prev().children(".node");
        cutNode($(".quickModeHighlight"));
        pasteNode($target, "before");
        $target.parent().prev().children(".node").addClass("quickModeHighlight");
      break;
     case (40):// ↓キー
       $origin = $(".quickModeHighlight").parent();
       if($origin.next().length == 0){
        return;
       }
       $target = $origin.next().children(".node");
       cutNode($(".quickModeHighlight"));
       pasteNode($target, "after");
       $target.parent().next().children(".node").addClass("quickModeHighlight");
     break;
     case (37):// ←キー
       $origin = $(".quickModeHighlight").parent();
       $target = $origin.closest("UL").prev();
       if($target.length == 0){
        return;
       }
       cutNode($(".quickModeHighlight"));
       pasteNode($target, "after");
       $target.parent().next().children(".node").addClass("quickModeHighlight");
     break;
     case (39):// →キー
       $origin = $(".quickModeHighlight").parent();
       if($origin.prev().length == 0){
        return;
       } 
       $target = $origin.prev().children(".node");
       cutNode($(".quickModeHighlight"));
       pasteNode($target, "child");
       $target.parent().children("UL").children("li:last-child").children(".node").addClass("quickModeHighlight");
     break;
    }
   }
  });
}
