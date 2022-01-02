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
exports.createProducer = createPublisher;
var Publisher = (function () {
  function Publisher(topic) {
    this.topic = topic;
    this.publish = this.publish.bind(this);
    this.send = this.send.bind(this);
    this.put = this.put.bind(this);
    this.write = this.write.bind(this);
    this.produce = this.produce.bind(this);
  }
  Publisher.prototype.send = function (data, attributes) {
    return this.publish(data, attributes);
  };
  Publisher.prototype.put = function (data, attributes) {
    return this.publish(data, attributes);
  };
  Publisher.prototype.write = function (data, attributes) {
    return this.publish(data, attributes);
  };
  Publisher.prototype.produce = function (data, attributes) {
    return this.publish(data, attributes);
  };
  Publisher.prototype.publish = function (data, attributes) {
    var _this = this;
    return new Promise(function (resolve, reject) {
      var dataBuffer = toBuffer(data);
      var message = {
        data: dataBuffer,
        attributes: attributes
      };
      _this.topic.publishMessage(message).then(function (messageId) {
        resolve(messageId);
      }).catch(function (err) {
        reject(err);
      });
    });
  };
  return Publisher;
}());
exports.Publisher = Publisher;
exports.Producer = Publisher;
function toBuffer(d) {
  return (typeof d === 'string' ? Buffer.from(d) : Buffer.from(JSON.stringify(d)));
}
exports.toBuffer = toBuffer;
function createSimplePublisher(projectId, credentials) {
  var p = core_1.createPubSub(projectId, credentials);
  return new SimplePublisher(p);
}
exports.createSimplePublisher = createSimplePublisher;
exports.createSimpleProducer = createSimplePublisher;
var SimplePublisher = (function () {
  function SimplePublisher(pubsub) {
    this.pubsub = pubsub;
    this.publish = this.publish.bind(this);
    this.send = this.send.bind(this);
    this.put = this.put.bind(this);
    this.write = this.write.bind(this);
    this.produce = this.produce.bind(this);
  }
  SimplePublisher.prototype.send = function (topicName, data, attributes) {
    return this.publish(topicName, data, attributes);
  };
  SimplePublisher.prototype.put = function (topicName, data, attributes) {
    return this.publish(topicName, data, attributes);
  };
  SimplePublisher.prototype.write = function (topicName, data, attributes) {
    return this.publish(topicName, data, attributes);
  };
  SimplePublisher.prototype.produce = function (topicName, data, attributes) {
    return this.publish(topicName, data, attributes);
  };
  SimplePublisher.prototype.publish = function (topicName, data, attributes) {
    var _this = this;
    return new Promise(function (resolve, reject) {
      var topic = _this.pubsub.topic(topicName);
      var dataBuffer = toBuffer(data);
      var message = {
        data: dataBuffer,
        attributes: attributes
      };
      topic.publishMessage(message).then(function (messageId) {
        resolve(messageId);
      }).catch(function (err) {
        reject(err);
      });
    });
  };
  return SimplePublisher;
}());
exports.SimplePublisher = SimplePublisher;
exports.SimpleProducer = SimplePublisher;
