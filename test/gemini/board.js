var gemini = require('gemini');

gemini.suite('blackboard', function(suite) {
    suite.setUrl('/tests')
        .setCaptureElements('.blackboard')
        .capture('plain');
});
