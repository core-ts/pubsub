"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var pubsub_1 = require("@google-cloud/pubsub");
var core_1 = require("./core");
var Publisher = (function () {
  function Publisher(topicName, projectId, credentials, log) {
    this.topicName = topicName;
    this.log = log;
    this.topic = new pubsub_1.PubSub({ projectId: projectId, credentials: credentials }).topic(this.topicName);
    core_1.checkPermission(this.topic.iam, ['pubsub.topics.publish'], this.log);
    this.publish = this.publish.bind(this);
  }
  Publisher.prototype.publish = function (data, attributes) {
    var _this = this;
    return new Promise(function (resolve, reject) {
      _this.topic.publishJSON(data, attributes).then(function (messageId) {
        resolve(messageId);
      }).catch(function (err) {
        reject(err);
      });
    });
  };
  return Publisher;
}());
exports.Publisher = Publisher;
var SimplePublisher = (function () {
  function SimplePublisher(projectId, credentials) {
    this.pubsub = new pubsub_1.PubSub({ projectId: projectId, credentials: credentials });
    this.publish = this.publish.bind(this);
  }
  SimplePublisher.prototype.publish = function (topicName, data, attributes) {
    var _this = this;
    return new Promise(function (resolve, reject) {
      var topic = _this.pubsub.topic(topicName);
      topic.publishJSON(data, attributes).then(function (messageId) {
        resolve(messageId);
      }).catch(function (err) {
        reject(err);
      });
    });
  };
  return SimplePublisher;
}());
exports.SimplePublisher = SimplePublisher;
