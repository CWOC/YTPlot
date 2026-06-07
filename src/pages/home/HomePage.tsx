import { HeroSection } from './components/HeroSection/HeroSection';
import { WhySection } from './components/WhySection/WhySection';
import { RecentCoursesSection } from './components/RecentCoursesSection/RecentCoursesSection';
import { HowItWorksSection } from './components/HowItWorksSection/HowItWorksSection';
import { FaqSection } from './components/FaqSection/FaqSection';
import styles from './HomePage.module.css';

export function HomePage() {
  return (
    <main className={styles.page}>
      <HeroSection />

      <div className={styles.container}>
        <WhySection />
        <RecentCoursesSection />
        <HowItWorksSection />
        <FaqSection />
      </div>
    </main>
  );
}
