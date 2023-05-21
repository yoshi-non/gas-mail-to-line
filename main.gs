// LINE Notify アクセストークン
var LINE_NOTIFY_ACCESS_TOKEN = TOKEN;

// Gmail受信トリガーで実行される関数
function onNewEmailReceived(e) {
  var threads = GmailApp.search("is:unread");

  for (var i = 0; i < threads.length; i++) {
    var messages = threads[i].getMessages();

    for (var j = 0; j < messages.length; j++) {
      var message = messages[j];
      // subject:件名
      var subject = message.getSubject();
      // sender:差出人
      var sender = message.getFrom();
      // body:本文
      var body = message.getPlainBody();
      var keywords = [
        "ホームページから来店予約がありました。",
        "ホームページから資料請求がありました。",
        "イベントのお申し込みがありました.",
      ];
      var separator =
        "---------------------------------------------------------------";
      // 特定の条件に基づいてメールをフィルタリングする場合は、ここに追加の条件を記述します
      if (subject === "特定の件名") {
        for (var k = 0; k < keywords.length; k++) {
          if (
            body.indexOf(keywords[k]) !== -1 &&
            body.indexOf(separator) !== -1
          ) {
            sendLineNotification(subject, sender, body);
          }
        }
      }
    }
  }

  markEmailsAsRead(threads);
}

// LINEに通知を送信する関数
function sendLineNotification(subject, sender, body) {
  var message = body;

  var formData = {
    message: message,
  };

  var options = {
    method: "post",
    headers: {
      Authorization: "Bearer " + LINE_NOTIFY_ACCESS_TOKEN,
    },
    payload: formData,
  };

  var response = UrlFetchApp.fetch(
    "https://notify-api.line.me/api/notify",
    options
  );
}

// メールを既読にする関数
function markEmailsAsRead(threads) {
  for (var i = 0; i < threads.length; i++) {
    threads[i].markRead();
  }
}
