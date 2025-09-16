import {createComparison, defaultRules} from "../lib/compare.js";

// @todo: #4.3 — настроить компаратор
const compare = createComparison(defaultRules); 

export function initFiltering(elements, indexes) {
    // @todo: #4.1 — заполнить выпадающие списки опциями
    Object.keys(indexes)                      // ключи: например ["searchBySeller", ...]
    .forEach((elementName) => {             // перебираем имя каждого элемента фильтра
      const el = elements[elementName];     // сам <select> из шаблона
      if (!el) return;
  
      el.append(
        ...Object.values(indexes[elementName])   // ["Имя 1", "Имя 2", ...]
          .map((name) => {                       // создаём тег <option> для каждого name
            const opt = document.createElement('option');
            opt.value = String(name);
            opt.textContent = String(name);
            return opt;                          // вернуть готовый <option>
          })
      );
    });

    return (data, state, action) => {
        // @todo: #4.2 — обработать очистку поля
        if (action && action.name === 'clear') {
            // из разметки кнопки: <button name="clear" data-field="searchBySeller">Очистить</button>
            const field = action.dataset.field; // какое поле в state чистить
            // найдём контейнер фильтра рядом с кнопкой
            const group = action.closest('[data-filter-group]') || action.parentElement;
        
            if (group) {
              // сбрасываем все контролы в этом блоке
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
        return data.filter(row => compare(row, state)); 

    }
}