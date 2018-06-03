"use strict";
const Http = require("http");
const Url = require("url");
var Server;
(function (Server) {
    let studiHomoAssoc = {};
    let port = process.env.PORT;
    if (port == undefined)
        port = 8200;
    let server = Http.createServer((_request, _response) => {
        _response.setHeader("content-type", "text/html; charset=utf-8");
        _response.setHeader("Access-Control-Allow-Origin", "*");
    });
    server.addListener("request", handleRequest);
    server.listen(port);
    function handleRequest(_request, _response) {
        console.log("Ich höre Stimmen!");
        let query = Url.parse(_request.url, true).query;
        console.log(query["command"]);
        if (query["command"]) {
            switch (query["command"]) {
                case "insert":
                    insert(query, _response);
                    break;
                case "refresh":
                    refresh(_response);
                    break;
                case "search":
                    search(query, _response);
                    break;
                default:
                    error();
            }
        }
        _response.end();
    }
    function insert(query, _response) {
        let obj = JSON.parse(query["data"]);
        let _vorname = obj.vorname;
        let _nachname = obj.nachname;
        let _martrikelnummer = obj.martrikelnummer.toString();
        let _alter = obj.alter;
        let _geschlecht = obj.geschlecht;
        let _studiengang = obj.studiengang;
        let studi;
        studi = {
            vorname: _vorname,
            nachname: _nachname,
            martrikelnummer: parseInt(_martrikelnummer),
            alter: _alter,
            geschlecht: _geschlecht,
            studiengang: _studiengang
        };
        studiHomoAssoc[_martrikelnummer] = studi;
        _response.write("Daten empfangen");
    }
    function refresh(_response) {
        console.log(studiHomoAssoc);
        for (let matrikel in studiHomoAssoc) {
            let studi = studiHomoAssoc[matrikel];
            let line = '<tr><td class="datentd">' + studi.nachname + '</td><td  class="datentd">' + studi.vorname + '</td><td  class="datentd">' + matrikel + '</td><td  class="datentd">' + studi.alter + '</td><td  class="datentd">' + studi.geschlecht + '</td><td  class="datentd">' + studi.studiengang + '</td></tr>';
            _response.write(line + "\n");
        }
    }
    function search(query, _response) {
        let studi = studiHomoAssoc[query["searchFor"]];
        if (studi) {
            let line = '<tr><td class="datentd">' + studi.nachname + '</td><td  class="datentd">' + studi.vorname + '</td><td  class="datentd">' + query + '</td><td  class="datentd">' + studi.alter + '</td><td  class="datentd">' + studi.geschlecht + '</td><td  class="datentd">' + studi.studiengang + '</td></tr>';
            _response.write(line);
        }
        else {
            _response.write("No Match");
        }
    }
    function error() {
        alert("Error");
    }
})(Server || (Server = {}));
//# sourceMappingURL=Server.js.map