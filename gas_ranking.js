// ===========================================
// Google Apps Script - ランキング API
// ===========================================
// このコードをスプレッドシートの
// 「拡張機能 > Apps Script」に貼り付けてください。
//
// スプレッドシートの1行目（ヘッダー）:
//   A1: name  |  B1: score  |  C1: timestamp
// ===========================================

function doGet(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = sheet.getDataRange().getValues();

  if (data.length <= 1) {
    return ContentService
      .createTextOutput(JSON.stringify([]))
      .setMimeType(ContentService.MimeType.JSON);
  }

  var rankings = [];
  for (var i = 1; i < data.length; i++) {
    rankings.push({
      name: data[i][0],
      score: Number(data[i][1]),
      timestamp: data[i][2]
    });
  }

  rankings.sort(function(a, b) { return b.score - a.score; });
  rankings = rankings.slice(0, 10);

  return ContentService
    .createTextOutput(JSON.stringify(rankings))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    var params = JSON.parse(e.postData.contents);
    var name = (params.name || "ななしさん").substring(0, 10);
    var score = Number(params.score) || 0;
    var timestamp = new Date().toISOString();

    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    sheet.appendRow([name, score, timestamp]);

    return ContentService
      .createTextOutput(JSON.stringify({ status: "ok" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
