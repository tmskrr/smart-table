import {cloneTemplate} from "../lib/utils.js";

/**
 * Инициализирует таблицу и вызывает коллбэк при любых изменениях и нажатиях на кнопки
 *
 * @param {Object} settings
 * @param {(action: HTMLButtonElement | undefined) => void} onAction
 * @returns {{container: Node, elements: *, render: render}}
 */
export function initTable(settings, onAction) {
    const { tableTemplate, rowTemplate, before, after } = settings;
  
    const root = cloneTemplate(tableTemplate);
  
    // @todo: #1.2 — дополнительные шаблоны (делаем буквально по заданию)
    // ДО таблицы — reverse + prepend
    before.reverse().forEach((subName) => {
      root[subName] = cloneTemplate(subName);
      root.container.prepend(root[subName].container);
    });
  
    // ПОСЛЕ таблицы — append
    after.forEach((subName) => {
      root[subName] = cloneTemplate(subName);
      root.container.append(root[subName].container);
    });
  
    // @todo: #1.3 — обработчики событий
    root.container.addEventListener('change', function () {
      onAction(); // без аргументов
    });
  
    root.container.addEventListener('reset', function () {
      setTimeout(onAction); // отложенный вызов
    });
  
    root.container.addEventListener('submit', function (e) {
      e.preventDefault();
      onAction(e.submitter); // передаём сабмиттер
    });
  
    // @todo: #1.1 — вывод строк
    const render = (data) => {
      // ВАЖНО: используем rowTemplate из settings (id шаблона), НЕ переопределяем!
      const nextRows = data.map((item) => {
        const row = cloneTemplate(rowTemplate); // { container, elements }
  
        Object.keys(item).forEach((key) => {
          if (row.elements[key]) {
            row.elements[key].textContent = item[key];
            // (по заданию value для input/select можно не трогать здесь)
          }
        });
  
        return row.container; // возвращаем готовую строку
      });
  
      // вставляем строки в таблицу
      root.elements.rows.replaceChildren(...nextRows);
    };
  
    return { ...root, render };
  }