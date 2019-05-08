/**
 * Author Luiz Schmitt <lzschmitt@gmail.com>
 *
 * Criador de formulários dinamicos.
 *
 */

Vue.component("formdata", {
    name: "formdata",
    props: ["urlApi", "fields", "actions"],
    template: `
<form class="needs-validation" novalidate @submit.prevent="save()" :enctype="formdata.hasFiles?'multipart/form-data':false">
    <template v-for="(row, index) in displayedFields">
        <div class="row">
            <div v-for="(column, index) in row" :class="setColumnWidthByRow(row)">
                <template v-if="column.input">
                    <div class="form-group">
                        <label :class="[{'formdata-required':column.input.required}]" v-show="column.label" :for="column.field">{{column.label}}</label>
                        <input :ref="column.field" :pattern="setPatternValue(column.field, column.input.pattern)" :type="column.input.type" class="form-control" :class="column.input.class" :id="column.field" :placeholder="column.input.placeholder" :disabled="column.input.disabled" :required="column.input.required">
                        <div class="invalid-feedback">
                            Preencha o campo obrigatório.
                        </div>
                    </div>
                </template>
                <template v-if="setFormType(column.file)">
                    <div class="form-group">
                        <label :class="[{'formdata-required':column.file.required}]" v-show="column.label" :for="column.field">{{column.label}}</label>
                        <input :ref="column.field" type="file" class="form-control" :class="column.file.class" :id="column.field" :placeholder="column.file.placeholder" :disabled="column.file.disabled" :required="column.file.required">
                        <div class="invalid-feedback">
                            Preencha o campo obrigatório.
                        </div>
                    </div>
                </template>                
                <template v-else-if="column.select">
                    <div class="form-group">
                        <label :class="[{'formdata-required':column.select.required}]" v-show="column.label" :for="column.field">{{column.label}}</label>
                        <select class="form-control" :class="column.select.class" :id="column.field"  :disabled="column.select.disabled" :required="column.select.required">
                            <option v-show="column.select.placeholder" value>{{column.select.placeholder}}</option>
                            <option :selected="column.select.selected == data.value" v-for="data in setSelectData(column.select.data)" :value="data.value">{{data.text}}</option>
                        </select>
                        <div class="invalid-feedback">
                            Preencha o campo obrigatório.
                        </div>                        
                    </div>
                </template>
                <template v-else-if="column.checkbox">
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" value="" :id="column.field"  :disabled="column.checkbox.disabled" :required="column.checkbox.required">
                        <label :class="[{'formdata-required':column.checkbox.required}]"  class="form-check-label" :for="column.field">
                            {{column.label}}
                        </label>
                        <div class="invalid-feedback">
                            Preencha o campo obrigatório.
                        </div>                          
                    </div>
                </template>
                <template v-else-if="column.textarea">
                    <div class="form-group">
                        <label :for="column.field">{{column.label}}</label>
                        <textarea class="form-control" :id="column.field" :rows="column.textarea.rows" :cols="column.textarea.cols"  :disabled="column.textarea.disabled" :required="column.textarea.required"></textarea>
                        <div class="invalid-feedback">
                            Preencha o campo obrigatório.
                        </div>                          
                    </div>                                 
                </template>
            </div>
        </div>
    </template>
    
    <slot v-bind:formdata="this" />

    <template v-if="formdata.actions.length">

    </template>
    <template v-else>

    <button type="submit">Salvar</button>
    </template>
</form>`,
    data() {
        return {
            // definições atuais do formdata
            formdata: {
                urlApi: "",
                fields: this.fields,
                actions: [],
                lock: true,
                hasFiles: false
            },
            // definições padrões do formdata
            formdata_default: {
                message: {
                    required: "Preencha o campo obrigatório.",
                    regex: "O valor do campo está inválido."
                },
                // layout em linhas, campo em baixo de campo
                // por padrão desabilitado, podendo formatar o layout
                // utilizando a posição com arrays como se fosse uma matriz.
                rowOnly: false,
                // tipo de campo input, suas configurações padrão
                input: {
                    type: "text",
                    value: "",
                    class: "",
                    required: false,
                    disabled: false,
                    pattern: "",
                    placeholder: "",
                    mask: {}
                },
                // tipo de campo input[type=file], suas configurações padrão
                file: {
                    class: "",
                    required: false,
                    disabled: false
                },
                // tipo de campo select, suas configurações padrão
                select: {
                    placeholder: "Escolha...",
                    data: [],
                    selected: "",
                    class: "",
                    required: false,
                    disabled: false
                },
                // tipo de campo checkbox, suas configurações padrão
                checkbox: {
                    selected: "",
                    class: "",
                    required: false,
                    disabled: false
                },
                // tipo de campo textarea, suas configurações padrão
                textarea: {
                    rows: 3,
                    cols: ""
                }
            }
        };
    },
    computed: {
        // método para tratar os campos passados no componente para montar o formdata.
        displayedFields() {
            // hack para utilizar vue dentro de outro scopo
            let vm = this;
            // dados dos campos para o formdata
            let fields = this.formdata.fields;
            // se não for criado array para definição de linhas/colunas
            // agrupa todos e faz somente quebra de linhas.
            if (!Array.isArray(fields[0])) {
                fields = [];
                fields.push(this.formdata.fields);
                this.formdata_default.rowOnly = true;
            }
            // verifica se a coluna é um tipo definido, caso contrario,
            // a coluna é definida como input[type=text] por padrão.
            fields.map((row, rIndex) => {
                row.map((column, cIndex) => {
                    if (column.input || column.file || column.select || column.checkbox) {
                        return false;
                    }
                    fields[rIndex][cIndex] = {
                        ...column,
                        input: vm.formdata_default.input
                    };
                });
            });

            return fields;
        }
    },
    methods: {
        // Método para executar a ação do formulário.
        async save() {
            if (this.validate()) {
                await axios
                    .get(this.urlApi, {})
                    .then(res => {})
                    .catch(err => {});
            }
        },
        // Método para validar se o formulário está apto para ser submetido.
        validate() {
            let vm = this;
            let erros = {
                required: 0,
                pattern: 0
            };
            // Verifica se todos os campos obrigatórios estão preenchidos
            $("input[required], select[required], textarea[required]").each(
                function () {
                    if (!$(this).val().length) {
                        erros.required++;
                        $(this).addClass("is-invalid");
                        $(this)
                            .next(".invalid-feedback")
                            .html(vm.formdata_default.message.required);
                    } else {
                        $(this)
                            .removeClass("is-invalid")
                            .addClass("is-valid");
                    }
                }
            );
            // Verifica se as expressões regulares estão certas.
            $("input[pattern]").each(function () {
                let pattern = $(this).attr("pattern");
                let message = $(this).attr("patternmessage");

                if (
                    !$(this)
                    .val()
                    .match(pattern)
                ) {
                    erros.pattern++;
                    $(this).addClass("is-invalid");
                    $(this)
                        .next(".invalid-feedback")
                        .html(message ? message : vm.formdata_default.message.regex);
                } else {
                    $(this)
                        .removeClass("is-invalid")
                        .addClass("is-valid");
                }
            });
            // se houver erros, trava o formdata
            this.formdata.lock = erros.required == 0 && erros.pattern == 0 ? false : true;
            // retorna true pra validado, false para dados com erros.
            return !this.formdata.lock;
        },

        // verifica quantas colunas tem por linha e quebra em até 12 colunas.
        // é necessário fazer uns ajustes de calculos, pro básico já funciona bem.
        setColumnWidthByRow(row) {
            let maxColumn = "col-12";

            if (this.formdata_default.rowOnly) {
                return maxColumn;
            }

            let width = parseInt(12 / Object.keys(row).length);

            if (width > 1 && width < 12) {
                maxColumn = `col-${Math.ceil(width)}`;
            } else {
                maxColumn = "col-12";
            }

            return maxColumn;
        },
        // Verifica se a expressão regular veio pura ou de um objeto.
        setPatternValue(el, pattern) {
            if (typeof pattern === "object") {
                setTimeout(function () {
                    $("#" + el).attr("patternmessage", pattern["invalid-message"]);
                }, 1);

                return pattern.regex;
            }

            return pattern !== undefined && pattern.length ? pattern : false;
        },

        async setSelectData(data) {
            if (Array.isArray(data)) {
                console.log("E array");
                return data;
            } else if (typeof data === 'string') {
                console.log("E string");
                await axios.get(data)
                    .then(res => {
                        return res.data;
                    })
            } else if (typeof data === 'object') {
                console.log("E Objeto")
                await axios.get(data.urlApi)
                    .then(res => {
                        return res.data;
                    })
            }
        },

        setFormType(form) {
            if (form) {
                this.formdata.hasFiles = true
            }
            return form;
        }
    }
});