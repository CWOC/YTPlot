import { describe, test, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import { ManualCourseModal } from './ManualCourseModal';

const mockHandleSubmit = vi.fn();

vi.mock('@/hooks/useManualCourseForm', () => ({
  useManualCourseForm: () => ({
    formError: '',
    handleSubmit: mockHandleSubmit,
  }),
}));

describe('ManualCourseModal', () => {
  beforeEach(() => {
    mockHandleSubmit.mockReset();
  });

  test('does not render dialog when open=false', () => {
    const { container } = render(<ManualCourseModal open={false} onClose={vi.fn()} />);
    const dialog = container.querySelector('dialog');
    expect(dialog).toBeTruthy();
    expect(dialog?.open).toBeFalsy();
  });

  test('renders dialog when open=true', () => {
    render(<ManualCourseModal open={true} onClose={vi.fn()} />);
    expect(screen.getByRole('dialog')).toBeDefined();
  });

  test('renders form with title input and description textarea', () => {
    render(<ManualCourseModal open={true} onClose={vi.fn()} />);
    expect(screen.getByLabelText('Título del curso')).toBeDefined();
    expect(screen.getByLabelText('Descripción del curso')).toBeDefined();
    expect(screen.getByText('CREAR CURSO MANUAL')).toBeDefined();
  });

  test('calls onClose when cancel button clicked', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(<ManualCourseModal open={true} onClose={onClose} />);

    await user.click(screen.getByText('CANCELAR'));
    expect(onClose).toHaveBeenCalledOnce();
  });

  test('calls onClose when dialog onClose fires', () => {
    const onClose = vi.fn();
    render(<ManualCourseModal open={true} onClose={onClose} />);

    const dialog = screen.getByRole('dialog');
    dialog.dispatchEvent(new Event('close'));
    expect(onClose).toHaveBeenCalledOnce();
  });

  test('calls handleSubmit on form submit, and onClose if created', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    mockHandleSubmit.mockResolvedValue(true);

    render(<ManualCourseModal open={true} onClose={onClose} />);

    const titleInput = screen.getByLabelText('Título del curso');
    await user.type(titleInput, 'Nuevo Curso');
    await user.click(screen.getByText('CREAR CURSO'));

    expect(mockHandleSubmit).toHaveBeenCalledOnce();
    expect(onClose).toHaveBeenCalledOnce();
  });
});
