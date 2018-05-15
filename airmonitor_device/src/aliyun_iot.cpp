#include "aliyun_iot.h"

#include <Crypto.h>
#include <PubSubClient.h>
#include <ESP8266WiFi.h>

static WiFiClient mqttWiFiClient;
static PubSubClient AliyunMQTTclient(mqttWiFiClient);

static String productKey;
static String deviceName;
static String deviceSecret;
static String mqttBroker;
static IPAddress mqttBrokerIP;
static String mqttClientID;
static String mqttUsername;
static String mqttPassword;
static String mqttPostPropertyTopic;

void AliyunIoT_Init(String& pk, String& dn, String& ds) {
    productKey = pk;
    deviceName = dn;
    deviceSecret = ds;

    // 获取 MQTT 服务器地址
    mqttBroker = F("%pk%.iot-as-mqtt.cn-shanghai.aliyuncs.com");
    mqttBroker.replace("%pk%", pk);
    String host = mqttBroker;
    host.toLowerCase();
    WiFi.hostByName(host.c_str(), mqttBrokerIP);

    // 生成 MQTT ClientID
    String timestamp = F("");
    timestamp += millis();
    mqttClientID = F("%dn%&%pk%|securemode=3,signmethod=hmacsha256,timestamp=%timestamp%|");
    mqttClientID.replace("%pk%", pk);
    mqttClientID.replace("%dn%", dn);
    mqttClientID.replace("%timestamp%", timestamp);

    // 生成 MQTT Username
    mqttUsername = dn;
    mqttUsername += "&";
    mqttUsername += pk;

    // 生成 MQTT Password
    String signcontent = F("clientId");
    signcontent += dn + F("&") + pk + F("deviceName") + dn + F("productKey") + pk + F("timestamp") + timestamp;
    mqttPassword = AliyunIoT_GetSign(signcontent, ds);

    String log = F("Aliyun IoT options:\n");
    log += "Broker: " + mqttBroker + "\n";
    log += "BrokerIP: ";
    log += String(mqttBrokerIP[0]) + "." + String(mqttBrokerIP[1]) + "." + String(mqttBrokerIP[2]) + "." + String(mqttBrokerIP[3]) + F("\n");
    log += "ClientID: " + mqttClientID + "\n";
    log += "Username: " + mqttUsername + "\n";
    log += "Password: " + mqttPassword + "\n";
    Serial.println(log);
}

String AliyunIoT_GetSign(String& signcontent, String& ds) {
    SHA256HMAC hmac((const byte *)ds.c_str(), ds.length());
    hmac.doUpdate((const byte *)signcontent.c_str(), signcontent.length());
    byte authCode[SHA256HMAC_SIZE];
    hmac.doFinal(authCode);
    String sign = F("");
    for (byte i = 0; i < SHA256HMAC_SIZE; ++i) {
        if (authCode[i] < 0x10) {
            sign += F("0");
        }
        sign += String(authCode[i], HEX);
    }
    String log = F("GetSign:\n");
    log += signcontent + F("\n");
    log += sign + F("\n");
    Serial.println(log);
    return sign;
}

void AliyunIoT_MQTTCallback(char* c_topic, byte* b_payload, unsigned int length) {

}

bool AliyunIoT_Connect() {
    AliyunMQTTclient.setServer(mqttBrokerIP, 1883);
    AliyunMQTTclient.setCallback(AliyunIoT_MQTTCallback);

    Serial.println("Start connecting to Aliyun IoT...");

    bool result = false;
    for (byte i = 0; i < 3; ++i) {
        result = AliyunMQTTclient.connect(mqttClientID.c_str(),
                                          mqttUsername.c_str(),
                                          mqttPassword.c_str());
        if (result) {
            Serial.println("Connected to Aliyun IoT.");
            break;
        } else {
            String log = F("Connect to Aliyun IoT failed with state ");
            log += AliyunMQTTclient.state();
            Serial.println(log);
        }
        delay(500);
    }

    return result;
}

bool AliyunIoT_CheckConnection() {
    if (!AliyunMQTTclient.connected()) {
        AliyunMQTTclient.disconnect();
        Serial.println("Aliyun IoT connection lost, reconnecting...");
        AliyunIoT_Connect();
    }

    return AliyunMQTTclient.connected();
}

String AliyunIoT_BuildPayload(String& props) {
    String payload = F("{\"id\":\"");
    payload += millis();
    payload += F("\",\"version\":\"1.0\",\"method\":\"thing.event.property.post\",\"params\":{");
    payload += props;
    payload += F("}}");
    return payload;
}

void AliyunIoT_Loop() {
    AliyunMQTTclient.loop();
}

bool AliyunIoT_PostProperty(String& props) {
    // 根据 Alink 协议，生成上报数据所使用的 topic
    if (mqttPostPropertyTopic.length() == 0) {
        String topic = F("/sys/%pk%/%dn%/thing/event/property/post");
        topic.replace("%pk%", productKey);
        topic.replace("%dn%", deviceName);
        mqttPostPropertyTopic = topic;
    }

    bool result = false;
    if (AliyunIoT_CheckConnection()) {
        String payload = AliyunIoT_BuildPayload(props);
        result = AliyunMQTTclient.publish(mqttPostPropertyTopic.c_str(), payload.c_str(), 0);
        Serial.println("Post property payload:");
        Serial.println(payload);
    }

    return result;
}
