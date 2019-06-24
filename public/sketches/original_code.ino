#include "FastLED.h"
#define NUM_LEDS 64
#define DATA_PIN 6

CRGB leds[NUM_LEDS];

void setup() {
    Serial.begin(1000000);
    FastLED.addLeds<WS2812B, DATA_PIN>(leds, NUM_LEDS);
}

void loop() {
    while (!Serial.available()) {}
    while (Serial.read() != 255) {}
    Serial.readBytes((char*)leds, NUM_LEDS * 3);
    FastLED.show();
}