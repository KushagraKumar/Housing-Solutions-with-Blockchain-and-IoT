#include <ESP8266WiFi.h>
#include <FirebaseArduino.h>
#include <Servo.h>
// Set these to run example.

Servo name_servo;
#define FIREBASE_HOST "project-4d8a2.firebaseio.com"

#define FIREBASE_AUTH "V6VDTdW7XU8PM7wTn2ERbmyXt3c7D7J0WSwJWNNN"

#define WIFI_SSID "OnePlus 5"

#define WIFI_PASSWORD "abcdefgh12"

int x=1;
int y=1;

void setup() {


Serial.begin(9600);

WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

Serial.print("connecting");

while (WiFi.status() != WL_CONNECTED) {

Serial.print(".");

delay(500);

}

Serial.println();

Serial.print("connected: ");

Serial.println(WiFi.localIP());

Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);

//Firebase.setInt("available",1);
name_servo.attach (2);

}

void loop() {
Serial.println(Firebase.getInt("motorOn"));
if(Firebase.getInt("motorOn")==2)

{
  if(x==1)
  {
Serial.println("ghumra hai");
name_servo.write(0);
delay(800);
name_servo.write(90);
y=1;
x=0;
}
}

else

{
if(Firebase.getInt("motorOn")==1)
{
  if(y==1)
  {
Serial.println("nahi ghumra hai");  
name_servo.write(100);
delay(800);
name_servo.write(90);
x=1;
y=0;
  }
}
}

if (Firebase.failed()) // Check for errors 
{

Serial.print("setting /number failed:");

Serial.println(Firebase.error());

return;

}

//delay(1000);

}
