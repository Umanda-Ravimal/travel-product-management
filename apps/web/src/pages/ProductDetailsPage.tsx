import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import {
  Alert,
  Box,
  Button,
  Card,
  CircularProgress,
  Snackbar,
  Stack,
  Tab,
  Tabs,
  Typography,
} from '../components/atoms';
import {
  DeleteOutlineOutlined,
  EditOutlined,
  LightbulbOutlined,
} from '../components/atoms/icons';
import { deleteProduct, getProduct, getProducts } from '../api/products.api';
import type { Product } from '../types/product';
import { getDisplayStatus } from '../utils/format';
import ProductGallery from '../components/products/ProductGallery';
import ProductKeyInformation from '../components/products/ProductKeyInformation';
import ProductDetailsContent from '../components/products/ProductDetailsContent';
import ProductStatusBadge from '../components/products/ProductStatusBadge';
import DeleteProductDialog from '../components/products/DeleteProductDialog';
import RelatedProducts from '../components/products/RelatedProducts';
import { PageHeader } from '../components/molecules';

export default function ProductDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');
  const [snackbar, setSnackbar] = useState(false);

  useEffect(() => {
    if (!id) return;

    const loadProduct = async () => {
      try {
        setLoading(true);
        setError('');
        setActiveTab(0);

        const result = await getProduct(id);
        setProduct(result);

        try {
          const relatedResponse = await getProducts({
            destination: result.destination,
            limit: 8,
          });

          setRelated(
            relatedResponse.data
              .filter((item) => item.id !== result.id)
              .slice(0, 4),
          );
        } catch {
          setRelated([]);
        }
      } catch (err) {
        console.error(err);
        setProduct(null);
        setError(
          'The product could not be found or an unexpected error occurred.',
        );
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  const handleDelete = async () => {
    if (!id) return;

    try {
      setDeleting(true);
      await deleteProduct(id);
      navigate('/products');
    } catch (err) {
      console.error(err);
      setDeleting(false);
      setDeleteOpen(false);
      setSnackbar(true);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '70vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error || !product) {
    return (
      <Box
        sx={{
          minHeight: '60vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Card sx={{ maxWidth: 520, width: '100%' }}>
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography sx={{ fontWeight: 800, fontSize: '1.15rem', mb: 1 }}>
              Unable to load product
            </Typography>

            <Typography color="text.secondary" sx={{ mb: 3 }}>
              {error}
            </Typography>

            <Button variant="contained" onClick={() => navigate('/products')}>
              Back to Products
            </Button>
          </Box>
        </Card>
      </Box>
    );
  }

  const isCurrentlyVisible =
    product.status === 'ACTIVE' &&
    product.inventoryCount > 0 &&
    new Date(product.validFrom) <= new Date() &&
    new Date(product.validUntil) >= new Date();

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <PageHeader
          title={product.productName}
          description={product.description}
          breadcrumbs={[
            { label: 'Products', to: '/products' },
            { label: product.productName },
          ]}
          actions={
            <Stack
              direction="row"
              spacing={1}
              sx={{ alignItems: 'center', flexWrap: 'wrap', rowGap: 1 }}
            >
              <ProductStatusBadge status={getDisplayStatus(product)} />

              <Button
                variant="outlined"
                startIcon={<EditOutlined />}
                onClick={() => navigate(`/products/${product.id}/edit`)}
              >
                Edit Product
              </Button>

              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteOutlineOutlined />}
                onClick={() => setDeleteOpen(true)}
              >
                Delete
              </Button>
            </Stack>
          }
        />
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            lg: '1.05fr 0.95fr',
          },
          gap: 2,
          mb: 2,
        }}
      >
        <ProductGallery
          productName={product.productName}
          destination={product.destination}
          images={product.images}
        />

        <ProductKeyInformation product={product} />
      </Box>

      <Card sx={{ overflow: 'hidden' }}>
        <Tabs
          value={activeTab}
          onChange={(_, value: number) => setActiveTab(value)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            px: 1,
            borderBottom: '1px solid',
            borderColor: 'divider',
            '& .MuiTab-root': {
              minHeight: 56,
              textTransform: 'none',
              fontWeight: 600,
            },
          }}
        >
          <Tab label="Details" />
          <Tab label="Availability" />
          <Tab label="Reviews" />
          <Tab label="Related Products" />
        </Tabs>

        <Box sx={{ p: { xs: 1.5, md: 2.5 } }}>
          {activeTab === 0 && <ProductDetailsContent product={product} />}

          {activeTab === 1 && (
            <EmptyTab
              title="Availability"
              message="Availability management is not currently configured for this product."
            />
          )}

          {activeTab === 2 && (
            <EmptyTab title="Reviews" message="No reviews yet." />
          )}

          {activeTab === 3 && <RelatedProducts products={related} />}

          <Box
            sx={{
              mt: 2.5,
              p: 2,
              borderRadius: 2,
              backgroundColor: '#EAF8F5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 2,
              flexWrap: 'wrap',
            }}
          >
            <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
              <LightbulbOutlined
                sx={{
                  color: 'primary.main',
                  fontSize: 28,
                }}
              />

              <Box>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 800, color: '#087F7B' }}
                >
                  {isCurrentlyVisible
                    ? 'This product is active and visible in search results.'
                    : 'This product is not currently visible in search results.'}
                </Typography>

                <Typography variant="caption" color="text.secondary">
                  Edit the product to update details, availability, or pricing.
                </Typography>
              </Box>
            </Stack>

            <Button
              variant="contained"
              startIcon={<EditOutlined />}
              onClick={() => navigate(`/products/${product.id}/edit`)}
            >
              Edit Product
            </Button>
          </Box>
        </Box>
      </Card>

      <DeleteProductDialog
        open={deleteOpen}
        productName={product.productName}
        loading={deleting}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
      />

      <Snackbar
        open={snackbar}
        autoHideDuration={3500}
        onClose={() => setSnackbar(false)}
      >
        <Alert severity="error">Failed to delete the product.</Alert>
      </Snackbar>
    </Box>
  );
}

function EmptyTab({
  title,
  message,
}: {
  title: string;
  message: string;
}) {
  return (
    <Box
      sx={{
        minHeight: 180,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        border: '1px dashed #D8E0E3',
        borderRadius: 2,
        backgroundColor: '#F8FAFA',
        px: 2,
      }}
    >
      <Typography sx={{ fontWeight: 800, mb: 0.5 }}>{title}</Typography>
      <Typography color="text.secondary" variant="body2">
        {message}
      </Typography>
    </Box>
  );
}
