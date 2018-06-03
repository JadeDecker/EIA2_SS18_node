import * as Http from "http";
import * as Url from "url";

namespace Server {
    interface AssocStringString {
        [key: string]: string;
    }

    interface Studi {
        vorname: string;
        nachname: string;
        martrikelnummer: number;
        alter: number;
        geschlecht: string;
        studiengang: string;
    }
    
    interface Studis {
        [matrikel: string]: Studi;
    }

    let studiHomoAssoc: Studis = {};
    let port: number = process.env.PORT;
    if (port == undefined)
        port = 8200;
    let server: Http.Server = Http.createServer((_request: Http.IncomingMessage, _response: Http.ServerResponse) => {
        _response.setHeader("content-type", "text/html; charset=utf-8");
        _response.setHeader("Access-Control-Allow-Origin", "*");
    });
    server.addListener("request", handleRequest);
    server.listen(port);

    function handleRequest(_request: Http.IncomingMessage, _response: Http.ServerResponse): void {
        console.log("Ich höre Stimmen!");
        let query: AssocStringString = Url.parse(_request.url, true).query;
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

    function insert(query: AssocStringString, _response: Http.ServerResponse): void {
        let obj: Studi = JSON.parse(query["data"]);
        let _vorname: string = obj.vorname;
        let _nachname: string = obj.nachname;
        let _martrikelnummer: string = obj.martrikelnummer.toString();
        let _alter: number = obj.alter;
        let _geschlecht: string = obj.geschlecht;
        let _studiengang: string = obj.studiengang;
        let studi: Studi;
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

    function refresh(_response: Http.ServerResponse): void {
        console.log(studiHomoAssoc);
        for (let matrikel in studiHomoAssoc) {
            let studi: Studi = studiHomoAssoc[matrikel];
            let line: string = '<tr><td class="datentd">' + studi.nachname + '</td><td  class="datentd">' + studi.vorname + '</td><td  class="datentd">' + matrikel + '</td><td  class="datentd">' + studi.alter + '</td><td  class="datentd">' + studi.geschlecht + '</td><td  class="datentd">' + studi.studiengang + '</td></tr>';
            _response.write(line + "\n");
        }
    }

    function search(query: AssocStringString, _response: Http.ServerResponse): void {
        let studi: Studi = studiHomoAssoc[query["searchFor"]];
        if (studi) {
            let line: string = '<tr><td class="datentd">' + studi.nachname + '</td><td  class="datentd">' + studi.vorname + '</td><td  class="datentd">' + query + '</td><td  class="datentd">' + studi.alter + '</td><td  class="datentd">' + studi.geschlecht + '</td><td  class="datentd">' + studi.studiengang + '</td></tr>';
            _response.write(line);
        } else {
            _response.write("No Match");
        }
    }

    function error(): void {
        alert("Error");
    }
}