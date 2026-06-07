import { Switch, Route } from 'wouter-preact';
import { Sidebar } from './components/Sidebar/Sidebar';
/** Pages */
import { HomePage } from './pages/home/HomePage';
import { DashboardPage } from './pages/dashboard/DashboardPage';
import { CoursePage } from './pages/dashboard/course/CoursePage';
import { CourseItemPage } from './pages/dashboard/course/item/CourseItemPage';
import { NotFoundPage } from './pages/404/NotFoundPage';

export function App() {
  return (
    <div className="appLayout">
      <Sidebar />

      <main className="mainContent">
        <div className="pageContainer">
          <Switch>
            <Route path="/" component={HomePage} />
            <Route path="/dashboard" component={DashboardPage} />
            <Route path="/dashboard/course/:courseId/item/:itemId" component={CourseItemPage} />
            <Route path="/dashboard/course/:id" component={CoursePage} />
            <Route component={NotFoundPage} />
          </Switch>
        </div>
      </main>
    </div>
  );
}
