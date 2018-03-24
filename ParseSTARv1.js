//Cours parser
const fs = require('fs');

const readStar = ( err,data) =>{ //permet d'attendre que le syst recoive le fichier pour lancer la fonction
    
//const getKeyword = (w) => ['data_', 'loop_', '_rln'].filter

    const parse = (input) => {
        //creation des variables et objets qui seront copies dans le json
        let blocklist = [];
        let cptblock = -1;
        let headerslist = [];
        let datalist = [];
        let colonnes = [];

        //definition d'un bloc de donnees
        let block = {
            name : "default",
            headers : headerslist,
            mx : 0,
            my : 0,
            type : "none",
            data : datalist
        };
        
        //definition de la structure globale du json
        let star = {
            comment : "Created by STARVIZEM",
            tables : blocklist
                   };   

        //parse
        let lines = input.replace(/^\s*\n/gm, "") .split('\n');//enleve les lignes vides ou avec seulement des espaces 
        lines.forEach( (line,index) => {
        
            let words = line.trim().split(/\s+/); 

            //data block
            if (words[0].includes('data_')){
                //on incremente le compteur de bloc
                cptblock = cptblock + 1;
                //on cree une copie de la structure de base d'un bloc
                const copiedblock = Object.assign({}, block);
                //on ajoute cette copie a la liste de blocs
                blocklist.push(copiedblock);
                let tableName = words[0].substr(5,words[0].length || 'None');
                blocklist[cptblock].name = tableName;  
                headerslist = [];//nouveau bloc donc on vide la liste de titres        
                datalist= [];//idem pour les donnees
                colonnes = [];
            }

            //loop_
            if (words[0].includes('loop_')){
                blocklist[cptblock].type = "loop";  
            }

            //column headers
            if (words[0].includes('_rln')){
                let title = words[0].substr(4, words[0].length || 'None');
                headerslist.push(title);
                blocklist[cptblock].mx = headerslist.length;    
                blocklist[cptblock].headers = headerslist;   
                colonnes.push([]);                      
            }
            
            //data
            if(blocklist[cptblock].type == "loop"){
                let notdata = /loop_|data_|_rln|\n+|\s+/.test(words[0]);//on teste si le 1er mot contient une de ces expressions, si non, c'est de la donnée
                if(notdata == false){
                    let nbline = blocklist[cptblock].my;
                    blocklist[cptblock].my = (nbline +1); //doit compter le nb de ligne dans chaque bloc mais en compte 1 ou 2 en trop (a cause des "" et null)
                    for (let col=0; col<words.length; col++){//pour chaque colonne de donnees
                        colonnes[col].push(words[col]);
                        datalist = colonnes.reduce(function(a, b){
                            return a.concat(b);
                       }, []);
                        console.log(datalist);
                        blocklist[cptblock].data = datalist;
                    }
                }
            }
            else{//pour les donnees sur une ligne sans tableau
                if (words[1] != null && words[1] != "" ){//seulement une valeur apres _rln, donc words[1]=> qui ne soit pas null ou vide
                    colonnes[0].push(words[1]);
                    datalist = colonnes.reduce(function(a, b){
                        return a.concat(b);
                   }, []);
                    blocklist[cptblock].data = datalist;
                    blocklist[cptblock].my = 1;
                }
            }
    });
        return star;
    }

    //MAIN
    if(err){throw err;}
    
    //Parse StarFile
    let star = parse(data);
    if (star.error){
        throw star.error
    }

    // Get JSON
    let starJSON = JSON.stringify(star);
    fs.writeFileSync("default_pipeline.json", starJSON);//nom variable a mettre
    console.log(starJSON);
}

fs.readFile("default_pipeline.star", "utf-8", readStar );//mettre un fichier passe en parametre 