/**
 * グローバル変数たち
 */
/** 文書のタイプ（オン/バッチ）を識別 */
var DOCUMENT_TYPE;
/** 変数 */
var selectList;
/** DBリスト */
var dbList;
/** 処理記から参照している別の成果物 */
var resources = {
 "wk" : [],
 "db" : [],
 "file" : [],
 "画面" : [],
 "帳票" : [],
 "電文" : [],
 "データオブジェクト" : []
};
/** 処理機の変数名としてポップアップで出力させるための */
var resourceName = [];
/** リソース変更前の名称 */
var beforeName;
/** */
var activeResource;
/** 処理の番号 */
var procSeq = 1;
var numlist = [];
var sha = "";
var $copyLi = null;
var copystatus;
/** メインの処理ノードを保持する部分のためのグローバル変数 */
var $sTree;
var $selectItem;
var $selectedAssigns;
var $selectedTab;
/** 画像データをメモリ上に保管するための配列 */
var storedImageData = [];
/** 代入ノードをデータ項目と演算子で区切るために使用 */
const OPE = "←→+-×÷";
/** UNDO処理のコントロール用 */
var undoData = [];
var firstUndoFlg = true;
var undoAttachFile;
var undoDelAttachFile;
/** データアクセス一覧関連のデータ */
var dataAccessListData;
var dataAccessIDList = [];
var daoIDmap = {};
/** 共通機能一覧関連のデータ*/
var kyotsuKinouListData;
var kyotsuKinouIDList = [];
var kyotsukinouDataList = [];
/** メッセージ一覧関連のデータ*/
var messageListData;
var messageIDList = [];
/** スタイル情報のデフォルトの値 */
var loadingResourceCount = 0;
var loadFinishedResourceCount = 0;
/** スタイル情報のデフォルトの値 */
var defaultColor = "rgb(0, 0, 0)";
var defaultBGColor = "rgb(255, 255, 255)";
var defaultBGColor2 = "rgba(0, 0, 0, 0)";
var highlightBGColor = "rgb(255, 255, 128)";
/** コード値マスタ (システムが一致するもののみ取得)*/
var codeMaster;
var dataAccessDataList = [];
/** ファイルIDのリスト　バッチで使う */
var fileIdList = [];
/** テーブルIDのリスト　バッチで使う */
var tableIdList = [];
/** input項目の変更を判定するために、フォーカス時に変更前の値をoldDataに保管 */
oldData = null;
/** 最終UNDOの蓄積時間 */
lastUndoStoreTime = +new Date();
dispProcPromiseList = [];
/** ----  内部処理記で使用するものはここから下  ----------*/
var methodName = [];
var methodDataList = [];
var naibushorikiDataList = [];
/** インポート機能を使用して読み込み時はセット */
var importDataPath = null;
/** クラス構造を作成するときに使用 */
var subMethodList = [];
var scroll_Y_before = null;
var changeDataBk = undefined;
