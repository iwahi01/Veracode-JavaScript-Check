/**
 * 個別ファイル化するほどでもない処理のうち
 * 外観に関するものをまとめる
 */
/**
 * スタイル情報を取得する
 * 
 * @param $ele
 *            取得対象のJQueryオブジェクト
 * @returns スタイル情報
 */
function getStyle($ele) {
 var style = {};
 setObj(style, "color", $ele.css("color"), $ele.parent().css("color"));
 // デフォルトの文字色と同じなら保存しない
 if (style.color == defaultColor) {
  delete style.color;
 }
 setObj(style, "bold", $ele.hasClass("bold"));
 setObj(style, "italic", $ele.hasClass("italic"));
 setObj(style, "underline", $ele.hasClass("underline"));
 setObj(style, "cancelline", $ele.hasClass("cancelline"));
 setObj(style, "BGcolor", $ele.css("background-color"), $ele.parent().css(
  "background-color"));
 // デフォルトの背景色と同じだったら保存しない
 if (style.BGcolor == defaultBGColor) {
  delete style.BGcolor;
 }
 // デフォルトの背景色と同じだったら保存しない
 // アルファ値ありのパターン
 if (style.BGcolor == defaultBGColor2) {
  delete style.BGcolor;
 }
 // ハイライトの背景色と同じだったら保存しない
 if (style.BGcolor == highlightBGColor) {
  delete style.BGcolor;
 }
 if (Object.keys(style).length === 0) {
  return null;
 }
 return style;
}
/**
 * 要素にスタイル用のクラスをセットする
 * 
 * @param $text
 *            対象のJQueryオブジェクト
 * @param style
 *            スタイル情報
 */
var setStyle = function($text, style) {
 if (style !== undefined) {
  if (style.color !== undefined) {
   $text.css("color", style.color);
  }
  if (style.bold !== undefined) {
   $text.addClass("bold");
  }
  if (style.italic !== undefined) {
   $text.addClass("italic");
  }
  if (style.underline !== undefined) {
   $text.addClass("underline");
  }
  if (style.cancelline !== undefined) {
   $text.addClass("cancelline");
  }
  if (style.BGcolor !== undefined) {
   $text.css("background-color", style.BGcolor);
  }
 }
};
/**
 * procのスタイル情報を取得する
 * @param $proc
 * @returns
 */
function getProcStyle($proc) {
 let styleList = [];
 let $procContent = $proc.children(".proc_content");
 let kind = $proc.children(".proc_kind").text();
 // 全ノード共通
 let $target = $proc.children(".proc_title");
 addStyleList($target, "概要", styleList);
 // 全ノード共通
 $target = $proc.children(".proc_comment").children("textarea");
 addStyleList($target, "コメント", styleList);
 // 全ノード共通 ワーク変数
 $proc.children(".proc_work").children("li").children(".proc_wk_row").each(function(i = 0) {
  $target = $(this).children(".work_name");
  addStyleList($target, "ワーク-" + (i + 1).toString() + "-変数名", styleList);
  $target = $(this).children(".work_type");
  addStyleList($target, "ワーク-" + (i + 1).toString() + "-型", styleList);
  $target = $(this).children(".work_init");
  addStyleList($target, "ワーク-" + (i + 1).toString() + "-初期値", styleList);
 });
 switch (kind) {
 case "自由記述":
  $target = $procContent.children(".input_free");
  addStyleList($target, "自由記述テキスト", styleList);
  break;
 case "代入":
  $procContent.children(".proc_assigns").each(function(i = 0) {
   $(this).children(".input_value").each(function(j = 0) {
    $target = $(this);
    addStyleList($target, "代入-" + (i + 1).toString() + "-" + (j + 1).toString(), styleList);
   });
  });
  break;
 case "リンク":
  $target = $procContent.children(".choose_proc");
  addStyleList($target, "リンク先", styleList);
  break;
 case "データアクセス":
  $target = $procContent.children(".accessID");
  addStyleList($target, "データアクセスID", styleList);
  //　引数
  $procContent.children(".argument_content").children(".proc_args").children("li").children(".argument_row").each(function(i = 0) {
   $target = $(this).children(".arg_name");
   addStyleList($target, "引数-" + (i + 1).toString() + "-引数名", styleList);
   $target = $(this).children(".arg_type");
   addStyleList($target, "引数-" + (i + 1).toString() + "-型", styleList);
   $target = $(this).children(".arg_from");
   addStyleList($target, "引数-" + (i + 1).toString() + "-代入内容", styleList);
  });
  $target = $procContent.children(".return_content").children(".return_name");
  addStyleList($target, "戻り値の変数名", styleList);
  $target = $procContent.children(".return_content").children(".return_type");
  addStyleList($target, "戻り値の型", styleList);
  $target = $procContent.children(".return_content").children(".return_target");
  addStyleList($target, "戻り値の代入先", styleList);
  break;
 case "ループ":
  //　条件
  $proc.children(".proc_conditions").children("li").children(".condition_content").each(function(i = 0) {
   $target = $(this).children(".cond_left");
   addStyleList($target, "条件-" + (i + 1).toString() + "-左辺", styleList);
   $target = $(this).children(".cond_right");
   addStyleList($target, "条件-" + (i + 1).toString() + "-右辺", styleList);
  });
  break;
 case "if":
  //　条件
  $proc.children(".proc_conditions").children("li").children(".condition_content").each(function(i = 0) {
   $target = $(this).children(".cond_left");
   addStyleList($target, "条件-" + (i + 1).toString() + "-左辺", styleList);
   $target = $(this).children(".cond_right");
   addStyleList($target, "条件-" + (i + 1).toString() + "-右辺", styleList);
  });
  break;
 case "else if":
  //　条件
  $proc.children(".proc_conditions").children("li").children(".condition_content").each(function(i = 0) {
   $target = $(this).children(".cond_left");
   addStyleList($target, "条件-" + (i + 1).toString() + "-左辺", styleList);
   $target = $(this).children(".cond_right");
   addStyleList($target, "条件-" + (i + 1).toString() + "-右辺", styleList);
  });
  break;
 case "メソッド":
  $target = $procContent.children(".method_info").children(".modifier");
  addStyleList($target, "修飾子", styleList);
  $target = $procContent.children(".method_info").children(".method_name");
  addStyleList($target, "メソッド名", styleList);
  $target = $procContent.children(".exception_content").children(".exception_type");
  addStyleList($target, "例外の型", styleList);
  //　引数
  $procContent.children(".argument_content").children(".proc_args").children("li").children(".argument_row").each(function(i = 0) {
   $target = $(this).children(".arg_name");
   addStyleList($target, "引数-" + (i + 1).toString() + "-引数名", styleList);
   $target = $(this).children(".arg_type");
   addStyleList($target, "引数-" + (i + 1).toString() + "-型", styleList);
   $target = $(this).children(".arg_from");
   addStyleList($target, "引数-" + (i + 1).toString() + "-代入内容", styleList);
  });
  $target = $procContent.children(".return_content").children(".return_name");
  addStyleList($target, "戻り値の変数名", styleList);
  $target = $procContent.children(".return_content").children(".return_type");
  addStyleList($target, "戻り値の型", styleList);
  break;
 case "メソッド呼び出し":
  $target = $procContent.children(".method_call_info").children(".input_method");
  addStyleList($target, "呼び出しメソッド", styleList);
  $target = $procContent.children(".return_content").children(".return_name");
  addStyleList($target, "戻り値の変数名", styleList);
  $target = $procContent.children(".return_content").children(".return_type");
  addStyleList($target, "戻り値の型", styleList);
  $target = $procContent.children(".return_content").children(".return_target");
  addStyleList($target, "戻り値の代入先", styleList);
  //　引数
  $procContent.children(".argument_content").children(".proc_args").children("li").children(".argument_row").each(function(i = 0) {
   $target = $(this).children(".arg_name");
   addStyleList($target, "引数-" + (i + 1).toString() + "-引数名", styleList);
   $target = $(this).children(".arg_type");
   addStyleList($target, "引数-" + (i + 1).toString() + "-型", styleList);
   $target = $(this).children(".arg_from");
   addStyleList($target, "引数-" + (i + 1).toString() + "-代入内容", styleList);
  });
  break;
 case "共通機能呼び出し":
  $target = $procContent.children(".call_common_info").children(".input_common");
  addStyleList($target, "共通機能ID", styleList);
  $target = $procContent.children(".return_content").children(".return_name");
  addStyleList($target, "戻り値の変数名", styleList);
  $target = $procContent.children(".return_content").children(".return_type");
  addStyleList($target, "戻り値の型", styleList);
  $target = $procContent.children(".return_content").children(".return_target");
  addStyleList($target, "戻り値の代入先", styleList);
  //　引数
  $procContent.children(".argument_content").children(".proc_args").children("li").children(".argument_row").each(function(i = 0) {
   $target = $(this).children(".arg_name");
   addStyleList($target, "引数-" + (i + 1).toString() + "-引数名", styleList);
   $target = $(this).children(".arg_type");
   addStyleList($target, "引数-" + (i + 1).toString() + "-型", styleList);
   $target = $(this).children(".arg_from");
   addStyleList($target, "引数-" + (i + 1).toString() + "-代入内容", styleList);
  });
  break;
 case "メッセージ":
  // メッセージID
  $target = $procContent.children(".messageID");
  addStyleList($target, "メッセージID", styleList);
  //　赤くする画面項目
  $procContent.children(".message_redProp").children(".input_value").each(function(i = 0) {
   $target = $(this);
   addStyleList($target, "赤くする画面項目-" + (i + 1).toString(), styleList);
  });
  break;
 case "catch":
  $target = $procContent.children(".exception_content").children(".exception_type");
  addStyleList($target, "例外の型", styleList);
  break;
 case "ファイル読み込み":
  // 読み込みファイル　readFileID 
  $target = $procContent.children(".readFileID");
  addStyleList($target, "読み込みファイル", styleList);
  break;
 case "ファイル出力":
  // 出力ファイル writeFileID
  $target = $procContent.children(".writeFileID");
  addStyleList($target, "出力ファイル", styleList);
  break;
 case "アンロード":
  // テーブルID tableID
  $target = $procContent.children(".tableID");
  addStyleList($target, "テーブルID", styleList);
  // 出力ファイル writeFileID
  $target = $procContent.children(".writeFileID");
  addStyleList($target, "出力ファイル", styleList);
  // アンロードの補足情報　unload_info
  $target = $procContent.children(".unload_info");
  addStyleList($target, "補足情報", styleList);
  break;
 case "ソート":
  // ソートするファイルID　sortFileID
  $procContent.children(".sortFileID").each(function(i = 0) {
   $target = $(this);
   addStyleList($target, "ソートするファイルID-" + (i + 1).toString(), styleList);
  });
  //ソートするキー sortkeys > sortkeyRow > sortkey
  $procContent.children(".sortkeys").children(".sortkeyrow").each(function(i = 0) {
   $target = $(this).children(".sortkey");
   addStyleList($target, "ソートキー-" + (i + 1).toString(), styleList);
  });
  $target = $procContent.children(".readFileID");
  addStyleList($target, "読み込みファイル", styleList);
  break;
 case "マッチング":
  // マッチングするファイルID 1 matchFileID1
  $target = $procContent.children(".matchFileID1");
  addStyleList($target, "マッチングするファイルID1", styleList);
  // マッチングするファイル1のキー項目　matchingkeys1 > matchkey
  $procContent.children(".matchingkeys1").children(".matchkey").each(function(i = 0) {
   $target = $(this);
   addStyleList($target, "マッチングするファイル1のキー-" + (i + 1).toString(), styleList);
  });
  // マッチングするファイルID 2 matchFileID2
  $target = $procContent.children(".matchFileID2");
  addStyleList($target, "マッチングするファイルID2", styleList);
  // マッチングするファイル2のキー項目　matchingkeys2 > matchkey
  $procContent.children(".matchingkeys2").children(".matchkey").each(function(i = 0) {
   $target = $(this);
   addStyleList($target, "マッチングするファイル2のキー-" + (i + 1).toString(), styleList);
  });
  break;
 case "HULFT":
  // HULFTID hulftID 
  $target = $procContent.children(".hulftID");
  addStyleList($target, "HULFTID", styleList);
  // HULFT接続先hostname
  $target = $procContent.children(".hostname");
  addStyleList($target, "接続先", styleList);
  break;
 case "要求分析票":
  $target = $procContent.children(".input_youkyu");
  addStyleList($target, "要求分析テキスト", styleList);
  break;
 case "関数":
  $target = $procContent.children(".func_name");
  addStyleList($target, "関数", styleList);
  break;
 case "関数呼び出し":
  $target = $procContent.children(".input_callfunc");
  addStyleList($target, "関数呼び出し", styleList);
  break;
 case "日本語マクロ":
  break;
 case "DA呼び出し":
  $target = $procContent.children(".callda_id");
  addStyleList($target, "DA呼び出し", styleList);
  break;
 }
 return styleList;
}
/**
 * 指定したオブジェクトのスタイル情報を取得し、styleListに追加する
 * @param $target
 * @param targetName
 * @param styleList
 * @returns
 */
function addStyleList($target, targetName, styleList) {
 if ($target.length !== 0) {
  let styleRow = {};
  styleRow.スタイル適用先 = targetName;
  styleRow.スタイル = getStyle($target);
  if (styleRow.スタイル !== null) {
   styleList.push(styleRow);
  }
 }
}
/**
 * procにスタイルをセットする
 * @param $proc
 * @param proc
 * @returns
 */
function setProcStyle($proc, proc) {
 //　styleListが無い場合は処理終了
 if (proc.styleList === undefined) {
  return;
 }
 for (let style of proc.styleList) {
  let target = style.スタイル適用先.split("-");
  let $procContent = $proc.children(".proc_content");
  if (target[0] == "概要") {
   setStyle($proc.children(".proc_title"), style.スタイル);
  } else if (target[0] == "コメント") {
   setStyle($proc.children(".proc_comment").children("textarea"), style.スタイル);
  } else if (target[0] == "自由記述テキスト") {
   setStyle($procContent.children(".input_free"), style.スタイル);
  } else if (target[0] == "ワーク") {
   let index = parseInt(target[1]) - 1;
   if (target[2] == "変数名") {
    setStyle($($proc.children(".proc_work").children("li").children(".proc_wk_row").get(index)).children(".work_name"), style.スタイル);
   } else if (target[2] == "型") {
    setStyle($($proc.children(".proc_work").children("li").children(".proc_wk_row").get(index)).children(".work_type"), style.スタイル);
   } else if (target[2] == "初期値") {
    setStyle($($proc.children(".proc_work").children("li").children(".proc_wk_row").get(index)).children(".work_init"), style.スタイル);
   }
  } else if (target[0] == "代入") {
   let indexRow = parseInt(target[1]) - 1;
   let indexCol = parseInt(target[2]) - 1;
   let $targetRow = $($procContent.children(".proc_assigns").get(indexRow));
   let $target = $($targetRow.children(".input_value").get(indexCol));
   setStyle($target, style.スタイル);
  } else if (target[0] == "引数") {
   let index = parseInt(target[1]) - 1;
   if (target[2] == "引数名") {
    setStyle($($procContent.children(".argument_content").children(".proc_args").children("li").children(".argument_row").get(index)).children(".arg_name"), style.スタイル);
   } else if (target[2] == "型") {
    setStyle($($procContent.children(".argument_content").children(".proc_args").children("li").children(".argument_row").get(index)).children(".arg_type"), style.スタイル);
   } else if (target[2] == "代入内容") {
    setStyle($($procContent.children(".argument_content").children(".proc_args").children("li").children(".argument_row").get(index)).children(".arg_from"), style.スタイル);
   }
  } else if (target[0] == "条件") {
   let index = parseInt(target[1]) - 1;
   if (target[2] == "左辺") {
    setStyle($($proc.children(".proc_conditions").children("li").children(".condition_content").get(index)).children(".cond_left"), style.スタイル);
   } else if (target[2] == "右辺") {
    setStyle($($proc.children(".proc_conditions").children("li").children(".condition_content").get(index)).children(".cond_right"), style.スタイル);
   }
  } else if (target[0] == "リンク先") {
   setStyle($procContent.children(".choose_proc"), style.スタイル);
  } else if (target[0] == "データアクセスID") {
   setStyle($procContent.children(".accessID"), style.スタイル);
  } else if (target[0] == "戻り値の変数名") {
   setStyle($procContent.children(".return_content").children(".return_name"), style.スタイル);
  } else if (target[0] == "戻り値の代入先") {
   setStyle($procContent.children(".return_content").children(".return_target"), style.スタイル);
  } else if (target[0] == "戻り値の型") {
   setStyle($procContent.children(".return_content").children(".return_type"), style.スタイル);
  } else if (target[0] == "例外の型") {
   setStyle($procContent.children(".exception_content").children(".exception_type"), style.スタイル);
  } else if (target[0] == "共通機能ID") {
   setStyle($procContent.children(".call_common_info").children(".input_common"), style.スタイル);
  } else if (target[0] == "修飾子") {
   setStyle($procContent.children(".method_info").children(".modifier"), style.スタイル);
  } else if (target[0] == "メソッド名") {
   setStyle($procContent.children(".method_info").children(".method_name"), style.スタイル);
  } else if (target[0] == "呼び出しメソッド") {
   setStyle($procContent.children(".method_call_info").children(".input_method"), style.スタイル);
  } else if (target[0] == "メッセージID") {
   setStyle($procContent.children(".messageID"), style.スタイル);
  } else if (target[0] == "赤くする画面項目") {
   let index = parseInt(target[1]) - 1;
   setStyle($($procContent.children(".message_redProp").children(".input_value").get(index)), style.スタイル);
  } else if (target[0] == "読み込みファイル") {
   setStyle($procContent.children(".readFileID"), style.スタイル);
  } else if (target[0] == "出力ファイル") {
   setStyle($procContent.children(".writeFileID"), style.スタイル);
  } else if (target[0] == "テーブルID") {
   setStyle($procContent.children(".tableID"), style.スタイル);
  } else if (target[0] == "補足情報") {
   setStyle($procContent.children(".unload_info"), style.スタイル);
  } else if (target[0] == "マッチングするファイルID1") {
   setStyle($procContent.children(".matchFileID1"), style.スタイル);
  } else if (target[0] == "マッチングするファイル1のキー") {
   let index = parseInt(target[1]) - 1;
   setStyle($($procContent.children(".matchingkeys1").children(".matchkey").get(index)), style.スタイル);
  } else if (target[0] == "マッチングするファイルID2") {
   setStyle($procContent.children(".matchFileID2"), style.スタイル);
  } else if (target[0] == "マッチングするファイル2のキー") {
   let index = parseInt(target[1]) - 1;
   setStyle($($procContent.children(".matchingkeys2").children(".matchkey").get(index)), style.スタイル);
  } else if (target[0] == "ソートするファイルID") {
   let index = parseInt(target[1]) - 1;
   setStyle($($procContent.children(".sortFileID").get(index)), style.スタイル);
  } else if (target[0] == "ソートキー") {
   let index = parseInt(target[1]) - 1;
   setStyle($($procContent.children(".sortkeys").children(".sortkeyrow").get(index)).children(".sortkey"), style.スタイル);
  } else if (target[0] == "HULFTID") {
   setStyle($procContent.children(".hulftID"), style.スタイル);
  } else if (target[0] == "接続先") {
   setStyle($procContent.children(".hostname"), style.スタイル);
  }　else if (target[0] == "要求分析テキスト") {
   setStyle($procContent.children(".input_youkyu"), style.スタイル);
  }else if (target[0] == "関数") {
   setStyle($procContent.children(".func_name"), style.スタイル);
  }else if (target[0] == "関数呼び出し") {
   setStyle($procContent.children(".input_callfunc"), style.スタイル);
  }else if (target[0] == "DA呼び出し") {
   setStyle($procContent.children(".callda_id"), style.スタイル);
  }
 }
}
var procTypeCount;
function createMetrics() {
 countTemplate = {
  "自由記述" : 0,
  "代入" : 0,
  "データアクセス" : 0,
  "ループ" : 0,
  "条件付き処理" : 0,
  "メソッド" : 0,
  "メソッド呼び出し" : 0,
  "try" : 0,
  "catch" : 0,
  "finally" : 0,
  "概要" : 0,
  "if" : 0,
  "else" : 0,
  "else if" : 0,
  "リンク" : 0,
  "共通機能呼び出し" : 0,
  "ワーク" : 0
 }
 // 各ノードの出現数を数える
 for (let layout of afterData.layoutList) {
  procTypeCount = JSON.parse(JSON.stringify(countTemplate));
  console.log("イベントID:" + layout.イベントID);
  for (proc of layout.処理) {
   countProcType(proc); }
  dispMetrics(); }
}
function dispMetrics() {
 setAfterData();
 // 各ノードの出現数からステップ数を出す
 let stepcount = 0;
 stepcount += procTypeCount["自由記述"] * 1;
 stepcount += procTypeCount["代入"] * 1;
 stepcount += procTypeCount["リンク"] * 1;
 stepcount += procTypeCount["データアクセス"] * 1;
 stepcount += procTypeCount["ループ"] * 1;
 stepcount += procTypeCount["条件付き処理"] * 0;
 stepcount += procTypeCount["if"] * 1;
 stepcount += procTypeCount["else"] * 0;
 stepcount += procTypeCount["else if"] * 1;
 stepcount += procTypeCount["概要"] * 0;
 stepcount += procTypeCount["共通機能呼び出し"] * 1;
 stepcount += procTypeCount["メソッド"] * 0;
 stepcount += procTypeCount["メソッド呼び出し"] * 1;
 stepcount += procTypeCount["try"] * 1;
 stepcount += procTypeCount["catch"] * 1;
 stepcount += procTypeCount["finally"] * 1;
 stepcount += procTypeCount["ワーク"] * 1;
 console.log("概算ステップ数：" + stepcount);
 let cyclomaticComplexity = 1 + procTypeCount["ループ"] + procTypeCount["if"] + procTypeCount["else if"] + procTypeCount["catch"];
 console.log("循環的複雑度：" + cyclomaticComplexity);
}
/**
 * 
 * @param proc
 * @returns
 */
function countProcType(proc) {
 let step = 1;
 if (proc.種類 === "代入") {
  if (proc.移送情報 !== undefined) {
   step = proc.移送情報.length;
  }
 }
 if (proc.wkList !== undefined) {
  procTypeCount.ワーク += proc.wkList.length;
 }
 if (proc.条件 !== undefined) {
  step = proc.条件.length;
 }
 if (procTypeCount[proc.種類] === undefined) {
  procTypeCount[proc.種類] = step;
 } else {
  procTypeCount[proc.種類] += step;
 }
 if (proc.子処理 !== undefined) {
  for (let p of proc.子処理) {
   countProcType(p); }
 }
}
