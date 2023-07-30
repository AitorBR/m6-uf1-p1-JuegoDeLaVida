var rows = 50; //Núm. de files de la graella 50
var cols = 100; //Núm. de columnes de la graella 100
var playing = false; //Variable que controla si s'està jugant o no
var game_graella = Array(rows); //Estructura on guardem l'estat de les cèl·lules
var next_graella = Array(rows); //Estructura on guardem l'estat de la pròxima generació de cèl·lules
var timer; //Variable on guardem el temporitzador
var reproduccio = 150;
let divGraella, table;
let celulas = [];
let celulasnext = [];

let btn_start;
let btn_next;
let btn_reset;
let btn_save_guardar;
let btn_load_carregar;
let btn_pause;


/**
 * Funció que inicialitza tot els components perquè es pugui iniciar el joc
 */
function inicia() {
    crea_taula();
    init_graella();
    reset_graella();
    setup_botons_control();
}



/**
 * Funció que crea el taulell del joc en JS (table) i l'introdueix al HTML.
 */

// tabla generada
function crea_taula() {
    //console.log("crea tabla");
    divGraella = document.getElementById("graella");
    table = document.createElement("table");
    divGraella.appendChild(table);
    // genera tabla
    for (var i = 0; i < rows; i++) {

        let linea = document.createElement("tr");
        celulas[i] = [];
        celulasnext[i] = [];
        for (var j = 0; j < cols; j++) {
            //genera la celula
            let cel = document.createElement("td");
            celulas[i][j] = false;
            celulasnext[i][j] = false;
            cel.id = i + "-" + j;
            cel.className = "";


            cel.onclick = clickCelula;
            linea.appendChild(cel);
        }
        table.appendChild(linea);
    }
    //console.log("tabla done");
    //console.log(celulas)

}

// en caso de querer que no se pueda hacer click a la celula una vez que se le ha dado a iniciar, poner: if (playing === false) {...}
function clickCelula() {
    // si esta viva la pone en muerta("") y si esta muerta en viva
    this.className = this.className == "viva" ? "" : "viva";
    //console.log(this.id);
    let idNum = this.id.split("-");
    ////console.log(idnum);
    let idLinea = idNum[0];
    let idColumna = idNum[1];
    //console.log(idLinea + " otra " + idColumna)
    //celulas[idLinea][idColumna] = true ? false : true;
    // invierte el valor, si es falso lo pone en true y viceversa
    celulas[idLinea][idColumna] = !(celulas[idLinea][idColumna]);
    //console.log(celulas);

}

/**
 * Functió que inicialitza l'estructura on esta les per poder jugar
 */
// no lo he usado
function init_graella() {

}

/**
 * Funció que posa inicialitza totes les cèl·lules a mortes
 */
function reset_graella() {
    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
            celulas[i][j] = false;
            document.getElementById(i + "-" + j).className = "";
        }
    }
}

/**
 * Funció que inicialitza els evens onclick dels botons
 */
function setup_botons_control() {
    btn_start = document.getElementById("start");
    btn_start.onclick = listen_btn_start;
    //console.log("display")
    //console.log(btn_start.style.display);
    btn_next = document.getElementById("next");
    btn_next.onclick = listen_btn_next;
    btn_reset = document.getElementById("reset");
    btn_reset.onclick = listen_btn_reset;
    btn_save_guardar = document.getElementById("save");
    btn_save_guardar.onclick = listen_btn_save_guardar;
    btn_load_carregar = document.getElementById("load");
    btn_load_carregar.onclick = listen_btn_load_carregar;
    btn_pause = document.getElementById("pause");
    btn_pause.onclick = listen_btn_pause;
}


// acciones de los botones
function listen_btn_start() {
    //console.log("btn start");
    playing = true;
    dontshowbtns();
    showpause();
    play();
}

function listen_btn_next() {
    //console.log("btn next");
    get_next_gen();
}

function listen_btn_reset() {
    //console.log("btn reset");
    reset_graella();
}

function listen_btn_save_guardar() {
    //console.log("btn save")
    let popup = window.prompt("inserta el nombre del tablero");
    if (popup != null) { // permito que el campo sea "" en caso de no querelo asi añadir:  && popup !== ""
        //console.log(celulas)
        localStorage.setItem(popup, celulas);
    } else {
        // solo ocurre cuando le das a cancelar, asi que se puede quitar
        alert("Tienes que rellenar el campo")
    }
}

function listen_btn_load_carregar() {
    //console.log("btn load")
    let popup = window.prompt("inserta el nombre del tablero");
    //console.log(popup);
    if (popup != null) {
        // si no existe, da error asi que no hace nada, me parece bien :)
        let x = localStorage.getItem(popup);
        //console.log(x);
        copyStringAtoArrayB(x);
        update_vista();
    } else {
        // solo ocurre cuando le das a cancelar, asi que se puede quitar
        alert("Tienes que rellenar el campo")
    }
}

function listen_btn_pause() {
    //console.log("pause")
    playing = false;
    showbtns();
    dontshowpause();
}

// muestra y oculta botones
function dontshowbtns() {
    btn_start.style.display = "none";
    btn_next.style.display = "none";
    btn_reset.style.display = "none";
    btn_save_guardar.style.display = "none";
    btn_load_carregar.style.display = "none";
}

function showbtns() {
    btn_start.style.display = "";
    btn_next.style.display = "";
    btn_reset.style.display = "";
    btn_save_guardar.style.display = "";
    btn_load_carregar.style.display = "";
}

function dontshowpause() {
    btn_pause.style.display = "none";
}

function showpause() {
    btn_pause.style.display = "";
}

/**
 * Aquí haureu de fer totes les funcions que maneguen els events click.
 * Per guardar arrays al LocalStorage haureu de fer servir la funció
 * JSON.stringify(), per llegir Arrays del LocalStorage JSON.parse()
 */

/**
 * Executa el joc, aquesta funció està completa i es correcte
 */
function play() {
    get_next_gen();
    if (playing) {
        //Executa la funció play cada {reproducció} ms 
        //Per parar la execució del timer heu de posar on calgui: 
        //clearTimeout(timer)
        timer = setTimeout(play, reproduccio);
    }
}

/**
 * Calcula l'estat de les cèl·lules de la pròxima generació amb les regles establertes
 */
function get_next_gen() {
    compta_veins();
    copyArrayAtoB(celulasnext, celulas);
    update_vista();
}

/**
 * Funció que copia la estructura de la pròxima generació a l'actual i posa a 0 la pròxima generació
 */
// esta la he llamado: copyArrayAtoB   no la habia visto
function copia_i_reset() {

}

/**
 * Funció que actualitza l'HTML amb l'estat actual de les cèl·lules
 */
function update_vista() {
    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
            if (celulas[i][j] == true) {
                document.getElementById(i + "-" + j).className = "viva";
            } else {
                document.getElementById(i + "-" + j).className = "";
            }
        }
    }
}

/**
 * Funció que compta els veins vius de una cèl·lula. 
 * Recorda que el taulell es infininit: 
 * Els veins de la fila [rows - 1] son la fila [0]
 * Els veins de la columna [0] són la columna[cols - 1]
 */
function compta_veins() {
    copyArrayAtoB(celulas, celulasnext);
    //console.log("copia")
    //console.log(celulasnext)
    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {

            let posx = i - 1;
            let posy = j - 1;
            let aliveCount = 0;
            let timeused = 0; // solo es un contador para el debug
            let viva = false;

            // paso por todas las casillas de alrededor, esto incluye a ella misma, asi que pongo el contador a -1 que subira a 0 cuando se cuente a si misma
            if (celulas[i][j] == true) {
                viva = true;
                aliveCount--;
            }

            // for para pasar por las 9 casillas de alrededor
            for (let f = 0; f <= 2; f++) {
                for (let g = 0; g <= 2; g++) {

                    // calcula si la posicion excede la tabla
                    // no hace falta que se cuente el caso de -2 porque nunca puede ocurrir
                    if (posx <= -1) {
                        posx = rows - 1;
                        ////console.log(posx)
                    } else if (posx > rows - 1) {
                        posx = 0;
                    }

                    if (posy == -2) {
                        posy = cols - 2;
                    } else if (posy <= -1) {
                        posy = cols - 1;
                    } else if (posy > cols - 1) {
                        posy = 0;
                    }

                    ////console.log(posx + "-" + posy)
                    if (celulas[posx][posy] == true) {
                        aliveCount++;
                    }

                    posy++;
                    timeused++;
                }
                posx++;
                // reseteo la posicion y para ir al inicio de la siguiente fila
                posy = posy - 3;
            }
            //console.log(timeused)
            ////console.log("alive" + aliveCount);

            // comprueba si deberia de estar viva o muerta
            if (viva == true) {
                if (aliveCount <= 1 || aliveCount >= 4) {
                    celulasnext[i][j] = false;
                    ////console.log("muerta");
                } else {
                    celulasnext[i][j] = true;
                    ////console.log("viva");
                }
            } else {
                if (aliveCount == 3) {
                    celulasnext[i][j] = true;
                }
            }

        }
    }
    //console.log("celulasnext");
    //console.log(celulasnext);
}

// el nombre lo indica lo que hace :)
function copyArrayAtoB(a, b) {
    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
            b[i][j] = a[i][j];
        }
    }
}

// el nombre lo indica lo que hace :)
// el local storage lo guarda como string (false,false,true,.....), como esta en orden añado un contador para saber el numero que toca
function copyStringAtoArrayB(text) {
    let a = text.split(",");
    let count = 0;

    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
            if (a[count] === "true") {
                document.getElementById(i + "-" + j).className = "viva";
                celulas[i][j] = true;
            } else {
                document.getElementById(i + "-" + j).className = "";
                celulas[i][j] = false;
            }
            count++;
        }
    }
}

window.onload = inicia;