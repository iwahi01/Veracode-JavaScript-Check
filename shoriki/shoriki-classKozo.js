/**
 * クラス構造仕様に関する処理
 */
function initClassKozo(){
 /**
  * 処理クラス構造画面を開く
  */
 $("#shoriki_classKozo").click(function() {
  // 該当詳細ファイルをがあるかどうかを判断する
  ajaxClassKozoOpen(getClassKozoUrl('check'), "GET", null);
 });
}
/**
 * URLを組み立てる
 */
function getClassKozoUrl(ope) {
 let detailName = getClassKozoName();
 let detailFileName = detailName.name[0] + '_' + detailName.name[1];
 let detailUrl;
 // 全体版かどうかを判断
 let paths = path.split("/");
 if (paths.length < 3) {
  let sysid = getSystemIdEntireEdition();
  // pathsの長さが１か2の場合、システムIDのフォルダに入っていない成果物（全体版／システムIDフォルダなし）
  if (sysid !== null && sysid !== "" && sysid !== undefined) {
  // sysidがとってこれれば全体版
   detailUrl = '/Radget/design/' + ope + '/' + owner + '/' + repo + '/' +
    branch + '/' + detailName.type + '/' + sysid + '/' +
    detailFileName + '.xml';
  } else {
  // とれないときはブロックなしシステム
   detailUrl = '/Radget/design/' + ope + '/' + owner + '/' + repo + '/' +
    branch + '/' + detailName.type + '/' + detailFileName + '.xml';
  }
 } else　 if (paths.length === 3) {
  // pathsの長さが3の場合、システムIDのフォルダに入っている成果物
  detailUrl = '/Radget/design/' + ope + '/' + owner + '/' + repo + '/' +
   branch + '/' + detailName.type + '/' + paths[1] + '/' + detailFileName +
   '.xml';
 }
 return detailUrl;
}
/**
 * 処理クラス構造を開く処理
 */
function ajaxClassKozoOpen(uri, method, data) {
 ajaxCallSync(uri ,method, data, function(res, status, jqXHR) {
  if(res.result == "true") {
   // 該当ファイルを開く
   window.open(getClassKozoUrl('open'));
  } else {
   let moveCheck = confirm("処理クラス構造仕様が存在しません。新規作成しますか？");
   if (moveCheck) {
    // エラー時はアラートで表示する
    if (jqXHR.responseText != undefined) {
     let data = {
      baseBranch: branch,
      message: "",
      detail: "",
      itemdata: JSON.stringify(setClassKozoInfo())
     };
     // 該当詳細ファイルを新規作成
     ajaxCallSync(getClassKozoUrl('commit'), "POST", data, function() {
      window.open(getClassKozoUrl('open'));
     });
    } else {
     alert(errorThrown);
    }
   }
  }
 });
}
/**
 * 処理クラス構造のファイルの名前を組み立てる
 * 
 * @returns
 */
function getClassKozoName() {
 let id = $("#ID").val();
 let name = $("#名称").val();
 detailName = {
   type: '5004010_処理クラス構造仕様',
   name: [id, name]
  };
 return detailName;
}
/**
 * 
 * 処理クラス構造仕様を作成する場合、
 * 内容を組み立てる
 * 
 * @returns
 */
function setClassKozoInfo() {
 'use strict';
 var newAfterData = {
   layoutList : [ {
    rows : []
   } ]
  };
 newAfterData.システムID = $("#システムID").val();
 newAfterData.ID = $("#ID").val();
 newAfterData.名称 = $("#名称").val();
 createClassKozo(newAfterData);
 return newAfterData;
}
/**
 * 処理のリストからActionのメソッドノードを取り出し、リストで返す
 * @param procList
 * @returns
 */
function includeActionNode(procList){
 actionList = [];
 //レイアウト内の階層がActionのメソッドを探す
 for(let proc of procList){
  if(proc.階層 == "Action" && proc.種類 == "メソッド"){
   actionList.push(proc);
  }
 }
 return actionList;
}
/**
 * メソッドの呼び出し構造を探索・構築
 * 
 * @param procList
 * @returns
 */
function includeMethodNode(procList){
 // まずはメソッドノードを全て探す
 let methodList = [];
 for(let proc of procList){
  if(proc.種類 == "メソッド"){
   methodList.push(proc);
  }
 }
 return methodList;
}
/**
 * クラス構造仕様のデータを組み立てる
 * 
 * @returns
 */
function createClassKozo(newAfterData) {
 let procList = [];
 let actionList = [];
 let tabIndex = getActiveIndex();
 // xmlの読み込み・表示で何らかのエラーが出ていると
 // activeIndexを取得しても-1になる
 //　この状態で処理を続けると永久ループ・データ破損等の危険があるので
 // 処理を終了させる
 if(tabIndex == -1){
  return;
 }
 // まずは現在のデータをafterDataに保管
 setTreeData(getActiveIndex());
 //全てのレイアウト（タブ）に対してループ
 for(let index = 0;index < afterData.layoutList.length;index++){  
  let layout = afterData.layoutList[index];
  // Actionのメソッドのノードを取得
  let actionList = includeActionNode(layout.処理);
  //全てのメソッドを取得
  var methodList = includeMethodNode(layout.処理);
  // 全てのactionに対してループ
  for(let me of actionList){
   // newAfterDataにデータを追加
   let row = {};
   row.処理階層 = "0";
   if(me.メソッド名 !== undefined && me.メソッド名.split(".").length >= 2){
    // クラス名.メソッド名で書いてある場合
    row.クラスID_DAOID = me.メソッド名.split(".")[0];
    row.メソッド名_データアクセスID = me.メソッド名.split(".")[1];
   }else{
    // クラス名の記述が省略されている(自メソッド呼び出しの場合)
    row.クラスID_DAOID = $("#ID").val();
    row.メソッド名_データアクセスID = me.メソッド名;
   }
   row.タイプ= "メソッド";
   row.処理概要 = $("#ID").val() + "のメソッド"; 
   newAfterData.layoutList[0].rows.push(row);
   var parentList = [];
   parentList.push(me.メソッド名);
   createClassKozoSub(me,methodList,1,parentList,newAfterData);
  }
 }
}
/**
 * クラス構造を再帰で作成
 * 
 * @param proc
 * @param methodList
 * @returns
 */
function createClassKozoSub(proc,methodList,level,parentList,newAfterData){
 if(proc.種類 == "データアクセス"){
  //　データアクセス処理用のメソッドを呼び出す 
  createClassKozoDataAccess(proc,level,newAfterData);
 }
 if(proc.種類 == "メソッド呼び出し"){
  // メソッド呼び出し処理用のメソッドを呼び出す
  createClassKozoMethodCall(proc,methodList,level,parentList,newAfterData);
 }
 if(proc.子処理 !== undefined){
  for(let childnode of proc.子処理){
   createClassKozoSub(childnode,methodList,level,parentList,newAfterData);
  }
 }
}
/**
 * クラス構造を作成
 * （データアクセスノード）
 * @param proc
 * @param level
 * @returns
 */
function createClassKozoDataAccess(proc,level,newAfterData){
 let row = {};
 row.処理階層 = level;
 //　マップからdaoIDを取得
 let daoID = daoIDmap[proc.内容];
 // 取得できなければエラー
 if(daoID === undefined){
  row.クラスID_DAOID = "! ERROR ! DAOIDがありません";
 } else{
  row.クラスID_DAOID = daoID;
 }
 row.メソッド名_データアクセスID = proc.内容;
 row.タイプ = "データアクセス";
 row.処理概要 = proc.概要;
 newAfterData.layoutList[0].rows.push(row);
}
/**
 * クラス構造を作成
 * （メソッド呼び出しノード）
 * @param proc
 * @param level
 * @param methodList
 * @param parentList
 * @returns
 */
function createClassKozoMethodCall(proc,methodList,level,parentList,newAfterData){
 let row = {};
 row.処理階層 = level;
 if(proc.内容.split(".").length >= 2){
  // クラス名.メソッド名で書いてある場合
  row.クラスID_DAOID = proc.内容.split(".")[0];
  row.メソッド名_データアクセスID = proc.内容.split(".")[1];
 }else{
  // クラス名の記述が省略されている(自メソッド呼び出しの場合)
  row.クラスID_DAOID = $("#ID").val();
  row.メソッド名_データアクセスID = proc.内容;
 }
 row.タイプ = "メソッド呼び出し";
 row.処理概要 = proc.概要;
 newAfterData.layoutList[0].rows.push(row);
 // 呼び出し先メソッドが自文書内のメソッドかチェック
 for(let subme of methodList){
  // 呼び出されているメソッドが発見できた
  if(proc.内容 == subme.メソッド名){
   let flg = false;
   // 呼び出し元のメソッドと被っていないかチェック
   // 永久ループ防止
   for(let parent of parentList){
    if(parent == proc.内容){
     flg = true;
    }
   }
   if(flg){
    // 呼び出し元と重なってしまっている
    row.処理概要　+= "! WARNING ! 再帰呼び出し";
   }else{
    // 呼び出し元と重なっていない
    var pl =  parentList.concat();
    pl.push(proc.内容);
    // 見つかった要素に対し、クラス構造作成メソッドを呼び出す
    createClassKozoSub(subme,methodList,level+1,pl,newAfterData);
   }
  }
 }
}
