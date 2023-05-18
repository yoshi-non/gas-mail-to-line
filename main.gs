// LINE Notify アクセストークン
var LINE_NOTIFY_ACCESS_TOKEN = TOKEN;

// Gmail受信トリガーで実行される関数
function onNewEmailReceived(e) {
  var threads = GmailApp.search("is:unread");

  for (var i = 0; i < threads.length; i++) {
    var messages = threads[i].getMessages();

    for (var j = 0; j < messages.length; j++) {
      var message = messages[j];
      var subject = message.getSubject();
      var sender = message.getFrom();
      var body = message.getPlainBody();

      // 特定の条件に基づいてメールをフィルタリングする場合は、ここに追加の条件を記述します
      if (subject === "特定の件名") {
        sendLineNotification(subject, sender, body);
      }
    }
  }

  markEmailsAsRead(threads);
}

// LINEに通知を送信する関数
function sendLineNotification(subject, sender, body) {
  var message =
    "メールが届きました！\n\n件名: " +
    subject +
    "\n差出人: " +
    sender +
    "\n本文: " +
    body;

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
