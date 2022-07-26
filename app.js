function elem(selector) {
    return document.querySelector(selector);
}

function createAlertDiv(message) {
    return `<div class="uk-alert-danger" uk-alert>
                <a class="uk-alert-close" uk-close></a>
                <p id="json_error">`+ message + `</p>
            </div>`;
}

const jsnviewOptions = {
    showLen: true,
    showType: false,
    showBrackets: true,
    showFoldmarker: false,
    colors: { boolean: '#ff2929', null: '#ff2929', string: '#690', number: '#905', float: '#002f99' }
}

var jsonData = '';

function parseJsonData(dataStr) {
    jsonData = JSON.parse(dataStr);
}

function formatJsonText() {
    try {
        let dataStr = elem("#json_text").value;
        if (dataStr == undefined || dataStr.length < 1) {
            elem("#json_error").innerHTML = createAlertDiv('Please enter valid json data in the text field.');
            return;
        }
        parseJsonData(dataStr);
        elem("#json_text").value = JSON.stringify(jsonData, null, "\t");
    } catch (err) {
        elem("#json_error").innerHTML = createAlertDiv('Formatting json failed, please enter valid json data.');
        console.error(err);
    }
}

function loadJsonViewer() {
    elem("#json_viwer").innerHTML = '';
    try {
        let dataStr = elem("#json_text").value;
        if (dataStr == undefined || dataStr.length < 1) {
            elem("#json_error").innerHTML = createAlertDiv('Please enter valid json data in the text field.');
            return;
        }
        parseJsonData(dataStr);
        const treeView = jsnview(jsonData, jsnviewOptions);
        elem("#json_viwer").appendChild(treeView);
        elem("#json_error").innerHTML = '';
    } catch (err) {
        elem("#json_error").innerHTML = createAlertDiv('Please enter valid json data in the text field.');
        console.error(err);
    }
}

function runQuery() {
    try {
        elem("#result_json_viwer").innerHTML = '';
        let queryStr = elem("#query_text").value;
        if (queryStr == undefined || queryStr.length < 1) {
            elem("#result_json_error").innerHTML = createAlertDiv('Please enter valid JMESPath query in the text field.');
            return;
        }

        if (jsonData == undefined || jsonData == null) {
            elem("#result_json_error").innerHTML = createAlertDiv('Json data provided in invalid.');
            return;
        }

        if (jsonData == '') {
            loadJsonViewer();
        }

        let queryResult = jmespath.search(jsonData, queryStr);
        const treeView = jsnview(queryResult, jsnviewOptions);
        elem("#result_json_viwer").appendChild(treeView);

        elem("#result_json_error").innerHTML = '';
    } catch (err) {
        elem("#result_json_error").innerHTML = createAlertDiv('Some error ocurred: ' + err);
        console.error(err);
    }
}