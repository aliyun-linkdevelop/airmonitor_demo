#include <Arduino.h>

#include <WiFiManager.h>
#include "aliyun_iot.h"
#include "sensor.h"

void setup() {
    Serial.begin(115200);

    // 接入 WiFi 网络
    WiFiManager wifiManager;
    wifiManager.autoConnect("AirMonitor_Config");
    Serial.println("Connected to internet.\n");

    // 初始化连接参数
    String productKey = F("__YOUR_DEVICE_PRODUCT_KEY__");
    String deviceName = F("__YOUR_DEVICE_NAME__");
    String deviceSecret = F("__YOUR_DEVICE_SECRET__");
    AliyunIoT_Init(productKey, deviceName, deviceSecret);

    // 建立连接
    AliyunIoT_Connect();
}

unsigned long postSensorDataTimer = 0;
#define POST_SENSOR_DATA_INTERVAL   60

void postSensorData() {
    int pm25 = sensor_get_pm25();
    int pm1 = sensor_get_pm1();
    int pm10 = sensor_get_pm10();
    float temperature = sensor_get_temperature();
    int humidity = sensor_get_humidity();
    String props = F("\"PM25Value\":");
    props += pm25;
    props += ",\"PM1\":";
    props += pm1;
    props += ",\"PM10\":";
    props += pm10;
    props += ",\"CurrentTemperature\":";
    props += temperature;
    props += ",\"RelativeHumidity\":";
    props += humidity;
    AliyunIoT_PostProperty(props);
}

void loop() {
    if (millis() - postSensorDataTimer > POST_SENSOR_DATA_INTERVAL*1000) {
        if (AliyunIoT_CheckConnection()) {
            Serial.println("Start sending sensor data...");
            postSensorData();
        }
        postSensorDataTimer = millis();
    }

    AliyunIoT_Loop();
    delay(1);
}
