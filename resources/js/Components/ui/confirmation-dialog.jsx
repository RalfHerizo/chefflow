import { Button } from '@/Components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/Components/ui/dialog';

/**
 * @param {{
 * open: boolean,
 * onOpenChange: (open: boolean) => void,
 * title: string,
 * description?: string,
 * confirmLabel?: string,
 * cancelLabel?: string,
 * destructive?: boolean,
 * processing?: boolean,
 * onConfirm: () => void
 * }} props
 */
export default function ConfirmationDialog({
    open,
    onOpenChange,
    title,
    description,
    confirmLabel = 'Confirmer',
    cancelLabel = 'Annuler',
    destructive = false,
    processing = false,
    onConfirm,
}) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    {description ? (
                        <DialogDescription>{description}</DialogDescription>
                    ) : null}
                </DialogHeader>
                <DialogFooter>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={processing}
                    >
                        {cancelLabel}
                    </Button>
                    <Button
                        type="button"
                        onClick={onConfirm}
                        disabled={processing}
                        className={
                            destructive
                                ? 'bg-red-600 text-white hover:bg-red-700'
                                : 'bg-[#FF7E47] text-white hover:bg-[#e86f3d]'
                        }
                    >
                        {processing ? 'Traitement...' : confirmLabel}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
