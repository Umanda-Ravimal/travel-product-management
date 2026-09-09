import { useMemo, useState } from 'react';

import { Box, IconButton, Typography } from '../atoms';
import { ChevronLeft, ChevronRight } from '../atoms/icons';
import { getProductGalleryImages } from '../../utils/productImages';

interface ProductGalleryProps {
  productName: string;
  destination: string;
  images?: string[];
}

export default function ProductGallery({
  productName,
  destination,
  images: productImages,
}: ProductGalleryProps) {
  const images = useMemo(
    () => getProductGalleryImages({ destination, images: productImages }),
    [destination, productImages],
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const extraCount = Math.max(images.length - 4, 0);
  const thumbs = images.slice(0, 4);

  const previousImage = () => {
    setActiveIndex((current) =>
      current === 0 ? images.length - 1 : current - 1,
    );
  };

  const nextImage = () => {
    setActiveIndex((current) =>
      current === images.length - 1 ? 0 : current + 1,
    );
  };

  return (
    <Box>
      <Box
        sx={{
          position: 'relative',
          height: { xs: 260, sm: 320, md: 400 },
          borderRadius: 3,
          overflow: 'hidden',
          backgroundColor: '#E9EEEE',
          boxShadow: '0 2px 12px rgba(20, 36, 51, 0.04)',
        }}
      >
        <Box
          component="img"
          src={images[activeIndex]}
          alt={productName}
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
          }}
        />

        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(90deg, rgba(8, 40, 40, 0.08) 0%, rgba(8, 40, 40, 0.12) 42%, rgba(8, 40, 40, 0.45) 100%)',
            pointerEvents: 'none',
          }}
        />

        <Box
          sx={{
            position: 'absolute',
            right: { xs: 16, md: 28 },
            bottom: { xs: 18, md: 28 },
            textAlign: 'right',
            color: '#fff',
            pointerEvents: 'none',
          }}
        >
            <Typography
              variant="h2"
              sx={{
                color: '#fff',
                textShadow: '0 8px 24px rgba(0,0,0,0.35)',
              }}
            >
              {destination}
            </Typography>

          <Typography
            sx={{
              mt: 0.6,
              fontSize: { xs: '0.62rem', md: '0.72rem' },
              fontWeight: 700,
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              opacity: 0.92,
            }}
          >
            A World of Discovery
          </Typography>
        </Box>

        <IconButton
          onClick={previousImage}
          aria-label="Previous image"
          sx={{
            position: 'absolute',
            left: 16,
            top: '50%',
            transform: 'translateY(-50%)',
            width: 40,
            height: 40,
            backgroundColor: 'rgba(255,255,255,.95)',
            '&:hover': {
              backgroundColor: '#fff',
            },
          }}
        >
          <ChevronLeft />
        </IconButton>

        <IconButton
          onClick={nextImage}
          aria-label="Next image"
          sx={{
            position: 'absolute',
            right: 16,
            top: '50%',
            transform: 'translateY(-50%)',
            width: 40,
            height: 40,
            backgroundColor: 'rgba(255,255,255,.95)',
            '&:hover': {
              backgroundColor: '#fff',
            },
          }}
        >
          <ChevronRight />
        </IconButton>
      </Box>

      <Box
        sx={{
          mt: 1.25,
          display: 'grid',
          gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
          gap: 1,
        }}
      >
        {thumbs.map((image, index) => {
          const isLastThumb = index === thumbs.length - 1 && extraCount > 0;
          const selected = activeIndex === index || (isLastThumb && activeIndex >= 3);

          return (
            <Box
              key={image}
              onClick={() => setActiveIndex(isLastThumb ? 3 : index)}
              sx={{
                position: 'relative',
                height: { xs: 64, md: 80 },
                borderRadius: 1.5,
                overflow: 'hidden',
                cursor: 'pointer',
                border: '2px solid',
                borderColor: selected ? 'primary.main' : 'transparent',
              }}
            >
              <Box
                component="img"
                src={image}
                alt={`${productName} ${index + 1}`}
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />

              {isLastThumb && (
                <Box
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(20,36,51,.55)',
                    color: '#fff',
                    fontWeight: 800,
                    fontSize: '0.9rem',
                  }}
                >
                  +{extraCount}
                </Box>
              )}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
