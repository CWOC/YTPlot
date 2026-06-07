import { useEffect, useCallback } from 'preact/hooks';
import { useParams, useLocation } from 'wouter-preact';
import { useCourseStore } from '@/stores/courseStore';

export function useCoursePage() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const courseId = Number(id);

  const course = useCourseStore((s) => s.courseById);
  const fetchCourseById = useCourseStore((s) => s.fetchCourseById);
  const toggleItemComplete = useCourseStore((s) => s.toggleItemComplete);
  const removeItemFromCourse = useCourseStore((s) => s.removeItemFromCourse);
  const updateCourse = useCourseStore((s) => s.updateCourse);
  const deleteCourse = useCourseStore((s) => s.deleteCourse);
  const clearCourseById = useCourseStore((s) => s.clearCourseById);

  useEffect(() => {
    fetchCourseById(courseId);
    return () => clearCourseById();
  }, [courseId, fetchCourseById, clearCourseById]);

  const handleToggle = useCallback(
    (itemId: string) => toggleItemComplete(courseId, itemId),
    [courseId, toggleItemComplete],
  );

  const handleRemoveItem = useCallback(
    (itemId: string) => {
      if (window.confirm('¿Eliminar este video del curso?')) {
        removeItemFromCourse(courseId, itemId);
      }
    },
    [courseId, removeItemFromCourse],
  );

  const handleDelete = useCallback(() => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este curso?')) {
      deleteCourse(courseId);
      navigate('/dashboard');
    }
  }, [courseId, deleteCourse, navigate]);

  const handleSaveTitle = useCallback(
    (title: string) => updateCourse(courseId, { title }),
    [courseId, updateCourse],
  );

  const handleSaveDescription = useCallback(
    (description: string) => updateCourse(courseId, { description }),
    [courseId, updateCourse],
  );

  return {
    course,
    handleToggle,
    handleRemoveItem,
    handleDelete,
    handleSaveTitle,
    handleSaveDescription,
  } as const;
}
