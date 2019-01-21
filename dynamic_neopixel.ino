#include <Adafruit_NeoPixel.h>
#ifdef __AVR__
  #include <avr/power.h>
#endif

#define PIN 6

Adafruit_NeoPixel strip;
int count;
String inputString = "";
boolean stringComplete = false;
String command;
String value;
int ind1;

void setup() {
  Serial.begin(1000000);
  inputString.reserve(200);
  strip = Adafruit_NeoPixel(512, PIN, NEO_GRB + NEO_KHZ800);
  strip.begin();
  strip.show();
  count = 0;
  strip.updateLength(count);
}

void loop() {
  if (stringComplete) {
    ind1 = inputString.indexOf(',');
    command = inputString.substring(0, ind1);
    value = inputString.substring(ind1+1);
    Serial.println(command);
    Serial.println(value);

    if (command == "count") {
      for(uint16_t i=0; i<strip.numPixels(); i++) {
        strip.setPixelColor(i, strip.Color(0, 0, 0));
        strip.show();
      }
      count = value.toInt();
      strip.updateLength(count);
    }

    if (command == "pixel" && (value.length() == 11 || value.length() == 12)) {
      int r = value.substring(0, 3).toInt();
      int g = value.substring(3, 6).toInt();
      int b = value.substring(6, 9).toInt();
      int n = value.substring(9).toInt();

      strip.setPixelColor(n, strip.Color(r, g, b));
      strip.show();
    }

    inputString = "";
    stringComplete = false;
  }
}

void serialEvent() {
  while (Serial.available()) {
    char inChar = (char)Serial.read();
    inputString += inChar;
    if (inChar == '\n') {
      stringComplete = true;
    }
  }
}