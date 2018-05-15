#include <Arduino.h>

/**
 * 初始化连接参数
 * @param   productKey      硬件产品的ProductKey
 * @param   deviceName      测试设备的 DeviceName
 * @param   deviceSecret    测试设备的 DeviceSecret
 */
void AliyunIoT_Init(String& productKey, String& deviceName, String& deviceSecret);

/**
 * 与阿里云 IoT 建立连接
 * @return  连接是否成功
 */
bool AliyunIoT_Connect();

/**
 * 检查与阿里云 IoT 的连接状态，如果未连接则尝试连接
 * @return  是否已经与阿里云 IoT 建立连接
 */
bool AliyunIoT_CheckConnection();

/**
 * 生成建立连接需要签名
 * @param   signcontent     需要签名的内容
 * @param   ds              测试设备的 DeviceSecret
 * @return  生成的签名
 */
String AliyunIoT_GetSign(String& signcontent, String& ds);

/**
 * PubSubClient 定时检测
 */
void AliyunIoT_Loop();

/**
 * 上报数据到阿里云 IoT
 * @param   props   属性值列表，使用键值对，以逗号分隔，例如 "PM25Value":12,"CurrentTemperature":25
 */
bool AliyunIoT_PostProperty(String& props);
