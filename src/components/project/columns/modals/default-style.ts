export default {
  control: {
    backgroundColor: '#fff',
    fontSize: 14,
    fontWeight: 'normal'
  },

  '&multiLine': {
    control: {
    },
    highlighter: {
    },
    input: {
    }
  },

  '&singleLine': {
    display: 'inline-block',
    width: 180,

    highlighter: {
    },
    input: {
    }
  },

  suggestions: {
    zIndex: 5000,
    list: {
      backgroundColor: 'white',
      border: '1px solid rgba(0,0,0,0.15)',
      fontSize: 14,
      zIndex: 1000
    },
    item: {
      padding: '5px 15px',
      borderBottom: '1px solid rgba(0,0,0,0.15)',
      '&focused': {
        backgroundColor: '#cee4e5'
      }
    }
  }
}
