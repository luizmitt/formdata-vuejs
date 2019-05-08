# formdata-vuejs - O que é!?

A idéia é criar formularios complexos a partir de uma configuração no component, ou seja, apenas utilizando o html, passando determinadas propriedades e suas devidas configurações, utilizando os padrões visuais do Bootstrap 4.

## Requisitos (dependencias)

O formdata precisa de alguns requisitos para funcionar corretamente, por enquanto nem todos estão disponíveis ainda, segue a lista:

- [x] Vuejs
- [x] Axios
- [x] JQuery
- [x] Boostrap 4
- [ ] Select 2
- [ ] Toastr

## Configuração

### Estrutura básica para utilizar o formdata

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<body>
    <div id="app">
    <!-- formdata é utilizado aqui! -->
    </div>
    <!-- carrega as dependencias -->
    <script src="node_modules/vue/dist/vue.js"></script>
    <script src="node_modules/axios/dist/axios.js"></script>
    <!-- carrega o componente do formdata -->
    <script src="src/formdataComponent.js"></script>
    <!-- inicia o vuejs -->
    <script type="text/javascript">
        new Vue({
            el:'#app'
        })
    </script>
</body>
</html>
``` 

A partir de agora todo o código mostrado será desenvolvido dentro da div#app.

### Chamada do component formdata

```html
    <formdata [(:)prop=string|object]>
        <template v-slot="{formdata}">
            <!-- caso seja necessário fazer a mão o formulário -->
        </template>
    </formdata>
```

formdata possui algumas propriedades, com bind ou não, obrigatórias.

## Propriedades

| propriedade | descrição                                                            | bind obrigatório? |
| ----------- | -------------------------------------------------------------------- | ----------------- |
| url-api     | é o endereço da api onde tera a ação que o formulario executará      | não               |
| fields      | é um objeto com determinada configuração para a monstagem dos campos | sim               |
| actions     | são as ações que o formulário poderá ter                             | sim               |

### fields
> em breve
#### validação de dados em branco
> em breve
#### validação de dados em regex
> em breve

### actions
> em breve
## Layout (disposição dos campos)
> em breve
## Exemplos
> em breve