function msgEmMassa(DDD, mensagem) {
    let sql = "select telefone from massaDados where telefone like '" + DDD + "%';";
    let telsBH = "select telefone from massaDados where telefone like '5531%';";
    console.log(sql);
    console.log(telsBH);
    connection.query
        (telsBH, function (errs, resultSelect, fields) {
            if (errs) throw errs;
            resultSelect.forEach(async elements => {
                client.sendMessage(elements.telefone + "@c.us", mensagem);
                await sleep(3000);
            });
        });
    //connection.end();
}
function selectPiada(connection) {
    return new Promise((resolve, reject) => {
      var sql = "SELECT texto FROM piadas ORDER BY RAND() LIMIT 1;";
      connection.query(sql, function (err, result, fields) {
        if (err) {
          reject(err);
          return;
        }
        if (result.length === 0) {
          reject(new Error("Nenhuma piada encontrada."));
          return;
        }
        const piada = result[0].texto;
        resolve(piada);
      });
    });
  }
function insertMassaDados(contact, connection) {
    return new Promise((resolve, reject) => {
        setTimeout(async () => {
            var sql = "SELECT COUNT(*) AS count FROM massaDados WHERE telefone = ?";
            var numeroContato = contact.id.user;
            var regex = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g;
            var nomeContato = contact.pushname.replace(regex, '');

            connection.query(sql, [numeroContato], function (err, result, fields) {
                if (err) {
                    reject(err);
                    return;
                }

                if (result[0].count > 0) {
                    // Registro já existe
                    resolve(false);
                } else {
                    console.log('Novo número encontrado!');
                    var sql = "INSERT INTO massaDados (telefone, nome) VALUES ?";
                    var values = [
                        [numeroContato, nomeContato]
                    ];
                    connection.query(sql, [values], function (err, result) {
                        if (err) {
                            reject(err);
                            return;
                        }

                        console.log("Inserido número: " + result.affectedRows);
                        resolve(true);
                    });
                }
            });
        }, 1000);
    });
}
module.exports = { msgEmMassa, insertMassaDados, selectPiada }