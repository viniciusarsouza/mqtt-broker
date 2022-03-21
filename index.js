const awsIot = require('aws-iot-device-sdk')

const device = awsIot.device({
  keyPath: 'temp-sensor.private.key',
  certPath: 'temp-sensor.cert.pem',
  caPath: 'root-CA.crt',
  clientId: 'temp-sensor',
  region: 'us-west-2',
  host: 'a27sf0y6gli8so.iot.us-west-2.amazonaws.com'
})

const contents = "Started!!!"

device.on('connect', function() {
  console.log('connect');

  device.publish('temp-sensor-Policy', JSON.stringify({test_data: 'NodeJS'}))

  console.log('Message Sent')
})

device.on('message', function(topic, payload) {
  console.log('message', topic, payload.toString())
})