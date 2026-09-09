import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import {
  generateProduct,
  type GeneratedProduct,
} from '../api/ai.api';
import {
  createProduct,
  getProduct,
  updateProduct,
  type CreateProductPayload,
} from '../api/products.api';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  Stack,
  Switch,
  TextField,
  Typography,
} from '../components/atoms';
import {
  AddOutlined,
  AutoAwesome,
  CalendarMonthOutlined,
  CloudUpload,
  DeleteOutlineOutlined,
  DescriptionOutlined,
  ImageOutlined,
  InfoOutlined,
  LocationOnOutlined,
  SaveOutlined,
  SellOutlined,
} from '../components/atoms/icons';
import { PageHeader } from '../components/molecules';
import type { Product } from '../types/product';

const categories = [
  'Dining',
  'Travel Package',
  'Airport Transfer',
  'Transport',
  'Tour',
  'Activity',
  'Accommodation',
];

const destinations = [
  'Colombo',
  'Ella',
  'Kandy',
  'Bentota',
  'Galle',
  'Sigiriya',
];

interface FormState {
  productName: string;
  destination: string;
  category: string;
  description: string;
  price: string;
  inventoryCount: string;
  validFrom: string;
  validUntil: string;
  status: 'ACTIVE' | 'INACTIVE';
  highlights: string[];
  inclusions: string[];
  tags: string[];
}

const initialForm: FormState = {
  productName: '',
  destination: '',
  category: '',
  description: '',
  price: '',
  inventoryCount: '0',
  validFrom: '',
  validUntil: '',
  status: 'ACTIVE',
  highlights: [''],
  inclusions: [''],
  tags: [],
};

function toDateInput(value?: string) {
  if (!value) return '';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return date.toISOString().split('T')[0];
}

function productToForm(product: Product): FormState {
  return {
    productName: product.productName,
    destination: product.destination,
    category: product.category,
    description: product.description,
    price: product.price,
    inventoryCount: String(product.inventoryCount),
    validFrom: toDateInput(product.validFrom),
    validUntil: toDateInput(product.validUntil),
    status: product.status,
    highlights:
      product.highlights?.length > 0 ? product.highlights : [''],
    inclusions:
      product.inclusions?.length > 0 ? product.inclusions : [''],
    tags: product.tags ?? [],
  };
}

function matchOption(value: string, options: string[]) {
  const normalized = value.trim().toLowerCase();

  if (!normalized) {
    return '';
  }

  return (
    options.find((option) => option.toLowerCase() === normalized) ??
    options.find(
      (option) =>
        option.toLowerCase().includes(normalized) ||
        normalized.includes(option.toLowerCase()),
    ) ??
    ''
  );
}

function generatedProductToForm(
  generated: GeneratedProduct,
  current: FormState,
): FormState {
  const highlights = generated.highlights.filter(Boolean);
  const inclusions = generated.inclusions.filter(Boolean);

  return {
    ...current,
    productName: generated.productName.trim() || current.productName,
    destination:
      matchOption(generated.destination, destinations) ||
      current.destination,
    category:
      matchOption(generated.category, categories) || current.category,
    description: (generated.description || current.description).slice(
      0,
      300,
    ),
    validFrom:
      toDateInput(generated.validFrom ?? undefined) || current.validFrom,
    validUntil:
      toDateInput(generated.validUntil ?? undefined) ||
      current.validUntil,
    highlights: highlights.length > 0 ? highlights : current.highlights,
    inclusions: inclusions.length > 0 ? inclusions : current.inclusions,
    tags: generated.tags.filter(Boolean).length
      ? generated.tags.filter(Boolean)
      : current.tags,
  };
}

export default function ProductFormPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const isEditMode = Boolean(id);

  const [form, setForm] = useState<FormState>(initialForm);
  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [tagInput, setTagInput] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  const [prompt, setPrompt] = useState('');
  const [generating, setGenerating] = useState(false);
  const [generateError, setGenerateError] = useState('');

  useEffect(() => {
    if (!id) return;

    const loadProduct = async () => {
      try {
        setLoading(true);

        const product = await getProduct(id);

        setForm(productToForm(product));
        setImagePreview(product.images?.[0] ?? null);
      } catch (error) {
        console.error(error);

        setSnackbar({
          open: true,
          message: 'Failed to load product.',
          severity: 'error',
        });
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  const handleGenerate = async () => {
    const trimmedPrompt = prompt.trim();

    if (!trimmedPrompt) {
      setGenerateError(
        'Please describe the travel product you want to create.',
      );
      return;
    }

    try {
      setGenerating(true);
      setGenerateError('');

      const generated = await generateProduct(trimmedPrompt);

      setForm((current) => generatedProductToForm(generated, current));
      setErrors({});
      setSnackbar({
        open: true,
        message: 'Form filled with AI-generated details. Review and edit before saving.',
        severity: 'success',
      });
    } catch (error) {
      console.error(error);

      setGenerateError(
        error instanceof Error
          ? error.message
          : 'Failed to generate product.',
      );
    } finally {
      setGenerating(false);
    }
  };

  const updateField = <K extends keyof FormState>(
    field: K,
    value: FormState[K],
  ) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [field]: '',
    }));
  };

  const updateArrayItem = (
    field: 'highlights' | 'inclusions',
    index: number,
    value: string,
  ) => {
    setForm((previous) => {
      const items = [...previous[field]];
      items[index] = value;

      return {
        ...previous,
        [field]: items,
      };
    });
  };

  const addArrayItem = (field: 'highlights' | 'inclusions') => {
    setForm((previous) => ({
      ...previous,
      [field]: [...previous[field], ''],
    }));
  };

  const removeArrayItem = (
    field: 'highlights' | 'inclusions',
    index: number,
  ) => {
    setForm((previous) => {
      const items = previous[field].filter(
        (_, itemIndex) => itemIndex !== index,
      );

      return {
        ...previous,
        [field]: items.length > 0 ? items : [''],
      };
    });
  };

  const addTag = () => {
    const tag = tagInput.trim();

    if (!tag) return;

    if (
      !form.tags.some(
        (existingTag) => existingTag.toLowerCase() === tag.toLowerCase(),
      )
    ) {
      setForm((previous) => ({
        ...previous,
        tags: [...previous.tags, tag],
      }));
    }

    setTagInput('');
  };

  const removeTag = (tagToRemove: string) => {
    setForm((previous) => ({
      ...previous,
      tags: previous.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleTagKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      addTag();
    }
  };

  const handleImageChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setSnackbar({
        open: true,
        message: 'Image must be smaller than 5MB.',
        severity: 'error',
      });

      return;
    }

    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      setSnackbar({
        open: true,
        message: 'Only JPG and PNG images are supported.',
        severity: 'error',
      });

      return;
    }

    const previewUrl = URL.createObjectURL(file);

    setImagePreview(previewUrl);
  };

  const validate = () => {
    const nextErrors: Record<string, string> = {};

    if (!form.productName.trim()) {
      nextErrors.productName = 'Product name is required.';
    }

    if (!form.destination) {
      nextErrors.destination = 'Destination is required.';
    }

    if (!form.category) {
      nextErrors.category = 'Category is required.';
    }

    if (!form.description.trim()) {
      nextErrors.description = 'Description is required.';
    }

    if (!form.price || Number(form.price) < 0) {
      nextErrors.price = 'Enter a valid price.';
    }

    if (
      form.inventoryCount === '' ||
      Number(form.inventoryCount) < 0
    ) {
      nextErrors.inventoryCount = 'Enter a valid inventory count.';
    }

    if (!form.validFrom) {
      nextErrors.validFrom = 'Valid from date is required.';
    }

    if (!form.validUntil) {
      nextErrors.validUntil = 'Valid until date is required.';
    }

    if (
      form.validFrom &&
      form.validUntil &&
      new Date(form.validUntil) <= new Date(form.validFrom)
    ) {
      nextErrors.validUntil =
        'Valid until must be later than valid from.';
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) {
      return;
    }

    const payload: CreateProductPayload = {
      productName: form.productName.trim(),
      destination: form.destination,
      category: form.category,
      description: form.description.trim(),
      price: form.price,
      inventoryCount: Number(form.inventoryCount),
      validFrom: form.validFrom,
      validUntil: form.validUntil,
      status: form.status,
      highlights: form.highlights
        .map((item) => item.trim())
        .filter(Boolean),
      inclusions: form.inclusions
        .map((item) => item.trim())
        .filter(Boolean),
      tags: form.tags,
    };

    try {
      setSaving(true);

      if (isEditMode && id) {
        await updateProduct(id, payload);

        setSnackbar({
          open: true,
          message: 'Product updated successfully.',
          severity: 'success',
        });
      } else {
        await createProduct(payload);

        setSnackbar({
          open: true,
          message: 'Product created successfully.',
          severity: 'success',
        });
      }

      setTimeout(() => {
        navigate('/products');
      }, 700);
    } catch (error) {
      console.error(error);

      setSnackbar({
        open: true,
        message: 'Failed to save product.',
        severity: 'error',
      });
    } finally {
      setSaving(false);
    }
  };

  const pageTitle = useMemo(
    () => (isEditMode ? 'Edit Product' : 'Create Product'),
    [isEditMode],
  );

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

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <PageHeader
          title={pageTitle}
          description={
            isEditMode
              ? 'Update the details of your travel product.'
              : 'Add a new travel product to your catalog.'
          }
          breadcrumbs={[
            { label: 'Products', to: '/products' },
            { label: pageTitle },
          ]}
          actions={
            <Stack direction="row" spacing={1.5}>
              <Button
                variant="outlined"
                onClick={() => navigate('/products')}
                disabled={saving}
                sx={{
                  px: 3,
                  minWidth: 110,
                }}
              >
                Cancel
              </Button>

              <Button
                variant="contained"
                startIcon={
                  saving ? (
                    <CircularProgress size={18} color="inherit" />
                  ) : (
                    <SaveOutlined />
                  )
                }
                onClick={handleSubmit}
                disabled={saving}
                sx={{
                  px: 3,
                  minWidth: 150,
                }}
              >
                {saving
                  ? 'Saving...'
                  : isEditMode
                    ? 'Save Changes'
                    : 'Save Product'}
              </Button>
            </Stack>
          }
        />
      </Box>

      <Grid container spacing={2}>
        {/* LEFT COLUMN */}
        <Grid size={{ xs: 12, lg: 8.5 }}>
          <Stack spacing={2}>
            {/* Basic Information */}
            <FormSection
              icon={<DescriptionOutlined />}
              title="Basic Information"
              subtitle="Tell us about your travel product."
            >
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <TextField
                    fullWidth
                    label="Product Name"
                    required
                    placeholder="e.g. Colombo Dinner Buffet"
                    value={form.productName}
                    onChange={(event) =>
                      updateField('productName', event.target.value)
                    }
                    error={Boolean(errors.productName)}
                    helperText={errors.productName}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                  <FormControl
                    fullWidth
                    required
                    error={Boolean(errors.category)}
                  >
                    <InputLabel>Category</InputLabel>

                    <Select
                      value={form.category}
                      label="Category"
                      onChange={(event) =>
                        updateField('category', event.target.value)
                      }
                    >
                      {categories.map((category) => (
                        <MenuItem key={category} value={category}>
                          {category}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  {errors.category && (
                    <Typography
                      variant="caption"
                      color="error"
                      sx={{ ml: 1.5 }}
                    >
                      {errors.category}
                    </Typography>
                  )}
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                  <FormControl
                    fullWidth
                    required
                    error={Boolean(errors.destination)}
                  >
                    <InputLabel>Destination</InputLabel>

                    <Select
                      value={form.destination}
                      label="Destination"
                      startAdornment={
                        <LocationOnOutlined
                          sx={{
                            ml: 1,
                            mr: 0.5,
                            color: 'text.secondary',
                          }}
                        />
                      }
                      onChange={(event) =>
                        updateField('destination', event.target.value)
                      }
                    >
                      {destinations.map((destination) => (
                        <MenuItem
                          key={destination}
                          value={destination}
                        >
                          {destination}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  {errors.destination && (
                    <Typography
                      variant="caption"
                      color="error"
                      sx={{ ml: 1.5 }}
                    >
                      {errors.destination}
                    </Typography>
                  )}
                </Grid>

                <Grid size={12}>
                  <TextField
                    fullWidth
                    multiline
                    minRows={4}
                    label="Description"
                    required
                    placeholder="A brief description of the product..."
                    value={form.description}
                    onChange={(event) =>
                      updateField('description', event.target.value)
                    }
                    error={Boolean(errors.description)}
                    helperText={
                      errors.description ||
                      `${form.description.length}/300`
                    }
                    slotProps={{
                      htmlInput: {
                        maxLength: 300,
                      },
                    }}
                  />
                </Grid>
              </Grid>
            </FormSection>

            {/* Pricing */}
            <FormSection
              icon={<SellOutlined />}
              title="Pricing & Availability"
              subtitle="Set the price, inventory and validity period."
            >
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <TextField
                    fullWidth
                    label="Price"
                    required
                    type="number"
                    value={form.price}
                    onChange={(event) =>
                      updateField('price', event.target.value)
                    }
                    error={Boolean(errors.price)}
                    helperText={errors.price}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <Box
                              sx={{
                                pr: 1.5,
                                mr: 1,
                                borderRight: '1px solid',
                                borderColor: 'divider',
                                fontWeight: 700,
                              }}
                            >
                              LKR
                            </Box>
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <TextField
                    fullWidth
                    label="Inventory Count"
                    required
                    type="number"
                    value={form.inventoryCount}
                    onChange={(event) =>
                      updateField(
                        'inventoryCount',
                        event.target.value,
                      )
                    }
                    error={Boolean(errors.inventoryCount)}
                    helperText={errors.inventoryCount}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <TextField
                    fullWidth
                    label="Valid From"
                    required
                    type="date"
                    value={form.validFrom}
                    onChange={(event) =>
                      updateField('validFrom', event.target.value)
                    }
                    error={Boolean(errors.validFrom)}
                    helperText={errors.validFrom}
                    slotProps={{
                      inputLabel: {
                        shrink: true,
                      },
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <CalendarMonthOutlined
                              sx={{ color: 'text.secondary' }}
                            />
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <TextField
                    fullWidth
                    label="Valid Until"
                    required
                    type="date"
                    value={form.validUntil}
                    onChange={(event) =>
                      updateField('validUntil', event.target.value)
                    }
                    error={Boolean(errors.validUntil)}
                    helperText={errors.validUntil}
                    slotProps={{
                      inputLabel: {
                        shrink: true,
                      },
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <CalendarMonthOutlined
                              sx={{ color: 'text.secondary' }}
                            />
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                </Grid>
              </Grid>
            </FormSection>

            {/* Detailed Information */}
            <FormSection
              icon={<DescriptionOutlined />}
              title="Detailed Information"
              subtitle="Add more details to make your product stand out."
            >
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <ArrayField
                    title="Highlights"
                    items={form.highlights}
                    placeholder="e.g. Scenic train ride through tea estates"
                    onAdd={() => addArrayItem('highlights')}
                    onRemove={(index) =>
                      removeArrayItem('highlights', index)
                    }
                    onChange={(index, value) =>
                      updateArrayItem('highlights', index, value)
                    }
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <ArrayField
                    title="Inclusions"
                    items={form.inclusions}
                    placeholder="e.g. Hotel transfers"
                    onAdd={() => addArrayItem('inclusions')}
                    onRemove={(index) =>
                      removeArrayItem('inclusions', index)
                    }
                    onChange={(index, value) =>
                      updateArrayItem('inclusions', index, value)
                    }
                  />
                </Grid>

                <Grid size={12}>
                  <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 700 }}
                    >
                      Tags
                    </Typography>

                    <InfoOutlined
                      sx={{
                        fontSize: 16,
                        color: 'text.secondary',
                      }}
                    />
                  </Stack>

                  <TextField
                    fullWidth
                    sx={{ mt: 1 }}
                    placeholder="Type a tag and press Enter"
                    value={tagInput}
                    onChange={(event) =>
                      setTagInput(event.target.value)
                    }
                    onKeyDown={handleTagKeyDown}
                    helperText="Press Enter to add a tag (e.g. adventure, family, cultural)"
                  />

                  {form.tags.length > 0 && (
                    <Stack
                      direction="row"
                      spacing={1}
                      useFlexGap
                      sx={{ mt: 1, flexWrap: 'wrap' }}
                    >
                      {form.tags.map((tag) => (
                        <Chip
                          key={tag}
                          label={tag}
                          onDelete={() => removeTag(tag)}
                          size="small"
                          sx={{
                            backgroundColor: '#E2F5F1',
                            color: '#087F7B',
                            fontWeight: 600,
                          }}
                        />
                      ))}
                    </Stack>
                  )}
                </Grid>
              </Grid>
            </FormSection>
          </Stack>
        </Grid>

        {/* RIGHT COLUMN */}
        <Grid size={{ xs: 12, lg: 3.5 }}>
          <Stack spacing={2}>
            {/* Image */}
            <Card>
              <CardContent>
                <SectionHeading
                  icon={<ImageOutlined />}
                  title="Product Image"
                  subtitle="Add a featured image for this product."
                />

                <Box
                  component="label"
                  sx={{
                    display: 'flex',
                    minHeight: 130,
                    border: '1.5px dashed',
                    borderColor: '#C8D6DC',
                    borderRadius: 2,
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    cursor: 'pointer',
                    transition: 'all .2s ease',
                    '&:hover': {
                      borderColor: 'primary.main',
                      backgroundColor: '#F6FBFA',
                    },
                  }}
                >
                  <CloudUpload
                    sx={{
                      fontSize: 34,
                      color: 'primary.main',
                      mb: 1,
                    }}
                  />

                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 700 }}
                  >
                    Click to upload an image
                  </Typography>

                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    or drag and drop
                  </Typography>

                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    JPG, PNG up to 5MB
                  </Typography>

                  <input
                    hidden
                    type="file"
                    accept="image/jpeg,image/png"
                    onChange={handleImageChange}
                  />
                </Box>

                {imagePreview && (
                  <>
                    <Box
                      component="img"
                      src={imagePreview}
                      alt="Product preview"
                      sx={{
                        width: '100%',
                        height: 120,
                        objectFit: 'cover',
                        borderRadius: 2,
                        mt: 1,
                      }}
                    />

                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<ImageOutlined />}
                      component="label"
                      sx={{ mt: 1 }}
                    >
                      Change Image

                      <input
                        hidden
                        type="file"
                        accept="image/jpeg,image/png"
                        onChange={handleImageChange}
                      />
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>

            {/* AI Generator */}
            <Card>
              <CardContent>
                <SectionHeading
                  icon={<AutoAwesome />}
                  title="AI Product Generator"
                  subtitle="Describe your product in simple words and let AI fill the form for you."
                />

                <TextField
                  fullWidth
                  multiline
                  minRows={3}
                  disabled={generating}
                  sx={{ mt: 2 }}
                  value={prompt}
                  onChange={(event) => {
                    setPrompt(event.target.value);
                    setGenerateError('');
                  }}
                  placeholder="e.g. A half day city tour in Colombo with key attractions, comfortable transport and an experienced guide..."
                />

                <Button
                  fullWidth
                  variant="contained"
                  disabled={generating || !prompt.trim()}
                  startIcon={
                    generating ? (
                      <CircularProgress size={18} color="inherit" />
                    ) : (
                      <AutoAwesome />
                    )
                  }
                  onClick={handleGenerate}
                  sx={{ mt: 1 }}
                >
                  {generating ? 'Generating...' : 'Generate with AI'}
                </Button>

                {generateError ? (
                  <Alert severity="error" sx={{ mt: 2 }}>
                    {generateError}
                  </Alert>
                ) : (
                  <Alert
                    severity="info"
                    icon={<InfoOutlined />}
                    sx={{
                      mt: 2,
                      backgroundColor: '#EAF8F6',
                      color: '#226B69',
                      '& .MuiAlert-icon': {
                        color: '#087F7B',
                      },
                    }}
                  >
                    This will automatically fill the form with
                    AI-generated content. You can review and edit
                    before saving.
                  </Alert>
                )}
              </CardContent>
            </Card>

            {/* Status */}
            <Card>
              <CardContent>
                <SectionHeading
                  icon={<SellOutlined />}
                  title="Status"
                  subtitle=""
                />

                <FormControlLabel
                  sx={{ mt: 1 }}
                  control={
                    <Switch
                      checked={form.status === 'ACTIVE'}
                      onChange={(event) =>
                        updateField(
                          'status',
                          event.target.checked
                            ? 'ACTIVE'
                            : 'INACTIVE',
                        )
                      }
                    />
                  }
                  label={
                    form.status === 'ACTIVE'
                      ? 'Active'
                      : 'Inactive'
                  }
                />

                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    display: 'block',
                    ml: 1,
                  }}
                >
                  Only active products will be visible in search
                  results.
                </Typography>
              </CardContent>
            </Card>
          </Stack>
        </Grid>
      </Grid>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3500}
        onClose={() =>
          setSnackbar((previous) => ({
            ...previous,
            open: false,
          }))
        }
      >
        <Alert severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

function FormSection({
  icon,
  title,
  subtitle,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardContent sx={{ p: 2 }}>
        <SectionHeading
          icon={icon}
          title={title}
          subtitle={subtitle}
        />

        <Divider sx={{ my: 2 }} />

        {children}
      </CardContent>
    </Card>
  );
}

function SectionHeading({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <Stack direction="row" spacing={1.5} sx={{ alignItems: 'flex-start' }}>
      <Box
        sx={{
          width: 40,
          height: 40,
          flexShrink: 0,
          borderRadius: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#E1F5F2',
          color: 'primary.main',
        }}
      >
        {icon}
      </Box>

      <Box>
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 800,
            lineHeight: 1.3,
          }}
        >
          {title}
        </Typography>

        {subtitle && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 0.25 }}
          >
            {subtitle}
          </Typography>
        )}
      </Box>
    </Stack>
  );
}

function ArrayField({
  title,
  items,
  placeholder,
  onAdd,
  onRemove,
  onChange,
}: {
  title: string;
  items: string[];
  placeholder: string;
  onAdd: () => void;
  onRemove: (index: number) => void;
  onChange: (index: number, value: string) => void;
}) {
  return (
    <Box>
      <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
        <Typography
          variant="body2"
          sx={{ fontWeight: 700 }}
        >
          {title}
        </Typography>

        <InfoOutlined
          sx={{
            fontSize: 16,
            color: 'text.secondary',
          }}
        />
      </Stack>

      <Stack spacing={1} sx={{ mt: 1 }}>
        {items.map((item, index) => (
          <Stack
            key={index}
            direction="row"
            spacing={1}
            sx={{ alignItems: 'center' }}
          >
            <TextField
              fullWidth
              size="small"
              placeholder={placeholder}
              value={item}
              onChange={(event) =>
                onChange(index, event.target.value)
              }
            />

            <IconButton
              color="error"
              onClick={() => onRemove(index)}
              size="small"
            >
              <DeleteOutlineOutlined fontSize="small" />
            </IconButton>
          </Stack>
        ))}
      </Stack>

      <Button
        variant="outlined"
        size="small"
        startIcon={<AddOutlined />}
        onClick={onAdd}
        sx={{ mt: 1 }}
      >
        Add {title.slice(0, -1)}
      </Button>
    </Box>
  );
}