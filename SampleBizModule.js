/*
処理固有に必要な処理などを、この層に実装する。

テストや挙動確認を含めたコードをコメントアウト込みで、
サンプルとして記述する。

written by syo
http://awsblog.physalisgp02.com
*/
module.exports = function SampleBizModule() {
  // 疑似的な継承関係として親モジュールを読み込む
  var superClazzFunc = new require("./AbstractBizUnitCommon.js");
  // prototypeにセットする事で継承関係のように挙動させる
  SampleBizModule.prototype = new superClazzFunc();

  // 処理の実行
  function* execute(event, context, bizRequireObjects) {
    var base = SampleBizModule.prototype.AbstractBaseCommon;
    try {
      base.writeLogTrace("SampleBizModule# execute : start");

      // 親の業務処理を実行
      return yield SampleBizModule.prototype.executeBizUnitCommon(
        event,
        context,
        bizRequireObjects
      );
    } catch (err) {
      base.printStackTrace(err);
      throw err;
    } finally {
      base.writeLogTrace("SampleBizModule# execute : end");
    }
  }

  /*
  ワーカー処理（疑似スレッド処理）用のクラスを返却
  */
  SampleBizModule.prototype.AbstractBaseCommon.getSubWorkerClazzFunc = function () {
    var base = SampleBizModule.prototype.AbstractBaseCommon;
    try {
      base.writeLogTrace("SampleBizModule# getSubWorkerClazzFunc : start");
      return require("./SampleBizWorkerModule.js");
    } catch (err) {
      base.printStackTrace(err);
      throw err;
    } finally {
      base.writeLogTrace("SampleBizModule# getSubWorkerClazzFunc : end");
    }
  };

  /*
  業務メイン処理（オーバーライドのサンプル）

  @override
  @param args 各処理の結果を格納した配列
  */
  SampleBizModule.prototype.AbstractBaseCommon.beforeMainExecute = function (
    args
  ) {
    var base = SampleBizModule.prototype.AbstractBaseCommon;
    try {
      base.writeLogTrace("SampleBizModule# beforeMainExecute : start");

      // 基底処理を実行する事で、Lambda実行引数のeventを取り出せる
      var event = base.getFirstIndexObject(args);
      console.log(JSON.stringify(event));

      var datas = [];
      datas.push({
        "col1-1": "val1-1",
        "col1-2": "val1-2",
        "col1-3": "val1-3",
      });
      datas.push({
        "col2-1": "val2-1",
        "col2-2": "val2-2",
        "col2-3": "val2-3",
      });
      datas.push({
        "col3-1": "val3-1",
        "col3-2": "val3-2",
        "col3-3": "val3-3",
      });
      datas.push({
        "col4-1": "val4-1",
        "col4-2": "val4-2",
        "col4-3": "val4-3",
      });
      datas.push({
        "col5-1": "val5-1",
        "col5-2": "val5-2",
        "col5-3": "val5-3",
      });
      datas.push({
        "col6-1": "val6-1",
        "col6-2": "val6-2",
        "col6-3": "val6-3",
      });
      datas.push({
        "col7-1": "val7-1",
        "col7-2": "val7-2",
        "col7-3": "val7-3",
      });

      // テスト用の値を仕込む
      // 実際には、Lambda起動引数：eventから
      // 何らかの処理加工した配列を後続に引き渡す想定
      var result = { workerArgs: datas };

      return result;
    } catch (err) {
      base.printStackTrace(err);
      throw err;
    } finally {
      base.writeLogTrace("SampleBizModule# beforeMainExecute : end");
    }
  }.bind(SampleBizModule.prototype.AbstractBaseCommon);

  return {
    execute,
  };
};
