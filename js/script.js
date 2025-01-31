let dataTabella = [];
let table;
window.addEventListener('load', function () {
    var file = document.getElementById('file');
    var output = document.getElementById('output');
    file.addEventListener('change', function () {
        var reader = new FileReader();
        reader.onload = (event) => {
            var data = new Uint8Array(event.target.result);
            var workbook = XLSX.read(data, { type: 'array' });
            var firstSheetName = workbook.SheetNames[1];
            var worksheet = workbook.Sheets[firstSheetName];
            var data = XLSX.utils.sheet_to_json(worksheet);
            // tabellaTmp=data;
            // console.log(data);
            scopattaTabella(data);
        };
        reader.readAsArrayBuffer(file.files[0]);
    });
    document.querySelector('#caricaDati').addEventListener('click', function () {
        
        if (document.getElementById('categoria').value == '') {
            // alert('Inserire una categoria');
            attivaAlert('Inserire una categoria!'.toUpperCase(), 'Attenzione', '', '');
            return;
        }
        if (dataTabella.length == 0) {
            // alert('Caricare un file');
            attivaAlert('Caricare un file valido!'.toUpperCase(), 'Attenzione', '', '');
            return;
        }
        let jSonRichiesta = {
            "azione": "caricaDati",
            "dati": dataTabella,
            "categoria": document.getElementById('categoria').value,
        }
        call(jSonRichiesta);
    })
    var c = location.href.split("?");
    if (c.length >= 1) {
        for (var i = 0; i < c.length; i++) {
            if (c[i].toLocaleLowerCase().indexOf('caricafile') >= 0) {
                document.getElementById('headerCaricaFile').style.display = 'block';
                return;
            }
        }
    }
    document.getElementById('header').style.display = 'block';
    document.getElementById("campoCerca").addEventListener("keyup", function () {
        let valore = this.value.toLowerCase();
        let dati = document.getElementById('contenitoreTabella').querySelectorAll('tr');
        for (var i = 0; i < dati.length; i++) {
            let riga = dati[i].querySelectorAll('td');
            let trovato = false;
            for (var j = 0; j < riga.length; j++) {
                let cella = riga[j];
                if (cella.innerHTML.toLowerCase().indexOf(valore) >= 0) {
                    trovato = true;
                    break;
                }
            }
            if (trovato) {
                dati[i].style.display = "";
            } else {
                dati[i].style.display = "none";
            }

        }
    });
    document.querySelectorAll('.btnLeggiDati').forEach((element) => element.addEventListener('click', function () {

        let jSonRichiesta = {
            "azione": "leggiDati",
            "categoria": document.getElementById('categoriaTabella').value,
            "classifica": document.getElementById('classifica').value,
        }
        call(jSonRichiesta, (data) => {
            if (data.esito == true && data.error == '') {
                scopattaTabella(data.dati);

            } else {
                let tabella = document.getElementById('contenitoreTabella');
                tabella.style.display = 'none';
                attivaAlert(data.error, 'Errore', '', '');
            }

        });
    }));
    this.document.getElementById('pulisciCampoCerca').addEventListener('click', function () {
        document.getElementById('campoCerca').value = '';
        let dati = document.getElementById('contenitoreTabella').querySelectorAll('tr');
        for (var i = 0; i < dati.length; i++) {
            dati[i].style.display = "";
        }
    })
});
const call = (jSonRichiesta, callBack = '') => {
    jSonRichiesta = JSON.stringify(jSonRichiesta);
    fetch("php/request.php", {
        method: 'post',
        headers: {
            "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
        },
        body: 'jSonRichiesta=' + jSonRichiesta
    })
        .then(res => res.text()) //res.json()
        .then(function (phpRes) {
            console.log(phpRes);
            phpRes = JSON.parse(phpRes);
            // let jSonRes = JSON.parse(phpRes);
            // console.log(jSonRes);
            if (callBack != '') {
                callBack(phpRes);
            }
        })
        .catch(error => {
            console.error('Errore:', error);
        });
}

const scopattaTabella = (tabellaTmp) => {
    let tabella = document.getElementById('contenitoreTabella');
    tabella.style.display = 'block';
    tabella.innerHTML = '';
    let tabellaObj = document.createElement('table');
    tabellaObj.className = 'table table-striped';
    let thead = document.createElement('thead');
    let tr = document.createElement('tr');

    for (var [k, v] of Object.entries(tabellaTmp)) {
        for (var [k1, v1] of Object.entries(v)) {
            let th = document.createElement('th');
            th.innerHTML = k1;
            tr.appendChild(th);
        }
        break;
    }
    thead.appendChild(tr);
    tabellaObj.appendChild(thead);
    let tbody = document.createElement('tbody');
    cont = 0;
    for (var [k, v] of Object.entries(tabellaTmp)) {
        cont++;
        let tr = document.createElement('tr');


        for (var [k1, v1] of Object.entries(v)) {
            let td = document.createElement('td');

            if (cont == 1) {
                td.className = 'gold';
            } else if (cont == 2) {
                td.className = 'silver';
            } else if (cont == 3) {
                td.className = 'bronze';
            }
            td.innerHTML = v1;
            tr.appendChild(td);
        }
        tbody.appendChild(tr);
    }
    tabellaObj.appendChild(tbody);
    tabella.appendChild(tabellaObj);
    // tabella.style.height=document.documentElement.clientHeight- (document.getElementById('header').clientHeight+50)+''+'px';
    dataTabella = tabellaTmp;
}
function generaUUID() {
    try {
        const array = new Uint8Array(8);
        crypto.getRandomValues(array);
        let hexID = Array.from(array, byte => byte.toString(16).padStart(2, "0")).join("");
        var str = Date.now() + '' + hexID.toUpperCase();
        return 'UID' + str;
    } catch (e) {

        return 'UID' + Date.now() + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
    }


}
let attivaAlert = (messaggio, titolo, callbackConferma, callBackChiudi) => {
    let guid = generaUUID();
    let modal = `
    <div class="modal fade" id="${guid}" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="${titolo}">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="${titolo}">${titolo}</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            ${messaggio}
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" id="chiudi-${guid}">Chiudi</button>
            <button type="button" class="btn btn-primary" id="conferma-${guid}">Conferma</button>
          </div>
        </div>
      </div>
    </div>`;

    // Rimuove un eventuale modal precedente con lo stesso ID
    let modalEsistente = document.getElementById(guid);
    if (modalEsistente) {
        modalEsistente.remove();
    }

    // Aggiunge il modal al body
    document.body.insertAdjacentHTML("beforeend", modal);

    let modalObj = new bootstrap.Modal(document.getElementById(guid));
    modalObj.show();

    document.querySelector(`#conferma-${guid}`).addEventListener('click', function () {
        if (callbackConferma) {
            callbackConferma();
        }
        modalObj.hide();
    });
    document.querySelector(`#chiudi-${guid}`).addEventListener('click', function () {
        if (callBackChiudi) {
            callBackChiudi();
        }
        modalObj.hide();
    });
    // Rimuove completamente il modal dal DOM dopo la chiusura
    document.getElementById(guid).addEventListener('hidden.bs.modal', function () {
        document.getElementById(guid).remove();
    });
};

// const scopattaTabella = (tabellaTmp) => {
//     let columns = [];
//     let listaColonne=['Posizione','Team','Score 1','Score 2','Score 3','Score 4','Score 5','Componenti',]
//     for (var [k, v] of Object.entries(tabellaTmp)) {
//         for (var [k1, v1] of Object.entries(v)) {
//             if(listaColonne.indexOf(k1)>=0){
//                 columns.push({ title: k1, field: k1 });
//             }
//         }
//         break;
//     }

//     table = new Tabulator("#contenitoreTabella", {
//         data: tabellaTmp,
//         columns: columns,
//         layout: "fitDataTable",
//         // responsiveLayout: "collapse",
//         // persistence : true,
//         tooltips: true,
//         addRowPos: "top",
//         history: true,
//         pagination: "local",
//         paginationSize: 100,
//         movableColumns: true,
//         resizableRows: false,
//         height: document.documentElement.clientHeight - (document.getElementById('header').clientHeight + document.getElementById('headerCaricaFile').clientHeight +20) + '' + 'px',
//         pagination: false,
//         paginationCounter: "rows",
//         locale: "it", // Imposta la localizzazione italiana come default
//         langs: {
//             "it": italianLocale, // Imposta le traduzioni italiane
//         },
//         selectableRows: 1,
//         footerElement: null
//         // Configurazioni aggiuntive per bottoni di esportazione ecc.
//     });
//     dataTabella = tabellaTmp;
// }

