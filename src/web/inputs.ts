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
  return Object.keys(options).map((value) => ({
    value,
    label: (options as Record<string, string>)[value]!,
  }));
}

function applyAttributes(node: HTMLElement, attributes: DialogOptions['inputAttributes']): void {
  if (!attributes) return;
  for (const k in attributes) {
    const value = attributes[k];
    if (value !== undefined) node.setAttribute(k, value);
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
  if (type === 'otp') {
    const len = options.otpLength ?? 6;
    const isAlpha = options.otpType === 'alphanumeric';
    const otpWrap = el('div', 'gk-otp');
    const inputs: HTMLInputElement[] = [];

    for (let i = 0; i < len; i++) {
      const inp = el('input', 'gk-field gk-otp-input', {
        type: 'text',
        maxLength: '1',
        inputmode: isAlpha ? 'text' : 'numeric',
        autocomplete: i === 0 ? 'one-time-code' : 'off',
        'aria-label': `Digit ${i + 1} of ${len}`,
      }) as HTMLInputElement;
      inputs.push(inp);
      otpWrap.append(inp);

      inp.addEventListener('input', () => {
        if (!isAlpha) inp.value = inp.value.replace(/\D/g, '');
        if (inp.value && inputs[i + 1]) inputs[i + 1]?.focus();
        const code = inputs.map((x) => x.value).join('');
        if (code.length === len) options.onOtpComplete?.(code);
      });

      inp.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && !inp.value && inputs[i - 1]) {
          inputs[i - 1]?.focus();
        } else if (e.key === 'ArrowLeft' && inputs[i - 1]) {
          inputs[i - 1]?.focus();
        } else if (e.key === 'ArrowRight' && inputs[i + 1]) {
          inputs[i + 1]?.focus();
        }
      });

      inp.addEventListener('paste', (e) => {
        const raw = e.clipboardData?.getData('text') || '';
        const cleaned = (isAlpha ? raw.replace(/[^a-zA-Z0-9]/g, '') : raw.replace(/\D/g, '')).slice(
          0,
          len,
        );
        if (!cleaned) return;
        e.preventDefault();
        inputs.forEach((x, j) => {
          x.value = cleaned[j] || '';
        });
        const nextIdx = Math.min(cleaned.length, len - 1);
        inputs[nextIdx]?.focus();
        if (cleaned.length === len) options.onOtpComplete?.(cleaned);
      });
    }

    if (options.inputValue && typeof options.inputValue === 'string') {
      const chars = options.inputValue.slice(0, len);
      inputs.forEach((inp, idx) => {
        inp.value = chars[idx] || '';
      });
    }

    let footerNote: HTMLElement | null = null;
    if (options.resendCooldown !== undefined) {
      let cooldown = options.resendCooldown;
      const resendWrap = el('p', 'gk-otp-resend', {
        style: 'margin-top:12px;font-size:13px;text-align:center;',
      });
      const resendBtn = el(
        'button',
        'gk-btn-resend',
        {
          type: 'button',
          style:
            'color:var(--gk-accent);font-weight:600;cursor:pointer;background:none;border:none;padding:0;font:inherit;',
        },
        'Resend code',
      );
      const timerSpan = el('span', '', {}, cooldown > 0 ? ` (${cooldown}s)` : '');
      resendBtn.disabled = cooldown > 0;
      resendWrap.append("Didn't get it? ", resendBtn, timerSpan);
      if (cooldown > 0) {
        const interval = setInterval(() => {
          cooldown--;
          if (cooldown <= 0) {
            clearInterval(interval);
            timerSpan.textContent = '';
            resendBtn.disabled = false;
          } else {
            timerSpan.textContent = ` (${cooldown}s)`;
          }
        }, 1000);
      }
      resendBtn.addEventListener('click', () => {
        if (resendBtn.disabled) return;
        options.onResend?.();
      });
      footerNote = resendWrap;
    }

    return {
      node: wrap(labelNode, otpWrap, footerNote),
      focusTarget: inputs[0] ?? otpWrap,
      fields: inputs,
      read: () => inputs.map((x) => x.value).join(''),
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
