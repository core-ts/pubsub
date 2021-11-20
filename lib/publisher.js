"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var pubsub_1 = require("@google-cloud/pubsub");
var core_1 = require("./core");
function createTopic(topicName, projectId, credentials, log) {
  var t = new pubsub_1.PubSub({ projectId: projectId, credentials: credentials }).topic(topicName);
  core_1.checkPermission(t.iam, ['pubsub.topics.publish'], log);
  return t;
}
exports.createTopic = createTopic;
function createPublisher(topicName, projectId, credentials, log) {
  var t = createTopic(topicName, projectId, credentials, log);
  return new Publisher(t);
}
exports.createPublisher = createPublisher;
var Publisher = (function () {
  function Publisher(topic) {
    this.topic = topic;
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
function createSimplePublisher(projectId, credentials) {
  var p = core_1.createPubSub(projectId, credentials);
  return new SimplePublisher(p);
}
exports.createSimplePublisher = createSimplePublisher;
var SimplePublisher = (function () {
  function SimplePublisher(pubsub) {
    this.pubsub = pubsub;
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
