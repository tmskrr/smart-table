
export function initFiltering(elements) {
  const updateIndexes = (elements, indexes) => {
      Object.keys(indexes).forEach((elementName) => {
          elements[elementName].append(...Object.values(indexes[elementName]).map(name => {
              const el = document.createElement('option');
              el.textContent = name;
              el.value = name;
              return el;
          }))
      })
  }

  const applyFiltering = (query, state, action) => {
      // код с обработкой очистки поля
      if (action && action.name === 'clear') {
      
        const field = action.dataset.field;
        
        const group = action.closest('[data-filter-group]') || action.parentElement;
    
        if (group) {
          group.querySelectorAll('input, select, textarea').forEach((el) => {
            if (el.type === 'checkbox' || el.type === 'radio') {
              el.checked = false;
            } else {
              el.value = '';
            }
          });
        }
    
        // синхронизируем состояние
        if (field in state) {
          if (Array.isArray(state[field])) {
            state[field] = [];
          } else if (typeof state[field] === 'boolean') {
            state[field] = false;
          } else {
            state[field] = '';
          }
        }
      }
    // @todo: #4.5 — отфильтровать данные используя компаратор
      const filter = {};
      Object.keys(elements).forEach(key => {
          if (elements[key]) {
              if (['INPUT', 'SELECT'].includes(elements[key].tagName) && elements[key].value) { // ищем поля ввода в фильтре с непустыми данными
                  filter[`filter[${elements[key].name}]`] = elements[key].value; // чтобы сформировать в query вложенный объект фильтра
              }
          }
      })

      return Object.keys(filter).length ? Object.assign({}, query, filter) : query; // если в фильтре что-то добавилось, применим к запросу
  }

  return {
      updateIndexes,
      applyFiltering
  }
}