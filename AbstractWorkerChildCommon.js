module.exports = function AbstractWorkerChildCommon() {
  var Promise;

  // 継承：親クラス＝AbstractBizCommon.js
  var superClazzFunc = require("./AbstractBizCommon.js");
  AbstractWorkerChildCommon.prototype = new superClazzFunc();

  // 各ログレベルの宣言
  var LOG_LEVEL_TRACE = 1;
  var LOG_LEVEL_DEBUG = 2;
  var LOG_LEVEL_INFO = 3;
  var LOG_LEVEL_WARN = 4;
  var LOG_LEVEL_ERROR = 5;

  // 現在の出力レベルを設定(ワーカー処理は別のログレベルを設定可能とする)
  var LOG_LEVEL_CURRENT = LOG_LEVEL_INFO;
  if (process && process.env && process.env.LogLevelForWorker) {
    LOG_LEVEL_CURRENT = process.env.LogLevelForWorker;
  }

  /*
  現在のログレベルを返却する
  ※　処理制御側とログレベルを同一設定で行う場合は、オーバーライドをコメントアウトする
  */
  AbstractWorkerChildCommon.prototype.AbstractBaseCommon.getLogLevelCurrent = function () {
    return LOG_LEVEL_CURRENT;
  }.bind(AbstractWorkerChildCommon.prototype);
  /*
  出力レベル毎のログ処理
  */
  AbstractWorkerChildCommon.prototype.AbstractBaseCommon.writeLogTrace = function (
    msg
  ) {
    var base = AbstractWorkerChildCommon.prototype.AbstractBaseCommon;
    if (base.getLogLevelTrace() >= base.getLogLevelCurrent()) {
      console.log(msg);
    }
  }.bind(AbstractWorkerChildCommon.prototype);

  AbstractWorkerChildCommon.prototype.AbstractBaseCommon.writeLogDebug = function (
    msg
  ) {
    var base = AbstractWorkerChildCommon.prototype.AbstractBaseCommon;
    if (base.getLogLevelDebug() >= base.getLogLevelCurrent()) {
      console.log(msg);
    }
  }.bind(AbstractWorkerChildCommon.prototype);

  AbstractWorkerChildCommon.prototype.AbstractBaseCommon.writeLogInfo = function (
    msg
  ) {
    var base = AbstractWorkerChildCommon.prototype.AbstractBaseCommon;
    if (base.getLogLevelInfo() >= base.getLogLevelCurrent()) {
      console.log(msg);
    }
  }.bind(AbstractWorkerChildCommon.prototype);

  AbstractWorkerChildCommon.prototype.AbstractBaseCommon.writeLogWarn = function (
    msg
  ) {
    var base = AbstractWorkerChildCommon.prototype.AbstractBaseCommon;
    if (base.getLogLevelWarn() >= base.getLogLevelCurrent()) {
      console.log(msg);
    }
  }.bind(AbstractWorkerChildCommon.prototype);

  AbstractWorkerChildCommon.prototype.AbstractBaseCommon.writeLogError = function (
    msg
  ) {
    var base = AbstractWorkerChildCommon.prototype.AbstractBaseCommon;
    if (base.getLogLevelError() >= base.getLogLevelCurrent()) {
      console.log(msg);
    }
  }.bind(AbstractWorkerChildCommon.prototype);

  // 処理の実行
  function* executeBizWorkerCommon(event, context, bizRequireObjects) {
    var base = AbstractWorkerChildCommon.prototype.AbstractBaseCommon;
    try {
      base.writeLogTrace(
        "AbstractWorkerChildCommon# executeBizWorkerCommon : start"
      );
      if (bizRequireObjects.PromiseObject) {
        Promise = bizRequireObjects.PromiseObject;
      }
      AbstractWorkerChildCommon.prototype.RequireObjects = bizRequireObjects;

      return yield AbstractWorkerChildCommon.prototype.executeBizCommon(
        event,
        context,
        bizRequireObjects
      );
    } catch (err) {
      base.printStackTrace(err);
      throw err;
    } finally {
      base.writeLogTrace(
        "AbstractWorkerChildCommon# executeBizWorkerCommon : end"
      );
    }
  }
  AbstractWorkerChildCommon.prototype.executeBizWorkerCommon = executeBizWorkerCommon;

  /*
  業務前処理

  @param args 実行結果配列（最初の処理は、Lambdaの起動引数：record)
  */
  AbstractWorkerChildCommon.prototype.AbstractBaseCommon.beforeMainExecute = function (
    args
  ) {
    var base = AbstractWorkerChildCommon.prototype.AbstractBaseCommon;
    try {
      base.writeLogTrace(
        "AbstractWorkerChildCommon# beforeMainExecute : start"
      );

      base.writeLogInfo(
        "AbstractWorkerChildCommon# beforeMainExecute:args:" +
          JSON.stringify(args)
      );

      return Promise.resolve(args);
    } catch (err) {
      base.printStackTrace(err);
      throw err;
    } finally {
      base.writeLogTrace("AbstractWorkerChildCommon# beforeMainExecute : end");
    }
  }.bind(AbstractWorkerChildCommon.prototype.AbstractBaseCommon);

  /*
  最終後処理
  ワーカー処理（疑似スレッド処理）の戻り値を加工して返却する。

  @param event Lambda起動引数
  @param context コンテキスト
  @param results ワーカー処理（疑似スレッド処理）の順次処理結果
  */
  AbstractWorkerChildCommon.prototype.AbstractBaseCommon.afterAllTasksExecute = function (
    event,
    context,
    results
  ) {
    var base = AbstractWorkerChildCommon.prototype.AbstractBaseCommon;
    try {
      base.writeLogTrace(
        "AbstractWorkerChildCommon# afterAllTasksExecute : start"
      );

      var lastValue = base.getLastIndexObject(results);

      // 返却用
      var params = { lastValue };

      return params;
    } catch (err) {
      base.printStackTrace(err);
      throw err;
    } finally {
      base.writeLogTrace(
        "AbstractWorkerChildCommon# afterAllTasksExecute : end"
      );
    }
  };

  /*
  直列処理のメソッド配列を返却する(オーバーライド)

  サンプル用にログ出力量を減らす為、後処理を間引く

  */
  AbstractWorkerChildCommon.prototype.AbstractBaseCommon.getTasks = function (
    event,
    context
  ) {
    var base = AbstractWorkerChildCommon.prototype.AbstractBaseCommon;
    try {
      base.writeLogTrace("AbstractWorkerChildCommon# getTasks : start");
      return [this.beforeMainExecute, this.businessMainExecute];
    } catch (err) {
      base.printStackTrace(err);
      throw err;
    } finally {
      base.writeLogTrace("AbstractWorkerChildCommon# getTasks : end");
    }
  };

  // 関数定義は　return　より上部に記述
  // 外部から実行できる関数をreturnすること
  return {
    executeBizWorkerCommon,
    AbstractBaseCommon: AbstractWorkerChildCommon.prototype.AbstractBaseCommon,
    AbstractBizCommon: AbstractWorkerChildCommon.prototype,
  };
};
