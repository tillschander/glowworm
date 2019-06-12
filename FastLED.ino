#include "FastLED.h"
#define NUM_LEDS 64

CRGB leds[NUM_LEDS];
void setup() {
    Serial.begin(1000000);
    LEDS.addLeds<WS2812B,6>(leds, NUM_LEDS);
}
int serialGlediator() {
    while (!Serial.available()) {}
    return Serial.read();
}
void loop() {
    while (serialGlediator() != 255) {} // Each frame begins with 255

    for (int i=0; i < NUM_LEDS; i++) {
        leds[i].r = serialGlediator();
        leds[i].g = serialGlediator();
        leds[i].b = serialGlediator();
    }

    FastSPI_LED.show();
}