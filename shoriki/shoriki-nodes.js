/**
 * メソッドノード関連
 */
/**
 * streeに対するイベントセット
 * メソッド名のコードアシスト機能を有効にする
 */
function initMethodCodeAssist(){
 //　内部処理記
 // メソッド候補表示（コードアシスト）
 $sTree.on("focus", ".input_method", function() {
  $(this).autocomplete({
   source : methodName,
   autoFocus : false,
   delay : 500,
   minLength : 2,
  });
 });
 //　内部処理記
 $sTree.on("blur", ".input_method", function() {
  var callMethod =  $(this).val();
  let flg = false;
  for(let m of methodDataList){
   if(callMethod == m.name){
    flg = true;    
    //バルーンの内容を組み立て
    let content = $(this).val();
    for(let i = 0;i<m.args.length;i++){
     content = content +  "<br>引数 : " + m.args[i];
    }
    for(let i = 0;i< m.returns.length;i++){
     content = content +  "<br>戻り値 : " + m.returns[i];
    }
    for(let i = 0;i< m.exceptions.length;i++){
     content = content +  "<br>例外 : " + m.exceptions[i];
    }
    setMethodBalloon($(this),content);
    //リンク用のエリアを作成
    if(m.path !== undefined){
     $(this).parent().append($("#shoriki_open").html());
     var $target_div = $(this).parent().children(".shoriki_open");
     $target_div.children("a").attr("href", m.path);
    }
   }
  }
  if(flg === false){
   fadeMessage("一致するメソッドがありません", $(this).offset().top　-20 , $(this).offset().left + 100, 3000);
  }
 });
 //　変更前をグローバルに保存
 $sTree.on("focus", ".method_name",function() {
  beforeName = $(this).val();
 });
 //　内部処理記
 // メソッド名の変更がされたときの処理
 $sTree.on("change", ".method_name", function() {
  for(let i = 0;i < methodDataList.length ; i ++){
   if(methodDataList[i].name == beforeName){
    methodDataList.splice(i,1);
    i = i - 1;
   }
  }
  for(let i = 0;i < methodName.length ; i ++){
   if(methodName[i] == beforeName){
    methodName.splice(i,1);
    i = i - 1;
   }
  }
  let methodData ={};
  let $methodname =  $(this);
  methodData.name =$methodname.val();
  methodData.args = [];
  methodData.returns = [];
  methodData.exceptions = [];
  let $parent = $methodname.parent().parent();
  let argments = $parent.children(".argument_content").children(".proc_args").children("li").children(".argument_row").each(function(){
   methodData.args.push($(this).children(".arg_type").val() + "型"　+ " " + $(this).children(".arg_name").val());
  });
  let returns = $parent.find(".return_content").each(function(){
   methodData.returns.push($(this).children(".return_type").val() + "型"　+ " " + $(this).children(".return_name").val());
  });
  let exceptions = $parent.find(".exception_content").each(function(){
   if($(this).children(".exception_type").val() !== undefined && $(this).children(".exception_type").val() !== ""){
    methodData.exceptions.push($(this).children(".exception_type").val() + "型");
   }
  });
  methodName.push($methodname.val());
  methodDataList.push(methodData);
 });
}
/**
 * 文書データからメソッド情報を取り出しグローバル変数にストアする
 * @returns
 */
function setupMethodDataList(re){
 if(re.layoutList === undefined){
  return;
 }
 for(let layout of re.layoutList){
  for(let proc of  layout.処理){
   if(proc.種類 == "メソッド"){
    //メソッド名がundefinedの場合、後々の処理でこけるようになってしまうので、
    //読み込み時点で除く
    if(proc.メソッド名 === undefined){
     continue;
    }
    let methodData = {};
    methodData.args = [];
    methodData.returns = [];
    methodData.exceptions = [];
    //methodData.name = res.ID + "." + proc.概要;
    methodData.name = proc.メソッド名;
    if(proc.引数 !== undefined){
     for(let arg of proc.引数){
      methodData.args.push(arg.型 + "型"　+ " " + arg.変数名);
     } 
    }
    if(proc.戻り値 !== undefined){
     for(let ret of proc.戻り値){
      methodData.returns.push(ret.型 + "型"　+ " " + ret.変数名);
     }
    }
    if(proc.例外 !== undefined){
     for(let exc of proc.例外){
      methodData.exceptions.push(exc.型 + "型");
     } 
    }
    methodName.push(proc.メソッド名);
    methodDataList.push(methodData);
   }
  }
 }
}
