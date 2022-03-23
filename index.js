const awsIot = require('aws-iot-device-sdk')

const device = awsIot.device({
  keyPath: 'temp-sensor.private.key',
  certPath: 'temp-sensor.cert.pem',
  caPath: 'root-CA.crt',
  clientId: 'temp-sensor',
  region: 'us-west-2',
  host: 'a27sf0y6gli8so-ats.iot.us-west-2.amazonaws.com'
})


device
  .on('connect', function() {
    console.log('connect');

    

    const payload = {
        temperature: 21 
    }

    device.subscribe('sensor/data/temperature');
    device.subscribe('sensor/data/calibration');
    device.publish('sensor/data', JSON.stringify(payload))
    device.publish('sensor/calibrate', JSON.stringify({}))
  });

device
  .on('message', function(topic, payload) {
    console.log('payload: ', payload.toString() );
  });