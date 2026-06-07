import { useState } from 'preact/hooks';
import { YoutubeService } from '@/services/YoutubeService';
import { IndexedDBService } from '@/services/IndexedDBService';
import { useCourseStore } from '@/stores/courseStore';
import type {
  CourseFromInsertPlaylist,
  CourseFromInsertVideo,
} from '@/types/video.d';

export const useYoutube = () => {
  const [error, setError] = useState<string | null>(null);

  async function handleCreateCourse(url: string) {
    setError(null);

    if (!url.trim()) {
      setError('Por favor, ingresa una URL de YouTube.');

      return;
    }

    const playlistId = YoutubeService.extractPlaylistId(url);
    const videoId = YoutubeService.extractVideoId(url);

    try {
      if (!playlistId && !videoId) {
        setError(
          'La URL ingresada no es válida. Asegúrate de que sea un enlace de lista de reproducción o video de YouTube.',
        );

        return;
      }

      let course: CourseFromInsertPlaylist | CourseFromInsertVideo | null = null;

      if (playlistId) {
        const playlist = await YoutubeService.fetchPlaylistById(playlistId);
        if (!playlist) {
          setError('No se pudo obtener información de la lista de reproducción.');

          return;
        }
        course = YoutubeService.formatPlaylistDetailsIntoCourse(playlist);
      } else if (videoId) {
        const video = await YoutubeService.fetchVideoById(videoId);
        if (!video) {
          setError('No se pudo obtener información del video.');

          return;
        }
        course = YoutubeService.formatVideoDetailsIntoCourse(video);
      }

      if (!course) {
        setError(
          'No se pudo obtener información de la URL proporcionada. Verifica que el enlace sea correcto y accesible.',
        );

        return;
      }

      await IndexedDBService.addCourse(course);
      useCourseStore.getState().loadRecentCourses();
      useCourseStore.getState().loadAllCourses();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(`Error al procesar la URL: ${err.message}`);
      } else {
        setError('Error desconocido al procesar la URL.');
      }
    }
  }

  return {
    error,
    handleCreateCourse,
  };
};
