'use strict';

const express = require("express");
const http = require("http");
const bodyParser = require('body-parser');
const atob = require('atob');

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.post('/api/template-renditions', (req, res) => {
  console.log(`heres the template data we want to send ${JSON.stringify(req.body.formPayload)} \n`);
  if (req.body.formPayload && req.body.formPayload.referenceNumber === '--error--') {
    res.statusCode = 404;
    res.send();
  } else {
    res.send({
      formPayload: req.body.formPayload,
      outputType: { fileExtension: ".pdf", mediaType: "application/pdf" },
      renditionOutputLocation: 'http://localhost:4200/assets/non-dm.pdf'
    });
  }
});

app.get('/api/form-definitions/:templateId', (req, res) => {
  const templateName = atob(req.params.templateId);
  if(templateName === 'generic-ui-definition.docx') {
    res.statusCode = 404;
    res.send();
  } else {
    console.log(`heres the template name ${templateName}`);
    const uiDefinition = require(`./${templateName}`);
    res.send(uiDefinition);
  }
});

const port = process.env.PORT || "9000";

const server = http.createServer(app);

app.set("port", port);

server.listen(port);

console.log(`listening on port ${port}`);
