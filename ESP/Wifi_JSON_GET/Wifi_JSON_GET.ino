#include <ESP8266HTTPClient.h>
#include <ESP8266WiFi.h>
#include <ArduinoJson.h>

const char* ssid = "PAUNOCUDOCATU";
const char* password = "reptxeca";

void setup() {
    pinMode(D0, OUTPUT);
  Serial.begin(115200);                 //Serial connection
  WiFi.begin(ssid, password);   //WiFi connection
 
  while (WiFi.status() != WL_CONNECTED) {  //Wait for the WiFI connection completion
    delay(500);
    Serial.println("Waiting for connection");
  }
}

void loop() {
  if(WiFi.status()==WL_CONNECTED){
    Serial.println(WiFi.localIP());
    HTTPClient http;
    http.begin("http://192.168.0.105:3333/lastalarmesps");
    http.addHeader("mac_id","esp-macid-0101");
    
    int httpCode = http.GET();                                  //Send the request
 
    if (httpCode > 0) { //Check the returning code
 
      String payload = http.getString();   //Get the request response payload
      Serial.println(payload);             //Print the response payload
      const char* json = "{\"message\":\"TOCAR AGR\"}";
      if(payload == json){
        digitalWrite(D0, LOW);
      }
      else{
        digitalWrite(D0, HIGH); 
      }
 
    }else
    {
      Serial.println("ERRO DE CONEXÃO");
      Serial.println(WiFi.localIP());
    }
 
    //http.end();   //Close connection
 
  }
 
  delay(20000);    //Send a request every 30 seconds
  
    
  
}
