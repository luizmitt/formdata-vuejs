/**
 * Author Luiz Schmitt <lzschmitt@gmail.com>
 * 
 * Criador de formulários dinamicos.
 * 
 */

Vue.component('formdata', {
    props: ['urlApi', 'fields', 'actions'],
    template: `
<form class="needs-validation" novalidate @submit.prevent="save()">
    <template v-for="(row, index) in displayedFields">
        <div class="row">
            <div v-for="(column, index) in row" :class="setColumnWidthByRow(row)">
                <template v-if="column.input">
                    <div class="form-group">
                        <label :class="[{'formdata-required':column.input.required}]" v-show="column.label" :for="column.field">{{column.label}}</label>
                        <input :type="column.input.type" class="form-control" :class="column.input.class" :id="column.field" :placeholder="column.input.placeholder" :disabled="column.input.disabled" :required="column.input.required" :pattern="column.input.pattern">
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
                rowOnly: false,
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

                select: {
                    placeholder: 'Escolha...',
                    data: [],
                    selected: '',
                    class: '',
                    required: false,
                    disabled: false
                },

                checkbox: {
                    selected: '',
                    class: '',
                    required: false,
                    disabled: false
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
            fields.map((column, index) => {
                if (column.input || column.select || column.checkbox) {
                    return false;
                }

                fields[index] = {
                    ...column,
                    input: self.formdata_default.input
                };
            })
            return fields;
        }
    },
    methods: {
        save() {

            $("input[required]").each(function () {
                if (!$(this).val().length) {
                    $(this).addClass('is-invalid');
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

            let width = parseInt(12 / (Object.keys(row).length - 1));

            if (width > 1 && width < 12) {
                maxColumn = `col-${Math.ceil(width)}`;
            } else {
                maxColumn = 'col-12';
            }

            return maxColumn;
        }
    }
});