import { useRef } from 'preact/hooks';
import { useYoutube } from './useYoutube';

export const useYoutubeInput = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { error, handleCreateCourse } = useYoutube();

  async function handleCreateCourseInput() {
    if (!inputRef.current) {
      return;
    }

    const url = inputRef.current.value;

    await handleCreateCourse(url);

    inputRef.current.value = '';
  }

  return {
    inputRef,
    error,
    handleCreateCourseInput,
  };
};
