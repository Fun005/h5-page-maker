import { mapGetters } from 'vuex'

export default {
  props: {
    uuid: {
      type: String,
      default: ''
    },
    defaultStyle: {
      type: Object,
      default: () => ({})
    },
    bindings: {
      type: Array,
      default: () => ([])
    }
  },
  computed: {
    ...mapGetters(['sharedData'])
  },
  methods: {

  }
}
