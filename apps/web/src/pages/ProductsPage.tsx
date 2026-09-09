import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { deleteProduct, getProducts } from '../api/products.api';
import { Alert, Button, Stack } from '../components/atoms';
import { AddOutlined } from '../components/atoms/icons';
import { PageHeader } from '../components/molecules';
import DeleteProductDialog from '../components/products/DeleteProductDialog';
import ProductsAiBanner from '../components/products/ProductsAiBanner';
import ProductsFilterBar, {
  type ProductFilters,
} from '../components/products/ProductsFilterBar';
import ProductsTable, {
  type ProductSort,
} from '../components/products/ProductsTable';
import type { Product, ProductListResponse } from '../types/product';

const emptyFilters: ProductFilters = {
  search: '',
  destination: '',
  category: '',
  minPrice: '',
  maxPrice: '',
};

export default function ProductsPage() {
  const [result, setResult] = useState<ProductListResponse>({
    data: [],
    meta: {
      page: 1,
      limit: 5,
      total: 0,
      totalPages: 0,
    },
  });

  const [draftFilters, setDraftFilters] = useState<ProductFilters>(emptyFilters);
  const [appliedFilters, setAppliedFilters] = useState<ProductFilters>(emptyFilters);
  const [sort, setSort] = useState<ProductSort>('newest');

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const response = await getProducts({
        search: appliedFilters.search || undefined,
        destination: appliedFilters.destination || undefined,
        category: appliedFilters.category || undefined,
        minPrice: appliedFilters.minPrice ? Number(appliedFilters.minPrice) : undefined,
        maxPrice: appliedFilters.maxPrice ? Number(appliedFilters.maxPrice) : undefined,
        page: page + 1,
        limit: rowsPerPage,
        sort,
      });

      setResult(response);
    } catch (err) {
      console.error(err);
      setError(
        'Unable to load products. Please make sure the API is running.',
      );
    } finally {
      setLoading(false);
    }
  }, [appliedFilters, page, rowsPerPage, sort]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleApplyFilters = () => {
    setAppliedFilters(draftFilters);
    setPage(0);
  };

  const handleReset = () => {
    setDraftFilters(emptyFilters);
    setAppliedFilters(emptyFilters);
    setSort('newest');
    setPage(0);
  };

  const handleDelete = async () => {
    if (!deleteTarget) {
      return;
    }

    try {
      setDeleteLoading(true);
      await deleteProduct(deleteTarget.id);
      setDeleteTarget(null);
      await loadProducts();
    } catch (err) {
      console.error(err);
      setError('Unable to delete the product. Please try again.');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <Stack spacing={2.5}>
      <PageHeader
        title="Products"
        description="Create, manage and monitor your travel product catalog."
        actions={
          <Button
            component={Link}
            to="/products/new"
            variant="contained"
            startIcon={<AddOutlined />}
            sx={{ px: 2.2, py: 1.05 }}
          >
            Add Product
          </Button>
        }
      />

      {error && (
        <Alert severity="error" onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <ProductsFilterBar
        filters={draftFilters}
        onChange={setDraftFilters}
        onApply={handleApplyFilters}
        onReset={handleReset}
      />

      <ProductsTable
        result={result}
        loading={loading}
        page={page}
        rowsPerPage={rowsPerPage}
        sort={sort}
        onSortChange={(nextSort) => {
          setSort(nextSort);
          setPage(0);
        }}
        onPageChange={setPage}
        onRowsPerPageChange={(nextRows) => {
          setRowsPerPage(nextRows);
          setPage(0);
        }}
        onDelete={setDeleteTarget}
      />

      <ProductsAiBanner />

      <DeleteProductDialog
        open={Boolean(deleteTarget)}
        productName={deleteTarget?.productName}
        loading={deleteLoading}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </Stack>
  );
}
