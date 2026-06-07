import { describe, test, expect, vi, afterEach } from 'vitest';
import { render, screen } from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import { InlineEdit } from './InlineEdit';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('InlineEdit', () => {
  test('renders the display span with the value when not editing', () => {
    render(<InlineEdit value="hello" onSave={vi.fn()} />);
    expect(screen.getByRole('button')).toBeDefined();
    expect(screen.getByText('hello')).toBeDefined();
  });

  test('clicking the display switches to edit mode (input appears)', async () => {
    const user = userEvent.setup();
    render(<InlineEdit value="hello" onSave={vi.fn()} />);

    await user.click(screen.getByRole('button'));
    const input = screen.getByDisplayValue('hello');
    expect(input).toBeDefined();
    expect(input.tagName).toBe('INPUT');
  });

  test('while editing, Enter saves the value (for as="input")', async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();

    render(<InlineEdit value="hello" onSave={onSave} />);
    await user.click(screen.getByRole('button'));

    const input = screen.getByDisplayValue('hello') as HTMLInputElement;
    await user.clear(input);
    await user.type(input, 'world');
    await user.keyboard('{Enter}');

    expect(onSave).toHaveBeenCalledWith('world');
  });

  test('while editing (textarea), Ctrl+Enter saves', async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();

    render(<InlineEdit value="hello" onSave={onSave} as="textarea" />);
    await user.click(screen.getByRole('button'));

    const textarea = screen.getByDisplayValue('hello');
    await user.clear(textarea);
    await user.type(textarea, 'new notes');
    await user.keyboard('{Control>}{Enter}{/Control}');

    expect(onSave).toHaveBeenCalledWith('new notes');
  });

  test('while editing, Escape cancels and reverts', async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();

    render(<InlineEdit value="original" onSave={onSave} />);
    await user.click(screen.getByRole('button'));

    const input = screen.getByDisplayValue('original');
    await user.clear(input);
    await user.type(input, 'changed');
    await user.keyboard('{Escape}');

    expect(screen.getByText('original')).toBeDefined();
    expect(onSave).not.toHaveBeenCalled();
  });

  test('blur saves', async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();

    render(<InlineEdit value="hello" onSave={onSave} />);
    await user.click(screen.getByRole('button'));

    const input = screen.getByDisplayValue('hello');
    await user.clear(input);
    await user.type(input, 'saved on blur');
    await user.tab();

    expect(onSave).toHaveBeenCalledWith('saved on blur');
  });

  test('trims whitespace before saving', async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();

    render(<InlineEdit value="hello" onSave={onSave} />);
    await user.click(screen.getByRole('button'));

    const input = screen.getByDisplayValue('hello');
    await user.clear(input);
    await user.type(input, '  trimmed  ');
    await user.keyboard('{Enter}');

    expect(onSave).toHaveBeenCalledWith('trimmed');
  });

  test('does not call onSave if value unchanged', async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();

    render(<InlineEdit value="same" onSave={onSave} />);
    await user.click(screen.getByRole('button'));
    await user.keyboard('{Enter}');

    expect(onSave).not.toHaveBeenCalled();
  });

  test('renders textarea when as="textarea"', () => {
    render(<InlineEdit value="notes" onSave={vi.fn()} as="textarea" />);
    expect(screen.getByRole('button')).toBeDefined();
    expect(screen.getByText('notes')).toBeDefined();
  });

  test('edit mode shows textarea when as="textarea"', async () => {
    const user = userEvent.setup();
    render(<InlineEdit value="notes" onSave={vi.fn()} as="textarea" />);

    await user.click(screen.getByRole('button'));
    const textarea = screen.getByDisplayValue('notes');
    expect(textarea).toBeDefined();
    expect(textarea.tagName).toBe('TEXTAREA');
  });
});
