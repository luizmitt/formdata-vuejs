Vue.component('formdata', {
    props: ['urlApi', 'fields', 'actions'],
    template: `
  <form @submit.prevent="save()">
    <template v-for="(item,index) in displayedFields">
      <template v-if="item.input">
        <div class="form-group">
          <label :class="[{'formdata-required':item.input.required}]" v-show="item.label" :for="item.field">{{item.label}}</label>
          <input :type="item.input.type" class="form-control" :class="item.input.class" :id="item.field" :placeholder="item.input.placeholder" :disabled="item.input.disabled" :required="item.input.required" :pattern="item.input.pattern">
        </div>
      </template>
      <template v-else-if="item.select">
        <div class="form-group">
          <label v-show="item.label" :for="item.field">{{item.label}}</label>
          <select class="form-control" :class="item.select.class" :id="item.field"  :disabled="item.select.disabled" :required="item.select.required">
            <option v-show="item.select.placeholder" value>{{item.select.placeholder}}</option>
            <option :selected="item.select.selected == data.value" v-for="data in item.select.data" :value="data.value">{{data.text}}</option>
          </select>
        </div>
      </template>
      <template v-else-if="item.checkbox">
        <div class="form-check">
          <input class="form-check-input" type="checkbox" value="" :id="item.field">
          <label class="form-check-label" :for="item.field">
            {{item.label}}
          </label>
        </div>
      </template>
      <template v-else-if="item.textarea">
      </template>
    </template>
    
    <template v-if="formdata.actions.length">
    
    </template>
    <tempalte v-else>

    <button type="submit">Salvar</button>
    </template>
    <slot :formdata="this">
  </form>
  `,
    data() {
        return {
            formdata: {
                urlApi: '',
                fields: this.fields,
                actions: []
            },

            formdata_default: {
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
        displayedFields() {
            let self = this;
            this.formdata.fields.map((item, index) => {
                if (item.input || item.select || item.checkbox) {
                    return false;
                }

                this.formdata.fields[index] = {
                    ...item,
                    input: self.formdata_default.input
                };
            })

            return this.formdata.fields;
        }
    },
    methods: {
        save() {

        }
    }
});