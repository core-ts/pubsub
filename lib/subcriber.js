"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var pubsub_1 = require("@google-cloud/pubsub");
var core_1 = require("./core");
var SimpleSubscriber = (function () {
  function SimpleSubscriber(projectId, credentials, subscriptionName, logError, logInfo, json) {
    this.logError = logError;
    this.logInfo = logInfo;
    this.json = json;
    this.subscription = new pubsub_1.PubSub({ projectId: projectId, credentials: credentials }).subscription(subscriptionName);
    core_1.checkPermission(this.subscription.iam, ['pubsub.subscriptions.consume'], this.logInfo);
    this.subscribe = this.subscribe.bind(this);
  }
  SimpleSubscriber.prototype.subscribe = function (handle) {
    var _this = this;
    this.subscription.on('message', function (message) {
      message.ack();
      var data = (_this.json ? JSON.parse(message.data.toString()) : message.data.toString());
      try {
        handle(data, message.attributes);
      }
      catch (err) {
        if (err && _this.logError) {
          _this.logError('Fail to consume message: ' + core_1.toString(err));
        }
      }
    });
    this.subscription.on('error', function (err) {
      if (err && _this.logError) {
        _this.logError('Error: ' + core_1.toString(err));
      }
    });
  };
  return SimpleSubscriber;
}());
exports.SimpleSubscriber = SimpleSubscriber;
