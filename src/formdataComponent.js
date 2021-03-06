/* eslint-disable no-console */
/* eslint-disable no-param-reassign */
/* eslint-disable max-len */
/* eslint-disable func-names */
/* eslint-disable no-undef */

/**
 * Author Luiz Schmitt <lzschmitt@gmail.com>
 *        Gabriel Vieira <gabriel_castr@outlook.com.br>
 *
 * A idéia é criar formularios complexos a partir de uma configuração no component, ou seja,
 * apenas utilizando o html, passando determinadas propriedades e suas devidas configurações,
 * utilizando os padrões visuais do Bootstrap 4.
 *
 */

Vue.component('formdata', {
  name: 'formdata',
  props: ['action', 'fields', 'buttons'],
  template: `
<form @submit.prevent="save" class="needs-validation" novalidate :method="formdata.action.method" :enctype="formdata.hasFiles?'multipart/form-data':false">
    <template v-for="(row) in this.formdata.fields">
        <div class="row">
            <div v-for="(column) in row" :class="setColumnWidthByRow(row)">
                <template v-if="column.input">
                    <div class="form-group">
                        <label :class="[{'formdata-required':column.input.required}]" v-show="column.label" :for="column.field">{{column.label}}</label>
                        <input v-model="formdata.data[column.field]" :ref="column.field" :name="column.field" :pattern="setPatternValue(column.field, column.input.pattern)" :type="column.input.type" class="form-control" :class="column.input.class" :id="column.field" :placeholder="column.input.placeholder" :disabled="column.input.disabled" :required="column.input.required">
                        <div class="invalid-feedback">
                            {{formdata_default.message.required}}
                        </div>
                    </div>
                </template>
                <template v-if="setFormType(column.file)">
                    <div class="form-group">
                        <label :class="[{'formdata-required':column.file.required}]" v-show="column.label" :for="column.field">{{column.label}}</label>
                        <input :ref="column.field" :name="column.field" type="file" class="form-control" :class="column.file.class" :id="column.field" :placeholder="column.file.placeholder" :disabled="column.file.disabled" :required="column.file.required">
                        <div class="invalid-feedback">
                            {{formdata_default.message.required}}
                        </div>
                    </div>
                </template>                
                <template v-else-if="column.select">
                    <div class="form-group">
                        <label :class="[{'formdata-required':column.select.required}]" v-show="column.label" :for="column.field">{{column.label}}</label>
                        <select v-select2="formdata.data[column.field]" :ref="column.field" :name="column.field" class="form-control" :class="column.select.class" :id="column.field"  :disabled="column.select.disabled" :required="column.select.required">
                            <option value>{{column.select.placeholder ? column.select.placeholder : formdata_default.select.placeholder}}</option>
                            <option :selected="column.select.selected == data.value" v-for="data in column.select.data" :value="data.value">{{data.text}}</option>
                        </select>
                        <div class="invalid-feedback">
                            {{formdata_default.message.required}}
                        </div>                        
                    </div>
                </template>
                <template v-else-if="column.checkbox">
                    <div class="form-check">
                        <input v-model="formdata.data[column.field]" :ref="column.field" :name="column.field" class="form-check-input" type="checkbox" value='' :id="column.field"  :disabled="column.checkbox.disabled" :required="column.checkbox.required">
                        <label :class="[{'formdata-required':column.checkbox.required}]" class="form-check-label" :for="column.field">
                            {{column.label}}
                        </label>
                        <div class="invalid-feedback">
                            {{formdata_default.message.required}}
                        </div>                          
                    </div>
                </template>
                <template v-else-if="column.textarea">
                    <div class="form-group">
                        <label :for="column.field">{{column.label}}</label>
                        <textarea v-model="formdata.data[column.field]" :ref="column.field" :name="column.field" class="form-control" :id="column.field" :rows="column.textarea.rows" :cols="column.textarea.cols" :disabled="column.textarea.disabled" :required="column.textarea.required"></textarea>
                        <div class="invalid-feedback">
                          {{formdata_default.message.required}}
                        </div>                          
                    </div>                                 
                </template>
            </div>
        </div>
    </template>
    <slot v-bind:formdata="this" />
    <template v-if="formdata.buttons.length">
      <div class="row">
        <button v-for="button in formdata.buttons" v-show="button.type == 'save'" type="submit" class="btn btn-default" :class="button.class">
          <i class="" :class="button.icon" v-show="button.icon.length"></i>
          <span>{{button.label}}</span>
        </button>
      </div>
    </template>
    <template v-else>
    <button class="btn btn-default" type="submit">Salvar</button>
    <button class="btn btn-default" type="reset">Resetar</button>
    </template>
</form>`,
  data() {
    return {
      // definições atuais do formdata
      formdata: {
        action: this.action,
        fields: this.fields,
        buttons: this.buttons,
        data: {},
        lock: true, // impede do formulario ser submetido
        hasFiles: false, // se o formulario for um formulario de arquivos
      },
      // definições padrões do formdata
      formdata_default: {
        message: {
          required: 'Preencha o campo obrigatório.',
          regex: 'O valor do campo está inválido.',
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
          placeholder: 'Escreva algo...',
          mask: {},
        },
        // tipo de campo input[type=file], suas configurações padrão
        file: {
          class: '',
          required: false,
          disabled: false,
        },
        // tipo de campo select, suas configurações padrão
        select: {
          placeholder: 'Escolha...',
          data: [],
          selected: '',
          class: '',
          required: false,
          disabled: false,
        },
        // tipo de campo checkbox, suas configurações padrão
        checkbox: {
          selected: '',
          class: '',
          required: false,
          disabled: false,
        },
        // tipo de campo textarea, suas configurações padrão
        textarea: {
          rows: 3,
          cols: '',
        },
      },
    };
  },
  computed: {

  },
  methods: {
    // método para tratar os campos passados no componente para montar o formdata.
    async prepareFields() {
      // hack para utilizar vue dentro de outro scopo
      const vm = this;
      // dados dos campos para o formdata
      const {
        fields,
      } = this.formdata;
      // se não for criado array para definição de linhas/colunas
      // agrupa todos e faz somente quebra de linhas.
      if (!Array.isArray(fields[0])) {
        this.formdata.fields = [];
        this.formdata.fields.push(fields);
        this.formdata_default.rowOnly = true;
      }
      // verifica se a coluna é um tipo definido, caso contrario,
      // a coluna é definida como input[type=text] por padrão.
      return this.formdata.fields.map(async (row, rIndex) => {
        await Promise.all(row.map(async (column, cIndex) => {
          // se o field já estiver configurado com um tipo, não faz nada
          if (column.input || column.file || column.checkbox || column.textarea) {
            return false;
          }
          // mas se for select
          if (column.select && column.select.data !== undefined) {
            // se tiver um array de dados
            if (Array.isArray(column.select.data)) {
              // replica os dados
              column.select.data = column.select.data;
            } else if (typeof column.select.data === 'string') { // se for um string, precisa ser uma url
              // executa o axios nessa url
              await axios.get(column.select.data).then((res) => {
                // quando houver parent
                if (this.parentNode(column, column.select.data)) {
                  // encerra a replica dos dados
                  // para aguardar a selecao do pai
                  return false;
                }
                // replica os dados pro combo
                column.select.data = res.data;
                return true;
              });
            } else if (typeof column.select.data === 'object') { // e se for um objeto
              // executa o axios na urlApi
              await axios.get(column.select.data.urlApi).then((res) => {
                // quando houver parent
                if (this.parentNode(column, column.select.data.urlApi, column.select.data.switchFields)) {
                  // encerra a replica de dados
                  // para aguardar a selecao do pai
                  return false;
                }
                // se houver switchFields
                if (column.select.data.switchFields !== undefined) {
                  // pega o field que sera value do combo
                  // pega o field que sera o text do combo
                  const {
                    value,
                    text,
                  } = column.select.data.switchFields;
                  // limpa os dados
                  column.select.data = [];
                  // faz a troca e replica os dados pro combo
                  res.data.map((result) => {
                    if (result[value] !== undefined && result[text] !== undefined) {
                      column.select.data.push({
                        value: result[value],
                        text: result[text],
                      });
                    }
                    return true;
                  });
                } else {
                  column.select.data = res.data;
                }
                return true;
              });
            }
          } else { // se não for nenhum dos tipos acima, por padrão ele carrega input com valores default.
            vm.formdata.fields[rIndex][cIndex] = {
              ...column,
              input: vm.formdata_default.input,
            };
          }

          return column;
        }));
      });
    },
    // Método para executar a ação do formulário.
    save() {
      if (this.validate()) {
        switch (this.formdata.action.method) {
          case 'GET':
            this.getFormData(this.formdata.action.urlApi);
            break;
          case 'POST':
            this.postFormData();
            break;
          case 'PUT':
            this.putFormData();
            break;
          default:
            this.postFormData();
        }
      }
    },
    getFormData(url) {
      axios.get(url, {
        params: this.formdata.data,
      }).then((res) => {
        console.log(res);
      });
    },
    postFormData() {
      axios.post(this.formdata.action.urlApi, this.formdata.data).then((res) => {
        console.log(res);
      });
    },
    putFormData() {
      axios.put(this.formdata.action.urlApi, this.formdata.data).then((res) => {
        console.log(res);
      });
    },
    parentNode(column, link, switchFields) {
      const vm = this;
      if (switchFields === undefined) {
        switchFields = {};
        switchFields.value = 'value';
        switchFields.text = 'text';
      }
      // se possuir um pai
      if (column.parent) {
        // cria um evento no pai
        $(`#${column.parent}`).on('select2:select select2:unselect select2:close change', function () {
          vm.formdata.data[column.field] = $(this).val();
          // passando o link e o parametro de selecao
          axios.get(link, {
            params: {
              [column.parent]: $(this).val(),
            },
          }).then((res) => {
            // monta as opções do retorno no filho
            const options = [`<option value>${column.select.placeholder ? column.select.placeholder : vm.formdata_default.select.placeholder}</option>`];
            res.data.map((o) => {
              options.push(`<option value="${o[switchFields.value]}">${o[switchFields.text]}</option>`);
              return true;
            });
            document.querySelector(`#${column.field}`).innerHTML = options.join('');
          });
        });
        column.select.data = [];
        return true;
      }
      return false;
    },
    // Método para validar se o formulário está apto para ser submetido.
    validate() {
      const vm = this;
      const erros = {
        required: 0,
        pattern: 0,
      };
      // Verifica se todos os campos obrigatórios estão preenchidos
      $('input[required], select[required], textarea[required]').each(function () {
        if (!$(this).val().length) {
          erros.required += 1;
          $(this).addClass('is-invalid');
          $(this)
            .next('.invalid-feedback')
            .html(vm.formdata_default.message.required);
        } else {
          $(this).removeClass('is-invalid').addClass('is-valid');
        }
      });
      // Verifica se as expressões regulares estão certas.
      $('input[pattern]').each(function () {
        const pattern = $(this).attr('pattern');
        const message = $(this).attr('patternmessage');

        if (!$(this).val().match(pattern)) {
          erros.pattern += 1;
          $(this).addClass('is-invalid');
          $(this)
            .next('.invalid-feedback')
            .html(message || vm.formdata_default.message.regex);
        } else {
          $(this)
            .removeClass('is-invalid')
            .addClass('is-valid');
        }
      });
      // se houver erros, trava o formdata
      this.formdata.lock = !(erros.required === 0 && erros.pattern === 0);
      // retorna true pra validado, false para dados com erros.
      return !this.formdata.lock;
    },
    // verifica quantas colunas tem por linha e quebra em até 12 colunas.
    // é necessário fazer uns ajustes de calculos, pro básico já funciona bem.
    setColumnWidthByRow(row) {
      let maxColumn = 'col-12';

      if (this.formdata_default.rowOnly) {
        return maxColumn;
      }

      const width = parseInt(12 / Object.keys(row).length, 10);

      if (width > 1 && width < 12) {
        maxColumn = `col-${Math.ceil(width)}`;
      } else {
        maxColumn = 'col-12';
      }

      return maxColumn;
    },
    // Verifica se a expressão regular veio pura ou de um objeto.
    setPatternValue(el, pattern) {
      if (typeof pattern === 'object') {
        setTimeout(() => {
          $(`#${el}`).attr('patternmessage', pattern['invalid-message']);
        }, 1);

        return pattern.regex;
      }

      return pattern !== undefined && pattern.length ? pattern : false;
    },
    // se houver um field file, o formulario virta multipart
    setFormType(form) {
      if (form) {
        this.formdata.hasFiles = true;
      }
      return form;
    },
  },

  directives: {
    select2: {
      componentUpdated(el) {
        options = {
          width: '100%',
          minimumInputLength: false,
          placeholder: 'Escolha...',
          cache: true,
          language: 'pt-BR',
        };
        if ($(el).attr('multiple') === undefined) {
          options.allowClear = true;
          options.multiple = false;
        }
        $(el).parents().each(function () {
          if ($(this).hasClass('modal')) {
            options.dropdownParent = $('.modal');
          }
        });
        $(el).select2(options);
      },
    },
  },

  mounted() {
    this.prepareFields();
  },
});
