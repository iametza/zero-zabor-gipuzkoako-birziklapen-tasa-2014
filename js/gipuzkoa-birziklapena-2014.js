(function() {
    
    // Zein herrialdetako datuak bistaratu nahi diren hemen zehazten da:
    // Aukerak:
    //		"araba"
    // 		"bizkaia"
    //		"gipuzkoa"
    //		"nafarroa"
    var hautatutako_herrialdea = "gipuzkoa";
    
    var herrialdeak = {
        "gipuzkoa": {
            kodea: 20,
            datuak: "datuak/gipuzkoa-birziklapena-2014.csv",
            json_izena: "udalerriak-gipuzkoa",
            topoJSON: "topoJSON/udalerriak-gipuzkoa.json",
            proiekzioa: {
                erdia: {
                    lat: -2.165,
                    lng: 43.15
                },
                eskala: 43500
            },
            altuera: 535,
            zabalera: 680

        },
        "bizkaia": {
            kodea: 48,
            datuak: "",
            json_izena: "udalerriak-bizkaia",
            topoJSON: "topoJSON/udalerriak-bizkaia.json",
            proiekzioa: {
                erdia: {
                    lat: -2.93,
                    lng: 43.22
                },
                eskala: 37000
            },
            altuera: 430,
            zabalera: 680
        },
        "araba": {
            kodea: "01",
            datuak: "",
            json_izena: "udalerriak-araba",
            topoJSON: "topoJSON/udalerriak-araba.json",
            proiekzioa: {
                erdia: {
                    lat: -2.75,
                    lng: 42.85
                },
                eskala: 33000
            },
            altuera: 600,
            zabalera: 680
        },
        "nafarroa": {
            kodea: "31",
            datuak: "",
            json_izena: "udalerriak-nafarroa",
            topoJSON: "topoJSON/udalerriak-nafarroa.json",
            proiekzioa: {
                erdia: {
                    lat: -1.615,
                    lng: 42.61
                },
                eskala: 19000
            },
            altuera: 650,
            zabalera: 680
        }
    }
    
    // Maparen svg elementuaren neurriak.
    var width = herrialdeak[hautatutako_herrialdea].zabalera,
        height = herrialdeak[hautatutako_herrialdea].altuera;
    
    // Maparen proiekzioaren xehetasunak.
    var projection = d3.geo.mercator()
        .center([herrialdeak[hautatutako_herrialdea].proiekzioa.erdia.lat, herrialdeak[hautatutako_herrialdea].proiekzioa.erdia.lng])
        .scale(herrialdeak[hautatutako_herrialdea].proiekzioa.eskala)
        .translate([width / 2, height / 2]);
    
    // Maparen bidearen generatzailea.
    var path = d3.geo.path()
        .projection(projection);
    
    // Maparen svg elementua DOMera gehitu eta neurriak ezarri.
    var svg = d3.select("#mapa").append("svg")
        .attr("width", width)
        .attr("height", height);
    
    // Hautatutako herrialdeko datuak irakurri.
    d3.csv(herrialdeak[hautatutako_herrialdea].datuak, function(error, datuak) {
        
        if (error) {
            return console.error(error);
        }
        
        // Hautatutako herrialdearen datu geografikoak irakurri dagokion topoJSONetik.
        d3.json(herrialdeak[hautatutako_herrialdea].topoJSON, function(error, eh) {
            
            if (error) {
                return console.error(error);
            }
            
            // Emaitzak eta topoJSON-a bateratzeko ideia hemendik hartu dut, behar bada badago modu hobe bat.
            // http://stackoverflow.com/questions/22994316/how-to-reference-csv-alongside-geojson-for-d3-rollover
            
            // 2014ko udalerri bakoitzeko birziklapen datuak dagokion mapako elementuarekin lotu.
            // d: Emaitzen arrayko udalerri bakoitzaren propietateak biltzen dituen objektua.
            // i: indizea
            datuak.forEach(function(d, i) {
                
                // e: Datu geografikoetako udalerriaren propietateak
                // j: indizea
                topojson.feature(eh, eh.objects[herrialdeak[hautatutako_herrialdea].json_izena]).features.forEach(function(e, j) {
                    
                    if (d.herria === e.properties.iz_euskal) {
                        e.properties.datuak = d;
                    }
                    
                });
                
            });
            
            // Udalerri guztiak.
            svg.selectAll(".unitateak")
                .data(topojson.feature(eh, eh.objects[herrialdeak[hautatutako_herrialdea].json_izena]).features)
                .enter().append("path")
                .attr("fill", function(d) {
                    
                    if (d.properties.datuak && d.properties.datuak.ehunekoa) {
                        
                        if (d.properties.datuak.ehunekoa <= 40) {
                            
                            return "#C7FDB5";
                            
                        } else if (d.properties.datuak.ehunekoa > 40 && d.properties.datuak.ehunekoa <= 50) {
                            
                            return "#A4FBA6";
                            
                        } else if (d.properties.datuak.ehunekoa > 50 && d.properties.datuak.ehunekoa <= 60) {
                            
                            return "#4AE54A";
                            
                        } else if (d.properties.datuak.ehunekoa > 60 && d.properties.datuak.ehunekoa <= 70) {
                            
                            return "#30CB00";
                            
                        } else if (d.properties.datuak.ehunekoa > 70 && d.properties.datuak.ehunekoa <= 80) {
                            
                            return "#0F9200";
                            
                        } else if (d.properties.datuak.ehunekoa > 80) {
                            
                            return "#006203";
                            
                        } else {
                            
                            return "#cccccc";
                            
                        }
                        
                    }
                
                    // Daturik ez badago...
                    return "#ffffff";
                    
                })
                .attr("class", "unitateak")
                .attr("id", function(d) { return "unitatea_" + d.properties.izena; })
                .attr("d", path)
                .on("mouseover", function(d) {
                    
                    // Elementu geografiko guztiek ez daukate iz_euskal propietatea,
                    // ez badauka ud_iz_e erabili.
                    if (d.properties.iz_euskal) {
                        
                        $("#unitatea-izena").text(d.properties.iz_euskal);
                        
                    } else {
                        
                        $("#unitatea-izena").text(d.properties.ud_iz_e);
                        
                    }
                    
                    if (d.properties.datuak.ehunekoa) {
                        
                        $(".datuak-taula .birziklapen-tasa").text("%" + d.properties.datuak.ehunekoa);
                        
                        $(".hasierako-mezua").hide();
                        
                        $(".daturik-ez").hide();
                        
                        $(".datuak").show();
                        
                    } else {
                        
                        $(".datuak").hide();
                        
                        $(".daturik-ez").show();
                        
                    }
                    
                });
            
            // Eskualdeen arteko mugak (a !== b)
            svg.append("path")
                .datum(topojson.mesh(eh, eh.objects[herrialdeak[hautatutako_herrialdea].json_izena], function(a, b) { return a !== b; }))
                .attr("d", path)
                .attr("class", "eskualde-mugak");
            
            // Kanpo-mugak (a === b)
            svg.append("path")
                .datum(topojson.mesh(eh, eh.objects[herrialdeak[hautatutako_herrialdea].json_izena], function(a, b) { return a === b; }))
                .attr("d", path)
                .attr("class", "kanpo-mugak");
            
        });
        
    });
    
}());