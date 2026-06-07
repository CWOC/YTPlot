import { useState } from 'preact/hooks';
import styles from './FaqSection.module.css';

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'faq-01',
    question: '01. ¿Cómo funciona la sincronización con YouTube?',
    answer:
      'Simplemente pega el enlace de cualquier playlist o video individual. Nuestro motor extrae los metadatos y crea una estructura de curso automática en tu dashboard privado.',
  },
  {
    id: 'faq-02',
    question: '02. ¿Puedo añadir archivos locales o PDFs?',
    answer:
      'Sí. Puedes crear nodos de contenido manual donde adjuntar archivos, notas y recursos complementarios que se integran en el mismo flujo de aprendizaje.',
  },
  {
    id: 'faq-03',
    question: '03. ¿El seguimiento de progreso es automático?',
    answer:
      'El progreso se actualiza cada vez que marcas un video o lección como completado. Todos los datos se almacenan localmente en tu dispositivo mediante IndexedDB.',
  },
];

export function FaqSection() {
  const [openId, setOpenId] = useState<string | null>('faq-01');

  const toggle = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section className={styles.section} id="faq">
      <h2 className="section-title">SISTEMA_CONSULTAS [FAQ]</h2>

      <div className={styles.list}>
        {FAQ_ITEMS.map((item) => {
          const isOpen = openId === item.id;
          return (
            <div className={`${styles.item} ${isOpen ? styles.open : ''}`} key={item.id}>
              <button
                id={item.id}
                className={styles.trigger}
                onClick={() => toggle(item.id)}
                aria-expanded={isOpen}
                aria-controls={`${item.id}-answer`}
              >
                <span className={styles.question}>{item.question}</span>
                <span className={`material-symbols-outlined ${styles.chevron}`}>
                  {isOpen ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}
                </span>
              </button>

              <div
                id={`${item.id}-answer`}
                className={styles.answer}
                role="region"
                aria-labelledby={item.id}
              >
                <p class={styles.answerText}>{item.answer}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
