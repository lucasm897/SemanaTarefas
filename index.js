// const mensagem = "WOUDY!"

// {
//    const mensagem = "Olá"
// }

// console.log(mensagem);
// console.log(mensagem);

// let concat = ["Bike", "Two"]
// console.log(concat[1]+concat[0])

// let meta = {
//     value: 'ler mais de um livro no mês',
//     check: false,
//     isChecked:(info) => {
//         console.log(info)
//     }

// }

// console.log(meta.value)
// meta.isChecked(meta.value)

// let metas =[
//     meta,{
//         value: "caminhar mais de 20 minutos",
//         check: false
//     }
// ]

// console.log(metas[1].value)



const { select,input, checkbox } =  require('@inquirer/prompts')
const fs = require("fs").promises

let mensagem = "Bem vindo o App de Metas!"


let metas

const carregarMetas = async ()  =>{
    try{
        const dados = await fs.readFile("metas.json", "utf-8")
        metas = JSON.parse(dados)
    }
    catch(erro){

    }
}

const salvarMetas = async()  => {
    await fs.writeFile("metas.json", JSON.stringify(metas, null, 2))
}

const cadastrarMeta = async () => {
    const meta = await input({ message : "Digite sua meta:"})

    if(meta.length == 0){
        mensagem = "Meta não pode ser vazia."
        return cadastrarMeta() //Obrigatório escrever meta
    }

    metas.push({value: meta, checked: false})

    mensagem = "Meta cadstrada com sucesso!"
}

const listarMetas = async () => {
    if(meta.length == 0){
        mensagem = "Não existe metas."
        return
    }

    const respostas = await checkbox({
        message: "Use as Setas para mudar de meta, o Espaço para marcar/desmarcar e Enter para finalizar.",
        choices: [...metas],
        instructions: false

    })

    //Desmarca todos os check, dessa forma vai ficar apenas as marcadas, pois são verificadas posteriormente

    metas.forEach((m) => {
        m.checked = false
    })

    if(respostas.length == 0){
        mensagm = "Nenhuma meta selecionada"
        return 0
    }

    respostas.forEach((respostas) => {
        const meta = metas.find((m) => {
            return m.value == respostas
        })

        meta.checked = true
    })

    mensagem = "Metas marcadas como concluídas"
}

const metasRealizadas = async () =>{
    if(meta.length == 0){
        mensagem = "Não existe metas."
        return
    }
    
    const  realizadas = metas.filter((metas) => {
        return meta.checked == true
    })

    if(realizadas.length == 0){
        mensagem = "Não existe metas realizadas."
    }

    await select({
        message:"Metas realizadas: " + realizadas.length,
        choices:[...realizadas]
    })
}

const metasAbertas = async () => {
    if(meta.length == 0){
        mensagem = "Não existe metas."
        return
    }
    
    const abertas = metas.filter((meta)=>{
        return meta.checked != true
    })

    if(abertas.length == 0){
        mensagem = "Não existe metas abertas."
    }

    await select({
        message:"Metas abertas: " + abertas.length,
        choices:[...abertas]
    })

}

const deletarMetas = async () => {
    if(meta.length == 0){
        mensagem = "Não existe metas."
        return
    }
    
    const metasDesmarcadas = metas.map((meta) =>{
        return {value: meta.value,
                checked: false
        }
    })

    // metas.forEach((m) => {
    //     m.checked = false
    // })

    const itensADeletar = await checkbox({
        message: "Selecione os itens para deletar.",
        choices: [...metasDesmarcadas],
        instructions: false

    })

    if(itensADeletar.length == 0){
        mensagem = "Nenhum item para deletar."
    }

    itensADeletar.forEach((item) =>{
        metas = metas.filter(() =>{
            return meta.value != item
        })
    })
}

const mostrarMensagem = () => {
    console.clear()

    if(mensagem !=""){
        console.log(mensagem)
        console.log("")
        mensagem = ""
    }
}

const start = async () => {
    await carregarMetas()


    while(true){
        mostrarMensagem()
        await salvarMetas()
        const opcao = await select({
            message: "Menu >", //propriedades do modulo
            choices: [
                {
                    name: "Cadastrar meta",
                    value: "cadastrar"
                },
                {
                    name: "Listar meta",
                    value: "listar"
                },
                {
                    name: "Metas realizadas",
                    value: "realizadas"
                },
                {
                    name: "Metas abertas",
                    value: "abertas"
                },
                {
                    name: "Delatar metas",
                    value: "deletar"
                },
                {
                    name: "Sair",
                    value: "sair"
                }
            ],//propriedades do modulo
        })
        switch(opcao){
            case "cadastrar":
                await cadastrarMeta()
                break
            case "listar":
                await listarMetas()
                break
            case "realizadas":
                await metasRealizadas()
                break
            case "abertas":
                await metasAbertas()
                break
            case "deletar":
                    await deletarMetas()
                    break    
            case "sair":
                return

        }
        //return
    }
}


start()
carregarMetas()


