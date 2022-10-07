/* app.js */

const express = require("express");
const crypto = require('crypto');

// Tracing libraries
const { startTracing } = require('@splunk/otel');
const opentelemetry = require("@opentelemetry/api");

// For local debugging and visibility into trace/span activity
const { diag, DiagConsoleLogger, DiagLogLevel } = require('@opentelemetry/api');

const PORT = process.env.PORT || "8080";
const app = express();

startTracing({
  serviceName: 'service-1'
});

diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.ALL);

app.get("/", (req, res) => {
  const tracer = opentelemetry.trace.getTracer('my-service-tracer');
  const span = tracer.startActiveSpan('main', span => {
    span.setAttribute('attribute1', 'value1');
    var randomUUID = crypto.randomUUID();
    res.send(randomUUID);
    // Be sure to end the span!
    span.end();
  })
});

app.listen(parseInt(PORT, 10), () => {
  console.log(`Listening for requests on http://localhost:${PORT}`);
});
