import { useEffect, useCallback, useMemo } from 'preact/hooks';
import { useParams, useLocation } from 'wouter-preact';
import { useCourseStore } from '@/stores/courseStore';

export function useCourseItemPage() {
  const { courseId, itemId } = useParams<{ courseId: string; itemId: string }>();
  const [, navigate] = useLocation();
  const courseIdNum = Number(courseId);
  const course = useCourseStore((s) => s.courseById);
  const fetchCourseById = useCourseStore((s) => s.fetchCourseById);
  const toggleItemComplete = useCourseStore((s) => s.toggleItemComplete);
  const removeItemFromCourse = useCourseStore((s) => s.removeItemFromCourse);
  const updateCourse = useCourseStore((s) => s.updateCourse);
  const updateItemNotes = useCourseStore((s) => s.updateItemNotes);

  useEffect(() => {
    fetchCourseById(courseIdNum);
  }, [courseIdNum, fetchCourseById]);

  const item = course?.items.find((i) => i.id === itemId) ?? null;

  const currentIndex = useMemo(
    () => (course ? course.items.findIndex((i) => i.id === itemId) : -1),
    [course, itemId],
  );

  const hasPrev = course ? currentIndex > 0 : false;
  const hasNext = course ? currentIndex < course.items.length - 1 : false;

  const handleToggle = useCallback(
    () => toggleItemComplete(courseIdNum, itemId),
    [courseIdNum, itemId, toggleItemComplete],
  );

  const handleSaveTitle = useCallback(
    (title: string) => {
      if (!course) return;
      const updatedItems = course.items.map((i) => (i.id === itemId ? { ...i, title } : i));
      updateCourse(courseIdNum, { items: updatedItems as typeof course.items });
    },
    [course, courseIdNum, itemId, updateCourse],
  );

  const handleSaveDescription = useCallback(
    (description: string) => {
      if (!course) return;
      const updatedItems = course.items.map((i) => (i.id === itemId ? { ...i, description } : i));
      updateCourse(courseIdNum, { items: updatedItems as typeof course.items });
    },
    [course, courseIdNum, itemId, updateCourse],
  );

  const handleSaveNotes = useCallback(
    (notes: string) => updateItemNotes(courseIdNum, itemId, notes),
    [courseIdNum, itemId, updateItemNotes],
  );

  const handleRemoveItem = useCallback(() => {
    if (window.confirm('¿Eliminar este video del curso?')) {
      removeItemFromCourse(courseIdNum, itemId);
      navigate(`/dashboard/course/${courseIdNum}`);
    }
  }, [courseIdNum, itemId, removeItemFromCourse, navigate]);

  return {
    course,
    item,
    currentIndex,
    hasPrev,
    hasNext,
    courseIdNum,
    handleToggle,
    handleRemoveItem,
    handleSaveTitle,
    handleSaveDescription,
    handleSaveNotes,
  } as const;
}
