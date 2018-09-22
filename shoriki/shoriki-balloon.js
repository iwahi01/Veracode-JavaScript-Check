/**
 * 現在表示されている全てのinput_value要素に対しバルーンをセット
 * @returns
 */
function setBalloonToAllInputValue(){
 $(".input_value").each(function() {
  setBalloon($(this));
 });
 $(".work_name").each(function() {
  setDictionaryBalloon($(this));
 });
 $(".accessID").each(function(){
  inputDataAccessSetBalloon($(this));
 });
 $(".input_common").each(function(){
  inputCommonSetBalloon($(this));
 });
 setBalloonToAllIpo();
}
function setBalloonToAllIpo(){
 $(".ipoElement").each(function() {
  setBalloonIpo($(this));
 });
}
function setBalloonIpo($target){
 let targetText = "";
 let targetTexts = $target.val().split(".");
 targetText = targetTexts[targetTexts.length - 1];
 if(targetText == ""){
  return;
 }
 $(".resource_name").each(function(){
  if ($(this).text() === targetText) {
   setMethodBalloon($target,$(this).closest("li").attr("title"));
  }
 });
}
/**
 * 概要バルーンをセットする
 */
function setBalloon($this) {
 var tx = $this.val().split(".");
 if (tx !== null && tx.length > 2　&& tx[0] !== "wk" && tx[0] !== "code") {
  $this.balloon({
   contents: getDetail(tx),
   position: "top",
   delay: 200
  });
 } else if(tx !== null &&　tx.length === 3 && tx[0] === "code"){
  let text;
  // コード値マスタが取得できていなかったら処理終了
  if(codeMaster === undefined){
   return;
  }
  for(let code of codeMaster){
   if(code.nameJP === tx[1] && code.codeValueNameJP === tx[2]){
    text = "コード値：" + code.codeValue  + "<BR>" + "意味：" + code.meaning;
   }
  }
  $this.balloon({
   contents: text,
   position: "top",
   delay: 200
  });
 }else {
  $this.balloon({
   contents: "No Data",
   position: "top",
   delay: 200
  });
 }
}
/**
 *  用語マスタからバルーン情報をセットする
 * @param $this
 * @returns
 */
function setDictionaryBalloon($this){
 // マスタ情報がなかった場合処理終了
 if(dictionaryMaster === undefined){
  return;
 }
 // 変換処理
 let result = convertByDictionary($this.val()); 
 let text = "";
 // 変換結果を取り出して編集
 for(let word of result.wordList){
  text += "和名：" + word.和名 + "<BR>";
  text += "英名：" + word.英名 + "<BR>";
  if(word.意味 !== undefined){
   text += "意味：" + word.意味 + "<BR><BR>";
  }else{
   text += "用語辞書に意味定義がありません<BR><BR>";
  }
 }
 // 変換失敗した単語があればその情報を追加
 if(result.notFoundWord  !== undefined){
  text += "!WARNING!　<BR>以下の単語は辞書にありませんでした<BR>「" + result.notFoundWord + "」<BR>";
 }
 // バルーンセット
 $this.balloon({
  contents: text,
  position: "right",
  delay: 200
 });
}
/**
 * バルーンをセットする
 */
function setMethodBalloon($target,content) {
 $target.balloon({
  contents: content,
  position: "top",
  delay: 200
 });
}
/**
 * データアクセスIDの入力箇所が変わったら呼び出される
 * (データアクセスノード)
 * @param value
 * @returns
 */
function inputDataAccessSetBalloon($this){
 let value = $this.val();
 let found = false;
 for(let dataAccessData of dataAccessDataList){
  for(let layout of dataAccessData.layoutList){
   if(layout.データアクセスID == value){
    found = true;
    //バルーンの内容を組み立て
    let content = value;
    for(let row of layout.入力情報){
     content = content +  "<br>入力項目 : " + row.項目名 + " / 編集仕様 : " + row.編集仕様　+ " / 条件 : " + row.条件;
    }
    for(let row of layout.対象テーブルID.rows){
     content = content +  "<br>対象テーブルID : " + row.テーブルID + " / テーブル名 : " + row.テーブル名;
    }
    for(let row of layout.出力情報.rows){
     content = content +  "<br>出力項目名 : " + row.テーブルID項目名;
    }
    setMethodBalloon($this,content);
   }
  }
 }
 if(!found){
  let content = "No Data";
  setMethodBalloon($this,content);
 }
}
/**
 * 共通機能ノードにバルーンをセット
 * @param $this
 * @returns
 */
function inputCommonSetBalloon($this){
 let value = $this.val();
 let data = null;
 for(let kyotsu of kyotsukinouDataList){
  if(kyotsu.共通機能ID == value){
   data = kyotsu;
  }
 }
 if(data === null){
  return;
 }
 //バルーンの内容を組み立て
 let content = value;
 for(let row of data.rowParas){
  content = content +  "<br>引数 : " + row.引数 + " / 属性 : " + row.引数_属性;
 }
 for(let row of data.rowReturns){
  content = content +  "<br>戻り値 : " + row.戻り値 + " / 属性 : " + row.戻り値_属性;
 }
 for(let row of data.rowExcepts){
  content = content +  "<br>例外 : " + row.例外;
 }
 setMethodBalloon($this,content);
}
/**
 * メッセージIDにバルーンをセット
 * (メッセージノード)
 * @param value
 * @returns
 */
function inputMessageIdSetBalloon($this){
 let value = $this.val();
 for(let layout of messageListData.layoutList){
  for(let row of layout.rows){
   if(row.メッセージID == value){
    //バルーンの内容を組み立て
    let content = "メッセージID:" + value + "<br>";
    content = content + "メッセージ：" + row.メッセージ + "<br>";
    content = content + "概要説明：" + row.概要説明;
    setMethodBalloon($this,content);
   }
  }
 }
}
