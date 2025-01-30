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
            console.log(data);
            scopattaTabella(data);
        };
        reader.readAsArrayBuffer(file.files[0]);
    });
    document.getElementById('caricaDati').addEventListener('click', function () {
        if(document.getElementById('categoria').value==''){
            alert('Inserire una categoria');
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
    document.getElementById("campoCerca").addEventListener("keyup", function() {
        let valore = this.value.toLowerCase();
        let dati=table.getRows();
        for(var i=0;i<dati.length;i++){
            let riga=dati[i];
            let data=riga.getData();
            let trovato=false;
            for(var [k,v] of Object.entries(data)){
                if(v.toString().toLowerCase().indexOf(valore)>=0){
                    trovato=true;
                    break;
                }
            }
            if(trovato){
                riga.getElement().style.display = "";
            }else{
                riga.getElement().style.display = "none";
            }

        }
    });
    document.getElementById('btnLeggiDati').addEventListener('click', function () {
        let jSonRichiesta = {
            "azione": "leggiDati",
            "categoria": document.getElementById('categoriaTabella').value,
        }
        call(jSonRichiesta,(data)=>{
            if(data.esito==true && data.error==''){
                scopattaTabella(data.dati);
            }else{
                alert(data.error);
            }
            
        });
    })
    this.document.getElementById('pulisciCampoCerca').addEventListener('click',function(){
        document.getElementById('campoCerca').value='';
        let dati=table.getRows();
        for(var i=0;i<dati.length;i++){
            dati[i].getElement().style.display = "";
        }
    })
});
const call = (jSonRichiesta,callBack='') => {
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
            if(callBack!=''){
                callBack(phpRes);
            }
        })
        .catch(error => {
            console.error('Errore:', error);
        });
}
var italianLocale = {
    "groups": {
        "item": "elemento",
        "items": "elementi",
    },
    "pagination": {
        "first": "Primo",
        "first_title": "Prima Pagina",
        "last": "Ultimo",
        "last_title": "Ultima Pagina",
        "prev": "Precedente",
        "prev_title": "Pagina Precedente",
        "next": "Successivo",
        "next_title": "Pagina Successiva",
        "counter": {
            "showing": "Mostra",
            "of": "di",
            "rows": "righe",
            "pages": "pagine",
        }
    },
    "headerFilters": {
        "default": "filtra", //default header filter placeholder text
        "columns": {
            "name": "filtra nome...", //replace default header filter text for column name
        }
    },
    // Altre traduzioni...
};


// const scopattaTabella=(tabellaTmp)=>{
//     let tabella=document.getElementById('contenitoreTabella');
//     tabella.innerHTML='';
//     let tabellaObj=document.createElement('table');
//     tabellaObj.className='table table-striped';
//     let thead=document.createElement('thead');
//     let tr=document.createElement('tr');

//     for(var [k,v] of Object.entries(tabellaTmp)){
//         for(var [k1,v1] of Object.entries(v)){
//             let th=document.createElement('th');
//             th.innerHTML=k1;
//             tr.appendChild(th);
//         }
//         break;
//     }
//     thead.appendChild(tr);
//     tabellaObj.appendChild(thead);
//     let tbody=document.createElement('tbody');
//     for(var [k,v] of Object.entries(tabellaTmp)){
//         let tr=document.createElement('tr');
//         for(var [k1,v1] of Object.entries(v)){
//             let td=document.createElement('td');
//             td.innerHTML=v1;
//             tr.appendChild(td);
//         }
//         tbody.appendChild(tr);
//     }
//     tabellaObj.appendChild(tbody);
//     tabella.appendChild(tabellaObj);
//     tabella.style.height=document.documentElement.clientHeight- (document.getElementById('header').clientHeight+50)+''+'px';
//     dataTabella=tabellaTmp;
// }
const scopattaTabella = (tabellaTmp) => {
    let columns = [];
    let listaColonne=['Posizione','Team','Score 1','Score 2','Score 3','Score 4','Score 5','Componenti',]
    for (var [k, v] of Object.entries(tabellaTmp)) {
        for (var [k1, v1] of Object.entries(v)) {
            if(listaColonne.indexOf(k1)>=0){
                columns.push({ title: k1, field: k1 });
            }
        }
        break;
    }

    table = new Tabulator("#contenitoreTabella", {
        data: tabellaTmp,
        columns: columns,
        layout: "fitDataTable",
        // responsiveLayout: "collapse",
        // persistence : true, 
        tooltips: true,
        addRowPos: "top",
        history: true,
        pagination: "local",
        paginationSize: 100,
        movableColumns: true,
        resizableRows: false,
        height: document.documentElement.clientHeight - (document.getElementById('header').clientHeight + document.getElementById('headerCaricaFile').clientHeight +20) + '' + 'px',
        pagination: false,
        paginationCounter: "rows",
        locale: "it", // Imposta la localizzazione italiana come default
        langs: {
            "it": italianLocale, // Imposta le traduzioni italiane
        },
        selectableRows: 1,
        footerElement: null
        // Configurazioni aggiuntive per bottoni di esportazione ecc.
    });
    dataTabella = tabellaTmp;
}

