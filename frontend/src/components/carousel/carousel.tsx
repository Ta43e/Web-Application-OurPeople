import React, { useEffect, useRef, useState } from 'react';
import { Image } from '../image/image';

type CarouselProps = {
  data: string[]; // Массив строк с URL изображений
};

const Carousel: React.FC<CarouselProps> = ({ data }) => {
  const [currentImg, setCurrentImg] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImg, setSelectedImg] = useState<string | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Переключение изображений с цикличностью
  const goToNextImage = () => {
    setCurrentImg((prev) => (prev === data.length - 1 ? 0 : prev + 1));
  };

  const goToPrevImage = () => {
    setCurrentImg((prev) => (prev === 0 ? data.length - 1 : prev - 1));
  };

  const openModal = (imgSrc: string) => {
    setSelectedImg(imgSrc);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImg(null);
  };

  // Устанавливаем интервал на автоматическую прокрутку
  useEffect(() => {
    const intervalId = setInterval(goToNextImage, 8000); // 8 секунд

    // Очищаем интервал, когда компонент размонтируется
    return () => clearInterval(intervalId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.length]); // Зависимость от длины массива изображений

  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: '600px', height: '300px', overflow: 'hidden', borderRadius: '10px' }}>
      {/* Контейнер изображений */}


      <div
        ref={carouselRef}
        style={{
          display: 'flex',
          transition: 'transform 0.3s ease-in-out',
          transform: `translateX(-${currentImg * 100}%)`,
        }}
      >
        {data.map((src, index) => (
          <div
            key={index}
            style={{
              flex: '0 0 100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Image
              src={src}
              alt={`Carousel image ${index + 1}`}
              style={{
                width: '100%',
                height: '300px',
                objectFit: 'cover',
                borderRadius: '10px',
              }}
              onClick={() => openModal(src)}
            />
          </div>
        ))}
      </div>

      {/* Кнопки навигации */}
      <button
        onClick={goToPrevImage}
        disabled={data.length === 0}
        style={{
          position: 'absolute',
          top: '50%',
          left: '10px',
          transform: 'translateY(-50%)',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          padding: '10px',
          cursor: 'pointer',
        }}
      >
        {'<'}
      </button>
      <button
        onClick={goToNextImage}
        disabled={data.length === 0}
        style={{
          position: 'absolute',
          top: '50%',
          right: '10px',
          transform: 'translateY(-50%)',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          padding: '10px',
          cursor: 'pointer',
        }}
      >
        {'>'}
      </button>

      {/* Модальное окно */}
      {isModalOpen && (
        <div
          onClick={closeModal}
          style={{
            position: 'fixed',
            zIndex: 1000,
            top: 10,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            
          }}
        >
          <img src={selectedImg!} alt="Full size" style={{ maxWidth: '80%', maxHeight: '80%', borderRadius: '10px' }} />
        </div>
      )}
    </div>
  );
};

export default Carousel;
