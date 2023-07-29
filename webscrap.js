const cheerio = require('cheerio');
const axios = require('axios');
const url = "https://www.terra.com.br/esportes/futebol/brasileiro-serie-a/tabela/";

async function getTabela(camp) {

    const dataAtual = new Date();
    //  const anoAtual = dataAtual.getFullYear();
    const anoAtual = 2023;
    // console.log(anoAtual);
    const config = {
        method: 'get',
        url: 'http://api-football-standings.azharimm.dev/leagues/' + camp + '.1/standings?season=' + anoAtual + '&sort=asc'
    }

    let res = await axios(config)
    // console.log('Retorno Tab: ' + res.status)
    let tab = res.data;
     //console.log(tab);
    return tab;
}
async function montarTabela(tab) {
    console.log(JSON.stringify(tab));
    var mensagem = '' + tab.data.name + ' - ' + tab.data.seasonDisplay + '';
    mensagem = mensagem + '\n\n## | PT | Time';
    // console.log(mensagem);
    var pos = 1;
    tab.data.standings.forEach(time => {
        time.stats.forEach(stats => {
            if (stats.name == 'points') {
                pontos = stats.value;
            }
        })
        // console.log(pos + ' - ' + time.team.displayName);
        let pos2 = '';
        if (pos < 10) {
            pos2 = '0' + String(pos);
        } else {
            pos2 = String(pos)
        }
        // console.log(pos + ' - ' + time.team.displayName);
        mensagem = mensagem + '\n' + pos2 + ' | ' + pontos + ' | ' + time.team.displayName + '';
        pos = pos + 1;
    });
     //console.log(mensagem);
    return mensagem;
}



async function timeBrasileirao(nometime) {
    try {
        const response = await axios.get(url);
        const $ = cheerio.load(response.data)
        const times = $("tr");
        var timeescolhido = "";
        times.each(function () {
            var timenome = $(this).find("tr .team-name").clone().find("span").remove().end().text().trim();
            if (timenome.toLowerCase().includes(nometime.toLowerCase())) {
                var ponto = $(this).find("tr .points").text();
                console.log("achou time")
                timeescolhido = "O " + timenome + " está com " + ponto + " pontos!";
            }
        });
        console.log(timeescolhido);
        return timeescolhido;
    } catch (error) {
        console.error(error)
    }
}
async function listaTimeBrasileirao() {
    try {
        const response = await axios.get(url);
        const $ = cheerio.load(response.data)
        const times = $("tr");
        const nomesTimes = [];
        times.each(function () {
            var timenome = $(this).find("tr .team-name").clone().find("span").remove().end().text().trim();
            nomesTimes.push(timenome);
        });
        return nomesTimes;
    } catch (error) {
        console.error(error)
        return [];
    }
}
async function buscaCI(nome) {
    try {
        const response = await axios.get("https://www.alldatasheet.com/view.jsp?Searchword="+nome);
        const $ = cheerio.load(response.data)
        const fabricante = $('a[onclick="javascript:myColorClick(10);"]');
        //javascript:myColorClick(10);
        //console.log(fabricante.text());
        var link = fabricante.attr("href").substring(2);
        var texto = fabricante.text();
        console.log(link);
        return link;
    } catch (error) {
        console.error(error)
        return [];
    }
}
module.exports = { buscaCI, getTabela, montarTabela, listaTimeBrasileirao, timeBrasileirao }