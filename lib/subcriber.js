"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var pubsub_1 = require("@google-cloud/pubsub");
var core_1 = require("./core");
function createSubscription(projectId, credentials, subscriptionName, logInfo) {
  var s = new pubsub_1.PubSub({ projectId: projectId, credentials: credentials }).subscription(subscriptionName);
  core_1.checkPermission(s.iam, ['pubsub.subscriptions.consume'], logInfo);
  return s;
}
exports.createSubscription = createSubscription;
function createSubscriber(projectId, credentials, subscriptionName, logError, logInfo, json) {
  var s = createSubscription(projectId, credentials, subscriptionName, logInfo);
  return new Subscriber(s, logError, json);
}
exports.createSubscriber = createSubscriber;
exports.createConsumer = createSubscriber;
var Subscriber = (function () {
  function Subscriber(subscription, logError, json, ack) {
    this.subscription = subscription;
    this.logError = logError;
    this.json = json;
    this.ack = (ack === false ? false : true);
    this.subscribe = this.subscribe.bind(this);
    this.get = this.get.bind(this);
    this.receive = this.receive.bind(this);
    this.read = this.read.bind(this);
    this.consume = this.consume.bind(this);
  }
  Subscriber.prototype.get = function (handle) {
    return this.subscribe(handle);
  };
  Subscriber.prototype.receive = function (handle) {
    return this.subscribe(handle);
  };
  Subscriber.prototype.read = function (handle) {
    return this.subscribe(handle);
  };
  Subscriber.prototype.consume = function (handle) {
    return this.subscribe(handle);
  };
  Subscriber.prototype.subscribe = function (handle) {
    var _this = this;
    this.subscription.on('message', function (message) {
      if (_this.ack) {
        message.ack();
      }
      var data = (_this.json ? JSON.parse(message.data.toString()) : message.data.toString());
      try {
        handle(data, message.attributes, message);
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
  return Subscriber;
}());
exports.Subscriber = Subscriber;
exports.Consumer = Subscriber;
