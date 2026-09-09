import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '../atoms';

interface DeleteProductDialogProps {
  open: boolean;
  productName?: string;
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteProductDialog({
  open,
  productName,
  loading = false,
  onClose,
  onConfirm,
}: DeleteProductDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle sx={{ fontWeight: 700 }}>Delete product?</DialogTitle>

      <DialogContent>
        <Typography variant="body2" color="text.secondary">
          Are you sure you want to delete <strong>{productName}</strong>? This
          action cannot be undone.
        </Typography>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>

        <Button
          variant="contained"
          color="error"
          onClick={onConfirm}
          disabled={loading}
        >
          {loading ? 'Deleting...' : 'Delete'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
