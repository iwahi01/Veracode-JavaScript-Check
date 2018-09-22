/**
 * textareaの貼り付けを可能にする
 */
function initPasteImage() {
 // textareaにpasteImageイベントをセットする
 $sTree.on('focus', ".input_free", function() {
  $(this).pastableTextarea();
 });
 // paste時の処理
 $sTree.on('pasteImage', ".input_free", function(ev, data) {
  var blobUrl = URL.createObjectURL(data.blob);
  pasteImage($(this).closest(".node"), data.dataURL, "pasteImage-" + Date.now() + ".png");
 }).on('pasteImageError', function(ev, data) {
  alert('エラー: ' + data.message);
 });
 // ×ボタン押下時に画像を削除する
 $sTree.on('click', ".img_del", function() {
  //　今回添付ファイルか保存済みファイルか判定
  let found = false;
  let delTarget = $(this).prev().children(".pasteImg").attr("id");
  for (var i = 0; i < storedFiledata.length; i++) {
   if(storedFiledata[i].name == delTarget){
    storedFiledata.splice(i, 1);
    found = true;
   }
  }
  if(!found){
   deleteTargetFiles.push($(this).prev().children(".pasteImg").attr("id"));
  }
  $(this).parent().remove();
 });
}
/**
 * イメージ貼り付け時の処理
 * 
 * @param $proc
 *            対象のjQueryオブジェクト
 * @param data
 * @param name
 * @param width
 * @param height
 */
var pasteImage = function($proc, data, name, width, height) {
 $proc.children(".proc_content").append($("#img_area").html());
 var $img_div = $proc.children(".proc_content").children(".img_area:last-child");
 $img_div.children(".pasteImg").attr("src", data);
 $img_div.children(".pasteImg").attr("id", name);
 $img_div.children(".pasteImg").resizable();
 $img_div.children(".pasteImg").width(width);
 $img_div.children(".pasteImg").height(height);
 $img_div.children("a").attr("href", data);
 let imageData = {
   "name" : name,
   "data" : data,
   "width" : width,
   "height" : height
 };
 //メモリ上に画像データを保管
 storedImageData.push(imageData);
 var sfddata = {
  baseBranch: "",
  message: "",
  detail: "",
  itemdata: "",
  // BASE64データを保存
  attachFile: data
 };
 var sfd = {
  name: name,
  data: sfddata
 };
 storedFiledata.push(sfd);
};
/**
 * イメージ表示(読み込み時)
 * 
 * @param $proc
 *            対象のjQueryオブジェクト
 * @param data
 * @param name
 * @param width
 * @param height
 */
var dispImage = function($proc, data, name, width, height) {
 $proc.children(".proc_content").append($("#img_area").html());
 var $img_div = $proc.children(".proc_content").children(".img_area:last-child");
 $img_div.children(".pasteImg").attr("src", data);
 $img_div.children(".pasteImg").attr("id", name);
 $img_div.children(".pasteImg").resizable();
 $img_div.children(".pasteImg").width(width);
 $img_div.children(".pasteImg").height(height);
 $img_div.children("a").attr("href", data);
};
/**
 * 画像データの情報を取得する
 * 
 * @param row
 *            格納先配列
 * @param $imgArea
 *            画像の入っているJQueryオブジェクト
 */
var getImgData = function(row, $imgArea) {
 if (row.画像 === undefined) {
  setObj(row, "画像", []);
 }
 // 保存後のpathを生成
 var newpath;
 var sppath = path.split("/");
 for (let i = 0; i < sppath.length; i++) {
  if (i === 0) {
   newpath = sppath[0];
  } else if (i == sppath.length - 1) {
   newpath = newpath + "/" + getFileName();
  } else {
   newpath = newpath + "/" + sppath[i];
  }
 }
 // 保存用ファイル名（ペースト時のタイムスタンプ）
 var attachname = $imgArea.children("div").children(".pasteImg").attr("id");
 var fileinfo = {
  src: attachname,
  width: $imgArea.find(".pasteImg").width(),
  height: $imgArea.find(".pasteImg").height()
 };
 row.画像.push(fileinfo);
};
