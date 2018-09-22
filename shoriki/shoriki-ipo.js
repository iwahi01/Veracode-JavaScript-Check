/**
 * IPO関連
 */
function initNodeIPO(){
 $sTree.on("focus", ".tableID", function() {
  oldData = $(this).val();
  $(this).autocomplete({
   source : tableIdList,
   autoFocus : false,
   delay : 100,
   minLength : 0
  });
 });
 $sTree.on("blur", ".tableID", function() {
  ipoInSync($(this).closest(".node"),$(this));
 });
 $sTree.on("focus", ".writeFileID", function() {
  oldData = $(this).val();
  $(this).autocomplete({
   source : fileIdList,
   autoFocus : false,
   delay : 100,
   minLength : 0
  });
 });
 $sTree.on("blur", ".writeFileID", function() {
  ipoOutSync($(this).closest(".node"),$(this));
 });
 $sTree.on("focus", ".readFileID", function() {
  oldData = $(this).val();
  $(this).autocomplete({
   source : fileIdList,
   autoFocus : false,
   delay : 100,
   minLength : 0
  });
 });
 $sTree.on("blur", ".readFileID", function() {
  ipoInSync($(this).closest(".node"),$(this));
 });
 $sTree.on("focus", ".matchFileID1", function() {
  oldData = $(this).val();
  $(this).autocomplete({
   source : fileIdList,
   autoFocus : false,
   delay : 100,
   minLength : 0
  });
 });
 $sTree.on("blur", ".matchFileID1", function() {
  ipoInSync($(this).closest(".node"),$(this));
 });
 $sTree.on("focus", ".matchFileID2", function() {
  oldData = $(this).val();
  $(this).autocomplete({
   source : fileIdList,
   autoFocus : false,
   delay : 100,
   minLength : 0
  });
 });
 $sTree.on("blur", ".matchFileID2", function() {
  ipoInSync($(this).closest(".node"),$(this));
 });
 $sTree.on("focus", ".sortFileID", function() {
  oldData = $(this).val();
  $(this).autocomplete({
   source : fileIdList,
   autoFocus : false,
   delay : 100,
   minLength : 0
  });
 });
 $sTree.on("blur", ".sortFileID", function() {
  ipoInSync($(this).closest(".node"),$(this));
 }); 
}
function ipoSync($input){
 let $node = $input.closest(".node");
 if($input.hasClass("tableID")){
  ipoInSync($node,$input);
 }else if($input.hasClass("writeFileID")){
  ipoOutSync($node,$input);
 }else if($input.hasClass("readFileID")){
  ipoInSync($node,$input);
 }else if($input.hasClass("matchFileID1")){
  ipoInSync($node,$input);
 }else if($input.hasClass("matchFileID2")){
  ipoInSync($node,$input);
 }else if($input.hasClass("sortFileID")){
  ipoInSync($node,$input);
 }
}
function ipoInSync($node,$input){
 if(oldData !== null && oldData === $input.val()){
  return;
 }
 let flg = false;
 $node.children(".ipo_in").children("div").children("input").each(function(){
  if($(this).val() == oldData){
   $(this).val($input.val());
   flg = true;
   setBalloonIpo($(this))
  }
 });
 if(!flg){
  addIpoIn($node,$input.val());
 }
 oldData = null;
}
function ipoOutSync($node,$input){
 if(oldData === $input.val()){
  return;
 }
 let flg = false;
 $node.children(".ipo_out").children("div").children("input").each(function(){
  if($(this).val() == oldData){
   $(this).val($input.val());
   flg = true;
   setBalloonIpo($(this))
  }
 });
 if(!flg){
  addIpoOut($node,$input.val());
 }
 oldData = null;
}
/**
 * IPOの入力を追加する
 * 
 * @param $node
 * @param text
 * @returns
 */
function addIpoIn($node, text) {
 $node.children(".ipo_in").append($("#IPOin_template").html());
 $node.children(".ipo_in").children("div:last-child").children("input").droppable(
   {
    accept : ".resource_item",
    drop : function(ev, ui) {
     let dropText = $(ui.draggable).children("a").children(
       ".resource_name").text();
     // リソースのタイプを取得
     let resType = $(ui.draggable).parent().parent().children(
       "a").text();
     resType = resType.slice(0, resType.length - 3);
     resType = resType.toLowerCase();
     $(this).val(resType + "." + dropText);
     setBalloonIpo($(this))
    },
    hoverClass : "dropHighlight"
   });
 // text指定があれば、IPOINにその文字を入れた状態にしておく
 if (text !== undefined && text !== "") {
  $node.children(".ipo_in").children("div:last-child").children("input").val(text);
  setBalloonIpo($node.children(".ipo_in").children("div:last-child").children("input"));
 }
 if($node.children(".ipoInIcon").length === 0){
  $node.children(".proc_content").before($("#ipoIn_icon").html());
  $node.children(".ipoInIcon").text("IPO-IN(1)");
 }else{
  let num = $node.children(".ipo_in").children("div").length;
  let icontext = "IPO-IN(" + num + ")";
  $node.children(".ipoInIcon").text(icontext);
 }
}
/**
 * IPOの出力を追加する
 * 
 * @param $node
 * @param text
 * @returns
 */
function addIpoOut($node, text) {
 $node.children(".ipo_out").append($("#IPOout_template").html());
 $node.children(".ipo_out").children("div:last-child").children("input").droppable(
   {
    accept : ".resource_item",
    drop : function(ev, ui) {
     let dropText = $(ui.draggable).children("a").children(
       ".resource_name").text();
     // リソースのタイプを取得
     let resType = $(ui.draggable).parent().parent().children(
       "a").text();
     resType = resType.slice(0, resType.length - 3);
     resType = resType.toLowerCase();
     $(this).val(resType + "." + dropText);
     setBalloonIpo($(this))
    },
    hoverClass : "dropHighlight"
   });
 if (text !== undefined && text !== "") {
  $node.children(".ipo_out").children("div:last-child").children("input").val(text);
  setBalloonIpo($node.children(".ipo_out").children("div:last-child").children("input"));
 }
 if($node.children(".ipoOutIcon").length === 0){
  $node.children(".proc_content").before($("#ipoOut_icon").html());
  $node.children(".ipoOutIcon").text("IPO-OUT(1)");
 }else{
  let num = $node.children(".ipo_out").children("div").length;
  let icontext = "IPO-OUT(" + num + ")";
  $node.children(".ipoOutIcon").text(icontext);
 }
}
