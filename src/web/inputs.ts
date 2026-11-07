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
    label: (options as Record<string, string>)[value] as string,
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

  const ctrl = (
    node: HTMLElement,
    target: HTMLElement,
    fields: HTMLElement[],
    read: () => unknown,
  ): InputControl => ({
    node,
    focusTarget: target,
    fields,
    read,
  });

  const makeCtrl = (
    child: HTMLElement,
    target: HTMLElement,
    fields: HTMLElement[],
    read: () => unknown,
  ): InputControl => ctrl(wrap(labelNode, child), target, fields, read);

  if (type === 'textarea') {
    const area = el('textarea', '', { placeholder: options.placeholder, rows: '3' });
    area.value = initial === undefined ? '' : String(initial);
    common(area);
    return makeCtrl(area, area, [area], () => area.value);
  }

  if (type === 'select') {
    const select = el('select');
    if (options.placeholder) {
      select.append(el('option', '', { value: '', disabled: '' }, options.placeholder));
    }
    for (const choice of normalizeChoices(options.options)) {
      select.append(
        el(
          'option',
          '',
          { value: choice.value, disabled: choice.disabled ? '' : undefined },
          choice.label,
        ),
      );
    }
    select.value = initial === undefined ? '' : String(initial);
    common(select);
    return makeCtrl(select, select, [select], () => select.value);
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
    return ctrl(
      wrap(group),
      radios.find((radio) => radio.checked) ?? first,
      radios,
      () => radios.find((radio) => radio.checked)?.value,
    );
  }

  if (type === 'checkbox') {
    const box = el('input', '', { type: 'checkbox' });
    box.checked = initial === true || initial === 'true' || initial === 1;
    box.id = id;
    applyAttributes(box, options.inputAttributes);
    const text = label ?? options.placeholder ?? '';
    return ctrl(
      wrap(el('label', 'gk-choice', { for: id }, box, el('span', '', {}, text))),
      box,
      [box],
      () => box.checked,
    );
  }

  const input = el('input', '', { type, placeholder: options.placeholder });
  if (type !== 'file' && initial !== undefined) input.value = String(initial);
  common(input);
  if (type === 'range') {
    const output = el('output', 'gk-output', { for: id }, input.value);
    input.addEventListener('input', () => {
      output.textContent = input.value;
    });
    return ctrl(wrap(labelNode, input, output), input, [input], () => Number(input.value));
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
        autocomplete: i ? 'off' : 'one-time-code',
        'aria-label': `Digit ${i + 1}`,
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
        if (e.key === 'Backspace' && !inp.value) inputs[i - 1]?.focus();
        else if (e.key === 'ArrowLeft' || e.key === 'ArrowRight')
          inputs[i + (e.key === 'ArrowLeft' ? -1 : 1)]?.focus();
      });

      inp.addEventListener('paste', (e) => {
        const raw = e.clipboardData?.getData('text') || '';
        const cleaned = raw.replace(isAlpha ? /[^a-zA-Z0-9]/g : /\D/g, '').slice(0, len);
        if (!cleaned) return;
        e.preventDefault();
        inputs.forEach((x, j) => {
          x.value = cleaned[j] || '';
        });
        inputs[Math.min(cleaned.length, len - 1)]?.focus();
        if (cleaned.length === len) options.onOtpComplete?.(cleaned);
      });
    }

    if (typeof initial === 'string') {
      inputs.forEach((inp, idx) => {
        inp.value = initial[idx] || '';
      });
    }

    let footerNote: HTMLElement | null = null;
    if (options.resendCooldown !== undefined) {
      let cd = options.resendCooldown;
      const resendBtn = el('button', 'gk-btn-resend', {}, 'Resend code');
      const timerSpan = el('span', '', {}, cd > 0 ? ` (${cd}s)` : '');
      resendBtn.disabled = cd > 0;
      footerNote = el('p', 'gk-otp-resend', {}, "Didn't get it? ", resendBtn, timerSpan);
      if (cd > 0) {
        const iv = setInterval(() => {
          if (!resendBtn.isConnected || --cd <= 0) {
            clearInterval(iv);
            timerSpan.textContent = '';
            resendBtn.disabled = false;
          } else timerSpan.textContent = ` (${cd}s)`;
        }, 1000);
      }
      resendBtn.addEventListener('click', () => {
        if (!resendBtn.disabled) options.onResend?.();
      });
    }

    return ctrl(wrap(labelNode, otpWrap, footerNote), inputs[0] ?? otpWrap, inputs, () =>
      inputs.map((x) => x.value).join(''),
    );
  }

  return makeCtrl(input, input, [input], () =>
    type === 'file'
      ? input.multiple
        ? [...(input.files ?? [])]
        : input.files?.[0]
      : type === 'number'
        ? input.value === ''
          ? undefined
          : Number(input.value)
        : input.value,
  );
}
