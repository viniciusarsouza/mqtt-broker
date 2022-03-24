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

const chance = new Chance()

device
  .on('connect', async function() {
    console.log('connect');

    device.subscribe('sensor/data/calibration');

    for(let i = 0; i < 60; i++){
      const payload = {
        temperature: chance.floating({ min: 20, max: 22 }),
        call_calibration: false
    }

    if(i == 58) {
      payload.call_calibration = true
    }

    console.log(`Seconds: ${i +1 } -> Temperature: ${payload.temperature}`)

    await device.publish('sensor/data', JSON.stringify(payload))
    }

  });



device
  .on('message', function(topic, payload) {
    console.log('y = m*x + b -> ', payload.toString())
  });


  