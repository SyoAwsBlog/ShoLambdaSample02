module.exports = function SampleBizWorkerModule() {
  // 疑似的な継承関係として親モジュールを読み込む
  var superClazzFunc = require("./AbstractWorkerChildCommon.js");
  // prototypeにセットする事で継承関係のように挙動させる
  SampleBizWorkerModule.prototype = new superClazzFunc();

  function* execute(event, context, RequireObjects) {
    var base = SampleBizWorkerModule.prototype.AbstractBaseCommon;
    try {
      base.writeLogTrace("SampleBizWorkerModule# execute : start");

      return yield SampleBizWorkerModule.prototype.executeBizWorkerCommon(
        event,
        context,
        RequireObjects
      );
    } catch (err) {
      base.printStackTrace(err);
      throw err;
    } finally {
      base.writeLogTrace("SampleBizWorkerModule# execute : end");
    }
  }
  SampleBizWorkerModule.prototype.execute = execute;

  SampleBizWorkerModule.prototype.AbstractBaseCommon.businessMainExecute = function (
    args
  ) {
    var base = SampleBizWorkerModule.prototype.AbstractBaseCommon;
    try {
      base.writeLogTrace("SampleBizWorkerModule# businessMainExecute : start");

      return new Promise(function (resolve, reject) {
        resolve("businessMainExecute Finish");
      });
    } catch (err) {
      base.printStackTrace(err);
      throw err;
    } finally {
      base.writeLogTrace("SampleBizWorkerModule# businessMainExecute : end");
    }
  }.bind(SampleBizWorkerModule.prototype.AbstractBaseCommon);

  // 関数定義は　return　より上部に記述
  // 外部から実行できる関数をreturnすること
  return {
    execute,
    SampleBizWorkerModule,
    AbstractBaseCommon: SampleBizWorkerModule.prototype.AbstractBaseCommon,
    AbstractBizCommon: SampleBizWorkerModule.prototype.AbstractBizCommon,
    AbstractWorkerChildCommon: SampleBizWorkerModule.prototype,
  };
};
