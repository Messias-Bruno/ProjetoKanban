const Exemplo = require('../models/mainModel.js')

const mostraPaginaInicial = (req, res) => {

    console.log('mainController.js','mostraPaginaInicial()')

    // Este exemplo pode ser usado para testar o envio de dados direto (hardcoded) para a view
    //===================================================================================================================================
    dados = {
        mensagem:'rota raiz', 
        titulo:'pagina principal',

        // É possível enviar dados diretamente para testes da view sem precisar consultar o banco
        exemplos:[ 
            {
                campo1: 'L1 - Dados 1',
                campo2: 'L1 - Dados 2',
                campo3: 'L1 - Dados 3',
            },
            {
                campo1: 'L2 - Dados 1',
                campo2: 'L2 - Dados 2',
                campo3: 'L2 - Dados 3',
            }            
        ]
    }
    
    res.render('kanban', { dados:dados})

    
}
const novatarefa = (req, res) => {

    console.log('mainController.js','novatarefa()')

    // Este exemplo pode ser usado para testar o envio de dados direto (hardcoded) para a view
    //===================================================================================================================================
    dados = {
        mensagem:'rota raiz', 
        titulo:'novatarefa',

        // É possível enviar dados diretamente para testes da view sem precisar consultar o banco
        exemplos:[ 
            {
                campo1: 'L1 - Dados 1',
                campo2: 'L1 - Dados 2',
                campo3: 'L1 - Dados 3',
            },
            {
                campo1: 'L2 - Dados 1',
                campo2: 'L2 - Dados 2',
                campo3: 'L2 - Dados 3',
            }            
        ]
    }
    
    res.render('tarefa', { dados:dados})

    
}
const novousuario = (req, res) => {

    console.log('mainController.js','novousuario()')

    // Este exemplo pode ser usado para testar o envio de dados direto (hardcoded) para a view
    //===================================================================================================================================
    dados = {
        mensagem:'rota raiz', 
        titulo:'novousuario',

        // É possível enviar dados diretamente para testes da view sem precisar consultar o banco
        exemplos:[ 
            {
                campo1: 'L1 - Dados 1',
                campo2: 'L1 - Dados 2',
                campo3: 'L1 - Dados 3',
            },
            {
                campo1: 'L2 - Dados 1',
                campo2: 'L2 - Dados 2',
                campo3: 'L2 - Dados 3',
            }            
        ]
    }
    
    res.render('novousuario', { dados:dados})

    
}
module.exports =  {
    mostraPaginaInicial,
    novatarefa,
    novousuario,

};