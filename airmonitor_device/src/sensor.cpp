#include "sensor.h"
#include <Arduino.h>

static int pm25 = 12;
static int pm1 = 12;
static int pm10 = 12;

float sensor_get_temperature() {
    return 25.3;
}

int sensor_get_humidity() {
    return 50;
}

int sensor_get_pm1() {
    int adjust = random(0, 10) - 5;
    pm1 = pm1 + adjust >= 0 ? pm1 + adjust : 0;
    pm1 = pm1 > 200 ? 200 : pm1;
    return pm1;
}

int sensor_get_pm25() {
    int adjust = random(0, 10) - 5;
    pm25 = pm25 + adjust >= 0 ? pm25 + adjust : 0;
    pm25 = pm25 > 200 ? 200 : pm25;
    return pm25;
}

int sensor_get_pm10() {
    int adjust = random(0, 10) - 5;
    pm10 = pm10 + adjust >= 0 ? pm10 + adjust : 0;
    pm10 = pm10 > 200 ? 200 : pm10;
    return pm10;
}
