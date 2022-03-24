const awsIot = require('aws-iot-device-sdk')
var Chance = require('chance');

const device = awsIot.device({
  keyPath: './util/temp-sensor.private.key',
  certPath: './util/temp-sensor.cert.pem',
  caPath: './util/root-CA.crt',
  clientId: 'temp-sensor',
  region: 'us-west-2',
  host: 'a27sf0y6gli8so-ats.iot.us-west-2.amazonaws.com'
})

/**
 * instance Chance lib for get random float numbers
 */
const chance = new Chance()

/**
 * listen a socket topic to connect with IoT Core
 */
device
  .on('connect', async function() {
    console.log('connect');

    /**
     * subscribe to sensor calibration topic, thats where will receive the calibration coefficients
     */
    device.subscribe('sensor/data/calibration');

    /**
     * a loop that simulates sensor sending a message per second
     */
    for(let i = 0; i < 60; i++){
      /**
       * construct payload structure that will be sended to IoT Core by publish
       * call_calibration is a tag that will be used to trigger a rule on IoT Core
       */
      const payload = {
        temperature: chance.floating({ min: 20, max: 22 }),
        call_calibration: false
    }

    if(i == 58) {
      payload.call_calibration = true
    }

    /**
     * console to simulate temperature per second
     */
    console.log(`Seconds: ${i +1 } -> Temperature: ${payload.temperature}`)

    /**
     * publish message to sensor/data topic to IoT Core
     */
    await device.publish('sensor/data', JSON.stringify(payload))
    }

  });

  /**
   * consolea message when recconect
   */
  device.on('reconnect', function() {
    console.log('reconnect')
  })


/**
 * listen message topic, and console messages received by subscribeds topics
 * in this case will receive only one message, thats the calibration coefficients and kill the processes
 */
device
  .on('message', function(topic, payload) {
    console.log('/------------------//-----------------------//----------------------//----------/')
    console.log('y = m*x + b -> ', payload.toString())
    process.exit()
  });





  