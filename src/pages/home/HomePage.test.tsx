import { describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/preact';
import { HomePage } from './HomePage';

vi.mock('./components/HeroSection/HeroSection', () => ({
  HeroSection: () => (
    <section>
      <h1>YTPlot: TRASCIENDE TU APRENDIZAJE</h1>
    </section>
  ),
}));

vi.mock('./components/WhySection/WhySection', () => ({
  WhySection: () => <section>Why Section</section>,
}));

vi.mock('./components/RecentCoursesSection/RecentCoursesSection', () => ({
  RecentCoursesSection: () => <section>Recent Courses</section>,
}));

vi.mock('./components/HowItWorksSection/HowItWorksSection', () => ({
  HowItWorksSection: () => <section>How It Works</section>,
}));

vi.mock('./components/FaqSection/FaqSection', () => ({
  FaqSection: () => <section>FAQ</section>,
}));

describe('HomePage', () => {
  test('renders the page without crashing', () => {
    const { container } = render(<HomePage />);
    expect(container).toBeDefined();
  });

  test('renders the HeroSection (look for "YTPlot" text)', () => {
    render(<HomePage />);
    expect(screen.getByText('YTPlot: TRASCIENDE TU APRENDIZAJE')).toBeDefined();
  });
});
