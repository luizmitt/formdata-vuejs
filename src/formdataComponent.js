/**
 * Author Luiz Schmitt <lzschmitt@gmail.com>
 * 
 * Criador de formulários dinamicos.
 * 
 */

Vue.component('formdata', {
    name: 'formdata',
    props: ['urlApi', 'fields', 'actions'],
    template: `
<form class="needs-validation" novalidate @submit.prevent="save()">
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
                <template v-else-if="column.select">
                    <div class="form-group">
                        <label v-show="column.label" :for="column.field">{{column.label}}</label>
                        <select class="form-control" :class="column.select.class" :id="column.field"  :disabled="column.select.disabled" :required="column.select.required">
                            <option v-show="column.select.placeholder" value>{{column.select.placeholder}}</option>
                            <option :selected="column.select.selected == data.value" v-for="data in column.select.data" :value="data.value">{{data.text}}</option>
                        </select>
                        <div class="invalid-feedback">
                            Preencha o campo obrigatório.
                        </div>                        
                    </div>
                </template>
                <template v-else-if="column.checkbox">
                    <div class="form-check">
                    <input class="form-check-input" type="checkbox" value="" :id="column.field">
                    <label class="form-check-label" :for="column.field">
                        {{column.label}}
                    </label>
                    </div>
                </template>
                <template v-else-if="column.textarea">
                    <div class="form-group">
                        <label :for="column.field">{{column.label}}</label>
                        <textarea class="form-control" :id="column.field" rows="3"></textarea>
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
                urlApi: '',
                fields: this.fields,
                actions: []
            },
            // definições padrões do formdata
            formdata_default: {
                message: {
                    required: 'Preencha o campo obrigatório.',
                    regex: 'O valor do campo está inválido.'
                },
                // layout em linhas, campo em baixo de campo
                // por padrão desabilitado, podendo formatar o layout
                // utilizando a posição com arrays como se fosse uma matriz.
                rowOnly: false,
                // tipo de campo input, suas configurações padrão
                input: {
                    type: 'text',
                    value: '',
                    class: '',
                    required: false,
                    disabled: false,
                    pattern: '',
                    placeholder: 'Preencha o campo',
                    mask: {}
                },
                // tipo de campo select, suas configurações padrão
                select: {
                    placeholder: 'Escolha...',
                    data: [],
                    selected: '',
                    class: '',
                    required: false,
                    disabled: false
                },
                // tipo de campo checkbox, suas configurações padrão
                checkbox: {
                    selected: '',
                    class: '',
                    required: false,
                    disabled: false
                },
                // tipo de campo textarea, suas configurações padrão
                textarea: {

                }
            }
        }
    },
    computed: {
        // método para tratar os campos passados no componente para montar o formdata.
        displayedFields() {
            // hack para utilizar vue dentro de outro scopo
            let self = this;
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
                    if (column.input || column.select || column.checkbox) {
                        return false;
                    }
                    fields[rIndex][cIndex] = {
                        ...column,
                        input: self.formdata_default.input
                    };
                });
            });

            return fields;
        }
    },
    methods: {
        async save() {
            this.validate();
            await axios.get(this.urlApi, {})
                .then(res => {

                })
                .catch(err => {

                });
        },

        validate() {
            let self = this;
            $("input[required]").each(function () {
                if (!$(this).val().length) {
                    $(this).addClass('is-invalid');
                    $(this).next('.invalid-feedback').html(self.formdata_default.message.required);
                } else {
                    $(this).removeClass('is-invalid').addClass('is-valid');
                }
            });
            $("input[pattern]").each(function () {
                let pattern = $(this).attr("pattern");
                let message = $(this).attr("patternmessage");

                if (!$(this).val().match(pattern)) {
                    $(this).addClass('is-invalid');
                    $(this).next('.invalid-feedback').html(message?message:self.formdata_default.message.regex);
                } else {
                    $(this).removeClass('is-invalid').addClass('is-valid');
                }
            });
        },

        // verifica quantas colunas tem por linha e quebra em até 12 colunas.
        // é necessário fazer uns ajustes de calculos, pro básico já funciona bem.
        setColumnWidthByRow(row) {
            let maxColumn = 'col-12';

            if (this.formdata_default.rowOnly) {
                return maxColumn;
            }

            let width = parseInt(12 / (Object.keys(row).length));

            if (width > 1 && width < 12) {
                maxColumn = `col-${Math.ceil(width)}`;
            } else {
                maxColumn = 'col-12';
            }

            return maxColumn;
        },

        setPatternValue(el, pattern) {
            if (typeof pattern === 'object') {
                setTimeout(function() {
                    $("#" + el).attr('patternmessage', pattern['invalid-message']);
                },1);
                
                return pattern.regex;
            }

            return (pattern !== undefined && pattern.length) ? pattern : false;
        }
    }
});