import { useState, useRef } from 'preact/hooks';
import { YoutubeService } from '@/services/YoutubeService';
import { useCourseStore } from '@/stores/courseStore';
import type { YoutubePlaylistResponse, YoutubeVideoResponse } from '@/types/video.d';

type YoutubeData = null | YoutubePlaylistResponse | YoutubeVideoResponse;

export function useAddToCourse(courseId: number) {
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const addItemsToCourse = useCourseStore((s) => s.addItemsToCourse);

  async function handleAddToCourse() {
    setError(null);

    const url = inputRef.current?.value ?? '';

    if (!url.trim()) {
      setError('Por favor, ingresa una URL de YouTube.');
      return;
    }

    const playlistId = YoutubeService.extractPlaylistId(url);
    const videoId = YoutubeService.extractVideoId(url);

    if (!playlistId && !videoId) {
      setError(
        'La URL ingresada no es válida. Asegúrate de que sea un enlace de lista de reproducción o video de YouTube.',
      );
      return;
    }

    try {
      let newItems;

      if (playlistId) {
        const data = await YoutubeService.fetchPlaylistById(playlistId);
        if (!data) {
          setError('No se pudo obtener la lista de reproducción.');
          return;
        }
        newItems = YoutubeService.formatPlaylistDetails(data);
      } else {
        const data = await YoutubeService.fetchVideoById(videoId!);
        if (!data) {
          setError('No se pudo obtener el video.');
          return;
        }
        newItems = [YoutubeService.formatVideoDetails(data)];
      }

      await addItemsToCourse(courseId, newItems);

      if (inputRef.current) {
        inputRef.current.value = '';
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(`Error al procesar la URL: ${err.message}`);
      } else {
        setError('Error desconocido al procesar la URL.');
      }
    }
  }

  return {
    inputRef,
    error,
    handleAddToCourse,
  } as const;
}
