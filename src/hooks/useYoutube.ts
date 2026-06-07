import { useState } from 'preact/hooks';
import { YoutubeService } from '@/services/YoutubeService';
import { IndexedDBService } from '@/services/IndexedDBService';
import { useCourseStore } from '@/stores/courseStore';
import type { YoutubePlaylistResponse, YoutubeVideoResponse } from '@/types/video.d';

type YoutubeData = null | YoutubePlaylistResponse | YoutubeVideoResponse;

export const useYoutube = () => {
  const [error, setError] = useState<string | null>(null);

  async function handleCreateCourse(url: string) {
    setError(null);
    let data: YoutubeData = null;

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

      if (playlistId) {
        data = await YoutubeService.fetchPlaylistById(playlistId);
      }

      if (videoId) {
        data = await YoutubeService.fetchVideoById(videoId);
      }

      if (!data) {
        setError(
          'No se pudo obtener información de la URL proporcionada. Verifica que el enlace sea correcto y accesible.',
        );

        return;
      }

      if (data.items && Array.isArray(data.items)) {
        data = YoutubeService.formatPlaylistDetailsIntoCourse(data as YoutubePlaylistResponse);
      } else {
        data = YoutubeService.formatVideoDetailsIntoCourse(data as YoutubeVideoResponse);
      }

      await IndexedDBService.addCourse(data);
      useCourseStore.getState().loadRecentCourses();
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
