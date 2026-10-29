import type { DialogChoice, DialogOptions } from '../core';
import { el, nextId } from './dom';

/** A built input control. */
export interface InputControl {
  /** Element placed in the dialog. */
  node: HTMLElement;
  /** Element that receives focus. */
  focusTarget: HTMLElement;
  /** Elements that carry `aria-invalid` and `aria-describedby`. */
  fields: HTMLElement[];
  /** Reads the current value. */
  read(): unknown;
}

/** Normalizes the `options` option to a list of choices. */
export function normalizeChoices(options: DialogOptions['options']): DialogChoice[] {
  if (!options) return [];
  if (Array.isArray(options)) {
    return (options as readonly (string | DialogChoice)[]).map((entry) =>
      typeof entry === 'string' ? { value: entry, label: entry } : entry,
    );
  }
  return Object.entries(options as Readonly<Record<string, string>>).map(([value, label]) => ({
    value,
    label,
  }));
}

function applyAttributes(node: HTMLElement, attributes: DialogOptions['inputAttributes']): void {
  if (!attributes) return;
  for (const key of Object.keys(attributes)) {
    const value = attributes[key];
    if (value !== undefined) node.setAttribute(key, value);
  }
}

/**
 * Builds the input described by `options.input`.
 * @param options Dialog options.
 * @param labelId Id of the element naming the dialog, used as fallback label.
 */
export function buildInput(options: DialogOptions, labelId: string): InputControl | undefined {
  const type = options.input;
  if (!type) return undefined;
  const id = nextId('gk-input');
  const initial = options.inputValue;
  const label = options.inputLabel;
  const labelNode = label ? el('label', 'gk-label', { for: id }, label) : null;
  const wrap = (...children: (Node | null)[]): HTMLElement => {
    const box = el('div', 'gk-input');
    for (const child of children) if (child) box.append(child);
    return box;
  };
  const common = (node: HTMLElement): void => {
    node.id = id;
    node.classList.add('gk-field');
    if (!label) node.setAttribute('aria-labelledby', labelId);
    applyAttributes(node, options.inputAttributes);
  };

  if (type === 'textarea') {
    const area = el('textarea', '', { placeholder: options.placeholder, rows: '3' });
    area.value = initial === undefined ? '' : String(initial);
    common(area);
    return {
      node: wrap(labelNode, area),
      focusTarget: area,
      fields: [area],
      read: () => area.value,
    };
  }

  if (type === 'select') {
    const select = el('select');
    const choices = normalizeChoices(options.options);
    if (options.placeholder) {
      const placeholder = el('option', '', { value: '', disabled: '' }, options.placeholder);
      select.append(placeholder);
    }
    for (const choice of choices) {
      const option = el(
        'option',
        '',
        { value: choice.value, disabled: choice.disabled ? '' : undefined },
        choice.label,
      );
      select.append(option);
    }
    select.value = initial === undefined ? '' : String(initial);
    common(select);
    return {
      node: wrap(labelNode, select),
      focusTarget: select,
      fields: [select],
      read: () => select.value,
    };
  }

  if (type === 'radio') {
    const group = el('fieldset', 'gk-radios');
    group.append(el('legend', label ? 'gk-label' : 'gk-sr', {}, label ?? ''));
    if (!label) group.setAttribute('aria-labelledby', labelId);
    const name = nextId('gk-radio');
    const radios: HTMLInputElement[] = [];
    for (const choice of normalizeChoices(options.options)) {
      const radio = el('input', '', {
        type: 'radio',
        name,
        value: choice.value,
        disabled: choice.disabled ? '' : undefined,
      });
      radio.checked = initial !== undefined && String(initial) === choice.value;
      radios.push(radio);
      group.append(el('label', 'gk-choice', {}, radio, el('span', '', {}, choice.label)));
    }
    const first = radios.find((radio) => !radio.disabled) ?? group;
    return {
      node: wrap(group),
      focusTarget: radios.find((radio) => radio.checked) ?? first,
      fields: radios,
      read: () => radios.find((radio) => radio.checked)?.value,
    };
  }

  if (type === 'checkbox') {
    const box = el('input', '', { type: 'checkbox' });
    box.checked = initial === true || initial === 'true' || initial === 1;
    box.id = id;
    applyAttributes(box, options.inputAttributes);
    const text = label ?? options.placeholder ?? '';
    return {
      node: wrap(el('label', 'gk-choice', { for: id }, box, el('span', '', {}, text))),
      focusTarget: box,
      fields: [box],
      read: () => box.checked,
    };
  }

  const input = el('input', '', { type, placeholder: options.placeholder });
  if (type !== 'file' && initial !== undefined) input.value = String(initial);
  common(input);
  if (type === 'range') {
    const output = el('output', 'gk-output', { for: id }, input.value);
    input.addEventListener('input', () => {
      output.textContent = input.value;
    });
    return {
      node: wrap(labelNode, input, output),
      focusTarget: input,
      fields: [input],
      read: () => Number(input.value),
    };
  }
  if (type === 'file') {
    return {
      node: wrap(labelNode, input),
      focusTarget: input,
      fields: [input],
      read: () => {
        const files = Array.from(input.files ?? []);
        return input.multiple ? files : files[0];
      },
    };
  }
  if (type === 'number') {
    return {
      node: wrap(labelNode, input),
      focusTarget: input,
      fields: [input],
      read: () => (input.value === '' ? undefined : Number(input.value)),
    };
  }
  return {
    node: wrap(labelNode, input),
    focusTarget: input,
    fields: [input],
    read: () => input.value,
  };
}
