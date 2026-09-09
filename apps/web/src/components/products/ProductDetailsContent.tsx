import type { ReactNode } from 'react';

import {
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  Stack,
  Typography,
} from '../atoms';
import {
  AutoAwesome,
  CheckCircle,
  ListAltOutlined,
  LocalOfferOutlined,
} from '../atoms/icons';
import type { Product } from '../../types/product';

interface ProductDetailsContentProps {
  product: Product;
}

export default function ProductDetailsContent({
  product,
}: ProductDetailsContentProps) {
  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, md: 4 }}>
        <DetailCard icon={<AutoAwesome />} title="Highlights">
          {product.highlights?.length ? (
            product.highlights.map((highlight) => (
              <ListItem key={highlight} text={highlight} />
            ))
          ) : (
            <EmptyText text="No highlights available." />
          )}
        </DetailCard>
      </Grid>

      <Grid size={{ xs: 12, md: 4 }}>
        <DetailCard icon={<ListAltOutlined />} title="Inclusions">
          {product.inclusions?.length ? (
            product.inclusions.map((inclusion) => (
              <ListItem key={inclusion} text={inclusion} />
            ))
          ) : (
            <EmptyText text="No inclusions available." />
          )}
        </DetailCard>
      </Grid>

      <Grid size={{ xs: 12, md: 4 }}>
        <DetailCard icon={<LocalOfferOutlined />} title="Tags">
          {product.tags?.length ? (
            <Stack
              direction="row"
              spacing={1}
              useFlexGap
              sx={{ mt: 0.5, flexWrap: 'wrap' }}
            >
              {product.tags.map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  size="small"
                  sx={{
                    backgroundColor: '#E2F5F1',
                    color: '#087F7B',
                    fontWeight: 600,
                  }}
                />
              ))}
            </Stack>
          ) : (
            <EmptyText text="No tags available." />
          )}
        </DetailCard>
      </Grid>
    </Grid>
  );
}

function DetailCard({
  icon,
  title,
  children,
}: {
  icon: ReactNode;
  title: string;
  children: ReactNode;
}) {
  return (
    <Card
      sx={{
        height: '100%',
        boxShadow: 'none',
        border: '1px solid #E5E9EC',
      }}
    >
      <CardContent sx={{ p: 2.25 }}>
        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#E4F6F4',
              color: 'primary.main',
            }}
          >
            {icon}
          </Box>

          <Typography sx={{ fontWeight: 800, fontSize: '1rem' }}>
            {title}
          </Typography>
        </Stack>

        <Box sx={{ mt: 2 }}>{children}</Box>
      </CardContent>
    </Card>
  );
}

function ListItem({ text }: { text: string }) {
  return (
    <Stack
      direction="row"
      spacing={1}
      sx={{ mb: 1.25, alignItems: 'flex-start' }}
    >
      <CheckCircle
        sx={{
          fontSize: 18,
          color: 'primary.main',
          mt: 0.2,
        }}
      />

      <Typography variant="body2" sx={{ lineHeight: 1.55 }}>
        {text}
      </Typography>
    </Stack>
  );
}

function EmptyText({ text }: { text: string }) {
  return (
    <Typography variant="body2" color="text.secondary">
      {text}
    </Typography>
  );
}
